const { findAircraftByName } = require("./aircraft");
const { isEmptyOrNull } = require("../helpers/validation");
const Logbook = require("../models/Logbook");

const getUserLogbookForAircraft = (aircraftName, user) => {
  let existingLogbook = null;

  for (var i = 0; i < user.logbooks.length; i++) {
    const logbook = user.logbooks[i];
    if (logbook.aircraft === aircraftName) {
      existingLogbook = logbook;
      break;
    }
  }

  return existingLogbook;
};

const removeLogbookFromUser = async (aircraftName, user) => {
  for (var i = 0; i < user.logbooks.length; i++) {
    const logbook = user.logbooks[i];
    if (logbook.aircraft === aircraftName) {
      user.logbooks.splice(i, 1);
      await user.save();
      break;
    }
  }
};

// TODO Implement a "GET logbooks for user" endpoint

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
  let response = { errors: [] };

  if (!isEmptyOrNull(existingLogbook)) {
    logbookExists = true;
  }

  if (logbookExists) {
    try {
      await removeLogbookFromUser(aircraftName, user);
    } catch (error) {
      response.errors.push(error.message);
    }
  } else {
    response.errors.push("User does not have a logbook for that aircraft!");
  }

  return response;
};

module.exports = {
  createLogbook,
  deleteLogbook,
};
