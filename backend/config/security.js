module.exports = {
  jwtSecret: process.env.LOGBOOK_JWT_SECRET || "PLEASEFORTHELOVEOFGODCHANGEME",
  rateLimit: {
    windowTimeMS: 15 * 60 * 1000, // The timespan over which the rate is taken
    maxRequestsInWindow: 100, // How many requests can each IP make, per window
  },
};
