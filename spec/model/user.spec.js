const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const userMethods = require("../../services/users");

describe("User model tests", () => {
  it("Should be invalid without a name", async () => {
    const invalidUser = {
      username: null,
      email: "someone@something.com",
    };

    const userModel = new User(invalidUser);

    try {
      const validated = await userModel.validate();
      fail();
    } catch (err) {
      expect(err.errors.username).to.exist;
    }
  });

  it("Should be invalid with an empty name", async () => {
    const invalidUser = {
      username: "",
      email: "someone@something.com",
    };

    const userModel = new User(invalidUser);

    try {
      const validated = await userModel.validate();
      fail();
    } catch (err) {
      expect(err.errors.username).to.exist;
    }
  });

  it("Should be invalid without an email", async () => {
    const invalidUser = {
      username: "someone",
      email: null,
    };

    const userModel = new User(invalidUser);

    try {
      const validated = await userModel.validate();
      fail();
    } catch (err) {
      expect(err.errors.email).to.exist;
    }
  });

  it("Should be invalid with an invalid email", async () => {
    const invalidUser = {
      username: "someone",
      email: "someonesomething.com",
    };

    const userModel = new User(invalidUser);

    try {
      const validated = await userModel.validate();
      fail();
    } catch (err) {
      expect(err.errors.email).to.exist;
    }
  });

  it("Should be invalid with an empty email", async () => {
    const invalidUser = {
      username: "someone",
      email: "",
    };

    const userModel = new User(invalidUser);

    try {
      const validated = await userModel.validate();
      fail();
    } catch (err) {
      expect(err.errors.email).to.exist;
    }
  });

  it("Should be valid with everything populated", async () => {
    const validUser = {
      username: "someone",
      email: "someone@something.com",
    };

    const userModel = new User(validUser);

    try {
      const validated = await userModel.validate();
    } catch (err) {
      fail(err);
    }
  });
});
