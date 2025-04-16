const mongoose = require("mongoose");
const { Schema } = mongoose;

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  hashedOtp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;
