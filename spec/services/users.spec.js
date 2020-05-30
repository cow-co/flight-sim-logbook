const userService = require("../../services/users");
const utils = require("./utils");
const expect = require("chai").expect;

beforeAll(async () => await utils.connect());

afterEach(async () => await utils.clearDB());

afterAll(async () => await utils.closeDB());

describe("User service tests", () => {
  it("Should fail to create a user with an empty username", async () => {
    const invalidUser = {
      name: "",
      email: "someone@something.com",
      password: "password12345",
      passwordConfirmation: "password12345",
    };

    try {
      const user = await userService.createUser(invalidUser);
      expect(user.errors.length).to.equal(1);
    } catch (err) {
      fail();
    }
  });

  it("Should fail to create a user with an empty email", async () => {
    const invalidUser = {
      name: "name",
      email: "",
      password: "password12345",
      passwordConfirmation: "password12345",
    };

    try {
      const user = await userService.createUser(invalidUser);
      expect(user.errors.length).to.equal(1);
    } catch (err) {
      fail();
    }
  });

  it("Should fail to create a user with an empty password", async () => {
    const invalidUser = {
      name: "name",
      email: "someone@something.com",
      password: "",
      passwordConfirmation: "",
    };

    try {
      const user = await userService.createUser(invalidUser);
      expect(user.errors.length).to.equal(1);
    } catch (err) {
      fail();
    }
  });

  it("Should fail to create a user with a non-matching password", async () => {
    const invalidUser = {
      name: "name",
      email: "someone@something.com",
      password: "password12345",
      passwordConfirmation: "password12346",
    };

    try {
      const user = await userService.createUser(invalidUser);
      expect(user.errors.length).to.equal(1);
    } catch (err) {
      fail();
    }
  });

  it("Should create a user", async () => {
    const invalidUser = {
      name: "name",
      email: "someone@something.com",
      password: "password12345",
      passwordConfirmation: "password12345",
    };

    try {
      const user = await userService.createUser(invalidUser);
      expect(user.name).to.equal("name");
    } catch (err) {
      fail();
    }
  });
});
