const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config/keys").JWT_KEY;
const { isEmptyOrNull } = require("../helpers/validation");

const secondsExpiry = 60 * 60 * 12;	// 12 hours
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

const generateJWT = async (user) => {
	const token = jwt.sign(
		{
			name: user.name,
			id: user._id,
		},
		JWT_KEY,
		{
			expiresIn: secondsExpiry
		}
	);

	// Save the token onto the user in the database; this will then be removed when the user logs out.
	// This allows us to track exactly which JWT is valid for that user (note that this also means they can only 
	// log in from one device at any given time)
	user.jwt = token;
	await user.save();

	return token;
};

// Verifies the given token, and returns the associated user ID (if valid, `null` if not)
const checkJWT = (token) => {
	let userId = null;

	try {
		const decoded = jwt.verify(token, JWT_KEY);

		if(decoded) {
			// Validate that the token matches what is saved in the DB
			const user = getUserByName(decoded.name);
			if(user.jwt === token) {
				userId = decoded.id;
			}
		}
	} catch(error) {
		console.log("Invalid JWT");
	}	
	
	return userId;
}

const deleteJWT = async (username) => {
	let errors = [];

	try {
		const user = await getUserByName(username);
		if(user) {
			user.jwt = null;
			await user.save();
		}
	} catch(error) {
		errors.push("Server Error");
	}

	return errors;
}

module.exports = { getUserByName, getUserByEmail, createUser, checkPassword, generateJWT, checkJWT, deleteJWT };