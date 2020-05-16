const expect = require("chai").expect;
const User = require("../../models/User");

describe("User model tests", () => {
	it("Should be invalid without a name", async () => {
		const invalidUser = {
			name: null,
			email: "someone@something.com",
			passwordHash: "someHash"
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
			email: "someone@something.com",
			passwordHash: "someHash"
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
			email: null,
			passwordHash: "someHash"
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
			email: "someonesomething.com",
			passwordHash: "someHash"
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
			email: "",
			passwordHash: "someHash"
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.email).to.exist;
		}
	});

	it("Should be invalid without a hash", async () => {
		const invalidUser = {
			name: "someone",
			email: "someone@something.com",
			passwordHash: null
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.passwordHash).to.exist;
		}
	});

	it("Should be invalid with an empty hash", async () => {
		const invalidUser = {
			name: "someone",
			email: "someone@something.com",
			passwordHash: ""
		};

		const userModel = new User(invalidUser);

		try {
			const validated = await userModel.validate();
			fail();
		} catch(err) {
			expect(err.errors.passwordHash).to.exist;
		}
	});
	
	it("Should be valid with everything populated", async () => {
		const validUser = {
			name: "someone",
			email: "someone@something.com",
			passwordHash: "hash"
		};

		const userModel = new User(validUser);

		try {
			const validated = await userModel.validate();
		} catch(err) {
			fail(err);
		}
	});
});