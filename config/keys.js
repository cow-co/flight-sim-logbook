const MONGO_UN = encodeURIComponent(process.env.LOGBOOK_DB_USER);
const MONGO_PW = encodeURIComponent(process.env.LOGBOOK_DB_PW);
const JWT_KEY = process.env.LOGBOOK_JWT_SECRET;
const EMAIL_UN = process.env.EMAIL_UN;
const EMAIL_PW = process.env.EMAIL_PW;
const AUTH_EXPIRY_HOURS = 12;

module.exports = {
  mongo_uri: `mongodb://${MONGO_UN}:${MONGO_PW}@ds231529.mlab.com:31529/flight-sim-logbook`,
  JWT_KEY,
  EMAIL_UN,
  EMAIL_PW,
  AUTH_EXPIRY_HOURS
};