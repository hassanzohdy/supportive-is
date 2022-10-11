import Is from "../src";

describe("@mongez/supportive-is/Is.json", () => {
  it("should return true if the value is a valid JSON", () => {
    expect(Is.json('{"name":"John"}')).toBe(true);
    expect(Is.json('{"name":"John", "age": 30}')).toBe(true);
    expect(
      Is.json('{"name":"John", "age": 30, "cars": ["Ford", "BMW", "Fiat"]}')
    ).toBe(true);
    expect(
      Is.json(
        '{"name":"John", "age": 30, "cars": ["Ford", "BMW", "Fiat"], "children": {"name":"Mary", "age": 10}}'
      )
    ).toBe(true);

    expect(Is.json("[1, 2, 3]")).toBe(true);
  });

  it("should return false if the value is not a valid JSON", () => {
    expect(Is.json("")).toBe(false);
    expect(Is.json(12)).toBe(false);
    expect(Is.json("12")).toBe(false);
    expect(Is.json("John")).toBe(false);

    expect(Is.json(0)).toBe(false);
    expect(Is.json({})).toBe(false);
    expect(Is.json([])).toBe(false);
    expect(Is.json(null)).toBe(false);
    expect(Is.json(true)).toBe(false);
    expect(Is.json(false)).toBe(false);
    expect(Is.json(undefined)).toBe(false);
  });
});
