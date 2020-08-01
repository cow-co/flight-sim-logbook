const mongoose = require("mongoose");
const Logbook = require("./Logbook");
const Schema = mongoose.Schema;

const validateEmail = (email) => {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    index: true,
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Please provide a valid email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email address",
    ],
    required: true,
  },
  passwordHash: String,
  jwt: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationToken: String,
  verificationSet: Number,
  resetPasswordToken: String,
  resetTokenSet: Number,
  logbooks: [Logbook],
});

module.exports = User = mongoose.model("Users", userSchema);
