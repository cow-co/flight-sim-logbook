const Aircraft = require("../models/Aircraft");

const findAircraftByName = async (aircraftName) => {
  console.log(aircraftName);
  let aircraft = null;
  aircraft = await Aircraft.findOne({ name: aircraftName });
  return aircraft;
};

module.exports = {
  findAircraftByName,
};
