const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "trackingapplication";

const isIIITGEmail = (email) => {
  console.log("Validating email:", email); // Log email input to track the flow
  return email.toLowerCase().endsWith("@iiitg.ac.in");
};

router.post(
  "/createfaculty",
  [
    body("name", "Name should be atleast 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("password", "Password should be of length atleast 5").isLength({
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
      let faculty = await Faculty.findOne({ email: req.body.email });
      if (faculty) {
        return res.status(400).json({
          error: [{ msg: "Sorry,A user with this email already exists" }],
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      faculty = await Faculty.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        id: faculty.id,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authToken });
    } catch (error) {
      return res.status(500).send("Internal server error occured");
    }
  }
);
router.post(
  "/facultylogin",
  [
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("password", "Password should be of length atleast 5").isLength({
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
      let faculty = await Faculty.findOne({ email });
      if (!faculty) {
        return res
          .status(400)
          .json({ error: [{ msg: "Please sign up to continue" }] });
      }
      const passCompare = await bcrypt.compare(password, faculty.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ error: [{ msg: "Please enter valid credentials" }] });
      }
      const data = {
        id: faculty.id,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      });
      res.json({ success });
    } catch (error) {
      return res.status(500).send("Internal server error occured");
    }
  }
);

//route 3 :get faculty details
router.post("/getfaculty", fetchUser, async (req, res) => {
  try {
    const facultyId = req.user.id;
    const faculty = await Faculty.findById(facultyId).select("-password");
    res.send(faculty);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//route : POST change password
router.post(
  "/fchangepassword",
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
      const facultyId = req.user.id;
      console.log(facultyId);
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        return res
          .status(404)
          .json({ error: [{ msg: "Faculty does not exist" }] });
      }
      const isOld = await bcrypt.compare(oldpassword, faculty.password);
      if (!isOld) {
        return res
          .status(400)
          .json({ error: [{ msg: "Old password is incorrect" }] });
      }
      success = true;
      const salt = await bcrypt.genSalt(10);
      const hashNew = await bcrypt.hash(newpassword, salt);
      faculty.password = hashNew;
      await faculty.save();
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
