const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdministratorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Administrator = mongoose.model("Administrator", AdministratorSchema);
module.exports = Administrator;
