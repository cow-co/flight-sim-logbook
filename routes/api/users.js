const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const userMethods = require("../../db_interface/users");
const jwtDecoding = require("../../helpers/jwt_decoding");
const { sendVerificationEmail, sendResetEmail } = require("../../helpers/emailing");

// Don't want to log a user in if their email has not been verified
router.post("/login", isVerified, async (req, res) => {
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
  let responseJSON = { user: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    const newUser = await userMethods.createUser(userDetails);
    if (newUser.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newUser.errors;
    } else {
      const token = await userMethods.generateEmailVerificationToken(newUser.name);
      const url = req.protocol + "://" + req.get("Host") + `/api/users/verify/${newUser.name}/${token}`;
      sendVerificationEmail(newUser.name, newUser.email, url);
      responseJSON.user = {
        name: newUser.name,
        email: newUser.email,
      };
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

  if (errors.length === 0) {
    return res.json({ message: "Successfully Logged Out" });
  } else {
    return res.status(statusCodes.SERVER_ERROR).json({ errors: errors });
  }
});

// This is used when the user's original verification token is lost or expired (i.e. this is how they request a new one)
// Requires login first.
router.get("/verify/send", authenticate, async (req, res) => {
  const user = res.locals.user;
  const token = await userMethods.generateEmailVerificationToken(user.name);
  const url = req.protocol + "://" + req.get("Host") + `/api/users/verify/${user.name}/${token}`;
  sendVerificationEmail(user.name, user.email, url);
  return res.status(statusCodes.SUCCESS).json({ message: "Email verification sent!" });
});

router.get("/verify/:username/:token", async (req, res) => {
  const isValid = await userMethods.verifyEmail(req.params.username, req.params.token);

  if (isValid) {
    return res.redirect("/login").json({ message: "Email verification succeeded!" });
  } else {
    return res.status(statusCodes.INVALID_STATUS).json({ message: "Email verification failed!" });
  }
});

router.post("/change-password", authenticate, isVerified, async (req, res) => {
  const password = req.body.password;
  const confirmation = req.body.passwordConfirmation;
  let responseJSON = { errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  if (password === confirmation && userMethods.isValidPassword(password)) {
    try {
      await userMethods.changePassword(res.locals.user, password);
      await userMethods.deleteJWT(res.locals.user.name);
      return res.redirect("../login");
    } catch (error) {
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

// This does not require authentication (since the user, by definition, has forgotten their password)
// Instead, the request must include the reset-password token from the email the user received
router.post("/reset-password", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const pwConfirm = req.body.passwordConfirmation;
  const resetToken = req.body.resetToken;

  let responseJSON = { errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  if (password === pwConfirm && userMethods.isValidPassword(password)) {
    try {
      const user = await userMethods.getUserByEmail(email);
      if (user && userMethods.verifyForgotPassword(user.name, resetToken)) {
        await userMethods.changePassword(res.locals.user, password);
        await userMethods.deleteJWT(res.locals.user.name);

        return res.redirect("../login");
      }
    } catch (error) {
      console.error(error.message);
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.errors.push("Server Error");
      return res.status(returnStatus).json(responseJSON);
    }
  }

  returnStatus = statusCodes.INVALID_STATUS;
  responseJSON.errors.push("Invalid Request");
  return res.status(returnStatus).json(responseJSON);
});

router.post("/request-reset-password", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = userMethods.getUserByEmail(userEmail);
    if (user) {
      const token = await userMethods.generateForgotPasswordToken(user.name);
      const url = req.protocol + "://" + req.get("Host") + `/api/users/reset-password/${user.name}/${token}`;
      sendResetEmail(user.name, user.email, url);
      return res.status(statusCodes.SUCCESS).json({ message: "Password reset email sent!" });
    } else {
      return res.status(statusCodes.INVALID_STATUS).json({ errors: ["User not found"] });
    }
  } catch (err) {
    console.error(err);
    return res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
  }
});

module.exports = router;
