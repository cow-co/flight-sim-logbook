let mongoString = "";
if (process.env.LOGBOOK_DB_USER) {
  mongoString = `mongodb://${process.env.LOGBOOK_DB_USER}:${process.env.LOGBOOK_DB_PASS}@127.0.0.1:27017/flight-sim-logbook`;
} else {
  mongoString = `mongodb://127.0.0.1:27017/flight-sim-logbook`;
}

module.exports = {
  mongo_uri: mongoString,
};
