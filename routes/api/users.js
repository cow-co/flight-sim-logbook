const express = require("express");
const router = express.Router();
const statusCodes = require("../../config/status_codes");
const { getUserByName, getUserByEmail } = require("../../db_interface/users");

router.post("/login", async (req, res) => {
	const loginDetails = req.body;

	try {
		const user = await getUserByName(loginDetails.name);
		if(user) {
			const valid = await user.checkPassword(loginDetails.password);
			if(valid) {
				const jwt = await user.generateJWT();
				return res.json(jwt);
			}
		}
	} catch(error) {
		return res.status(statusCodes.CREDS_ERROR).json({ errors: error.message });
	}
});

module.exports = router;