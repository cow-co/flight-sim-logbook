const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO Flesh this out with:
//  - aircraft type (will need to be a DB entity)
//  - SEAD, CAS, BVR, BFM, Carrier...
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
