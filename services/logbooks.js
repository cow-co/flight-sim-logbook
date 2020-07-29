const { findAircraftByName } = require("./aircraft");
const { isEmptyOrNull } = require("../helpers/validation");
const Logbook = require("../models/Logbook");

const getUserLogbookForAircraft = (aircraftName, user) => {
  let existingLogbook = null;

  for (var i = 0; i < user.logbooks.length; i++) {
    if (logbook.aircraft.name === aircraftName) {
      existingLogbook = logbook;
      break;
    }
  }

  return existingLogbook;
};

const createLogbook = async (logbookSetup, user) => {
  let newLogbook = {
    logbook: null,
    errors: [],
  };

  let existingLogbook = getUserLogbookForAircraft(logbookSetup.aircraftName, user);

  if (existingLogbook) {
    logbookExists = true;
  }

  let chosenAircraft = findAircraftByName(logbookSetup.aircraftName);

  if (logbookExists) {
    newLogbook.errors.push("User already has a logbook for that aircraft!");
  } else {
    if (isEmptyOrNull(logbookSetup.aircraftName)) {
      newLogbook.errors.push("Please choose an aircraft!");
    }

    if (isEmptyOrNull(chosenAircraft)) {
      newLogbook.errors.push("Please select a valid aircraft!");
    }
  }

  if (newLogbook.errors.length === 0) {
    try {
      const createdLogbook = await Logbook.create({
        aircraft: chosenAircraft,
      });

      newLogbook.logbook.aircraft = chosenAircraft.name;
      newLogbook.logbook = createdLogbook;
    } catch (error) {
      newLogbook.errors.push(error.message);
    }
  }

  return newLogbook;
};

module.exports = {
  createLogbook,
};
