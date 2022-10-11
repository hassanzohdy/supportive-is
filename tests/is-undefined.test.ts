import Is from "../src";

describe("@mongez/supportive-is/Is.undefined", () => {
  it("should be undefined", () => {
    let undefinedVariable;
    expect(Is.undefined(undefined)).toBe(true);
    expect(Is.undefined(undefinedVariable)).toBe(true);
  });

  it("should not be undefined", () => {
    expect(Is.undefined(0)).toBe(false);
    expect(Is.undefined(1)).toBe(false);
    expect(Is.undefined(null)).toBe(false);
    expect(Is.undefined(true)).toBe(false);
    expect(Is.undefined([])).toBe(false);
    expect(Is.undefined({})).toBe(false);
    expect(Is.undefined("")).toBe(false);
  });
});
