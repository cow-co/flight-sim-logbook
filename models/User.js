const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_KEY = require("../config/keys").JWT_KEY;
const Schema = mongoose.Schema;

const millisecondsExpiry = 1000 * 60 * 60 * 12;	// 12 hours

const validateEmail = (email) => {
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regex.test(email);
}

const userSchema = new Schema({
	name: {
		type: String,
		index: true,
		unique: true,
		required: true
	},
	email: {
		type: String,
		index: true,
		lowercase: true,
		unique: true,
		validate: [validateEmail, "Please provide a valid email address"],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
		required: true
	},
	passwordSalt: String,
	passwordHash: String
});

userSchema.methods.setPassword = async (password) => {
	try {
		this.passwordSalt = await bcrypt.genSalt(14);	// 14 rounds for the salt, should result in a 4x increase in time taken compared to the default
		this.passwordHash = await bcrypt.hash(password, this.passwordSalt);
		return this.passwordHash;
	} catch(error) {
		console.error(error);
	}
};

userSchema.methods.checkPassword = async (givenPassword) => {
	const hash = await bcrypt.hash(givenPassword, this.passwordSalt);
	return this.passwordHash === hash;
};

// TODO Should we save the JWT onto the user object in the DB? How else would we note when the user has logged out?
userSchema.methods.generateJWT = async () => {
	const now = new Date();
	const expiresOn = new Date(now);
	expiresOn.setTime(now.getTime() + millisecondsExpiry);

	return jwt.sign({
		name: this.name,
		id: this._id,
		exp: parseInt(expiresOn.getTime() / 1000, 10)	// Decimal representation of the expiry, in seconds
	},
	JWT_KEY)
};

module.exports = User = mongoose.model("user", userSchema);