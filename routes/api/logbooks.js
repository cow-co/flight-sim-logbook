const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");

router.post("/create", async (req, res) => {
  const userDetails = req.body;
  let responseJSON = { user: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    console.log("Creating logbook...");
    const newUser = await userMethods.createUser(userDetails);
    if (newUser.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newUser.errors;
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
