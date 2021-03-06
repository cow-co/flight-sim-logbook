const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");
const userService = require("../services/users");

const mongod = new MongoMemoryServer();

const connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: 3,
    reconnectInterval: 1000,
  };

  await mongoose.connect(uri, mongooseOpts);
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

const createUser = async (userDetails) => {
  const newUser = await User.create(userDetails);
  return newUser;
};

const verifyUser = async (username) => {
  let user = await userService.getUserByName(username);
  user.isVerified = true;
  await user.save();
  return user;
};

const setupPasswordReset = async (username) => {
  const token = await userService.generateForgotPasswordToken(username);
  return token;
};

module.exports = {
  connect,
  closeDB,
  clearDB,
  createUser,
  verifyUser,
  setupPasswordReset,
};
