const securityMiddleware = require("../../middlewares/security-middleware");
const jwt = require("jsonwebtoken");
const userService = require("../../db/services/user-service");

jest.mock("jsonwebtoken");
jest.mock("../../db/services/user-service");

describe("Security middleware tests", () => {
  describe("Verify token", () => {
    test("Success", async () => {
      console.log("SUCCESS");
      jwt.verify.mockReturnValue({
        userId: "id",
        iat: 100000,
      });
      userService.getMinValidTokenTimestamp.mockResolvedValue(1000);

      let called = false;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        null,
        () => {
          called = true;
        }
      );

      expect(called).toBeTruthy();
    });

    test("Failure - invalid token", async () => {
      jwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError();
      });

      let calledNext = false;
      let rejected = false;
      let status = 200;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
            status = statusCode;
            return {
              json: function (object) {
                rejected = true;
              },
            };
          },
        },
        () => {
          calledNext = true;
        }
      );

      expect(calledNext).toBeFalsy();
      expect(rejected).toBeTruthy();
      expect(status).toBe(403);
    });

    test("Failure - expired token", async () => {
      jwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError();
      });

      let calledNext = false;
      let rejected = false;
      let status = 200;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
            status = statusCode;
            return {
              json: function (object) {
                console.log(object);
                rejected = true;
              },
            };
          },
        },
        () => {
          calledNext = true;
        }
      );

      expect(calledNext).toBeFalsy();
      expect(rejected).toBeTruthy();
      expect(status).toBe(403);
    });

    test("Failure - user has logged out", async () => {
      jwt.verify.mockReturnValue({
        userId: "id",
        iat: 10,
      });
      userService.getMinValidTokenTimestamp.mockResolvedValue(100000);

      let calledNext = false;
      let rejected = false;
      let status = 200;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
            status = statusCode;
            return {
              json: function (object) {
                console.log(object);
                rejected = true;
              },
            };
          },
        },
        () => {
          calledNext = true;
        }
      );

      expect(calledNext).toBeFalsy();
      expect(rejected).toBeTruthy();
      expect(status).toBe(403);
    });
  });
});
