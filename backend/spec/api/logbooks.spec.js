let agent;
let server;
const { purgeCache } = require("../utils");
const logbookService = require("../../db/services/logbook-service");

jest.mock("../../db/services/logbook-service");

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

  describe("Get logbooks", () => {
    test("Success", async () => {
      logbookService.getLogbooks.mockResolvedValue([
        {
          user: "id",
          entries: [],
        },
      ]);

      const res = await agent.get("/api/logbooks/");

      expect(res.statusCode).toBe(200);
      expect(res.body.errors).toHaveLength(0);
      expect(res.body.logbooks).toHaveLength(1);
    });

    test("Success - empty list", async () => {
      logbookService.getLogbooks.mockResolvedValue([]);

      const res = await agent.get("/api/logbooks/");

      expect(res.statusCode).toBe(200);
      expect(res.body.errors).toHaveLength(0);
      expect(res.body.logbooks).toHaveLength(0);
    });

    test("Failure - exception", async () => {
      logbookService.getLogbooks.mockRejectedValue(new TypeError("TEST"));

      const res = await agent.get("/api/logbooks/");

      expect(res.statusCode).toBe(500);
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.logbooks).toHaveLength(0);
    });
  });
});
