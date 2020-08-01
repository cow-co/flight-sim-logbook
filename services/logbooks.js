const { findAircraftByName } = require("./aircraft");
const { isEmptyOrNull } = require("../helpers/validation");
const Logbook = require("../models/Logbook");

const getUserLogbookForAircraft = (aircraftName, user) => {
  let existingLogbook = null;

  for (var i = 0; i < user.logbooks.length; i++) {
    const logbook = user.logbooks[i];
    if (logbook.aircraft.name === aircraftName) {
      existingLogbook = logbook;
      break;
    }
  }

  return existingLogbook;
};

// TODO Update, since Logbook is now a subdocument of User
const createLogbook = async (aircraftName, user) => {
  let newLogbook = {
    logbook: null,
    errors: [],
  };

  let existingLogbook = getUserLogbookForAircraft(aircraftName, user);
  let logbookExists = false;

  if (!isEmptyOrNull(existingLogbook)) {
    logbookExists = true;
  }

  let chosenAircraft = null;

  if (isEmptyOrNull(aircraftName)) {
    newLogbook.errors.push("Please choose an aircraft!");
  } else {
    chosenAircraft = await findAircraftByName(aircraftName);
  }

  if (logbookExists) {
    newLogbook.errors.push("User already has a logbook for that aircraft!");
  } else {
    if (!isEmptyOrNull(aircraftName) && isEmptyOrNull(chosenAircraft)) {
      newLogbook.errors.push("Please select a valid aircraft!");
    }
  }

  if (newLogbook.errors.length === 0) {
    try {
      const createdLogbook = {
        aircraft: aircraftName,
      };

      user.logbooks.push(createdLogbook);
      await user.save();
      newLogbook.logbook = createdLogbook;
    } catch (error) {
      console.warn(error);
      newLogbook.errors.push(error.message);
    }
  }

  return newLogbook;
};

const deleteLogbook = async (aircraftName, user) => {
  let existingLogbook = getUserLogbookForAircraft(aircraftName, user);
  let logbookExists = false;
  let response = { message: "", errors: [] };

  if (!isEmptyOrNull(existingLogbook)) {
    logbookExists = true;
  }

  if (logbookExists) {
    try {
      await Logbook.deleteOne({ _id: existingLogbook._id });
      response.message = "Successfully Deleted Logbook";
    } catch (error) {
      newLogbook.errors.push(error.message);
      response.message = "Failed to Delete Logbook";
    }
  } else {
    response.errors.push("User does not have a logbook for that aircraft!");
    response.message = "Failed to Delete Logbook";
  }

  return response;
};

module.exports = {
  createLogbook,
  deleteLogbook,
};
