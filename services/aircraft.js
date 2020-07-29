const Aircraft = require("../models/Aircraft");

const findAircraftByName = async (aircraftName) => {
  let aircraft = null;
  aircraft = await Aircraft.findOne({ name: aircraftName });
  return aircraft;
};

module.exports = {
  findAircraftByName,
};
