---
name: mongez-supportive-is-collections
description: |
  Documents the five collection and shape predicates — `isObject`, `isPlainObject`, `Is.array`, `isIterable`, and `isEmpty` — including the falsy-return pattern and known bugs.
  TRIGGER when: code imports `isObject`, `isPlainObject`, `isIterable`, `isEmpty`, or uses `Is.array` from `@mongez/supportive-is`; user asks "how do I check if an object is empty / a plain object / iterable", "why does isObject return null instead of false", or "how do I detect a class instance vs literal object"; typical import is `import { isEmpty, isPlainObject } from "@mongez/supportive-is"` (or legacy `import Is from "@mongez/supportive-is"; Is.empty(x)`).
  SKIP: general-purpose array/object utilities (`get`, `set`, `clone`, `pluck`, `groupBy`) — use `mongez-reinforcements-*` skills, since this package is purely shape/type PREDICATES not transformations; schema validation via `zod`/`valibot`; native `Array.isArray`/`typeof` checks without this package imported.
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

isObject(null);          // false
isObject(undefined);     // false
isObject(0);             // false
isObject("");            // false
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
isPlainObject(null);                  // false
isPlainObject(Object.create(null));   // true   (null-prototype objects are plain)
```

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
isIterable("");              // true   (empty string is still iterable)
isIterable(new Set());       // true
isIterable(new Map());       // true
isIterable({ *[Symbol.iterator]() { yield 1; } }); // true

isIterable({});              // false
isIterable(123);             // false
isIterable(null);            // false
isIterable(undefined);       // false
```

## `isEmpty`

The most subtle predicate in the package. Branches:

| Input | Result | Why |
|---|---|---|
| `null`, `undefined`, `""` | `true` | Listed in the empty-set |
| `0`, `true`, `false` | `false` | Listed in the "real value" set |
| `NaN` | `false` | Treated as a numeric value, not absence |
| `Date` instance | `false` | A constructed Date is a real value |
| `new Map()` / `new Set()` | `.size === 0` | Special cased |
| Plain object (no `Symbol.iterator`) | `Object.keys(v).length === 0` | Compared by own-key count |
| Iterable (array, string, …) | `.length === 0` | Generic check |
| Numeric (per `isNumeric`) | `false` | Numbers are real values |
| Everything else | `true` | Default fall-through |

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
isEmpty({ a: 1 });    // false
isEmpty(new Date());  // false
isEmpty(NaN);         // false
```
