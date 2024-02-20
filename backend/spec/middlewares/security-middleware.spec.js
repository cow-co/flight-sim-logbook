const securityMiddleware = require("../../middlewares/security-middleware");
const jwt = require("jsonwebtoken");
const userService = require("../../db/services/user-service");

jest.mock("jsonwebtoken");
jest.mock("../../db/services/user-service");

describe("Security middleware tests", () => {
  describe("Verify token", () => {
    test("Success", async () => {
      jwt.verify.mockReturnValue({
        userId: "id",
        iat: 100000,
      });
      userService.getMinValidTokenTimestamp.mockResolvedValue(1000);

      let called = false;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            console.log(header);
            if (header === "authorization") {
              console.log("BEARING");
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
      jwt.verify.mockRejectedValue(new jwt.JsonWebTokenError("TEST"));

      let calledNext = false;
      let rejected = false;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "Authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
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
    });

    test("Failure - expired token", async () => {
      jwt.verify.mockRejectedValue(new jwt.TokenExpiredError("TEST"));

      let calledNext = false;
      let rejected = false;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "Authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
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
    });

    test("Failure - user has logged out", async () => {
      jwt.verify.mockReturnValue({
        userId: "id",
        iat: 10,
      });
      userService.getMinValidTokenTimestamp.mockResolvedValue(1000);

      let calledNext = false;
      let rejected = false;
      await securityMiddleware.verifyToken(
        {
          headerString: function (header) {
            if (header === "Authorization") {
              return "Bearer jjjjj";
            } else {
              return null;
            }
          },
        },
        {
          status: function (statusCode) {
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
    });
  });
});
