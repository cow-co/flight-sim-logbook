const request = require("supertest");
const server = require("../../../index");
const utils = require("../../utils");
const expect = require("chai").expect;

const baseUser = {
  name: "name",
  email: "email@email.com",
  password: "password12345",
  passwordConfirmation: "password12345",
};

describe("User endpoint tests", () => {
  beforeAll(async () => await utils.connect());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("user-creation", () => {
    it("should create a user", async () => {
      const res = await request(server).post("/api/users/create").send(baseUser);
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

  describe("login", () => {
    it("should log the user in", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);

      const res = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      expect(res.statusCode).to.equal(200);
    });

    it("should fail to log in with incorrect password", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);

      const res = await request(server)
        .post("/api/users/login")
        .send({
          name: baseUser.name,
          password: baseUser.password + "a",
        });
      expect(res.statusCode).to.equal(401);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  it("should fail to log in with incorrect username", async () => {
    await request(server).post("/api/users/create").send(baseUser);
    await utils.verifyUser(baseUser.name);

    const res = await request(server)
      .post("/api/users/login")
      .send({
        name: baseUser.name + "a",
        password: baseUser.password,
      });
    expect(res.statusCode).to.equal(400);
    expect(res.body.errors.length).to.equal(1);
  });

  describe("logout", () => {
    it("should log the user out", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);

      const loginRes = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;
      const res = await request(server).get("/api/users/logout").set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
    });

    it("should fail to log out without a token", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);

      const res = await request(server).get("/api/users/logout");
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("change-password", () => {
    it("should change the user's password", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const loginRes = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const res = await request(server)
        .post("/api/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ password: "password123456", passwordConfirmation: "password123456" });
      expect(res.statusCode).to.equal(302);
    });

    it("should fail to change password with non-matching confirmation", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const loginRes = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const res = await request(server)
        .post("/api/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ password: "password123456", passwordConfirmation: "password123457" });
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("reset-password", () => {
    it("should reset the user's password", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const token = await utils.setupPasswordReset(baseUser.name);

      const res = await request(server).post("/api/users/reset-password").send({
        email: baseUser.email,
        password: "password123456",
        passwordConfirmation: "password123456",
        resetToken: token,
      });
      expect(res.statusCode).to.equal(302);
    });

    it("should fail to reset password with non-matching confirmation", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const token = await utils.setupPasswordReset(baseUser.name);

      const res = await request(server).post("/api/users/reset-password").send({
        email: baseUser.email,
        password: "password123456",
        passwordConfirmation: "password123457",
        resetToken: token,
      });
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });

    it("should fail to reset password with invalid reset token", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const token = await utils.setupPasswordReset(baseUser.name);

      const res = await request(server)
        .post("/api/users/reset-password")
        .send({
          email: baseUser.email,
          password: "password123456",
          passwordConfirmation: "password123456",
          resetToken: token + "aaa",
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });

  describe("user deletion", () => {
    it("should delete the user", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const loginRes = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const res = await request(server).delete("/api/users/delete").set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).to.equal(302);
    });

    it("should fail to delete a non-logged-in user", async () => {
      await request(server).post("/api/users/create").send(baseUser);
      await utils.verifyUser(baseUser.name);
      const loginRes = await request(server).post("/api/users/login").send({
        name: baseUser.name,
        password: baseUser.password,
      });
      const token = loginRes.body.jwt;

      const res = await request(server).delete("/api/users/delete");
      expect(res.statusCode).to.equal(400);
      expect(res.body.errors.length).to.equal(1);
    });
  });
});
