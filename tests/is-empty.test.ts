import Is from "./../src";

test("Is empty", () => {
  expect(Is.empty("")).toBe(true);
  expect(Is.empty([])).toBe(true);
  expect(Is.empty({})).toBe(true);
  expect(Is.empty(null)).toBe(true);
  expect(Is.empty(undefined)).toBe(true);

  expect(Is.empty(0)).toBe(false);
  expect(Is.empty(1)).toBe(false);
  expect(Is.empty("0")).toBe(false);
  expect(Is.empty(false)).toBe(false);
  expect(Is.empty({ length: 0 })).toBe(false);
});
