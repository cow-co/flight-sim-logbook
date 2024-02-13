let agent;
let server;
const { purgeCache } = require("../utils");

describe("Logbook tests", () => {
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
  });

  test("Basic GET endpoint", async () => {
    const res = await agent.get("/api/logbooks/");

    expect(res.statusCode).toBe(200);
  });
});
