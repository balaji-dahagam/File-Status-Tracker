const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "trackingapplication";

const isIIITGEmail = (email) => {
  return email.toLowerCase().endsWith("@iiitg.ac.in");
};

// Route 1: Signup endpoint - send OTP POST: No login needed
router.post(
  "/createstudent",
  [
    body("name", "Name should be at least 3 characters").isLength({ min: 3 }),
    body("rollno", "Rollno should be at least 7 characters").isLength({
      min: 7,
    }),
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("password", "Password should be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      let student = await Student.findOne({ email: req.body.email });
      if (student) {
        return res.status(400).json({
          error: [{ msg: "Sorry, a user with this email already exists" }],
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create the student account after successful OTP verification
      student = await Student.create({
        name: req.body.name,
        rollno: req.body.rollno,
        email: req.body.email,
        password: secPass,
      });

      // Generate JWT token
      const data = {
        id: student.rollno,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: [{ msg: "Internal server error" }],
      });
    }
  }
);

// Route 3: Student login endpoint POST: No login required
router.post(
  "/studentlogin",
  [
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("password", "Password should be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let student = await Student.findOne({ email });
      if (!student) {
        return res
          .status(400)
          .json({ error: [{ msg: "Please sign up to continue" }] });
      }

      const passCompare = await bcrypt.compare(password, student.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ error: [{ msg: "Please enter valid credentials" }] });
      }

      const data = {
        id: student.rollno,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      });
      res.json({ success });
    } catch (error) {
      return res.status(500).json({
        error: [{ msg: "Internal server error" }],
        msg: error,
      });
    }
  }
);

// Route 4: Fetch student details (protected route) POST: Login required
router.post("/getstudent", fetchUser, async (req, res) => {
  try {
    const student = await Student.findOne({ rollno: req.user.id }).select(
      "-password"
    );
    if (!student) {
      return res.status(404).json({
        error: [{ msg: "Student not found" }],
      });
    }
    res.send(student);
  } catch (error) {
    console.error("Error in /getstudent route:", error.stack);
    return res.status(500).json({
      error: [{ msg: "Internal server error" }],
    });
  }
});

//route 5 : update password : POST Login required
router.post(
  "/schangepassword",
  fetchUser,
  [
    body("oldpassword", "Password should be of atleast 5 characters").isLength({
      min: 5,
    }),
    body("newpassword", "Password shuld be of atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { oldpassword, newpassword } = req.body;
    try {
      const student = await Student.findOne({ rollno: req.user.id });
      if (!student) {
        return res
          .status(404)
          .json({ error: [{ msg: "Student does not exist" }] });
      }
      const isOld = await bcrypt.compare(oldpassword, student.password);
      if (!isOld) {
        return res
          .status(400)
          .json({ error: [{ msg: "Old password is incorrect" }] });
      }
      success = true;
      const salt = await bcrypt.genSalt(10);
      const hashNew = await bcrypt.hash(newpassword, salt);
      student.password = hashNew;
      await student.save();
      res.status(200).json({ success, msg: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: [{ msg: "Internal server error" }],
        msg: error,
      });
    }
  }
);

module.exports = router;
