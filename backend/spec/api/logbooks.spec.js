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

  describe("Get user logbook entries", () => {
    test("Success", async () => {
      logbookService.getLogbooksForUser.mockResolvedValue([
        {
          _id: "1",
          aircraft: "MiG-21 FISHBED",
          hours: 2,
          ships: 2,
          sead: false,
          bvr: false,
          bfm: true,
          cas: false,
          carrier: false,
        },
        {
          _id: "2",
          aircraft: "F/A-18C",
          hours: 2.5,
          ships: 4,
          sead: true,
          bvr: true,
          bfm: false,
          cas: false,
          carrier: true,
        },
      ]);

      const res = await agent.get("/api/logbooks/id");

      expect(res.statusCode).toBe(200);
      expect(res.body.errors).toHaveLength(0);
      expect(res.body.entries).toHaveLength(2);
    });

    test("Success - empty list", async () => {
      logbookService.getLogbooksForUser.mockResolvedValue([]);

      const res = await agent.get("/api/logbooks/id");

      expect(res.statusCode).toBe(200);
      expect(res.body.errors).toHaveLength(0);
      expect(res.body.entries).toHaveLength(0);
    });

    test("Failure - exception", async () => {
      logbookService.getLogbooksForUser.mockRejectedValue(
        new TypeError("TEST")
      );

      const res = await agent.get("/api/logbooks/id");

      expect(res.statusCode).toBe(500);
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.entries).toHaveLength(0);
    });
  });
});
