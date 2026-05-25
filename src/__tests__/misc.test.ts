import { describe, expect, it } from "vitest";
import {
  isPromise,
  isDate,
  isGenerator,
  isFormElement,
  isFormData,
} from "../index";

describe("isPromise", () => {
  it("returns true for native Promise instances", () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(Promise.reject().catch(() => {}))).toBe(true);
    expect(isPromise(new Promise((r) => r(1)))).toBe(true);
  });

  it("returns false for non-Promise thenables and non-objects", () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise({ then() {} })).toBe(false); // thenable but not Promise
    expect(isPromise(123)).toBe(false);
    expect(isPromise("hello")).toBe(false);
    expect(isPromise(() => {})).toBe(false);
  });

  it("returns a falsy value for null/undefined", () => {
    expect(isPromise(null)).toBeFalsy();
    expect(isPromise(undefined)).toBeFalsy();
  });

  it(
    "BUG: subclassed Promise is not detected (src/index.ts:87)",
    () => {
      // The check is `value.constructor.name === "Promise"`. A class
      // extending Promise reports its own name.
      class MyPromise<T> extends Promise<T> {}
      const p = MyPromise.resolve(1);
      expect(isPromise(p)).toBe(true);
    },
  );
});

describe("isDate", () => {
  it("returns true for Date instances", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date(0))).toBe(true);
    expect(isDate(new Date("2024-01-01"))).toBe(true);
    // Invalid date is still a Date.
    expect(isDate(new Date("not a date"))).toBe(true);
  });

  it("returns false for date-like strings, numbers, and other objects", () => {
    expect(isDate("2024-01-01")).toBe(false);
    expect(isDate(Date.now())).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(123)).toBe(false);
  });

  it("returns a falsy value for null/undefined", () => {
    expect(isDate(null)).toBeFalsy();
    expect(isDate(undefined)).toBeFalsy();
  });
});

describe("isGenerator", () => {
  it("returns false for ordinary objects, functions, primitives", () => {
    expect(isGenerator({})).toBe(false);
    expect(isGenerator([])).toBe(false);
    expect(isGenerator(() => {})).toBe(false);
    expect(isGenerator("hello")).toBe(false);
    expect(isGenerator(123)).toBe(false);
  });

  it("returns a falsy value for null/undefined", () => {
    expect(isGenerator(null)).toBeFalsy();
    expect(isGenerator(undefined)).toBeFalsy();
  });

  it(
    "BUG: generator instances are not detected (src/index.ts:99)",
    () => {
      // The check is `value.constructor.name === "GeneratorFunction"`, but
      // a generator INSTANCE (the result of invoking a generator function)
      // has an empty-string constructor name in V8. The correct check is
      // either `value && typeof value.next === "function" && typeof value[Symbol.iterator] === "function"`
      // or `Object.prototype.toString.call(value) === "[object Generator]"`.
      function* gen() {
        yield 1;
      }
      const g = gen();
      expect(isGenerator(g)).toBe(true);
    },
  );
});

describe("isFormElement", () => {
  it("returns true for HTMLFormElement instances", () => {
    // happy-dom provides HTMLFormElement.
    const form = document.createElement("form");
    expect(isFormElement(form)).toBe(true);
  });

  it("returns false for other DOM elements and non-elements", () => {
    const div = document.createElement("div");
    expect(isFormElement(div)).toBe(false);
    expect(isFormElement({})).toBe(false);
    expect(isFormElement("form")).toBe(false);
    expect(isFormElement(null)).toBe(false);
    expect(isFormElement(undefined)).toBe(false);
  });
});

describe("isFormData", () => {
  it("returns true for FormData instances", () => {
    expect(isFormData(new FormData())).toBe(true);
  });

  it("returns false for non-FormData", () => {
    expect(isFormData({})).toBe(false);
    expect(isFormData([])).toBe(false);
    expect(isFormData("form")).toBe(false);
    expect(isFormData(null)).toBe(false);
    expect(isFormData(undefined)).toBe(false);
  });
});
