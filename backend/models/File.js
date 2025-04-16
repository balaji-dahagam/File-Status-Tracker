const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // No enum constraint anymore, allowing any string value
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType",
  },
  submittedByEmail: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Student", "Faculty"],
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Administrator",
  },
  status: {
    type: String,
    default: "Pending",
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  threshold: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
  },
  history: [
    {
      fromEmail: String, // Email of the person sending the file
      toEmail: String, // Email of the person receiving the file
      status: String, // Status at this stage (e.g., Pending, In Process, etc.)
      updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the date and time
      },
    },
  ],
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userType",
  },
});

// Method to convert date to IST
FileSchema.methods.toIST = function (date) {
  if (!date) return null;
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};

// Middleware to update lastUpdated date when status is modified
FileSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.lastUpdated = Date.now();
  }
  next();
});

const File = mongoose.model("file", FileSchema);
module.exports = File;
