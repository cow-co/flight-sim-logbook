const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const userService = require("../db/services/user-service");
const validation = require("../validation/security-validation");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const securityConfig = require("../config/security");
const { verifyToken } = require("../middlewares/security-middleware");
const logbookService = require("../db/services/logbook-service");

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

  let usernameErrors = validation.validateUsername(username);
  let passwordErrors = validation.validatePassword(
    password,
    passwordConfirmation
  );
  const validationErrors = usernameErrors.concat(passwordErrors);

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
      const user = await userService.getUserByName(username, false);
      if (user && user._id) {
        status = statusCodes.BAD_REQUEST;
        response.errors.push("User with that name already exists!");
      } else {
        const hashedPassword = await argon2.hash(password);
        const created = await userService.createUser(username, hashedPassword);
        response.userId = created._id;
        await logbookService.createLogbook(created._id);
      }
    } catch (err) {
      log("POST /api/users/register", err, levels.WARN);
      status = statusCodes.INTERNAL_SERVER_ERROR;
      response.errors.push("Internal Server Error");
    }
  }

  res.status(status).json(response);
});

router.post("/login", async (req, res) => {
  const username = req.bodyString("username");
  // Sanitising these via bodyString might clobber their values,
  // which is bad in the case of a password. Sanitising not needed anyway, since
  // only the hash (which is safe) will go to the DB.
  const password = req.body.password;

  log(
    "POST /api/users/login",
    `Logging in with username ${username}`,
    levels.DEBUG
  );

  let status = statusCodes.OK;
  let response = {
    user: {
      id: null,
      name: null,
    },
    token: null,
    errors: [],
  };

  try {
    let verified = false;
    const user = await userService.getUserByName(username, true);
    if (user && user._id) {
      verified = await argon2.verify(user.password.hashedPassword, password);
      if (verified) {
        response.user.id = user._id;
        response.user.name = user.name;
        const token = jwt.sign(
          {
            userId: user._id,
          },
          securityConfig.jwtSecret,
          {
            expiresIn: "3h",
          }
        );
        response.token = token;
      }
    }

    if (!verified) {
      log(
        "POST /api/users/login",
        `Login failed for username ${username}`,
        levels.SECURITY
      );
      status = statusCodes.UNAUTHENTICATED;
      response.errors.push("Incorrect Credentials");
    }
  } catch (err) {
    log("POST /api/users/register", err, levels.WARN);
    status = statusCodes.INTERNAL_SERVER_ERROR;
    response.errors.push("Internal Server Error");
  }

  res.status(status).json(response);
});

router.delete("/logout", verifyToken, async (req, res) => {
  let status = statusCodes.OK;
  let response = {
    errors: [],
  };

  try {
    await userService.logUserOut(req.data.userId);
    log(
      "DELETE /api/users/logout",
      `User ${req.data.userId} logged out`,
      levels.DEBUG
    );
  } catch (err) {
    log("DELETE /api/users/logout", err, levels.WARN);
    status = statusCodes.INTERNAL_SERVER_ERROR;
    response.errors.push("Internal Server Error");
  }

  res.status(status).json(response);
});

router.get("/whoami", verifyToken, async (req, res) => {
  log("GET /users/whoami", "Checking user status...", levels.DEBUG);
  let response = {};
  let status = statusCodes.OK;

  try {
    const user = await userService.getUserById(req.data.userId);
    response = {
      userId: user._id,
      errors: [],
    };
  } catch (err) {
    log("GET /users/whoami", err, levels.ERROR);
    status = statusCodes.INTERNAL_SERVER_ERROR;
    response = {
      userId: null,
      errors: ["Internal Server Error"],
    };
  }

  res.status(status).json(response);
});

module.exports = router;
