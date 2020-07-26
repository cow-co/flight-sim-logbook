const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logbookSchema = new Schema({
  aircraft: {
    type: Schema.Types.ObjectId,
    ref: "Aircraft",
  },
  totalHours: Number,
  imcHours: Number,
  bfmHours: Number,
  bvrHours: Number,
  seadHours: Number,
  casHours: Number,
  strikeHours: Number,
  packageHours: Number,
  caseISorties: Number,
  caseIIISorties: Number,
  aarHours: Number,
});

module.exports = Logbook = mongoose.model("Logbooks", logbookSchema);
