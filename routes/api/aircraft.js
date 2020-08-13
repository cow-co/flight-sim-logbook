const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const aircraftMethods = require("../../services/aircraft");
const { isEmptyOrNull } = require("../../helpers/validation");

router.get("/all", async (req, res) => {
  let responseJSON = { aircraft: [], errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    responseJSON.aircraft = await aircraftMethods.getAllAircraft();
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

module.exports = router;
