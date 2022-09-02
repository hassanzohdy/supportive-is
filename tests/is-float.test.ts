import Is from "./../src";

test("Is float", () => {
  expect(Is.float(1.2)).toBe(true);

  expect(Is.float(1)).toBe(false);
  expect(Is.float(1.0)).toBe(false); // weird?
  expect(Is.float(null)).toBe(false);
  expect(Is.float("1.0")).toBe(false);
  expect(Is.float(undefined)).toBe(false);
});
