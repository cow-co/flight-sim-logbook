const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const logbookMethods = require("../../services/logbooks");

router.post("/create", authenticate, isVerified, async (req, res) => {
  const logbookDetails = req.body;
  let responseJSON = { logbook: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    console.log("Creating logbook...");
    const newLogbook = await logbookMethods.createLogbook(logbookDetails);
    if (newLogbook.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newLogbook.errors;
    } else {
      returnStatus = statusCodes.CREATED;
      console.log("Created logbook.");
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

module.exports = router;
