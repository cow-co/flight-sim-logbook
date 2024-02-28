const Logbook = require("../models/Logbook");
const LogbookEntry = require("../models/LogbookEntry");

const getLogbooks = async () => {
  return await Logbook.find();
};

const getLogbooksForUser = async (userId) => {
  return Logbook.findOne({ user: userId }).populate("entries");
};

const createLogbook = async (userId) => {
  await Logbook.create({
    user: userId,
    entries: [],
  });
};

const addLogbookEntry = async (userId, logbookEntry) => {
  const entry = await LogbookEntry.create(logbookEntry);
  const userLogbook = await Logbook.findOne({ user: userId });
  userLogbook.entries.push(entry._id);
  await userLogbook.save();
};

module.exports = {
  getLogbooks,
  getLogbooksForUser,
  createLogbook,
  addLogbookEntry,
};
