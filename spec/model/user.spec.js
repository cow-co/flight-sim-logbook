const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const userMethods = require("../../db_interface/users");

describe("User model tests", () => {
	it("Should be invalid without a name", async () => {
		const invalidUser = {
			name: null,
			email: "someone@something.com"
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.name).to.exist;
		}
	});

	it("Should be invalid with an empty name", async () => {
		const invalidUser = {
			name: "",
			email: "someone@something.com"
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.name).to.exist;
		}
	});

	it("Should be invalid without an email", async () => {
		const invalidUser = {
			name: "someone",
			email: null
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.email).to.exist;
		}
	});

	it("Should be invalid with an invalid email", async () => {
		const invalidUser = {
			name: "someone",
			email: "someonesomething.com"
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.email).to.exist;
		}
	});

	it("Should be invalid with an empty email", async () => {
		const invalidUser = {
			name: "someone",
			email: ""
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.email).to.exist;
		}
	});
	
	it("Should be valid with everything populated", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com"
		};

		const userModel = new User(validUser);

		try {
			const validated = await userModel.validate();
		} catch(err) {
			fail(err);
		}
	});
	
	it("Should generate a JWT", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com"
		};

		const userModel = new User(validUser);		
		const token = await userMethods.generateJWT(userModel);
		const decoded = await jwt.decode(token);

		expect(decoded.name).to.equal("someone");
	});
});