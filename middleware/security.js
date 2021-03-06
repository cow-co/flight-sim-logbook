const checkJWT = require("../services/users").checkJWT;
const statusCodes = require("../config/status_codes");
const jwtDecoding = require("../helpers/jwt_decoding");
const getUserByName = require("../services/users").getUserByName;

const authenticate = async (req, res, next) => {
  try {
    const token = jwtDecoding.getTokenFromRequest(req);
    if (token === null) {
      return res.status(statusCodes.CREDS_ERROR).json({ errors: ["Invalid Token"] });
    }

    const user = await checkJWT(token);

    if (user && user.isActive) {
      res.locals.user = user;
      next(); // This will be `isVerified` if email verification is required for the endpoint in question
    } else {
      console.log("Invalid token received");

      return res.status(statusCodes.CREDS_ERROR).json({ errors: ["Invalid Token"] });
    }
  } catch (error) {
    console.error(error);

    return res.status(statusCodes.SERVER_ERROR).json({ errors: ["Invalid Token"] });
  }
};

const isVerified = async (req, res, next) => {
  let user = null;

  try {
    // Some endpoints may call this first (if authentication tokens are not required - e.g. login endpoint) so res.locals.user won't be set
    if (res.locals.user !== undefined) {
      user = res.locals.user;
    } else {
      username = req.body.username;
      user = await getUserByName(username);
    }

    if (user) {
      if (user.isVerified) {
        next();
      } else {
        return res.status(statusCodes.CREDS_ERROR).json({ isVerified: false, errors: ["Please verify your email"] });
      }
    } else {
      return res.status(statusCodes.CREDS_ERROR).json({ isVerified: false, errors: ["User does not exist"] });
    }
  } catch (error) {
    console.log(error);
    return res.status(statusCodes.CREDS_ERROR).json({ isVerified: false, errors: ["Malformed Request"] });
  }
};

module.exports = { authenticate, isVerified };
