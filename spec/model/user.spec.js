const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

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
	
	it("Should generate password hash and salt", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com"
		};

		const userModel = new User(validUser);
		const hash = await userModel.setPassword("password");
		expect(hash).to.exist;
	});
	
	it("Should validate a given password", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com"
		};

		const userModel = new User(validUser);
		await userModel.setPassword("password");
		const valid = await userModel.checkPassword("password");
		expect(valid).to.be.true;
	});
	
	it("Should generate a JWT", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com"
		};

		const userModel = new User(validUser);
		const token = await userModel.generateJWT();
		const decoded = await jwt.decode(token);

		expect(decoded.name).to.equal("someone");
	});
});