const checkJWT = require("../services/users").checkJWT;
const statusCodes = require("../config/status_codes");
const jwtDecoding = require("../helpers/jwt_decoding");
const getUserByName = require("../services/users").getUserByName;

const authenticate = async (req, res, next) => {
  try {
    const token = jwtDecoding.getTokenFromRequest(req);
    const user = await checkJWT(token);

    if (user && user.isActive) {
      res.locals.user = user;
      next(); // This will be `isVerified` if email verification is required for the endpoint in question
    } else {
      console.log("Invalid token received");

      return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
    }
  } catch (error) {
    console.error(error);

    return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
  }
};

const isVerified = async (req, res, next) => {
  let user = null;
  let isVerified = false;

  try {
    // Some endpoints may call this first (if authentication tokens are not required - e.g. login endpoint) so res.locals.user won't be set
    if (res.locals.user !== undefined) {
      isVerified = res.locals.user.isVerified;
    } else {
      username = req.body.name;
      user = await getUserByName(username);
      if (user) {
        isVerified = user.isVerified;
      }
    }

    if (!isVerified) {
      return res.status(statusCodes.INVALID_STATUS).json({ isVerified: false, errors: ["Please verify your email"] });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(statusCodes.INVALID_STATUS).json({ isVerified: false, errors: ["Malformed Request"] });
  }
};

module.exports = { authenticate, isVerified };
