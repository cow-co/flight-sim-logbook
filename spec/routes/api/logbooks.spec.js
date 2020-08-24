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
        aircraft: "F-16",
      };
      const res = await request(server)
        .post("/api/logbooks/")
        .set("Authorization", `Bearer ${token}`)
        .send(logbookRequest);
      expect(res.statusCode).to.equal(201);
      expect(res.body.logbook).to.haveOwnProperty("aircraft", logbookRequest.aircraft);
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
        aircraft: "F-19",
      };
      const res = await request(server)
        .post("/api/logbooks/")
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
        aircraft: "F-16",
      };
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server)
        .delete(`/api/logbooks/${logbookRequest.aircraft}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
    });

    it("should fail to delete a logbook with an invalid aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).delete(`/api/logbooks/aaa`).set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("getting user's logbooks", () => {
    it("should get a user's logbooks", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };
      const path = "/api/logbooks/" + baseUser.username;
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).get(path);
      expect(res.statusCode).to.equal(200);
      expect(res.body.logbooks.length).to.equal(1);
    });

    it("should fail to get a logbook with an empty aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).get("/api/logbooks/" + baseUser.username + "a");
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("getting a single logbook", () => {
    it("should get a user's logbook", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };
      const path = `/api/logbooks/${baseUser.username}/${logbookRequest.aircraft}`;
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).get(path);
      expect(res.statusCode).to.equal(200);
      expect(res.body.logbook.aircraft).to.equal(logbookRequest.aircraft);
    });

    it("should fail to get a logbook with an incorrect aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };
      const path = `/api/logbooks/${baseUser.username}/${logbookRequest.aircraft}a`;
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server).get(path);
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("logbook-updating", () => {
    it("should update a logbook", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };

      const mission = {
        duration: 3.3,
        a2aKills: 0,
        imc: false,
        bfm: false,
        bvr: false,
        sead: true,
        cas: false,
        strike: false,
        package: true,
        caseI: false,
        caseIII: false,
        aar: true,
      };
      await request(server).post("/api/logbooks/").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server)
        .put(`/api/logbooks/${logbookRequest.aircraft}`)
        .set("Authorization", `Bearer ${token}`)
        .send(mission);
      expect(res.statusCode).to.equal(200);
    });

    it("should fail to update a logbook with an empty aircraft name", async () => {
      await request(server).post("/api/users/register").send(baseUser);
      await utils.verifyUser(baseUser.username);

      const loginRes = await request(server).post("/api/users/login").send({
        username: baseUser.username,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const logbookRequest = {
        aircraft: "F-16",
      };

      const mission = {
        duration: 3.3,
        a2aKills: 0,
        imc: false,
        bfm: false,
        bvr: false,
        sead: true,
        cas: false,
        strike: false,
        package: true,
        caseI: false,
        caseIII: false,
        aar: true,
      };
      await request(server).post("/api/logbooks/create").set("Authorization", `Bearer ${token}`).send(logbookRequest);
      const res = await request(server)
        .put(`/api/logbooks/${logbookRequest.aircraft}`)
        .set("Authorization", `Bearer ${token}`)
        .send(mission);
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });
});
