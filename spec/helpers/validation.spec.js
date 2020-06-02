const isEmptyOrNull = require("../../helpers/validation").isEmptyOrNull;
const isPasswordValid = require("../../helpers/validation").isPasswordValid;

describe("Validation Tests", () => {
  it("Should identify empty string", () => {
    const text = "";
    const isTextEmpty = isEmptyOrNull(text);
    expect(isTextEmpty).toBe(true);
  });

  it("Should identify null", () => {
    const value = null;
    const isValueEmpty = isEmptyOrNull(value);
    expect(isValueEmpty).toBe(true);
  });

  it("Should identify undefined", () => {
    const value = undefined;
    const isValueEmpty = isEmptyOrNull(value);
    expect(isValueEmpty).toBe(true);
  });

  it("Should identify empty object", () => {
    const obj = {};
    const isObjectEmpty = isEmptyOrNull(obj);
    expect(isObjectEmpty).toBe(true);
  });

  it("Should identify non-empty object", () => {
    const obj = { value: "value" };
    const isObjectEmpty = isEmptyOrNull(obj);
    expect(isObjectEmpty).toBe(false);
  });

  it("Should identify non-empty string", () => {
    const text = "text";
    const isTextEmpty = isEmptyOrNull(text);
    expect(isTextEmpty).toBe(false);
  });
});
