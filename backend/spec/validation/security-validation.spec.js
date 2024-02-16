const validation = require("../../validation/security-validation");

describe("Username validation tests", () => {
  test("Username validation - success", () => {
    const errors = validation.validateUsername("name");
    expect(errors).toHaveLength(0);
  });

  test("Username validation - failure - short", () => {
    const errors = validation.validateUsername("na");
    expect(errors).toHaveLength(1);
  });
});

describe("Password validation tests", () => {
  test("Password validation - success", () => {
    const errors = validation.validatePassword(
      "password1234567890",
      "password1234567890"
    );
    expect(errors).toHaveLength(0);
  });

  test("Password validation - failure - short", () => {
    const errors = validation.validatePassword("password", "password");
    expect(errors).toHaveLength(1);
  });

  test("Password validation - failure - non-matching", () => {
    const errors = validation.validatePassword(
      "password1234567890",
      "password1234567891"
    );
    expect(errors).toHaveLength(1);
  });

  test("Password validation - failure - non-matching AND short", () => {
    const errors = validation.validatePassword("password", "passwora");
    expect(errors).toHaveLength(2);
  });
});
