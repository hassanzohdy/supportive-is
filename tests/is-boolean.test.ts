import Is from "./../src";

test("Boolean value", () => {
  expect(Is.boolean(true)).toBe(true);
  expect(Is.boolean(false)).toBe(true);

  expect(Is.boolean(0)).toBe(false);
  expect(Is.boolean({})).toBe(false);
  expect(Is.boolean([])).toBe(false);
  expect(Is.boolean("")).toBe(false);
  expect(Is.boolean(null)).toBe(false);
  expect(Is.boolean(undefined)).toBe(false);
});
