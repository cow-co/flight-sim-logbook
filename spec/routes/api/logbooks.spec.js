const request = require("supertest");
const server = require("../../../index");
const utils = require("../../utils");
const seedDB = require("../../../config/aircraft");
const expect = require("chai").expect;

const baseUser = {
  username: "name",
  email: "email@email.com",
  password: "password12345",
  passwordConfirmation: "password12345",
};

describe("Logbook endpoint tests", () => {
  beforeAll(async () => await utils.connect());

  beforeEach(async () => await seedDB());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("logbook-creation", () => {
    it("should create a logbook", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraftName: "F-16",
      };
      const res = await request(server)
        .post("/api/logbooks/create")
        .set("Authorization", `Bearer ${token}`)
        .send(logbookRequest);
      expect(res.statusCode).to.equal(201);
      expect(res.body.logbook).to.haveOwnProperty("aircraft", logbookRequest.aircraftName);
    });

    it("should fail to create a logbook with an invalid aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraftName: "F-19",
      };
      const res = await request(server)
        .post("/api/logbooks/create")
        .set("Authorization", `Bearer ${token}`)
        .send(logbookRequest);
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("logbook-deletion", () => {
    it("should delete a logbook", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraftName: "F-16",
      };
      await request(server).post("/api/logbooks/create").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server)
        .delete("/api/logbooks/delete")
        .set("Authorization", `Bearer ${token}`)
        .send(logbookRequest);
      expect(res.statusCode).to.equal(200);
    });

    it("should fail to delete a logbook with an empty aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraftName: "F-16",
      };
      await request(server).post("/api/logbooks/create").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).delete("/api/logbooks/delete").set("Authorization", `Bearer ${token}`).send({
        aircraftName: "",
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });
});
