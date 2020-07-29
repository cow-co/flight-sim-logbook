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
  let logbookExists = false;

  if (!isEmptyOrNull(existingLogbook)) {
    logbookExists = true;
  }

  let chosenAircraft = null;

  if (isEmptyOrNull(logbookSetup.aircraftName)) {
    newLogbook.errors.push("Please choose an aircraft!");
  } else {
    chosenAircraft = await findAircraftByName(logbookSetup.aircraftName);
  }

  if (logbookExists) {
    newLogbook.errors.push("User already has a logbook for that aircraft!");
  } else {
    if (!isEmptyOrNull(logbookSetup.aircraftName) && isEmptyOrNull(chosenAircraft)) {
      newLogbook.errors.push("Please select a valid aircraft!");
    }
  }

  if (newLogbook.errors.length === 0) {
    try {
      let createdLogbook = await Logbook.create({
        aircraft: chosenAircraft,
      });

      newLogbook.logbook = {
        aircraft: logbookSetup.aircraftName,
        totalHours: createdLogbook.totalHours,
        imcHours: createdLogbook.imcHours,
        bfmHours: createdLogbook.bfmHours,
        bvrHours: createdLogbook.bvrHours,
        seadHours: createdLogbook.seadHours,
        casHours: createdLogbook.casHours,
        strikeHours: createdLogbook.strikeHours,
        packageHours: createdLogbook.packageHours,
        caseISorties: createdLogbook.caseISorties,
        caseIIISorties: createdLogbook.caseIIISorties,
        aarHours: createdLogbook.aarHours,
      };
      console.log(newLogbook.logbook);
    } catch (error) {
      newLogbook.errors.push(error.message);
    }
  }

  return newLogbook;
};

module.exports = {
  createLogbook,
};
