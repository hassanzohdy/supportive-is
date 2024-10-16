import Is, { isEmpty } from "./../src";

describe("@mongez/supportive-is/isEmpty", () => {
  it("should be empty", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Date())).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("should not be empty", () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty("0")).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty({ length: 0 })).toBe(false);
  });
});
