const logbookService = require("../../services/logbooks");
const utils = require("../utils");
const expect = require("chai").expect;
const seedDB = require("../../config/aircraft");

describe("Logbook service tests", () => {
  beforeAll(async () => await utils.connect());

  beforeEach(async () => await seedDB());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("Logbook creation tests", () => {
    it("Should fail to create a logbook with an empty aircraft name", async () => {
      const invalidLogbook = {
        aircraftName: "",
      };

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(invalidLogbook, createdUser);
        expect(logbook.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to create a logbook with an invalid aircraft name", async () => {
      const invalidLogbook = {
        aircraftName: "name",
      };

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(invalidLogbook, createdUser);
        expect(logbook.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should create a logbook", async () => {
      const validLogbook = {
        aircraftName: "F-16",
      };

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(validLogbook, createdUser);
        expect(logbook.logbook.aircraft).to.equal(validLogbook.aircraftName);
      } catch (err) {
        fail(err);
      }
    });
  });
});
