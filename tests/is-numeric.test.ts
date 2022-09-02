import Is from "../src";

test("Is numeric value", () => {
  expect(Is.numeric(1)).toBe(true);
  expect(Is.numeric(0)).toBe(true);
  expect(Is.numeric(1.0)).toBe(true);
  expect(Is.numeric(1.1)).toBe(true);
  expect(Is.numeric(1.00001)).toBe(true);
  expect(Is.numeric(+2)).toBe(true);
  expect(Is.numeric(-2)).toBe(true);
  expect(Is.numeric("2")).toBe(true);
  expect(Is.numeric("2.0")).toBe(true);
  expect(Is.numeric("+2")).toBe(true);
  expect(Is.numeric("-2")).toBe(true);

  expect(Is.numeric("/2")).toBe(false);
  expect(Is.numeric("*2")).toBe(false);
  expect(Is.numeric("2.")).toBe(false);
  expect(Is.numeric(null)).toBe(false);
  expect(Is.numeric(undefined)).toBe(false);
});
