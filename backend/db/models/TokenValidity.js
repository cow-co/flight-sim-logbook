const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenValiditySchema = new Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  // Is set to the current time when logged out - effectively invalidating existing tokens
  minTokenValidity: {
    type: Number,
    required: true,
  },
});

module.exports = TokenValidity = mongoose.model(
  "TokenValidity",
  tokenValiditySchema
);
