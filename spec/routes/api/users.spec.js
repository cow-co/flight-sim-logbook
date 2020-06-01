const request = require("supertest");
const server = require("../../../index");
const utils = require("../../utils");
const expect = require("chai").expect;

describe("User endpoint tests", () => {
  beforeAll(async () => await utils.connect());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("user-creation", () => {
    it("should create a user", async () => {
      const res = await request(server).post("/api/users/create").send({
        name: "name",
        email: "email@email.com",
        password: "password12345",
        passwordConfirmation: "password12345",
      });
      expect(res.statusCode).to.equal(201);
      expect(res.body.user).to.haveOwnProperty("name", "name");
    });

    it("should fail to create a user with non-matching passwords", async () => {
      const res = await request(server).post("/api/users/create").send({
        name: "name",
        email: "email@email.com",
        password: "password12345",
        passwordConfirmation: "password12346",
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });
});
