import Is from "./../src";

describe("@mongez/supportive-is/Is.empty", () => {
  it("should be empty", () => {
    expect(Is.empty("")).toBe(true);
    expect(Is.empty([])).toBe(true);
    expect(Is.empty(new Map())).toBe(true);
    expect(Is.empty(new Set())).toBe(true);
    expect(Is.empty({})).toBe(true);
    expect(Is.empty(null)).toBe(true);
    expect(Is.empty(undefined)).toBe(true);
  });

  it("should not be empty", () => {
    expect(Is.empty(0)).toBe(false);
    expect(Is.empty(1)).toBe(false);
    expect(Is.empty("0")).toBe(false);
    expect(Is.empty(false)).toBe(false);
    expect(Is.empty({ length: 0 })).toBe(false);
  });
});
