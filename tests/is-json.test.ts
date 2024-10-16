import Is, { isJson } from "../src";

describe("@mongez/supportive-is/isJson", () => {
  it("should return true if the value is a valid JSON", () => {
    expect(isJson('{"name":"John"}')).toBe(true);
    expect(isJson('{"name":"John", "age": 30}')).toBe(true);
    expect(
      isJson('{"name":"John", "age": 30, "cars": ["Ford", "BMW", "Fiat"]}')
    ).toBe(true);
    expect(
      isJson(
        '{"name":"John", "age": 30, "cars": ["Ford", "BMW", "Fiat"], "children": {"name":"Mary", "age": 10}}'
      )
    ).toBe(true);

    expect(isJson("[1, 2, 3]")).toBe(true);
  });

  it("should return false if the value is not a valid JSON", () => {
    expect(isJson("")).toBe(false);
    expect(isJson(12)).toBe(false);
    expect(isJson("12")).toBe(false);
    expect(isJson("John")).toBe(false);

    expect(isJson(0)).toBe(false);
    expect(isJson({})).toBe(false);
    expect(isJson([])).toBe(false);
    expect(isJson(null)).toBe(false);
    expect(isJson(true)).toBe(false);
    expect(isJson(false)).toBe(false);
    expect(isJson(undefined)).toBe(false);
  });
});
