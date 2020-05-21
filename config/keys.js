const MONGO_UN = encodeURIComponent(process.env.LOGBOOK_DB_USER);
const MONGO_PW = encodeURIComponent(process.env.LOGBOOK_DB_PW);
const JWT_KEY = process.env.LOGBOOK_JWT_SECRET;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

module.exports = {
  mongo_uri: `mongodb://${MONGO_UN}:${MONGO_PW}@ds231529.mlab.com:31529/flight-sim-logbook`,
  JWT_KEY,
  SENDGRID_API_KEY
};