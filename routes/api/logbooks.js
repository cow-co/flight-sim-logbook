const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const logbookMethods = require("../../services/logbooks");
const userMethods = require("../../services/users");
const { isEmptyOrNull } = require("../../helpers/validation");

router.post("/create", authenticate, isVerified, async (req, res) => {
  const logbookDetails = req.body;
  let responseJSON = { logbook: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    const newLogbook = await logbookMethods.createLogbook(logbookDetails.aircraftName, res.locals.user);
    if (newLogbook.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newLogbook.errors;
    } else {
      returnStatus = statusCodes.CREATED;
      // TODO Return the new logbook in the same format (cleansed to remove irrelevant fields) as from GET-logbooks
      responseJSON.logbook = newLogbook.logbook;
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

router.delete("/delete", authenticate, isVerified, async (req, res) => {
  const logbookDetails = req.body;
  let responseJSON = { message: "", errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    const newLogbook = await logbookMethods.deleteLogbook(logbookDetails.aircraftName, res.locals.user);
    if (newLogbook.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newLogbook.errors;
      responseJSON.message = "Failed to Delete Logbook";
    } else {
      returnStatus = statusCodes.SUCCESS;
      responseJSON.logbook = newLogbook.logbook;
      responseJSON.message = "Deleted Logbook";
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.message = "Failed to Delete Logbook";
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

router.get("/:username", async (req, res) => {
  let responseJSON = { logbooks: [], message: "", errors: [] };
  let returnStatus = statusCodes.SUCCESS;
  const username = req.params.username;
  const user = await userMethods.getUserByName(username);

  if (isEmptyOrNull(user)) {
    returnStatus = statusCodes.INVALID_STATUS;
    responseJSON.errors.push("User does not exist!");
  } else {
    try {
      responseJSON = await logbookMethods.getAllLogbooks(user);
    } catch (error) {
      console.error(error.message);
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.message = "Failed to get logbooks for user";
      responseJSON.errors.push("Server-side error");
    }
  }

  return res.status(returnStatus).json(responseJSON);
});

router.get("/:username/:aircraftName", async (req, res) => {
  let responseJSON = { logbook: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;
  const username = req.params.username;
  const aircraftName = req.params.aircraftName;
  const user = await userMethods.getUserByName(username);

  if (isEmptyOrNull(user)) {
    returnStatus = statusCodes.INVALID_STATUS;
    responseJSON.errors.push("User does not exist!");
  } else {
    try {
      const result = await logbookMethods.getLogbook(aircraftName, user);
      responseJSON.logbook = result.logbook;
      if (isEmptyOrNull(responseJSON.logbook)) {
        returnStatus = statusCodes.INVALID_STATUS;
        responseJSON.errors.push("User does not have a logbook for that aircraft!");
      }
    } catch (error) {
      console.error(error.message);
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.message = "Failed to get logbook";
      responseJSON.errors.push("Server-side error");
    }
  }

  return res.status(returnStatus).json(responseJSON);
});

router.post("/add-mission", authenticate, isVerified, async (req, res) => {
  const mission = req.body;
  let responseJSON = { logbook: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    const updatedLogbook = await logbookMethods.addMission(mission, res.locals.user);

    if (updatedLogbook.logbook !== null && updatedLogbook.errors.length === 0) {
      returnStatus = statusCodes.SUCCESS;
      responseJSON.logbook = updatedLogbook.logbook;
    } else if (updatedLogbook.logbook !== null) {
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.errors = updatedLogbook.errors;
    } else {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = updatedLogbook.errors;
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

module.exports = router;
