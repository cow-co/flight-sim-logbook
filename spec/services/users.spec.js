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
});
