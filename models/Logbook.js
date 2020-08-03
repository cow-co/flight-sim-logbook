const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logbookSchema = new Schema({
  aircraft: {
    type: String,
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  a2aKills: {
    type: Number,
    default: 0,
  },
  imcSorties: {
    type: Number,
    default: 0,
  },
  bfmSorties: {
    type: Number,
    default: 0,
  },
  bvrSorties: {
    type: Number,
    default: 0,
  },
  seadSorties: {
    type: Number,
    default: 0,
  },
  casSorties: {
    type: Number,
    default: 0,
  },
  strikeSorties: {
    type: Number,
    default: 0,
  },
  packageSorties: {
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
  aarSorties: {
    type: Number,
    default: 0,
  },
});

module.exports = logbookSchema;
