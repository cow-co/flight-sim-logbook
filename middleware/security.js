const checkJWT = require("../db_interface/users").checkJWT;
const statusCodes = require("../config/status_codes");
const jwtDecoding = require("../helpers/jwt_decoding");

const authenticate = (req, res, next) => {
	try {
		const token = jwtDecoding.getTokenFromRequest(req);
		const userId = checkJWT(token);
		if(userId) {
			next();
		} else {
			console.log("Invalid token received");
			
			return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
		}
	} catch(error) {
		console.error(error);
		
		return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
	}
}

module.exports = authenticate;