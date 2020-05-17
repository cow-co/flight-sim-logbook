const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
	passwordHash: String,
	jwt: String
});

module.exports = User = mongoose.model("Users", userSchema);