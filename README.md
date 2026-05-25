# @mongez/supportive-is

> Tree-shakable type & shape predicates for JavaScript. `isString`, `isEmpty`, `isUrl`, `isPromise`, `isMobile.any()` — boring, useful, and one named import each so unused checks fall away in the bundler.

Every predicate is a single named export. There's no runtime dependency, no global, and no class to instantiate. The legacy `Is` namespace (`Is.empty(value)`) is still exported as a convenience but tree-shakers can't strip what you don't import.

## Install

```sh
yarn add @mongez/supportive-is
```

## A 30-second tour

```ts
import {
  isString,
  isEmpty,
  isNumeric,
  isUrl,
  isEmail,
  isPlainObject,
  isPromise,
  isMobile,
} from "@mongez/supportive-is";

isString("hello");                        // true
isEmpty({});                              // true
isEmpty(0);                               // false  (zero is not empty)
isNumeric("12.5");                        // true
isUrl("https://example.com");             // true
isEmail("user@example.com");              // true
isPlainObject(new Date());                // false
isPromise(fetch("/api"));                 // true
if (isMobile.any()) { /* mobile UI */ }
```

## What's in the box

Each predicate is a single named export. The `Is` default export is preserved for legacy callers — `Is.empty(x)` and `isEmpty(x)` are the same function.

### Primitives & numbers

| Export | Purpose |
|---|---|
| `isString(value)` | `typeof value === "string"`. |
| `isNumeric(value)` | Number-or-numeric-string check. Matches `"12"`, `"-1.5"`, `"1e10"`. |
| `isInt(value)` | Integer number (data type `number`). `1.0` counts as int (stringifies to `"1"`). |
| `isFloat(value)` | Floating-point number with a fractional part. |
| `isPrimitive(value)` | `string` / `number` / `boolean` / `bigint`. (Symbol and null/undefined are excluded.) |
| `isScalar(value)` | `string` / `number` / `boolean` / `bigint` / `symbol`. |

### Collections & shape

