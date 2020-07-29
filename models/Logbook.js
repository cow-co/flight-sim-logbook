const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logbookSchema = new Schema({
  aircraft: {
    type: Schema.Types.ObjectId,
    ref: "Aircraft",
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  imcHours: {
    type: Number,
    default: 0,
  },
  bfmHours: {
    type: Number,
    default: 0,
  },
  bvrHours: {
    type: Number,
    default: 0,
  },
  seadHours: {
    type: Number,
    default: 0,
  },
  casHours: {
    type: Number,
    default: 0,
  },
  strikeHours: {
    type: Number,
    default: 0,
  },
  packageHours: {
    type: Number,
    default: 0,
  },
  caseISorties: {
    type: Number,
    default: 0,
  },
  caseIIISorties: {
    type: Number,
    default: 0,
  },
  aarHours: {
    type: Number,
    default: 0,
  },
});

module.exports = Logbook = mongoose.model("Logbooks", logbookSchema);
