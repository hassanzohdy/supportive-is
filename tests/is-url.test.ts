import Is, { isUrl } from "../src";

describe("@mongez/supportive-is/isUrl", () => {
  it("should return true for valid url", () => {
    expect(isUrl("https://google.com")).toBe(true);
    expect(isUrl("https://www.google.com")).toBe(true);
    expect(isUrl("http://google.com")).toBe(true);
    expect(isUrl("http://www.google.com")).toBe(true);
    expect(isUrl("https://google.com:80")).toBe(true);
    expect(
      isUrl(
        "https://codesandbox.io/s/suspicious-lichterman-fsxkg6?file=/src/index.js"
      )
    ).toBe(true);
  });

  it("should return false for invalid url", () => {
    expect(Is.url("google")).toBe(false);
    expect(isUrl("www.google.com")).toBe(false);
    expect(isUrl("google.")).toBe(false);
    expect(isUrl("google.com")).toBe(false);
    expect(isUrl("google..com")).toBe(false);
    expect(isUrl("https://google.")).toBe(false);
    expect(isUrl("https://google..com")).toBe(false);
    expect(isUrl("https://google.com:")).toBe(false);
    expect(isUrl("https://google.com:80a")).toBe(false);
    expect(isUrl("")).toBe(false);
    expect(isUrl(false)).toBe(false);
    expect(isUrl(null)).toBe(false);
    expect(isUrl(undefined)).toBe(false);
    expect(isUrl(0)).toBe(false);
    expect(isUrl(12)).toBe(false);
    expect(isUrl("12")).toBe(false);
  });
});
