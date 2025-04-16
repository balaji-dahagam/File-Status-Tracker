const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const File = require("../models/File");
const router = express.Router();
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const moment = require("moment-timezone");
const { body, validationResult } = require("express-validator");
const Administrator = require("../models/Administrator");

const isIIITGEmail = (email) => {
  console.log("Validating email:", email); // Log email input to track the flow
  return email.toLowerCase().endsWith("@iiitg.ac.in");
};

//route 1 : add a file for student or a faculty
router.post("/submitfile", fetchUser, async (req, res) => {
  try {
    const {
      fileName,
      fileType,
      status,
      currentLocation,
      comments,
      threshold,
      toEmail,
    } = req.body;

    let userEmail, userType, userId;
    let user = await Student.findOne({ rollno: req.user.id });
    if (user) {
      userType = "Student";
      userEmail = user.email;
      userId = user._id;
    } else {
      user = await Faculty.findById(req.user.id);
      if (user) {
        userType = "Faculty";
        userEmail = user.email;
        userId = user._id;
      } else {
        user = await Administrator.findById(req.user.id);
        if (user) {
          return res
            .status(400)
            .json({ error: "Administrator cannot submit files" });
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      }
    }

    const admin = await Administrator.findOne({ email: toEmail });
    if (!admin) {
      return res.status(404).json({ error: "Administrator not found" });
    }
    const newfile = await File.create({
      fileName: fileName,
      fileType: fileType,
      userType,
      currentLocation: currentLocation,
      status: status,
      comments: comments,
      toEmail: toEmail,
      submittedBy: userId,
      submittedByEmail: userEmail,
      threshold: threshold,
      submissionDate: moment.tz("Asia/Kolkata").toDate(),
      history: [
        {
          fromEmail: userEmail,
          toEmail,
          location: currentLocation,
          status: "Pending",
        },
      ],
      recipient: admin._id,
    });
    res
      .status(201)
      .json({ message: "File submitted successfully", file: newfile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//route 2 : fetch all files : GET
router.get("/showfiles", fetchUser, async (req, res) => {
  try {
    let submittedByEmail;
    let user = await Student.findOne({ rollno: req.user.id }); // Check if the user is a student
    if (user) {
      submittedByEmail = user.email; // If a student, use their email
    } else {
      user = await Faculty.findById(req.user.id); // Check if the user is faculty
      if (user) {
        submittedByEmail = user.email; // If faculty, use their email
      } else {
        return res.status(404).json({ success: false, msg: "User not found" }); // User not found
      }
    }

    const files = await File.find({ submittedByEmail }) // Fetch files based on the email
      .populate("submittedBy", "name");

    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

//route 3 : fetch files for administrator : login required
router.get("/admin/files/sent", fetchUser, async (req, res) => {
  try {
    const admin = await Administrator.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Administrator not found" });
    }
    const sentFiles = await File.find({
      history: { $elemMatch: { fromEmail: admin.email } },
      recipient: { $ne: admin._id }, // Admin is not the current recipient
    })
      .populate("submittedBy", "name")
      .populate("recipient", "name");

    sentFiles.sort((a, b) => {
      const lastUpdateA = new Date(a.history[0].updatedAt);
      const lastUpdateB = new Date(b.history[0].updatedAt);
      return lastUpdateA - lastUpdateB;
    });
    res.status(200).json({ success: true, files: sentFiles });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error", error });
  }
});

const getDaysNeeded = (date) => {
  const today = new Date();
  const timeDiff = Math.abs(today - new Date(date));
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

//route 4 : Received files : login required
router.get("/admin/files/received", fetchUser, async (req, res) => {
  try {
    const admin = await Administrator.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Administrator not found" });
    }

    const receivedFiles = await File.find({ recipient: admin._id })
      .populate("submittedBy", "name")
      .populate("recipient", "name");

    const currentDate = new Date();
    const immediateCheckFiles = [];
    const sortedFiles = [];

    receivedFiles.forEach((file) => {
      const expectedEndDate = new Date(file.submissionDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + file.threshold);
      console.log(expectedEndDate);

      if (expectedEndDate < currentDate) {
        immediateCheckFiles.push(file);
      } else {
        sortedFiles.push(file);
      }
    });

    sortedFiles.sort((a, b) => {
      const expectedEndDateA = new Date(a.submissionDate);
      expectedEndDateA.setDate(expectedEndDateA.getDate() + a.threshold);

      const expectedEndDateB = new Date(b.submissionDate);
      expectedEndDateB.setDate(expectedEndDateB.getDate() + b.threshold);

      const comparison = expectedEndDateA - expectedEndDateB;
      return comparison !== 0
        ? comparison
        : new Date(a.submissionDate) - new Date(b.submissionDate);
    });

    res.status(200).json({
      success: true,
      files: sortedFiles,
      immediateCheckFiles: immediateCheckFiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//route 5 : update file status : login required
router.put("/updatefiledetails/:id", fetchUser, async (req, res) => {
  const { recipientEmail, status } = req.body;
  const fileId = req.params.id;
  try {
    console.log(fileId);
    const admin = await Administrator.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Admininstrator doesnot exist" });
    }
    const tosend = await Administrator.findOne({ email: recipientEmail });
    if (!tosend) {
      return res
        .status(404)
        .json({ error: "The one whom u want to send doesnt exist" });
    }
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      {
        status: status,
        lastUpdated: Date.now(),
        recipient: tosend._id,
        $push: {
          history: {
            fromEmail: admin.email,
            toEmail: recipientEmail,
            location: "",
            status: status,
            updatedAt: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!updatedFile) {
      console.log(updatedFile);
      return res.status(400).json({ error: "Updated file error" });
    }
    res.status(200).json({
      success: true,
      msg: "File updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

router.get("/details/:fileId", async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId); // Replace with your file-fetching logic
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.delete("/delete/:fileId", async (req, res) => {
  const { fileId } = req.params;
  try {
    const fileToDelete = await File.findByIdAndDelete(fileId);
    if (!fileToDelete) {
      return res.status(404).json({ msg: "File not there to delete" });
    }
    res.status(200).json({ msg: "File deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});
module.exports = router;
