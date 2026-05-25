import { describe, expect, it } from "vitest";
import {
  isObject,
  isPlainObject,
  isIterable,
  isEmpty,
  Is,
} from "../index";

describe("isObject", () => {
  it("returns truthy for objects, arrays, dates, regexes, class instances", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject([1, 2, 3])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(/x/)).toBe(true);
    class C {}
    expect(isObject(new C())).toBe(true);
  });

  it("returns a falsy value for null/undefined/primitives/functions", () => {
    // NOTE: isObject is `value && typeof value === "object"`, so it returns
    // the raw falsy value (null, undefined, 0, "") rather than `false` for
    // these inputs. We assert with toBeFalsy() to keep the surface stable.
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(0)).toBeFalsy();
    expect(isObject("")).toBeFalsy();
    expect(isObject("hello")).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });
});

describe("isPlainObject", () => {
  it("returns true only for objects created from `{}` or `new Object()`", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    // eslint-disable-next-line no-new-object
    expect(isPlainObject(new Object())).toBe(true);
  });

  it("returns false for arrays, dates, class instances, primitives", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(/x/)).toBe(false);
    class C {}
    expect(isPlainObject(new C())).toBe(false);
    expect(isPlainObject("hello")).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
  });

  it("returns a falsy value for null/undefined", () => {
    // Same falsy-return pattern as isObject.
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(undefined)).toBeFalsy();
  });

  it(
    "BUG: throws on Object.create(null) — constructor is undefined (src/index.ts:39)",
    () => {
      // `value.constructor.name` blows up when `value.constructor` is
      // missing. A null-prototype object is a valid plain object by most
      // definitions; the check should guard against the missing constructor.
      expect(() => isPlainObject(Object.create(null))).not.toThrow();
      expect(isPlainObject(Object.create(null))).toBe(true);
    },
  );
});

describe("Is.array (alias for Array.isArray)", () => {
  it("returns true for arrays", () => {
    expect(Is.array([])).toBe(true);
    expect(Is.array([1, 2, 3])).toBe(true);
    expect(Is.array(new Array(3))).toBe(true);
  });

  it("returns false for non-arrays", () => {
    expect(Is.array({})).toBe(false);
    expect(Is.array("hello")).toBe(false);
    expect(Is.array(null)).toBe(false);
    expect(Is.array(undefined)).toBe(false);
    expect(Is.array(new Set())).toBe(false);
    expect(Is.array({ length: 0 })).toBe(false);
  });
});

describe("isIterable", () => {
  it("returns true for built-in iterables", () => {
    expect(isIterable([])).toBeTruthy();
    expect(isIterable([1, 2, 3])).toBeTruthy();
    expect(isIterable("hello")).toBeTruthy();
    expect(isIterable(new Set())).toBeTruthy();
    expect(isIterable(new Map())).toBeTruthy();
  });

  it("returns true for custom Symbol.iterator implementations", () => {
    const iter = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
      },
    };
    expect(isIterable(iter)).toBeTruthy();
  });

  it("returns falsy for non-iterables", () => {
    expect(isIterable({})).toBeFalsy();
    expect(isIterable({ a: 1 })).toBeFalsy();
    expect(isIterable(123)).toBeFalsy();
    expect(isIterable(true)).toBeFalsy();
    expect(isIterable(null)).toBeFalsy();
    expect(isIterable(undefined)).toBeFalsy();
    expect(isIterable(() => {})).toBeFalsy();
  });

  it(
    "BUG: empty string returns the empty string instead of true (src/index.ts:64)",
    () => {
      // `value && typeof value[Symbol.iterator] === "function"` short-
      // circuits on the falsy `""` and returns `""` itself. The empty
      // string IS iterable (just yields nothing).
      expect(isIterable("")).toBe(true);
    },
  );
});

describe("isEmpty", () => {
  it("returns true for empty strings, arrays, objects, Map, Set, null, undefined", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("treats zero as non-empty", () => {
    expect(isEmpty(0)).toBe(false);
  });

  it("returns false for booleans", () => {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });

  it("returns false for non-empty strings, arrays, numbers", () => {
    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty(" ")).toBe(false);
    expect(isEmpty("0")).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(-1)).toBe(false);
  });

  it("returns size === 0 for Map and Set", () => {
    const m = new Map();
    m.set("a", 1);
    expect(isEmpty(m)).toBe(false);

    const s = new Set();
    s.add(1);
    expect(isEmpty(s)).toBe(false);
  });

  it(
    "BUG: returns true for non-empty plain objects (src/index.ts:110)",
    () => {
      // Plain objects without Symbol.iterator fall through every branch
      // and hit `return true` at the bottom. Semantically `{ a: 1 }` is
      // not empty. Add an `Object.keys(value).length === 0` fast-path for
      // plain objects.
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty({ length: 0 })).toBe(false);
    },
  );

  it("BUG: new Date() is reported as empty (src/index.ts:110)", () => {
    // Date instances have no iterator and don't stringify as numeric, so
    // they fall through to `return true`. A constructed Date is not empty.
    expect(isEmpty(new Date())).toBe(false);
  });

  it("BUG: NaN is reported as empty (src/index.ts:110)", () => {
    // NaN is a number, not empty in the usual sense.
    expect(isEmpty(Number.NaN)).toBe(false);
  });
});
