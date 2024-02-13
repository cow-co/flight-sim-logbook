const Logbook = require("../models/Logbook");
const LogbookEntry = require("../models/LogbookEntry");

const getLogbooks = async () => {
  return await Logbook.find();
};

module.exports = {
  getLogbooks,
};
