const security = require("../../middleware/security");
const utils = require("../utils");
const expect = require("chai").expect;
const userService = require("../../services/users");

describe("Security middleware tests", () => {
  beforeAll(async () => await utils.connect());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("Authentication tests", () => {
    it("Should authenticate correctly", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
        isActive: true,
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateJWT(createdUser);
        const request = {
          header: (header) => {
            return `Bearer ${token}`;
          },
        };
        let res = {
          locals: {
            user: null,
          },
        };

        await security.authenticate(request, res, () => {
          expect(res.locals.user.username).to.equal(user.username);
        });
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to authenticate with incorrect token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
        isActive: true,
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateJWT(createdUser);
        const request = {
          header: (header) => {
            return `Bearer ${token + "a"}`;
          },
        };
        let res = {
          locals: {
            user: null,
          },
          status: (code) => {
            expect(code).to.equal(401);
            return {
              json: (jsonCode) => {},
            };
          },
        };

        await security.authenticate(request, res, () => {
          expect(res.locals.user).to.be.null;
        });
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("Verification tests", () => {
    it("Should check a verified email", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
        isActive: true,
        isVerified: true,
      };
      const createdUser = await utils.createUser(user);

      try {
        const request = {
          body: {
            user: {
              username: user.username,
            },
          },
        };
        let res = {
          locals: {},
          status: (code) => {
            expect(code).to.equal(401);
            return {
              json: (jsonCode) => {},
            };
          },
        };

        await security.isVerified(request, res, () => {
          expect(true).to.be.true;
        });
      } catch (err) {
        fail(err);
      }
    });

    it("Should check a non-verified email", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
        isActive: true,
        isVerified: false,
      };
      const createdUser = await utils.createUser(user);

      try {
        const request = {
          body: {
            user: {
              username: user.username,
            },
          },
        };
        let res = {
          locals: {},
          status: (code) => {
            expect(code).to.equal(401);
            return {
              json: (jsonCode) => {},
            };
          },
        };

        await security.isVerified(request, res, () => {
          fail();
        });
      } catch (err) {
        fail(err);
      }
    });
  });
});
