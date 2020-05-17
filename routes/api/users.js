const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const userMethods = require("../../db_interface/users");

router.post("/login", async (req, res) => {
	const loginDetails = req.body;
	console.log("Received login request");
	let valid = false;
	let response = null;

	try {
		const user = await userMethods.getUserByName(loginDetails.name);
		if(user) {
			valid = await userMethods.checkPassword(user, loginDetails.password);
			if(valid) {
				const jwt = await userMethods.generateJWT(user);
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

router.post("/create", async (req, res) => {
	const userDetails = req.body;
	console.log("Received user-creation request");
	let response = null;
	let userExists = false;

	try {
		let user = await userMethods.getUserByName(userDetails.name);
		if(user) {
			userExists = true;
		} else {
			user = await userMethods.getUserByEmail(userDetails.email);
			userExists = user ? true : false;
		}

		if(userExists) {
			response = res.status(statusCodes.INVALID_STATUS).json({errors: ["User already exists!"]});
		} else {
			const userId = await userMethods.createUser(userDetails);
			response = res.json({"id": userId});
		}
	} catch(error) {
		console.error("Other error");
		response = res.status(statusCodes.SERVER_ERROR).json({ errors: ["Server Error"] });
	}

	return response;
});

module.exports = router;