const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config/keys").JWT_KEY;

const millisecondsExpiry = 1000 * 60 * 60 * 12;	// 12 hours

const getUserByName = async username => {
	let user = null;
	user = await User.findOne({name: username});
	return user;
};

const getUserByEmail = async email => {
	let user = null;
	user = await User.findOne({email: email});
	return user;
};

const createUser = async userSetup => {
	let newUser = null;
	
	try {
		// TODO: Validate password requirements (length, content)
		const hash = await argon2.hash(userSetup.password);
		newUser = User.create({
			name: userSetup.name,
			email: userSetup.email,
			passwordHash: hash
		});
	} catch(error) {
		throw error;
	}

	return newUser;
};

const checkPassword = async (user, givenPassword) => {
	return await argon2.verify(user.passwordHash, givenPassword);
};

// TODO Should we save the JWT onto the user object in the DB? How else would we note when the user has logged out?
const generateJWT = async (user) => {
	const now = new Date();
	const expiresOn = new Date(now);
	expiresOn.setTime(now.getTime() + millisecondsExpiry);

	return jwt.sign({
		name: user.name,
		id: user._id,
		exp: parseInt(expiresOn.getTime() / 1000, 10)	// Decimal representation of the expiry, in seconds
	},
	JWT_KEY)
};

module.exports = { getUserByName, getUserByEmail, createUser, checkPassword, generateJWT };