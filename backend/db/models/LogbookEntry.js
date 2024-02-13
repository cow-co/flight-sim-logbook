const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logbookEntrySchema = new Schema({
  minutes: {
    type: Number,
    required: true,
  },
  flightSize: {
    type: Number,
    required: true,
  },
});

module.exports = LogbookEntry = mongoose.model(
  "LogbookEntry",
  logbookEntrySchema
);
