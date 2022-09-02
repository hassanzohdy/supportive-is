import Is from "../src";

test("Is undefined value", () => {
  let undefinedVariable;
  expect(Is.undefined(undefined)).toBe(true);
  expect(Is.undefined(undefinedVariable)).toBe(true);

  expect(Is.undefined(0)).toBe(false);
  expect(Is.undefined(1)).toBe(false);
  expect(Is.undefined(null)).toBe(false);
  expect(Is.undefined(true)).toBe(false);
  expect(Is.undefined([])).toBe(false);
  expect(Is.undefined({})).toBe(false);
  expect(Is.undefined("")).toBe(false);
});
