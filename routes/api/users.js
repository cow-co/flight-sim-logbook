const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { authenticate, isVerified } = require("../../middleware/security");
const userMethods = require("../../services/users");
const jwtDecoding = require("../../helpers/jwt_decoding");
const { sendVerificationEmail, sendResetEmail } = require("../../helpers/emailing");

// TODO Improve error logging (say where the error is, not just what it is)

router.post("/register", async (req, res) => {
  const userDetails = req.body;
  let responseJSON = { user: null, errors: [] };
  let returnStatus = statusCodes.SUCCESS;

  try {
    console.log("Creating user...");
    const newUser = await userMethods.createUser(userDetails);
    if (newUser.errors.length > 0) {
      returnStatus = statusCodes.INVALID_STATUS;
      responseJSON.errors = newUser.errors;
    } else {
      const token = await userMethods.generateEmailVerificationToken(newUser.username);
      const url = req.protocol + "://" + req.get("Host") + `/api/users/verify/${newUser.username}/${token}`;
      sendVerificationEmail(newUser.username, newUser.email, url);
      responseJSON.user = {
        username: newUser.username,
        email: newUser.email,
      };
      returnStatus = statusCodes.CREATED;
      console.log("Created user.");
    }
  } catch (error) {
    console.error(error.message);
    returnStatus = statusCodes.SERVER_ERROR;
    responseJSON.errors.push("Server-side error");
  }

  return res.status(returnStatus).json(responseJSON);
});

// Don't want to log a user in if their email has not been verified
router.post("/login", isVerified, async (req, res) => {
  const loginDetails = req.body;
  let valid = false;
  let response = null;

  try {
    const user = await userMethods.getUserByName(loginDetails.username);
    if (user) {
      valid = await userMethods.checkPassword(user, loginDetails.password);
      if (valid) {
        const jwt = await userMethods.generateJWT(user);
        response = res.json({ jwt: jwt, username: loginDetails.username });
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

router.post("/logout", authenticate, isVerified, async (req, res) => {
  const username = jwtDecoding.getUsernameFromToken(jwtDecoding.getTokenFromRequest(req));
  const errors = await userMethods.deleteJWT(username);

  if (errors.length === 0) {
    return res.json({ message: "Successfully Logged Out" });
  } else {
    return res.status(statusCodes.SERVER_ERROR).json({ errors: errors });
  }
});

// This is used when the user's original verification token is lost or expired (i.e. this is how they request a new one)
router.post("/verify/send", async (req, res) => {
  const user = req.body.user;
  const token = await userMethods.generateEmailVerificationToken(user.username);
  if (token) {
    const url = req.protocol + "://" + req.get("Host") + `/api/users/verify/${user.username}/${token}`;
    sendVerificationEmail(user.username, user.email, url);
    return res.status(statusCodes.SUCCESS).json({ message: "Email verification sent!" });
  } else {
    return res.status(statusCodes.INVALID_STATUS).json({ errors: ["User not found"] });
  }
});

router.get("/verify/:username/:token", async (req, res) => {
  const isValid = await userMethods.verifyEmail(req.params.username, req.params.token);

  if (isValid) {
    return res.redirect("/users/login");
  } else {
    return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Email verification failed!"] });
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
      await userMethods.deleteJWT(res.locals.user.username);
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

router.post("/request-reset-password", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await userMethods.getUserByEmail(userEmail);
    if (user) {
      const token = await userMethods.generateForgotPasswordToken(user.username);
      const url = req.protocol + "://" + req.get("Host") + `/api/users/reset-password/${user.username}/${token}`;
      sendResetEmail(user.username, user.email, url);
      return res.status(statusCodes.SUCCESS).json({ message: "Password reset email sent!" });
    } else {
      return res.status(statusCodes.INVALID_STATUS).json({ errors: ["User not found"] });
    }
  } catch (err) {
    console.error(err);
    return res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
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
      const passwordResetVerified = await userMethods.verifyForgotPassword(user.username, resetToken);
      if (user && passwordResetVerified) {
        await userMethods.changePassword(user, password);
        await userMethods.deleteJWT(user.username);

        return res.redirect("../login");
      }
    } catch (error) {
      console.error(error.message);
      returnStatus = statusCodes.SERVER_ERROR;
      responseJSON.errors.push("Server Error");
      return res.status(returnStatus).json(responseJSON);
    }
  }

  console.log("Invalid reset");
  returnStatus = statusCodes.INVALID_STATUS;
  responseJSON.errors.push("Invalid Request");
  return res.status(returnStatus).json(responseJSON);
});

router.delete("/delete", authenticate, isVerified, async (req, res) => {
  try {
    await userMethods.deleteUser(res.locals.user.username);
    return res.redirect("../../../"); // Redirect to index
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
  }
});

module.exports = router;
