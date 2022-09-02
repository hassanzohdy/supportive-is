import Is from "./../src";

test("Is null value", () => {
  expect(Is.null(null)).toBe(true);

  expect(Is.null(0)).toBe(false);
  expect(Is.null(0 & 0)).toBe(false);
  expect(Is.null(1)).toBe(false);
  expect(Is.null(undefined)).toBe(false);
  expect(Is.null(true)).toBe(false);
  expect(Is.null([])).toBe(false);
  expect(Is.null({})).toBe(false);
  expect(Is.null("")).toBe(false);
});