| Export | Purpose |
|---|---|
| `isObject(value)` | Truthy object check — arrays, dates, regexes, class instances. Excludes `null` and functions. |
| `isPlainObject(value)` | `{}` / `new Object()` only — not arrays, dates, class instances. |
| `Is.array(value)` | Alias for `Array.isArray`. |
| `isIterable(value)` | Implements `Symbol.iterator`. |
| `isEmpty(value)` | Smart emptiness check (see [Empty semantics](#empty-semantics)). |

### Formats

| Export | Purpose |
|---|---|
| `isJson(value)` | Valid JSON string starting with `{` or `[`. |
| `isUrl(value)` | Valid `http://` / `https://` URL with a dotted hostname. |
| `isEmail(value)` | Standard email regex. |
| `isRegex(value)` | RegExp instance / regex literal. |
| `isValidId(value)` | Valid HTML `id` (`[A-Za-z][\w\-:.]*`). Also exposed as `Is.validHtmlId`. |

### Misc objects

| Export | Purpose |
|---|---|
| `isPromise(value)` | Native `Promise` instance. |
| `isDate(value)` | `Date` instance (any constructor result, valid or invalid). |
| `isGenerator(value)` | Generator function (note: see [Known bugs](#known-bugs)). |
| `isFormElement(value)` | `HTMLFormElement` instance. Also exposed as `Is.form`. |
| `isFormData(value)` | `FormData` instance. |

### Environment / DOM

These probe `window`, `document`, and `navigator`. They no-op safely on the server only when the global isn't referenced (see [SSR notes](#ssr-notes)).

| Export | Purpose |
|---|---|
| `isMobile.android()` / `.ios()` / `.iphone()` / `.ipad()` / `.ipod()` / `.windows()` / `.any()` | User-agent based mobile detection. |
| `isDesktop()` | `!isMobile.any()`. |
| `isMac()` | macOS UA. |
| `isBrowser(name)` | Single entry-point — `"chrome" \| "safari" \| "firefox" \| "opera" \| "edge" \| "ie"`. |
| `isChrome()` / `isFirefox()` / `isSafari()` / `isOpera()` / `isIE()` / `isEdge()` | Vendor-specific probes. |

## Empty semantics

`isEmpty` collapses a few real-world checks into one:

```ts
isEmpty(null);                  // true
isEmpty(undefined);             // true
isEmpty("");                    // true
isEmpty([]);                    // true
isEmpty({});                    // true
isEmpty(new Map());             // true
isEmpty(new Set());             // true

isEmpty(0);                     // false  (zero is a real value)
isEmpty(false);                 // false
isEmpty("0");                   // false
isEmpty(" ");                   // false  (whitespace is not empty)
isEmpty([0]);                   // false
```

For numbers, `isEmpty` short-circuits via `isNumeric`, so any finite number is considered non-empty. See [Known bugs](#known-bugs) for cases where this gets surprising.

## SSR notes

Most predicates are pure and run anywhere. The browser/environment helpers (`isMobile.*`, `isMac`, `isBrowser`, `isChrome`, `isFirefox`, `isSafari`, `isOpera`, `isIE`, `isEdge`, `isDesktop`, `isFormElement`) touch `window`, `document`, or `navigator` at **call time** — they don't read those globals at module-eval, so importing the package on the server is safe. Calling them on the server will throw if the global isn't shimmed.

If you ship a Next.js / Remix / TanStack Start app and want UA-aware rendering on the server, parse `request.headers.get("user-agent")` yourself rather than relying on these predicates.

## Migrating from v1 (the `Is` namespace)

The v1 surface was a single default export:

```ts
import Is from "@mongez/supportive-is";

Is.string("x");
Is.empty([]);
```

v2 keeps that import working — `Is` is still exported as the default — but each predicate is also a named export, so bundlers can drop the ones you don't use:

```ts
// v2 (preferred — tree-shakable)
import { isString, isEmpty } from "@mongez/supportive-is";

isString("x");
isEmpty([]);
```

The exported `Is` object only collects the canonical predicates from this package; methods removed in v2 (`Is.cssSelector`, `Is.htmlTag`, `Is.callable`, …) stay removed.

## Known bugs

These exist in the current source and aren't fixed here — changing the public output would break consumers. They're documented for reference and each has a corresponding `.skip()`-ed test that lists the line number in `src/index.ts`. The full list is in [CHANGELOG.md](./CHANGELOG.md).

- **`isNumeric`** uses a `/g` regex which makes `lastIndex` drift across calls, so repeated calls alternate `true` / `false` on the same input.
- **`isInt`** rejects negative integers (`isInt(-1) === false`) and integers that stringify in scientific notation (`isInt(1e21) === false`).
- **`isFloat`** rejects negative floats and uses an unescaped `.` in the regex.
- **`isEmpty`** returns `true` for non-empty plain objects (`{ a: 1 }`), for `new Date()`, and for `NaN`.
- **`isPlainObject`** throws on `Object.create(null)`.
- **`isUrl`** accepts `https://google.` and `https://google..com`.
- **`isEmail`** matches single-element arrays (`isEmail(["x@y.com"]) === true`) because the regex coerces with `String()`.
- **`isGenerator`** never matches a generator INSTANCE (only the constructor name of generator FUNCTIONS, which doesn't roundtrip).
- **`isSafari`** false-positives on any host whose `HTMLElement.toString()` contains the word "constructor" (which is most class-based DOM polyfills).
- **`isPromise`** doesn't recognize subclasses (`class MyPromise extends Promise`).
- **`isObject`**, **`isRegex`**, **`isPlainObject`**, **`isPromise`**, **`isDate`**, **`isGenerator`** return the raw falsy operand (`null`, `undefined`, `0`, `""`) instead of `false` for negative cases, because the guard is `value && …`.

## Examples

### A reusable guard

```ts
import { isPlainObject } from "@mongez/supportive-is";

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const v = source[key];
    if (isPlainObject(v) && isPlainObject(target[key])) {
      target[key] = deepMerge(target[key] as object, v as object) as T[keyof T];
    } else {
      target[key] = v as T[keyof T];
    }
  }
  return target;
}
```

### A form validator

```ts
import { isEmpty, isEmail, isUrl } from "@mongez/supportive-is";

function validate(form: { email?: string; website?: string }) {
  const errors: Record<string, string> = {};
  if (isEmpty(form.email)) errors.email = "Email is required";
  else if (!isEmail(form.email!)) errors.email = "Email is invalid";

  if (form.website && !isUrl(form.website)) {
    errors.website = "Website must be a full http(s) URL";
  }
  return errors;
}
```

### Mobile-aware UI

```ts
import { isMobile } from "@mongez/supportive-is";

const isTouchDevice = isMobile.any();
```

## Related packages

| Package | Purpose |
|---|---|
| [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) | General-purpose utility belt — objects, strings, arrays, async. |
| [`@mongez/atom`](https://github.com/hassanzohdy/atom) | Framework-agnostic state primitive. |
| [`@mongez/events`](https://github.com/hassanzohdy/events) | Tiny event bus. |

## License

MIT
