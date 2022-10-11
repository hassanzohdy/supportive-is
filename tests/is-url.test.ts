import Is from "../src";

describe("@mongez/supportive-is/Is.url", () => {
  it("should return true for valid url", () => {
    expect(Is.url("google.com")).toBe(true);
    expect(Is.url("www.google.com")).toBe(true);
    expect(Is.url("https://google.com")).toBe(true);
    expect(Is.url("https://www.google.com")).toBe(true);
    expect(Is.url("http://google.com")).toBe(true);
    expect(Is.url("http://www.google.com")).toBe(true);
    expect(Is.url("https://google.com:80")).toBe(true);
  });

  it("should return false for invalid url", () => {
    expect(Is.url("google")).toBe(false);
    expect(Is.url("google.")).toBe(false);
    expect(Is.url("google..com")).toBe(false);
    expect(Is.url("https://google.")).toBe(false);
    expect(Is.url("https://google..com")).toBe(false);
    expect(Is.url("https://google.com:")).toBe(false);
    expect(Is.url("https://google.com:80a")).toBe(false);
    expect(Is.url("")).toBe(false);
    expect(Is.url(false)).toBe(false);
    expect(Is.url(null)).toBe(false);
    expect(Is.url(undefined)).toBe(false);
    expect(Is.url(0)).toBe(false);
    expect(Is.url(12)).toBe(false);
    expect(Is.url("12")).toBe(false);
  });
});
