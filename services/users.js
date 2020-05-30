const User = require("../models/User");
const argon2 = require("argon2");
const cryptoString = require("crypto-random-string");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config/keys").JWT_KEY;
const AUTH_EXPIRY_HOURS = require("../config/keys").AUTH_EXPIRY_HOURS;
const { isEmptyOrNull } = require("../helpers/validation");

const secondsExpiry = 60 * 60 * AUTH_EXPIRY_HOURS; // 12 hours
const minPassLength = 13;

const getUserByName = async (username) => {
  let user = null;

  try {
    user = await User.findOne({ name: username });
  } catch (error) {
    throw error;
  }

  return user;
};

const getUserByEmail = async (email) => {
  let user = null;
  user = await User.findOne({ email: email });
  return user;
};

// UNTESTED
const isValidPassword = (password) => {
  return password.length >= minPassLength;
};

// UNTESTED
const changePassword = async (user, password) => {
  const hash = await argon2.hash(password);
  user.passwordHash = hash;

  if (!user.isActive) {
    user.isActive = true;
  }

  user.verificationToken = null;
  user.resetPasswordToken = null;

  await user.save();
};

const createUser = async (userSetup) => {
  let newUser = {
    name: null,
    email: null,
    errors: [],
  };

  let existingUser = await getUserByName(userSetup.name);
  if (existingUser) {
    userExists = true;
  } else {
    existingUser = await getUserByEmail(userSetup.email);
    userExists = existingUser ? true : false;
  }

  if (userExists) {
    newUser.errors.push("User already exists!");
  } else {
    if (isEmptyOrNull(userSetup.name)) {
      newUser.errors.push("Please enter a username");
    }

    if (isEmptyOrNull(userSetup.email)) {
      newUser.errors.push("Please enter an email");
    }

    if (userSetup.password !== userSetup.passwordConfirmation) {
      newUser.errors.push("Password confirmation does not match");
    }
  }

  if (newUser.errors.length === 0) {
    try {
      if (isValidPassword(userSetup.password)) {
        const hash = await argon2.hash(userSetup.password);
        await User.create({
          name: userSetup.name,
          email: userSetup.email,
          passwordHash: hash,
        });

        newUser.name = userSetup.name;
        newUser.email = userSetup.email;
      } else {
        newUser.errors.push("Password does not satisfy requirements");
      }
    } catch (error) {
      newUser.errors.push(error.message);
    }
  }

  return newUser;
};

const checkPassword = async (user, givenPassword) => {
  return await argon2.verify(user.passwordHash, givenPassword);
};

const generateJWT = async (user) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    JWT_KEY,
    {
      expiresIn: secondsExpiry,
    }
  );

  // Save the token onto the user in the database; this will then be removed when the user logs out.
  // This allows us to track exactly which JWT is valid for that user (note that this also means they can only
  // log in from one device at any given time)
  user.jwt = token;
  await user.save();

  return token;
};

// Verifies the given token, and returns the associated user (if valid, `null` if not)
const checkJWT = async (token) => {
  let user = null;

  try {
    const decoded = jwt.verify(token, JWT_KEY);

    if (decoded) {
      // Validate that the token matches what is saved in the DB
      const obtainedUser = await getUserByName(decoded.name);
      if (obtainedUser.jwt === token) {
        user = obtainedUser;
      }
    }
  } catch (error) {
    console.log("Invalid JWT");
  }

  return user;
};

// UNTESTED
const deleteJWT = async (username) => {
  let errors = [];

  try {
    const user = await getUserByName(username);
    if (user) {
      user.jwt = null;
      await user.save();
    }
  } catch (error) {
    errors.push("Server Error");
  }

  return errors;
};

// UNTESTED
const generateEmailVerificationToken = async (username) => {
  const user = await getUserByName(username);
  const token = cryptoString({ length: 15, type: "url-safe" });
  const dateSet = Date.now();
  user.verificationToken = token;
  user.verificationSet = dateSet;
  await user.save();

  return token;
};

// UNTESTED
const verifyEmail = async (username, givenToken) => {
  const user = await getUserByName(username);
  const timePassed = Date.now() - user.verificationSet;
  let valid = false;
  if (timePassed < secondsExpiry * 1000) {
    if (user.verificationToken === givenToken) {
      valid = true;
    }
  } else {
    // unset the expired token
    user.verificationToken = null;
    await user.save();
  }

  return valid;
};

// UNTESTED
const generateForgotPasswordToken = async (username) => {
  const user = await getUserByName(username);
  const token = cryptoString({ length: 15, type: "url-safe" });
  const dateSet = Date.now();
  user.resetPasswordToken = token;
  user.resetTokenSet = dateSet;
  // We don't want the account to be useable until the password is reset.
  // This allows us to use password-reset as a quick way to lock out an account.
  user.isActive = false;
  await user.save();

  return token;
};

// UNTESTED
const verifyForgotPassword = async (username, token) => {
  const user = await getUserByName(username);
  const timePassed = Date.now() - user.resetTokenSet;
  let valid = false;
  if (timePassed < secondsExpiry * 1000) {
    if (user.resetPasswordToken === token) {
      valid = true;
    }
  } else {
    // unset the expired token
    user.resetPasswordToken = null;
    await user.save();
  }

  return valid;
};

const deleteUser = async (username) => {
  await User.deleteOne({ name: username }); // Usernames are (should be) unique
};

module.exports = {
  getUserByName,
  getUserByEmail,
  isValidPassword,
  changePassword,
  createUser,
  checkPassword,
  generateJWT,
  checkJWT,
  deleteJWT,
  generateEmailVerificationToken,
  verifyEmail,
  generateForgotPasswordToken,
  verifyForgotPassword,
  deleteUser,
};
