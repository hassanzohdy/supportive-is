import { describe, expect, it } from "vitest";
import {
  isDate,
  isFormData,
  isFormElement,
  isGenerator,
  isIterable,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRegex,
  isScalar,
  isString,
} from "../index";

/**
 * Runtime behaviour of the guards that are also TypeScript type predicates.
 * Each test uses the narrowed value in a way that only compiles if the
 * predicate narrows `unknown` to the documented type.
 */
describe("type-predicate guards narrow at runtime", () => {
  it("isString", () => {
    const value: unknown = " padded ";

    if (!isString(value)) throw new Error("expected a string");

    expect(value.trim()).toBe("padded");
    expect(isString(new String("x"))).toBe(false);
  });

  it("isPlainObject", () => {
    const value: unknown = JSON.parse('{"user":{"name":"Hasan"}}');

    if (!isPlainObject(value)) throw new Error("expected a plain object");

    expect(Object.keys(value)).toEqual(["user"]);
    expect(value.user).toEqual({ name: "Hasan" });
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new (class Foo {})())).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });

  it("isObject", () => {
    const value: unknown = [1, 2, 3];

    if (!isObject(value)) throw new Error("expected an object");

    expect(Object.keys(value)).toEqual(["0", "1", "2"]);
    expect(isObject(null)).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject("x")).toBe(false);
  });

  it("isDate", () => {
    const value: unknown = new Date(0);

    if (!isDate(value)) throw new Error("expected a date");

    expect(value.getTime()).toBe(0);
    expect(isDate("2020-01-01")).toBe(false);
    expect(isDate({})).toBe(false);
  });

  it("isRegex", () => {
    const value: unknown = /a+/g;

    if (!isRegex(value)) throw new Error("expected a regex");

    expect(value.test("caat")).toBe(true);
    expect(isRegex("/a/")).toBe(false);
    expect(isRegex({})).toBe(false);
  });

  it("isPromise", async () => {
    const value: unknown = Promise.resolve(42);

    if (!isPromise(value)) throw new Error("expected a promise");

    await expect(value.then((result) => result)).resolves.toBe(42);
    expect(isPromise({ then: () => {} })).toBe(false);
  });

  it("isIterable", () => {
    const value: unknown = new Set([1, 2]);

    if (!isIterable(value)) throw new Error("expected an iterable");

    expect([...value]).toEqual([1, 2]);
    // strings are iterable at runtime, exactly like the predicate says
    expect(isIterable("abc")).toBe(true);
    expect(isIterable(5)).toBe(false);
    expect(isIterable(null)).toBe(false);
  });

  it("isGenerator", () => {
    function* numbers() {
      yield 1;
      yield 2;
    }
    const value: unknown = numbers();

    if (!isGenerator(value)) throw new Error("expected a generator");

    expect(value.next().value).toBe(1);
    expect([...value]).toEqual([2]);
    // duck-typed: any self-iterable iterator qualifies, e.g. an array iterator
    expect(isGenerator([1][Symbol.iterator]())).toBe(true);
    expect(isGenerator([1])).toBe(false);
    expect(isGenerator(numbers)).toBe(false);
  });

  it("isScalar", () => {
    const value: unknown = Symbol.for("s");

    if (!isScalar(value)) throw new Error("expected a scalar");

    expect(typeof value).toBe("symbol");
    expect(isScalar(null)).toBe(false);
    expect(isScalar({})).toBe(false);
  });

  it("isPrimitive", () => {
    const value: unknown = BigInt(10);

    if (!isPrimitive(value)) throw new Error("expected a primitive");

    expect(typeof value).toBe("bigint");
    // symbols are scalar but NOT primitive for this package
    expect(isPrimitive(Symbol("s"))).toBe(false);
    expect(isPrimitive(undefined)).toBe(false);
  });

  it("isFormElement", () => {
    const value: unknown = document.createElement("form");

    if (!isFormElement(value)) throw new Error("expected a form element");

    expect(value.elements.length).toBe(0);
    expect(isFormElement(document.createElement("div"))).toBe(false);
    expect(isFormElement({})).toBe(false);
  });

  it("isFormData", () => {
    const value: unknown = new FormData();

    if (!isFormData(value)) throw new Error("expected form data");

    value.append("a", "1");
    expect(value.get("a")).toBe("1");
    expect(isFormData({})).toBe(false);
  });
});
