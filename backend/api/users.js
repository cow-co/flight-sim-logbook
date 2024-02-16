const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const userService = require("../db/services/user-service");
const validation = require("../validation/security-validation");
const argon2 = require("argon2");

router.post("/register", async (req, res) => {
  const username = req.bodyString("username");
  // Sanitising these via bodyString might clobber their values,
  // which is bad in the case of a password. Sanitising not needed anyway, since
  // only the hash (which is safe) will go to the DB.
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  log(
    "POST /api/users/register",
    `Registering user: username ${username}`,
    levels.DEBUG
  );

  let validationErrors = validation.validateUsername(username);
  validationErrors = validationErrors.concat(
    validation.validatePassword(password, passwordConfirmation)
  );

  let status = statusCodes.OK;
  let response = {
    userId: null,
    errors: [],
  };

  if (validationErrors.length > 0) {
    status = statusCodes.BAD_REQUEST;
    response.errors = validationErrors;
  } else {
    try {
      const user = userService.getUserByName(username);
      if (user._id) {
        status = statusCodes.BAD_REQUEST;
        response.errors.push("User with that name already exists!");
      } else {
        const hashedPassword = await argon2.hash(password);
        const created = await userService.createUser(username, hashedPassword);
        response.userId = created._id;
      }
    } catch (err) {
      log("POST /api/users/register", err, levels.WARN);
      status = statusCodes.INTERNAL_SERVER_ERROR;
      response.errors.push("Internal Server Error");
    }
  }

  res.status(status).json(response);
});

module.exports = router;
