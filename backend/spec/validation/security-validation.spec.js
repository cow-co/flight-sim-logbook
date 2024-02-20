const validation = require("../../validation/security-validation");

describe("Validation tests", () => {
  describe("Username validation", () => {
    test("Success", () => {
      const errors = validation.validateUsername("name");
      expect(errors).toHaveLength(0);
    });

    test("Failure - short", () => {
      const errors = validation.validateUsername("na");
      expect(errors).toHaveLength(1);
    });
  });

  describe("Password validation", () => {
    test("Success", () => {
      const errors = validation.validatePassword(
        "password1234567890",
        "password1234567890"
      );
      expect(errors).toHaveLength(0);
    });

    test("Failure - short", () => {
      const errors = validation.validatePassword("password", "password");
      expect(errors).toHaveLength(1);
    });

    test("Failure - non-matching", () => {
      const errors = validation.validatePassword(
        "password1234567890",
        "password1234567891"
      );
      expect(errors).toHaveLength(1);
    });

    test("Failure - non-matching AND short", () => {
      const errors = validation.validatePassword("password", "passwora");
      expect(errors).toHaveLength(2);
    });
  });
});
