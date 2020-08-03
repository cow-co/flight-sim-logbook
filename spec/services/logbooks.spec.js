const logbookService = require("../../services/logbooks");
const userService = require("../../services/users");
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
      const aircraftName = "";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(aircraftName, createdUser);
        expect(logbook.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to create a logbook with an invalid aircraft name", async () => {
      const aircraftName = "name";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(aircraftName, createdUser);
        expect(logbook.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should create a logbook", async () => {
      const aircraftName = "F-16";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(aircraftName, createdUser);
        expect(logbook.logbook.aircraft).to.equal(aircraftName);
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("Logbook deletion tests", () => {
    it("Should fail to delete a logbook which does not exist", async () => {
      const aircraftName = "";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(aircraftName, createdUser);
        const response = await logbookService.deleteLogbook(aircraftName, createdUser);
        expect(response.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should delete a logbook", async () => {
      const aircraftName = "F-16";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        await logbookService.createLogbook(aircraftName, createdUser);
        const response = await logbookService.deleteLogbook(aircraftName, createdUser);
        expect(response.errors.length).to.equal(0);
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("Logbook update tests", () => {
    it("Should fail to update a logbook which does not exist", async () => {
      const aircraftName = "";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        const logbook = await logbookService.createLogbook(aircraftName, createdUser);

        const mission = {
          aircraft: "skjdh",
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
        const response = await logbookService.addMission(mission, createdUser);
        expect(response.logbook).to.equal(null);
      } catch (err) {
        fail(err);
      }
    });

    it("Should update a logbook", async () => {
      const aircraftName = "F-16";

      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };

      const createdUser = await utils.createUser(user);

      try {
        await logbookService.createLogbook(aircraftName, createdUser);

        const mission = {
          aircraft: aircraftName,
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
        const response = await logbookService.addMission(mission, createdUser);
        const updatedUser = await userService.getUserByName(user.username);
        const updatedLogbook = await logbookService.getLogbook(aircraftName, updatedUser);
        expect(response.logbook).to.not.equal(null);
        expect(updatedLogbook.logbook.totalHours).to.equal(3.3);
      } catch (err) {
        fail(err);
      }
    });
  });
});
