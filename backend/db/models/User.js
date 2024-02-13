const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    dropDups: true,
    required: true,
  },
  password: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "HashedPassword",
  },
});

module.exports = User = mongoose.model("User", userSchema);
