---
name: mongez-supportive-is-primitives
description: |
  Documents the six primitive and numeric predicates — `isString`, `isNumeric`, `isInt`, `isFloat`, `isPrimitive`, and `isScalar` — including their semantics, edge cases, and known bugs.
  TRIGGER when: code imports `isString`, `isNumeric`, `isInt`, `isFloat`, `isPrimitive`, or `isScalar` from `@mongez/supportive-is`; user asks "how do I check string / number / int / float", "detect a numeric string like '12'", "difference between isPrimitive and isScalar", or "type-narrow a string in TS"; typical import is `import { isString, isNumeric } from "@mongez/supportive-is"` (or `Is.string(x)` / `Is.numeric(x)` via the legacy default `Is` namespace).
  SKIP: native `typeof v === "string"` or `Number.isInteger(v)` checks where you don't need this package — those are correct and avoid this package's known `isInt`/`isFloat` negative-number bugs; `@mongez/reinforcements` for string/number transformations (not predicates); schema validators.
---

# Primitives & numbers

Six predicates for primitive-type and numeric checks. All are `O(1)` and run anywhere.

| Predicate | Quick rule |
|---|---|
| `isString(v)` | `typeof v === "string"` (excludes `new String(...)`) |
| `isNumeric(v)` | Number-or-numeric-string, regex-based |
| `isInt(v)` | `typeof v === "number"` AND stringifies to `/^\d+$/` |
| `isFloat(v)` | `typeof v === "number"` AND stringifies to `\d+.\d+` |
| `isPrimitive(v)` | `string \| number \| boolean \| bigint` (NOT symbol/null/undefined) |
| `isScalar(v)` | `string \| number \| boolean \| bigint \| symbol` |

## `isString`

```ts
isString("");           // true
isString("hello");      // true
isString(`x${1}`);      // true

isString(new String("x")); // false (wrapper objects are typeof "object")
isString(0);               // false
isString(null);            // false
```

Useful for narrowing union types: TypeScript treats `isString(v)` as a type guard for `string`.

## `isNumeric`

Recognizes numbers AND numeric strings:

```ts
isNumeric(0);          // true
isNumeric(-1.5);       // true
isNumeric("12");       // true
isNumeric("+1");       // true
isNumeric("1.5E-3");   // true

isNumeric("");         // false
isNumeric("1.");       // false (trailing dot)
isNumeric("12abc");    // false
isNumeric(null);       // false
```

> **BUG (`src/index.ts:10`)**: the regex carries the `/g` flag. `RegExp.prototype.test` advances `lastIndex` on each call, so repeated calls on the same input alternate `true` / `false` / `true`. Workaround: don't reuse `isNumeric` in tight loops on the same value, or assign once: `const ok = isNumeric(x); ok && doThing()`.

## `isInt` & `isFloat`

Both require `typeof value === "number"`:

```ts
isInt(0);             // true
isInt(1);             // true
isInt(1.0);           // true   (stringifies to "1")

isInt(1.5);           // false
isInt("2");           // false  (data type matters)
isInt(NaN);           // false
isInt(Infinity);      // false

isFloat(1.5);         // true
isFloat(0.1);         // true

isFloat(1);           // false
isFloat(1.0);         // false  (no decimal in "1")
isFloat("1.5");       // false
```

> **BUGS (`src/index.ts:17`, `src/index.ts:23`)**:
> - Both regexes lack a sign branch — `isInt(-1)` and `isFloat(-1.5)` both return `false`.
> - `isInt(1e21)` returns `false` because `String(1e21) === "1e+21"`.
> - `isFloat` uses an unescaped `.` in `/^\d+.(\d+)$/`.
> Use `Number.isInteger` and `Number.isFinite` for the real checks until these are patched.

## `isPrimitive` vs `isScalar`

The only difference is `Symbol`:

| Value | `isPrimitive` | `isScalar` |
|---|---|---|
| `"x"` | true | true |
| `1`, `1.5`, `1n` | true | true |
| `true`, `false` | true | true |
| `Symbol("x")` | **false** | **true** |
| `null` | false | false |
| `undefined` | false | false |
| `[]`, `{}`, `() => {}` | false | false |

`isPrimitive` is named for "what you can use in `+` / `===`", which excludes `Symbol`. `isScalar` is "anything that isn't an object reference".

## Notes

- `isString` is the only predicate here that doesn't have a known bug.
- `isPrimitive(Symbol(...))` returning `false` is **intentional** — call `isScalar` instead if you want symbols included.
- For "is it a finite number", use `Number.isFinite(v)`. For "is it an integer (any sign)", use `Number.isInteger(v)`. `isInt`/`isFloat` are kept for compatibility but the native checks are correct.
