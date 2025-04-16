const express = require("express");
const router = express.Router();
const { sendMail } = require("../emailController");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Administrator = require("../models/Administrator");

const isIIITGEmail = (email) => {
  return email.toLowerCase().endsWith("@iiitg.ac.in");
};

router.post("/", sendMail);

// router.post(
//   "/forgotpassword",
//   [
//     body("email", "Enter a valid email domain").custom((value) => {
//       if (!isIIITGEmail(value)) {
//         throw new Error("Invalid email domain");
//       }
//       return true;
//     }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ error: errors.array() });
//     }
//     try {
//       sendMail();
//     } catch (error) {
//       return res.status(500).json({
//         error: [{ msg: "Internal Server error" }],
//       });
//     }
//   }
// );

router.post(
  "/verifyotp",
  [
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("otp", "OTP should be atleast 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { email, otp } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const user = await Otp.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: "OTP doesnot exist" });
      }
      const otpComp = await bcrypt.compare(otp, user.hashedOtp);

      if (!otpComp) {
        return res.status(400).json({ error: [{ msg: "OTP is invalid" }] });
      } else {
        return res.status(200).json({ msg: "OTP verified successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  }
);

router.post(
  "/forgotpassword",
  [
    body("email", "Enter a valid email domain").custom((value) => {
      if (!isIIITGEmail(value)) {
        throw new Error("Invalid email domain");
      }
      return true;
    }),
    body("newpassword", "Password should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { email, newpassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    console.log(email);

    const userExists =
      (await Student.findOne({ email })) ||
      (await Faculty.findOne({ email })) ||
      (await Administrator.findOne({ email }));

    if (!userExists) {
      return res
        .status(404)
        .json({ error: "Account doesnot exist on this email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newpassword, salt);

    userExists.password = hashedpassword;
    await userExists.save();

    res.status(200).json({ message: "Password updated successfully" });
  }
);

module.exports = router;
