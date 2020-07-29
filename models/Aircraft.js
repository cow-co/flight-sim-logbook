const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aircraftSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  bvrCapable: Boolean,
  carrierOpsCapable: Boolean,
  agCapable: Boolean,
});

module.exports = Aircraft = mongoose.model("Aircraft", aircraftSchema);
