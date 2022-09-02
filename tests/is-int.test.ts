import Is from "./../src";

test("Is int", () => {
  expect(Is.int(1)).toBe(true);
  expect(Is.int(0)).toBe(true);
  expect(Is.int(1.0)).toBe(true);

  expect(Is.int(1.1)).toBe(false);
  expect(Is.int("2")).toBe(false);
  expect(Is.int(null)).toBe(false);
  expect(Is.int(1.00001)).toBe(false);
  expect(Is.int(undefined)).toBe(false);
});
