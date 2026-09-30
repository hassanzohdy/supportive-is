import { describe, expectTypeOf, it } from "vitest";
import Is, {
  isDate,
  isEmail,
  isEmpty,
  isFloat,
  isFormData,
  isFormElement,
  isGenerator,
  isInt,
  isIterable,
  isJson,
  isNumeric,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRegex,
  isScalar,
  isString,
  isUrl,
  isValidId,
} from "../index";

/**
 * Type-level tests. These are checked by `vitest --typecheck` (tsc), not at
 * runtime: `expectTypeOf(...)` compiles only if the types match exactly.
 */
describe("guards are type predicates", () => {
  it("narrows unknown to the exact type they verify", () => {
    const value = null as unknown;

    if (isString(value)) expectTypeOf(value).toEqualTypeOf<string>();
    if (isPlainObject(value))
      expectTypeOf(value).toEqualTypeOf<Record<string, unknown>>();
    if (isObject(value)) expectTypeOf(value).toEqualTypeOf<object>();
    if (isDate(value)) expectTypeOf(value).toEqualTypeOf<Date>();
    if (isRegex(value)) expectTypeOf(value).toEqualTypeOf<RegExp>();
    if (isPromise(value)) expectTypeOf(value).toEqualTypeOf<Promise<unknown>>();
    if (isIterable(value))
      expectTypeOf(value).toEqualTypeOf<Iterable<unknown>>();
    if (isGenerator(value))
      expectTypeOf(value).toEqualTypeOf<IterableIterator<unknown>>();
    if (isScalar(value))
      expectTypeOf(value).toEqualTypeOf<
        string | boolean | number | symbol | bigint
      >();
    if (isPrimitive(value))
      expectTypeOf(value).toEqualTypeOf<string | boolean | number | bigint>();
    if (isFormElement(value))
      expectTypeOf(value).toEqualTypeOf<HTMLFormElement>();
    if (isFormData(value)) expectTypeOf(value).toEqualTypeOf<FormData>();
  });

  it("picks the matching member of a union", () => {
    const value = null as unknown as Date | string | number;

    if (isDate(value)) expectTypeOf(value).toEqualTypeOf<Date>();
    else expectTypeOf(value).toEqualTypeOf<string | number>();

    if (isString(value)) expectTypeOf(value).toEqualTypeOf<string>();
    else expectTypeOf(value).toEqualTypeOf<Date | number>();
  });

  it("exposes the predicates through the Is object", () => {
    expectTypeOf(Is.plainObject).toEqualTypeOf(isPlainObject);
    expectTypeOf(Is.date).toEqualTypeOf(isDate);
    expectTypeOf(Is.formElement).toEqualTypeOf(isFormElement);
  });
});

describe("refinement checks stay plain booleans", () => {
  // These accept a subset of their base type (isInt of number, isEmail of
  // string, ...), so a predicate would wrongly narrow the false branch to
  // `never` for a value that is already a `number` / `string`.
  it("return boolean, not a predicate", () => {
    expectTypeOf(isInt).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isFloat).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isNumeric).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isJson).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isUrl).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isEmail).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isValidId).returns.toEqualTypeOf<boolean>();
    expectTypeOf(isEmpty).returns.toEqualTypeOf<boolean>();
  });

  it("does not narrow either branch", () => {
    const value = null as unknown as number | string;

    if (isInt(value)) expectTypeOf(value).toEqualTypeOf<number | string>();
    else expectTypeOf(value).toEqualTypeOf<number | string>();

    if (isEmail(value)) expectTypeOf(value).toEqualTypeOf<number | string>();
    else expectTypeOf(value).toEqualTypeOf<number | string>();
  });
});

describe("parameters are unknown", () => {
  it("accepts any value without a cast", () => {
    expectTypeOf(isString).parameter(0).toEqualTypeOf<unknown>();
    expectTypeOf(isPlainObject).parameter(0).toEqualTypeOf<unknown>();
    expectTypeOf(isInt).parameter(0).toEqualTypeOf<unknown>();
    expectTypeOf(isEmpty).parameter(0).toEqualTypeOf<unknown>();
    expectTypeOf(isUrl).parameter(0).toEqualTypeOf<unknown>();
  });
});
