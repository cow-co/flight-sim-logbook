const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const authenticate = require("../../middleware/security");
const userMethods = require("../../db_interface/users");
const jwtDecoding = require("../../helpers/jwt_decoding");

router.post("/login", async (req, res) => {
  const loginDetails = req.body;
  console.log("Received login request");
  let valid = false;
  let response = null;

  try {
    const user = await userMethods.getUserByName(loginDetails.name);
    if (user) {
      valid = await userMethods.checkPassword(user, loginDetails.password);
      if (valid) {
        const jwt = await userMethods.generateJWT(user);
        response = res.json(jwt);
      } else {
        console.log("Invalid PW");

        response = res.status(statusCodes.CREDS_ERROR).json({ errors: ["Incorrect Credentials"] });
      }
    } else {
      console.log("Invalid user");
      response = res.status(statusCodes.CREDS_ERROR).json({ errors: ["Incorrect Credentials"] });
    }
  } catch (error) {
    console.error("Other error");
    response = res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
  }

  return response;
});

router.post("/create", async (req, res) => {
  const userDetails = req.body;
  console.log("Received user-creation request");
  let response = null;
  let userExists = false;

  try {
    let user = await userMethods.getUserByName(userDetails.name);
    if (user) {
      userExists = true;
    } else {
      user = await userMethods.getUserByEmail(userDetails.email);
      userExists = user ? true : false;
    }

    if (userExists) {
      response = res.status(statusCodes.INVALID_STATUS).json({ errors: ["User already exists!"] });
    } else {
      const newUser = await userMethods.createUser(userDetails);
      if (newUser.errors.length > 0) {
        // TODO Send email verification
        // TODO Add "verified" to user model; if not verified, user cannot get a JWT on login (error returned, saying to verify email, with a link to resend verification)
        response = res.status(statusCodes.INVALID_STATUS).json({ errors: newUser.errors });
      } else {
        response = res.json({ user: newUser });
      }
    }
  } catch (error) {
    console.error("Other error");
    response = res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
  }

  return response;
});

router.get("/logout", authenticate, async (req, res) => {
  const username = jwtDecoding.getUsernameFromToken(jwtDecoding.getTokenFromRequest(req));
  const errors = await userMethods.deleteJWT(username);

  if(errors.length === 0) {
    return res.json({ "message": "Successfully Logged Out" });
  } else {
    return res.status(statusCodes.SERVER_ERROR).json({ errors: errors });
  }
});

module.exports = router;
