import Is from "../src";

test("Is HTML Id", () => {
  expect(Is.validHtmlId("base-id")).toBe(true);
  expect(Is.validHtmlId("base-id")).toBe(true);
  expect(Is.validHtmlId("has-dash")).toBe(true);
  expect(Is.validHtmlId("has.dots")).toBe(true);
  expect(Is.validHtmlId("has:colon")).toBe(true);
  expect(Is.validHtmlId("has-number-3")).toBe(true);
  expect(Is.validHtmlId("has_underscore")).toBe(true);
  expect(Is.validHtmlId("has::multiple::colons")).toBe(true);
  expect(Is.validHtmlId("has--multiple--dashes")).toBe(true);
  expect(Is.validHtmlId("has__multiple__underscores")).toBe(true);

  expect(Is.validHtmlId("1qq")).toBe(false);
  expect(Is.validHtmlId(null)).toBe(false);
  expect(Is.validHtmlId(undefined)).toBe(false);
  expect(Is.validHtmlId("has,comma")).toBe(false);
  expect(Is.validHtmlId("1-starts-with-number")).toBe(false);
  expect(Is.validHtmlId("_starts-with-underscore")).toBe(false);
});
