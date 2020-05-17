const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config/keys").JWT_KEY;
const { isEmptyOrNull } = require("../helpers/validation");

const millisecondsExpiry = 1000 * 60 * 60 * 12;	// 12 hours
const minPassLength = 13;

const getUserByName = async username => {
	let user = null;

	try {
		user = await User.findOne({name: username});
	} catch(error) {
		throw error;
	}

	return user;
};

const getUserByEmail = async email => {
	let user = null;
	user = await User.findOne({email: email});
	return user;
};

const createUser = async userSetup => {
	let newUser = {
		name: null,
		email: null,
		errors: []
	};

	if(isEmptyOrNull(userSetup.name)) {
		newUser.errors.push("Please enter a username");
	}

	if(isEmptyOrNull(userSetup.email)) {
		newUser.errors.push("Please enter an email");
	}
	
	if(newUser.errors.length === 0) {
		try {
			if(userSetup.password.length >= minPassLength) {
				const hash = await argon2.hash(userSetup.password);
				await User.create({
					name: userSetup.name,
					email: userSetup.email,
					passwordHash: hash
				});

				newUser.name = userSetup.name;
				newUser.email = userSetup.email;
			} else {
				newUser.errors.push("Password does not satisfy requirements");
			}			
		} catch(error) {
			newUser.errors.push(error.message);
		}
	}
	
	return newUser;
};

const checkPassword = async (user, givenPassword) => {
	return await argon2.verify(user.passwordHash, givenPassword);
};

// TODO A "checkJWT" method to validate the JWT is correct (and if it is not, we then redirect to the login page)

const generateJWT = async (user) => {
	const now = new Date();
	const expiresOn = new Date(now);
	expiresOn.setTime(now.getTime() + millisecondsExpiry);
	const token = jwt.sign({
			name: user.name,
			id: user._id,
			exp: parseInt(expiresOn.getTime() / 1000, 10)	// Decimal representation of the expiry, in seconds
		},
		JWT_KEY);

	// Save the token onto the user in the database; this will then be removed when the user logs out.
	// This allows us to track exactly which JWT is valid for that user (note that this also means they can only 
	// log in from one device at any given time)
	user.jwt = token;
	await user.save();

	return token;
};

module.exports = { getUserByName, getUserByEmail, createUser, checkPassword, generateJWT };