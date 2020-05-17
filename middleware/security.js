const checkJWT = require("../db_interface/users").checkJWT;
const statusCodes = require("../config/status_codes");

const authenticate = (req, res, next) => {
	const bearerToken = req.headers[Authorization];

	try {
		const token = bearerToken.split(" ")[1];
		const userId = checkJWT(token);
		if(userId) {
			next();
		} else {
			return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
		}
	} catch(error) {
		return res.status(statusCodes.INVALID_STATUS).json({ errors: ["Invalid Token"] });
	}
}

module.exports = authenticate;