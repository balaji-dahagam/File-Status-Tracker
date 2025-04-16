const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Otp = require("./models/Otp");
const Student = require("./models/Student");
const Faculty = require("./models/Faculty");
const Administrator = require("./models/Administrator");

const generateOtp = require("./generateOtp");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
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

  const otp = generateOtp();
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  const otpRecord = await Otp.create({
    email: email,
    hashedOtp: hashedOtp,
  });

  await otpRecord.save();

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP for registration for File Status Tracking",
    text: `Do not share your OTP with anyone. The OTP is ${otp}. Verify with this code to continue with the process`,
  };
  //   console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400).json({ error: error });
    } else {
      res.status(200).json({ msg: "Email sent successfully" });
    }
  });
});

module.exports = { sendMail };
