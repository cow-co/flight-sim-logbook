const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { getUserByName, getUserByEmail } = require("../../db_interface/users");

router.post("/login", async (req, res) => {
	const loginDetails = req.body;
	console.log("Received login request");
	let valid = false;
	let response = null;

	try {
		const user = await getUserByName(loginDetails.name);
		if(user) {
			valid = await user.checkPassword(loginDetails.password);
			if(valid) {
				const jwt = await user.generateJWT();
				response = res.json(jwt);
			} else {
				console.log("Invalid PW");
				
				response = res.status(statusCodes.CREDS_ERROR).json({ errors: ["Incorrect Credentials"] });
			}
		} else {
			console.log("Invalid user");
			response = res.status(statusCodes.CREDS_ERROR).json({ errors: ["Incorrect Credentials"] });
		}
	} catch(error) {
		console.error("Other error");
		response = res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
	}

	return response;
});

module.exports = router;