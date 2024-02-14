const User = require("../models/User");
const HashedPassword = require("../models/HashedPassword");
const TokenValidity = require("../models/TokenValidity");

// TODO Chuck some logging in here

/**
 * Finds a user corresponding to the given ID
 * @param {string} id The MongoDB ID of the user to find
 * @param {boolean} includePasswordHash Whether we should include the password hash in the returned object
 * @returns The user, if found, or null if not
 */
const getUserById = async (id, includePasswordHash) => {
  let user = null;

  if (id) {
    user = await User.findById(id);
    if (includePasswordHash) {
      await user.populate("password");
    }
  }

  return user;
};

/**
 * Finds a user corresponding to the given username
 * @param {string} name The username of the user to find
 * @param {boolean} includePasswordHash Whether we should include the password hash in the returned object
 * @returns The user, if found, or EMPTY_USER object if not
 */
const getUserByName = async (name, includePasswordHash) => {
  let user = null;

  if (name) {
    user = await User.findOne({ name: name });
    if (includePasswordHash) {
      await user.populate("password");
    }
  }

  return user;
};

/**
 * Creates a new user in the database, as well as a HashedPassword record for them.
 * @param {string} username Username for the new user. Assumed to have already been validated.
 * @param {string} hashedPassword Hash of the password for the new user.
 */
const createUser = async (username, hashedPassword) => {
  const createdUser = await User.create({
    name: username,
  });
  const pw = await HashedPassword.create({
    hashedPassword: hashedPassword,
  });
  createdUser.password = pw._id;
  await createdUser.save();
  return createdUser;
};

/**
 * "Logs out" the user with the given ID, by generating a TokenValidity entry.
 * This basically records the time of the logout, and any JWTs issued before that
 * time will be considered invalid.
 * @param {string} id ID of user to log out
 */
const logUserOut = async (id) => {
  const existingEntry = await TokenValidity.findOne({ userId: id });
  if (existingEntry) {
    existingEntry.minTokenValidity = Date.now();
    await existingEntry.save();
  } else {
    await TokenValidity.create({
      userId: id,
      minTokenValidity: Date.now(),
    });
  }
};

/**
 * Retrieves the TokenValidity timestamp for the given user. Any JWTs issued *before* this timestamp
 * are to be considered invalid.
 * @param {string} id ID of the user to look up
 * @returns The timestamp before which any tokens will be considered invalid (or 0 if an entry is not found)
 */
const getMinValidTokenTimestamp = async (id) => {
  let timestamp = 0;
  const tokenValidityEntry = await TokenValidity.findOne({ userId: id });
  if (tokenValidityEntry) {
    timestamp = tokenValidityEntry.minTokenValidity;
  }
  return timestamp;
};

module.exports = {
  getUserById,
  getUserByName,
  createUser,
  logUserOut,
  getMinValidTokenTimestamp,
};
