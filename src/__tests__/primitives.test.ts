import { describe, expect, it } from "vitest";
import {
  isInt,
  isFloat,
  isNumeric,
  isString,
  isPrimitive,
  isScalar,
} from "../index";

describe("isString", () => {
  it("returns true for string values", () => {
    expect(isString("")).toBe(true);
    expect(isString("hello")).toBe(true);
    expect(isString(String("x"))).toBe(true);
    // template-literal strings
    expect(isString(`x${1}`)).toBe(true);
  });

  it("returns false for non-strings", () => {
    expect(isString(0)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(Symbol("s"))).toBe(false);
    expect(isString(() => {})).toBe(false);
    // String wrapper objects are not "string" by typeof — they're "object"
    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String("x"))).toBe(false);
  });
});

describe("isNumeric", () => {
  it("returns true for numeric values (number or string)", () => {
    expect(isNumeric(0)).toBe(true);
    expect(isNumeric(1)).toBe(true);
    expect(isNumeric(-1)).toBe(true);
    expect(isNumeric(1.5)).toBe(true);
    expect(isNumeric(-1.5)).toBe(true);
    expect(isNumeric("0")).toBe(true);
    expect(isNumeric("1")).toBe(true);
    expect(isNumeric("+1")).toBe(true);
    expect(isNumeric("-1")).toBe(true);
    expect(isNumeric("1.5")).toBe(true);
    expect(isNumeric("1e10")).toBe(true);
    expect(isNumeric("1.5E-3")).toBe(true);
  });

  it("returns false for non-numeric values", () => {
    expect(isNumeric("")).toBe(false);
    expect(isNumeric("hello")).toBe(false);
    expect(isNumeric("12abc")).toBe(false);
    expect(isNumeric("1.2.3")).toBe(false);
    expect(isNumeric("1.")).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric({})).toBe(false);
    expect(isNumeric([])).toBe(false);
  });

  it(
    "BUG: stateful /g regex makes repeated calls alternate (src/index.ts:10)",
    () => {
      // The regex literal `/^[+-]?\d+(\.\d+)?([Ee][+-]?\d+)?$/g` carries the
      // `g` flag, so `.test()` advances `lastIndex` between invocations on
      // the same regex instance. Calling isNumeric twice on the same
      // numeric value returns true, then false. Remove the `g` flag (or
      // explicitly reset `lastIndex`) to fix.
      expect(isNumeric("2")).toBe(true);
      expect(isNumeric("2")).toBe(true);
    },
  );
});

describe("isInt", () => {
  it("returns true for non-negative integer numbers", () => {
    expect(isInt(0)).toBe(true);
    expect(isInt(1)).toBe(true);
    expect(isInt(42)).toBe(true);
    // 1.0 stringifies to "1"
    expect(isInt(1.0)).toBe(true);
    expect(isInt(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("returns false for non-integers and non-numbers", () => {
    expect(isInt(1.1)).toBe(false);
    expect(isInt(1.00001)).toBe(false);
    expect(isInt("2")).toBe(false);
    expect(isInt(null)).toBe(false);
    expect(isInt(undefined)).toBe(false);
    expect(isInt(NaN)).toBe(false);
    expect(isInt(Infinity)).toBe(false);
    expect(isInt(-Infinity)).toBe(false);
    expect(isInt(true)).toBe(false);
    expect(isInt([])).toBe(false);
    expect(isInt({})).toBe(false);
  });

  it(
    "BUG: isInt rejects negative integers — regex `/^\\d+$/` has no sign (src/index.ts:17)",
    () => {
      expect(isInt(-1)).toBe(true);
      expect(isInt(-100)).toBe(true);
    },
  );

  it(
    "BUG: isInt rejects integers that stringify in scientific notation (src/index.ts:17)",
    () => {
      // 1e21 prints as "1e+21" — regex `/^\d+$/` rejects it.
      expect(isInt(1e21)).toBe(true);
    },
  );
});

describe("isFloat", () => {
  it("returns true for positive floats with a fractional part", () => {
    expect(isFloat(1.5)).toBe(true);
    expect(isFloat(0.1)).toBe(true);
    expect(isFloat(82.42)).toBe(true);
  });

  it("returns false for integers, strings, and non-numbers", () => {
    expect(isFloat(1)).toBe(false);
    // 1.0 stringifies to "1" — no decimal part.
    expect(isFloat(1.0)).toBe(false);
    expect(isFloat("1.5")).toBe(false);
    expect(isFloat(null)).toBe(false);
    expect(isFloat(undefined)).toBe(false);
    expect(isFloat(NaN)).toBe(false);
    expect(isFloat(Infinity)).toBe(false);
    expect(isFloat("")).toBe(false);
    expect(isFloat([])).toBe(false);
  });

  it(
    "BUG: isFloat rejects negative floats — regex has no sign (src/index.ts:23)",
    () => {
      expect(isFloat(-1.5)).toBe(true);
    },
  );

  // NOTE: the regex `/^\d+.(\d+)$/` also uses an unescaped `.` that matches
  // any character. We can't exercise that bug via stringified numbers (every
  // number stringifies with `.` as the decimal separator) but it's documented
  // in the changelog.
});

describe("isPrimitive", () => {
  it("returns true for string/boolean/number/bigint", () => {
    expect(isPrimitive("")).toBe(true);
    expect(isPrimitive("hello")).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(1.5)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(1n)).toBe(true);
  });

  it("returns false for everything else", () => {
    expect(isPrimitive(null)).toBe(false);
    expect(isPrimitive(undefined)).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
    // The current implementation excludes Symbol — kept as documented.
    expect(isPrimitive(Symbol("s"))).toBe(false);
  });
});

describe("isScalar", () => {
  it("returns true for string/boolean/number/symbol/bigint", () => {
    expect(isScalar("")).toBe(true);
    expect(isScalar("hello")).toBe(true);
    expect(isScalar(0)).toBe(true);
    expect(isScalar(1.5)).toBe(true);
    expect(isScalar(true)).toBe(true);
    expect(isScalar(false)).toBe(true);
    expect(isScalar(Symbol("s"))).toBe(true);
    expect(isScalar(1n)).toBe(true);
  });

  it("returns false for null, undefined, arrays, objects, functions", () => {
    expect(isScalar(null)).toBe(false);
    expect(isScalar(undefined)).toBe(false);
    expect(isScalar([])).toBe(false);
    expect(isScalar({})).toBe(false);
    expect(isScalar(() => {})).toBe(false);
    expect(isScalar(new Date())).toBe(false);
  });
});
