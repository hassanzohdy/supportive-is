---
name: mongez-supportive-is-collections
description: Documents the five collection and shape predicates — isObject, isPlainObject, Is.array, isIterable, and isEmpty — including the falsy-return pattern and known bugs.
when_to_use: User calls isObject(), isPlainObject(), isIterable(), isEmpty(), or Is.array() from @mongez/supportive-is, or asks about emptiness checks, plain-object detection, iterable detection, or why a predicate returns null instead of false.
---

# Collections & shape

Five predicates that ask "what shape of value is this, and is it empty?". `isObject`, `isPlainObject`, `Is.array`, `isIterable`, and `isEmpty`.

| Predicate | Quick rule |
|---|---|
| `isObject(v)` | Truthy AND `typeof v === "object"` |
| `isPlainObject(v)` | Constructor name is exactly `"Object"` |
| `Is.array(v)` | `Array.isArray(v)` |
| `isIterable(v)` | Has a `[Symbol.iterator]` method |
| `isEmpty(v)` | Smart emptiness (see below) |

## `isObject`

Includes arrays, dates, regexes, class instances. Excludes `null` and functions.

```ts
isObject({});            // true
isObject([]);            // true
isObject(new Date());    // true
isObject(/x/);           // true
class C {}
isObject(new C());       // true

isObject(null);          // null    (falsy non-boolean — see below)
isObject(undefined);     // undefined
isObject(0);             // 0
isObject("");            // ""
isObject("x");           // false
isObject(123);           // false
isObject(() => {});      // false
```

To check "object but not array": `isObject(x) && !Array.isArray(x)`. To check "object but also not date": add `&& !(x instanceof Date)`. Or just use `isPlainObject`.

## `isPlainObject`

Returns `true` ONLY for `{}` and `new Object()`. Class instances, dates, regexes, and arrays return `false`.

```ts
isPlainObject({});                    // true
isPlainObject({ a: 1 });              // true
isPlainObject(new Object());          // true

isPlainObject([]);                    // false
isPlainObject(new Date());            // false
isPlainObject(/x/);                   // false
isPlainObject(new class {});          // false
isPlainObject("hello");               // false
isPlainObject(null);                  // falsy (null)
```

> **BUG (`src/index.ts:39`)**: throws on `Object.create(null)` because the constructor is `undefined`. Add `?.` once you fix it: `value?.constructor?.name === "Object"`.

## `Is.array`

Pure alias for `Array.isArray`. Same semantics: only literal arrays, not array-likes.

```ts
Is.array([]);            // true
Is.array(new Array(3));  // true

Is.array(new Set());     // false  (iterable, but not an Array)
Is.array({ length: 0 }); // false  (array-like, but not an Array)
```

## `isIterable`

Has a `[Symbol.iterator]` method.

```ts
isIterable([]);              // true
isIterable("hello");         // true
isIterable(new Set());       // true
isIterable(new Map());       // true
isIterable({ *[Symbol.iterator]() { yield 1; } }); // true

isIterable({});              // false
isIterable(123);             // false
isIterable(null);            // false (null)
```

> **BUG (`src/index.ts:64`)**: `isIterable("")` returns `""` instead of `true` because the guard is `value && …` and `""` is falsy. Empty strings ARE iterable (they just yield nothing). Treat the empty-string case specially or wrap with `Boolean(isIterable(x))`.

## `isEmpty`

The most subtle predicate in the package. Branches:

| Input | Result | Why |
|---|---|---|
| `null`, `undefined`, `""` | `true` | Listed in the empty-set |
| `0`, `true`, `false` | `false` | Listed in the "real value" set |
| `new Map()` / `new Set()` | `.size === 0` | Special cased |
| Iterable (array, string, …) | `.length === 0` | Generic check |
| Numeric (per `isNumeric`) | `false` | Numbers are real values |
| Everything else | `true` | Default — **buggy for plain objects, Dates, NaN** |

```ts
isEmpty(null);        // true
isEmpty(undefined);   // true
isEmpty("");          // true
isEmpty([]);          // true
isEmpty({});          // true
isEmpty(new Map());   // true
isEmpty(new Set());   // true

isEmpty(0);           // false
isEmpty(false);       // false
isEmpty("0");         // false
isEmpty(" ");         // false
isEmpty([0]);         // false
isEmpty(1);           // false
```

> **BUGS (`src/index.ts:110`)**:
> - `isEmpty({ a: 1 })` returns `true`. The fall-through default is `return true`; non-iterable plain objects with keys leak through. Workaround: `isEmpty(x) || (isPlainObject(x) && Object.keys(x).length === 0)` reversed — `Object.keys(x).length === 0 || isEmpty(x)`.
> - `isEmpty(new Date())` returns `true`. A constructed Date is not empty.
> - `isEmpty(NaN)` returns `true`. Debatable, but unexpected if you've been thinking "is it a falsy value".

If you need a correct emptiness check, prefer:

```ts
function isReallyEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === "string" || Array.isArray(v)) return v.length === 0;
  if (v instanceof Map || v instanceof Set) return v.size === 0;
  if (typeof v === "object" && v.constructor?.name === "Object") return Object.keys(v).length === 0;
  return false;
}
```

## Falsy-return pattern

`isObject`, `isPlainObject`, `isRegex`, `isPromise`, `isDate`, `isGenerator`, and `isIterable` all use the shape `value && …`. When `value` is falsy they short-circuit and return the operand itself:

```ts
isObject(null);       // null
isObject(undefined);  // undefined
isObject(0);          // 0
isObject("");         // ""
```

In Boolean contexts (`if`, `&&`, `||`, `!`) this is fine. With `=== false` it isn't:

```ts
if (isObject(null) === false) { /* never runs */ }
if (!isObject(null)) { /* this runs */ }
if (Boolean(isObject(null)) === false) { /* this runs too */ }
```

Use `!isObject(x)`, `Boolean(isObject(x))`, or the truthy-falsy form. Don't compare to `false` directly.
