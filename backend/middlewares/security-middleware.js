const jwt = require("jsonwebtoken");
const sanitize = require("sanitize");
const { log, levels } = require("../utils/logger");
const statusCodes = require("../config/statusCodes");
const securityConfig = require("../config/security");
const userService = require("../db/services/user-service");

const sanitizer = sanitize();

/**
 * Checks that the JWT is valid; if not, redirects to the login page
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {function} next
 */
const verifyToken = async (req, res, next) => {
  log("security-middleware/verifyToken", "Verifying Token...", levels.DEBUG);

  const authHeader = req.headerString("authorization");

  if (!authHeader) {
    res.status(statusCodes.FORBIDDEN).json({ errors: ["No token"] });
  } else {
    const token = authHeader.split(" ")[1]; // header has format "Bearer <TOKEN>"

    try {
      let payload = jwt.verify(token, securityConfig.jwtSecret);
      payload = sanitizer.primitives(payload); // This ensures all the keys are at least only Booleans, Integers, or Strings. Sufficient for our purposes.
      const minTimestamp = await userService.getMinValidTokenTimestamp(
        payload.userId
      );

      if (minTimestamp < payload.iat * 1000) {
        req.data = {};
        req.data.userId = payload.userId;

        next();
      } else {
        log(
          "security-middleware/verifyToken",
          "User provided an invalid token. Potential token stealing/token re-use attack!",
          levels.SECURITY
        );

        res.status(statusCodes.FORBIDDEN).json({ errors: ["Invalid token"] });
      }
    } catch (err) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError" ||
        err.name === "NotBeforeError"
      ) {
        log("security-middleware/verifyToken", err, levels.SECURITY);

        res.status(statusCodes.FORBIDDEN).json({ errors: ["Invalid Token"] });
      } else {
        log("security-middleware/verifyToken", err, levels.ERROR);

        res
          .status(statusCodes.INTERNAL_SERVER_ERROR)
          .json({ errors: ["Internal Server Error"] });
      }
    }
  }
};

module.exports = {
  verifyToken,
};
