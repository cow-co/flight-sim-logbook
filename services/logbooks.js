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

const stripDownLogbook = async (logbook) => {
  const aircraft = await findAircraftByName(logbook.aircraft);
  const logbookData = logbook.toObject();
  let modified = {
    ...logbookData,
  };

  if (!aircraft.bvrCapable) {
    delete modified.bvrSorties;
  }

  if (!aircraft.carrierOpsCapable) {
    delete modified.caseISorties;
    delete modified.caseIIISorties;
  }

  if (!aircraft.agCapable) {
    delete modified.seadSorties;
    delete modified.casSorties;
    delete modified.strikeSorties;
  }

  return modified;
};

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
      newLogbook.logbook = {
        aircraft: createdLogbook.aircraft,
        totalHours: 0,
        a2aKills: 0,
      };
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

const getAllLogbooks = (user) => {
  let response = { logbooks: [] };
  user.logbooks.forEach((logbook) => {
    response.logbooks.push(summariseLogbook(logbook));
  });

  return response;
};

const summariseLogbook = (logbook) => {
  return {
    aircraft: logbook.aircraft,
    totalHours: logbook.totalHours,
    a2aKills: logbook.a2aKills,
  };
};

const getLogbook = async (aircraftName, user) => {
  let response = { logbook: null };
  const ogLogbook = getUserLogbookForAircraft(aircraftName, user);
  if (!isEmptyOrNull(ogLogbook)) {
    response.logbook = await stripDownLogbook(ogLogbook);
  }

  return response;
};

const addMission = async (aircraft, missionDetails, user) => {
  let response = { logbook: null, errors: [] };
  let logbook = getUserLogbookForAircraft(aircraft, user);
  const aircraftDetails = await findAircraftByName(aircraft);

  if (!isEmptyOrNull(logbook)) {
    logbook.totalHours += missionDetails.duration;
    logbook.totalSorties += 1;
    logbook.a2aKills += missionDetails.a2aKills;

    if (missionDetails.imc) {
      logbook.imcSorties++;
    }

    if (missionDetails.bfm) {
      logbook.bfmSorties++;
    }

    if (missionDetails.bvr && aircraftDetails.bvrCapable) {
      logbook.bvrSorties++;
    }

    if (missionDetails.sead && aircraftDetails.agCapable) {
      logbook.seadSorties++;
    }

    if (missionDetails.cas && aircraftDetails.agCapable) {
      logbook.casSorties++;
    }

    if (missionDetails.strike && aircraftDetails.agCapable) {
      logbook.strikeSorties++;
    }

    if (missionDetails.package) {
      logbook.packageSorties++;
    }

    if (missionDetails.caseI && aircraftDetails.carrierOpsCapable) {
      logbook.caseISorties++;
    }

    if (missionDetails.caseIII && aircraftDetails.carrierOpsCapable) {
      logbook.caseIIISorties++;
    }

    if (missionDetails.aar) {
      logbook.aarSorties++;
    }

    response.logbook = await stripDownLogbook(logbook);

    try {
      await user.save();
    } catch (err) {
      console.warn("Failed to update logbook in DB");
      response.errors.push("Failed to update logbook");
    }
  } else {
    response.errors.push("You must create a logbook for that aircraft first!");
  }

  return response;
};

module.exports = {
  createLogbook,
  deleteLogbook,
  getAllLogbooks,
  summariseLogbook,
  getLogbook,
  addMission,
};
