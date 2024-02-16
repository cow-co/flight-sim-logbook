let agent;
let server;
const { purgeCache } = require("../utils");
const userService = require("../../db/services/user-service");
const validation = require("../../validation/security-validation");

jest.mock("../../db/services/user-service");
jest.mock("../../validation/security-validation");

describe("User tests", () => {
  afterEach(() => {
    server.stop();
    delete require.cache[require.resolve("../../index")];
  });

  afterAll(() => {
    purgeCache();
  });

  beforeEach(() => {
    server = require("../../index");
    agent = require("supertest").agent(server);
    validation.validateUsername.mockReturnValue([]);
    validation.validatePassword.mockReturnValue([]);
  });

  test("Register - success", async () => {
    userService.getUserByName.mockResolvedValue(null);
    userService.createUser.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashedId",
    });

    const res = await agent.post("/api/users/register").send({
      username: "name",
      password: "password1234567890",
      passwordConfirmation: "password1234567890",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.errors).toHaveLength(0);
    expect(res.body.userId).toBe("id");
  });

  test("Register - failure - username validation", async () => {
    validation.validateUsername.mockReturnValue(["Short"]);

    const res = await agent.post("/api/users/register").send({
      username: "na",
      password: "password1234567890",
      passwordConfirmation: "password1234567890",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.userId).toBeNull();
  });

  test("Register - failure - password validation", async () => {
    validation.validatePassword.mockReturnValue(["Short"]);

    const res = await agent.post("/api/users/register").send({
      username: "name",
      password: "password",
      passwordConfirmation: "password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.userId).toBeNull();
  });

  test("Register - failure - exception", async () => {
    userService.getUserByName.mockRejectedValue(new TypeError("TEST"));

    const res = await agent.post("/api/users/register").send({
      username: "name",
      password: "password1234567890",
      passwordConfirmation: "password1234567890",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.userId).toBe(null);
  });

  test("Register - failure - user exists", async () => {
    userService.getUserByName.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashedId",
    });

    const res = await agent.post("/api/users/register").send({
      username: "name",
      password: "password1234567890",
      passwordConfirmation: "password1234567890",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.userId).toBeNull();
  });
});
