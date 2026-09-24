---
description: "Type-check predicates and environment detection in one tiny package. Exports `isEmpty`, `isEmail`, `isUrl`, `isNumeric`, `isPlainObject`, `isPromise`, `isJson`, `isString`, `isBrowser`, `isMobile`, `isDate`, `Is`. Use for: \"check if value is empty\", \"validate an email or URL string\", \"is this a plain object\", \"is numeric string\", \"detect browser or mobile device\", \"is valid JSON\", \"is a promise or iterable\". Not this package: transforming data (pick, merge, groupBy, string case, debounce) → @mongez/reinforcements; form or schema validation → @mongez/react-form or @warlock.js/seal."
---
# @mongez/supportive-is

A set of boolean predicates, each also reachable as a method on the `Is` object. They return plain `boolean`; they are runtime checks, not TypeScript type guards.

## The 80% path
1. Orient with `overview.md`.
2. Primitives and scalar types: `primitives.md`.
3. Objects, arrays, iterables and emptiness (`isObject`, `isPlainObject`, `isIterable`, `isEmpty`): `collections.md`.
4. Strings with a format (email, URL, JSON): `formats.md`.
5. Browser and device detection: `environment.md`; promises, dates and other leftovers: `misc.md`; examples: `recipes.md`.

## Conventions and pitfalls
- `isEmpty` treats `0`, `false`, dates and `NaN` as not empty; it is true for `""`, `null`, `undefined`, and empty arrays, maps, sets and objects.
- `isNumeric("12")` is true while `isInt("12")` is false. `isInt` and `isFloat` accept real numbers only.
- `isUrl` requires http(s) and a dotted host, so `localhost` fails.
- `isObject` is true for arrays and dates; use `isPlainObject` for `{}`-style data.
- Environment checks (`isBrowser`, `isMobile`, `isChrome`) rely on globals, so guard them on the server.
- `isEmail` is a format check, not deliverability.
