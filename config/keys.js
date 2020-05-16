const MONGO_UN = encodeURIComponent(process.env.LOGBOOK_DB_USER);
const MONGO_PW = encodeURIComponent(process.env.LOGBOOK_DB_PW);

module.exports = {
  mongo_uri: `mongodb://${MONGO_UN}:${MONGO_PW}@ds231529.mlab.com:31529/flight-sim-logbook`
};