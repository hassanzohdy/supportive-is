import vm from "node:vm";
import { describe, expect, it } from "vitest";
import {
  isRegex,
  isValidId,
  isJson,
  isUrl,
  isEmail,
  Is,
} from "../index";

describe("isRegex", () => {
  it("returns true for regex literals and RegExp instances", () => {
    expect(isRegex(/x/)).toBe(true);
    expect(isRegex(/abc/gi)).toBe(true);
    expect(isRegex(new RegExp("x"))).toBe(true);
  });

  it("returns false for non-regexes", () => {
    expect(isRegex("/x/")).toBe(false);
    expect(isRegex("x")).toBe(false);
    expect(isRegex(123)).toBe(false);
    expect(isRegex({})).toBe(false);
    expect(isRegex([])).toBe(false);
  });

  it("returns a falsy value for null/undefined", () => {
    // Same `value && …` short-circuit pattern as isObject — null leaks
    // through instead of being coerced to false.
    expect(isRegex(null)).toBeFalsy();
    expect(isRegex(undefined)).toBeFalsy();
  });

  it("is not fooled by a spoofed constructor name or toStringTag", () => {
    expect(isRegex({ constructor: { name: "RegExp" } })).toBe(false);
    expect(isRegex({ [Symbol.toStringTag]: "RegExp" })).toBe(false);
    expect(isRegex(Object.create(RegExp.prototype))).toBe(false);
    expect(isRegex(RegExp.prototype)).toBe(false);
  });

  it("returns true for a RegExp from another realm", () => {
    expect(isRegex(vm.runInNewContext("/x/g"))).toBe(true);
  });

  it("returns true for a RegExp subclass", () => {
    class MyRegex extends RegExp {}
    expect(isRegex(new MyRegex("x"))).toBe(true);
  });
});

describe("isValidId (Is.validHtmlId)", () => {
  it("returns true for valid HTML id values", () => {
    expect(isValidId("base-id")).toBe(true);
    expect(isValidId("BASE-ID")).toBe(true);
    expect(isValidId("has-dash")).toBe(true);
    expect(isValidId("has.dots")).toBe(true);
    expect(isValidId("has:colon")).toBe(true);
    expect(isValidId("has-number-3")).toBe(true);
    expect(isValidId("has_underscore")).toBe(true);
    expect(isValidId("Plain")).toBe(true);
  });

  it("returns false for invalid HTML id values", () => {
    expect(isValidId("1starts-with-digit")).toBe(false);
    expect(isValidId("_starts-with-underscore")).toBe(false);
    expect(isValidId("has,comma")).toBe(false);
    expect(isValidId("has spaces")).toBe(false);
    expect(isValidId("")).toBe(false);
  });

  it("returns false for null/undefined (boolean-coerced)", () => {
    // Implementation wraps in Boolean(...) so these are real false, not null.
    expect(isValidId(null)).toBe(false);
    expect(isValidId(undefined)).toBe(false);
  });

  it("is exposed as Is.validHtmlId", () => {
    expect(Is.validHtmlId).toBe(isValidId);
  });

  it("rejects long non-matching input quickly (no catastrophic backtracking)", () => {
    const input = "a" + "a".repeat(50000) + "!";
    const start = Date.now();
    expect(isValidId(input)).toBe(false);
    expect(Date.now() - start).toBeLessThan(200);
  });
});

describe("isJson", () => {
  it("returns true for valid JSON object/array strings", () => {
    expect(isJson('{"name":"John"}')).toBe(true);
    expect(isJson('{"a":1,"b":2}')).toBe(true);
    expect(isJson("[]")).toBe(true);
    expect(isJson("[1,2,3]")).toBe(true);
    expect(isJson('{"nested":{"a":1}}')).toBe(true);
    expect(isJson('{"arr":[1,2,3]}')).toBe(true);
  });

  it("returns false for malformed JSON", () => {
    expect(isJson("{name:John}")).toBe(false); // unquoted key
    expect(isJson("{'name':'John'}")).toBe(false); // single quotes
    expect(isJson("[1,2,")).toBe(false);
  });

  it("returns false for non-strings, empty strings, and non-{/[ prefixes", () => {
    expect(isJson("")).toBe(false);
    expect(isJson("12")).toBe(false);
    expect(isJson('"hello"')).toBe(false); // valid JSON, but rejected by prefix check
    expect(isJson("null")).toBe(false);
    expect(isJson("true")).toBe(false);
    expect(isJson(null)).toBe(false);
    expect(isJson(undefined)).toBe(false);
    expect(isJson(0)).toBe(false);
    expect(isJson(12)).toBe(false);
    expect(isJson({})).toBe(false);
    expect(isJson([])).toBe(false);
  });
});

