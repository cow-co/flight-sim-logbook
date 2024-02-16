const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const userService = require("../db/services/user-service");

router.post("/register", async (req, res) => {
  const username = req.bodyString("username");
  const password = req.bodyString("password");
  const passwordConfirmation = req.bodyString("passwordConfirmation");
  log(
    "POST /api/users/register",
    `Registering user: username ${username}`,
    levels.DEBUG
  );
});
