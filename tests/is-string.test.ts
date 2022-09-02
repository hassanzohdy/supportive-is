import Is from "./../src";

test("Is String", () => {
  expect(Is.string("")).toBe(true);
  expect(Is.string("12")).toBe(true);

  expect(Is.string(0)).toBe(false);
  expect(Is.string({})).toBe(false);
  expect(Is.string([])).toBe(false);
  expect(Is.string(null)).toBe(false);
  expect(Is.string(true)).toBe(false);
  expect(Is.string(false)).toBe(false);
  expect(Is.string(undefined)).toBe(false);
});
