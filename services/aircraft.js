const Aircraft = require("../models/Aircraft");

const findAircraftByName = async (aircraftName) => {
  let aircraft = null;
  aircraft = await Aircraft.findOne({ name: aircraftName });
  return aircraft;
};

const getAllAircraft = async () => {
  let aircraft = [];
  aircraft = await Aircraft.find();
  return aircraft;
};

module.exports = {
  findAircraftByName,
  getAllAircraft,
};
