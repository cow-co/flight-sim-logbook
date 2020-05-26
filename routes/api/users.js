const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const userMethods = require("../../db_interface/users");
const jwtDecoding = require("../../helpers/jwt_decoding");
const {sendVerificationEmail} = require("../../helpers/emailing");

// Don't want to log a user in if their email has not been verified
router.post("/login", isVerified, async (req, res) => {
  const loginDetails = req.body.user;
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
  let userExists = false;
  let responseJSON = {user: null, errors: []};
  let returnStatus = statusCodes.SUCCESS;

  try {
    let user = await userMethods.getUserByName(userDetails.name);
    if (user) {
      userExists = true;
    } else {
      user = await userMethods.getUserByEmail(userDetails.email);
      userExists = user ? true : false;
    }

    if (userExists) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors.push("User already exists!");
    } else {
      const newUser = await userMethods.createUser(userDetails);
      if (newUser.errors.length > 0) {
        returnStatus = statusCodes.INVALID_STATUS;
        responseJSON.errors = newUser.errors;
      } else {
        const token = await userMethods.generateEmailVerificationToken(newUser.name);
        await sendVerificationEmail(newUser.name, newUser.email, token);
        responseJSON.user = {
          name: newUser.name,
          email: newUser.email
        };
      }
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

router.get("/logout", authenticate, isVerified, async (req, res) => {  
  const username = jwtDecoding.getUsernameFromToken(jwtDecoding.getTokenFromRequest(req));
  console.log(`Received logout request for ${username}`);
  const errors = await userMethods.deleteJWT(username);

  if(errors.length === 0) {
    return res.json({ "message": "Successfully Logged Out" });
  } else {
    return res.status(statusCodes.SERVER_ERROR).json({ errors: errors });
  }
});

// This is used when the user's original verification token is lost or expired (i.e. this is how they request a new one)
// Requires login first.
router.post("/verify/send/", authenticate, async (req, res) => {
  const user = res.locals.user;
  const token = await userMethods.generateEmailVerificationToken(user.name);
  const url = req.protocol + "://" + req.get("Host") + `/verify/${user.name}/token`;
  await sendVerificationEmail(user.name, user.email, url);
  return res.status(statusCodes.SUCCESS).json({message: "Email verification sent!"});
});

router.get("/verify/:username/:token", async (req, res) => {
  const isValid = await userMethods.verifyEmail(req.params.username, req.params.token);

  if(isValid) {
    return res.redirect("/login").json({message: "Email verification succeeded!"});
  } else {
    return res.status(statusCodes.INVALID_STATUS).json({message: "Email verification failed!"});
  }
});

router.post("/change-password", authenticate, isVerified, async (req, res) => {
  const password = req.body.password;
  let responseJSON = {errors: []};
  let returnStatus = statusCodes.SUCCESS;
  if(userMethods.isValidPassword(password)) {
    try {
      await userMethods.changePassword(res.locals.user, password);
      await userMethods.deleteJWT(res.locals.user.name);
      return res.redirect("../login");
    } catch(error) {
      console.error(error.message);
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.errors.push("Server Error");
      return res.status(returnStatus).json(responseJSON);
    }
  } else {
    returnStatus = statusCodes.INVALID_STATUS;
    responseJSON.errors.push("Invalid Password");
    return res.status(returnStatus).json(responseJSON);
  }

});

module.exports = router;
