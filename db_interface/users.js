const User = require("../models/User");

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
	let id = null;
	
	try {
		const newUser = User.create({
			name: userSetup.name,
			email: userSetup.email,
			passwordHash: userSetup.passwordHash
		});
		id = newUser._id;
	} catch(error) {
		throw error;
	}

	return id;
};

module.exports = { getUserByName, getUserByEmail };