describe("isUrl", () => {
  it("returns true for valid http(s) URLs with dotted hostnames", () => {
    expect(isUrl("https://google.com")).toBe(true);
    expect(isUrl("https://www.google.com")).toBe(true);
    expect(isUrl("http://google.com")).toBe(true);
    expect(isUrl("https://google.com:8080")).toBe(true);
    expect(isUrl("https://google.com/path?q=1")).toBe(true);
    expect(isUrl("https://sub.example.co.uk")).toBe(true);
  });

  it("returns false for URLs without a valid hostname", () => {
    expect(isUrl("google")).toBe(false);
    expect(isUrl("google.com")).toBe(false); // no scheme
    expect(isUrl("www.google.com")).toBe(false); // no scheme
    expect(isUrl("ftp://example.com")).toBe(false); // wrong scheme
    expect(isUrl("file:///etc/passwd")).toBe(false);
  });

  it("returns false for non-strings, empty strings, numbers", () => {
    expect(isUrl("")).toBe(false);
    expect(isUrl(null)).toBe(false);
    expect(isUrl(undefined)).toBe(false);
    expect(isUrl(0)).toBe(false);
    expect(isUrl(false)).toBe(false);
    expect(isUrl(12)).toBe(false);
    expect(isUrl("12")).toBe(false);
  });

  it(
    "BUG: URLs with a trailing dot in the hostname pass (src/index.ts:149)",
    () => {
      // `new URL("https://google.")` is accepted by URL parser. The check
      // only requires hostname.includes(".") and length > indexOf("."),
      // which `"google."` satisfies (".", indexOf=6, length=7). A real
      // hostname should require a non-empty TLD segment.
      expect(isUrl("https://google.")).toBe(false);
    },
  );

  it(
    "BUG: URLs with `..` in the hostname pass (src/index.ts:149)",
    () => {
      // The whatwg URL parser accepts "google..com" as a host (it ends up
      // as "google..com"). The check doesn't catch the empty label.
      expect(isUrl("https://google..com")).toBe(false);
    },
  );
});

describe("isEmail", () => {
  it("returns true for standard email shapes", () => {
    expect(isEmail("user@example.com")).toBe(true);
    expect(isEmail("a.b.c@example.co.uk")).toBe(true);
    expect(isEmail("u+tag@example.com")).toBe(true);
    expect(isEmail("user-name@sub.example.com")).toBe(true);
    expect(isEmail("hassanzohdy@gmail.com")).toBe(true);
  });

  it("returns false for malformed addresses", () => {
    expect(isEmail("user")).toBe(false);
    expect(isEmail("user@")).toBe(false);
    expect(isEmail("@example.com")).toBe(false);
    expect(isEmail("a@b")).toBe(false); // no TLD
    expect(isEmail("a b@example.com")).toBe(false);
    expect(isEmail("")).toBe(false);
  });

  it("returns false for non-strings (via regex coercion)", () => {
    expect(isEmail(null)).toBe(false);
    expect(isEmail(undefined)).toBe(false);
    expect(isEmail(12)).toBe(false);
    expect(isEmail({})).toBe(false);
  });

  it("rejects quoted local parts", () => {
    expect(isEmail('"a b"@x.com')).toBe(false);
    expect(isEmail('"<a>"@x.com')).toBe(false);
    expect(isEmail('"a\tb"@x.com')).toBe(false);
    expect(isEmail('"a@b.com"@x.com')).toBe(false);
  });

  it("rejects domain labels that start or end with a hyphen", () => {
    expect(isEmail("a@-b.com")).toBe(false);
    expect(isEmail("a@b-.com")).toBe(false);
    expect(isEmail("a@b.-c.com")).toBe(false);
    expect(isEmail("a@b-c.com")).toBe(true);
  });

  it("rejects CR/LF", () => {
    expect(isEmail("a\n@x.com")).toBe(false);
    expect(isEmail("a@x.com\n")).toBe(false);
    expect(isEmail("a\r@x.com")).toBe(false);
  });

  it("caps the local part at 64 and the whole address at 254 characters", () => {
    expect(isEmail("a".repeat(64) + "@x.com")).toBe(true);
    expect(isEmail("a".repeat(65) + "@x.com")).toBe(false);

    const domain = (pad: string) =>
      `${pad}${("b".repeat(60) + ".").repeat(3)}com`;
    const at254 = "a".repeat(64) + "@" + domain("xx.");
    expect(at254.length).toBe(254);
    expect(isEmail(at254)).toBe(true);
    const at255 = "a".repeat(64) + "@" + domain("xxx.");
    expect(at255.length).toBe(255);
    expect(isEmail(at255)).toBe(false);
  });

  it("still accepts IP-literal domains", () => {
    expect(isEmail("a@[1.2.3.4]")).toBe(true);
  });

  it(
    "BUG: isEmail returns true for a single-email array (src/index.ts:168)",
    () => {
      // RegExp.prototype.test coerces its argument with String(). A
      // single-element array `["x@y.com"]` stringifies to "x@y.com" and the
      // regex matches. Should `typeof value === "string"`-gate the check.
      expect(isEmail(["user@example.com"])).toBe(false);
    },
  );
});
