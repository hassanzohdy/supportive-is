<div align="center">

# @mongez/supportive-is

**Tree-shakable type and shape predicates for JavaScript — `isString`, `isEmpty`, `isUrl`, `isPromise`, `isMobile.any()` — one named export each, zero runtime dependencies.**

[![npm](https://img.shields.io/npm/v/@mongez/supportive-is.svg)](https://www.npmjs.com/package/@mongez/supportive-is)
[![license](https://img.shields.io/npm/l/@mongez/supportive-is.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@mongez/supportive-is.svg)](https://bundlephobia.com/package/@mongez/supportive-is)
[![downloads](https://img.shields.io/npm/dw/@mongez/supportive-is.svg)](https://www.npmjs.com/package/@mongez/supportive-is)

</div>

---

## Why @mongez/supportive-is?

Raw `typeof` and `instanceof` only get you so far — `typeof null` is `"object"`, `typeof []` is `"object"`, and there's no built-in answer to "is this thing empty in the way I mean?". `lodash.isString` (and friends) work, but you either pay for the full `lodash` build or wire up a separate package per check and hope tree-shaking strips what you don't use. `validator.js` does email, URL, and friends, but it's a heavyweight string-validation library with a different scope.

`@mongez/supportive-is` is the smallest middle ground: one named export per predicate, `sideEffects: false` so bundlers actually drop the unused ones, zero runtime dependencies, and a `Date`/`Map`/`Set`/plain-object-aware `isEmpty` that collapses the ten lines you'd write by hand into one call. The package is **shape predicates only** — it tells you *what kind of value you have*, not how to transform it. Transformations live in [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements).

```ts
import { isEmail, isEmpty, isPlainObject, isUrl } from "@mongez/supportive-is";

isEmail("user@example.com");   // true
isEmpty({});                   // true
isEmpty(0);                    // false  — zero is a real value
isPlainObject(new Date());     // false  — Date is an instance, not a literal
isUrl("https://example.com");  // true
```

---

## Features

| Feature | Description |
|---|---|
| **Tree-shakable named exports** | `import { isString }` brings in ~80 bytes; the unused predicates fall away. `sideEffects: false` is set. |
| **Primitive checks** | `isString`, `isNumeric`, `isInt`, `isFloat`, `isPrimitive`, `isScalar` — covers numeric-strings, signed numbers, and the `bigint`/`symbol` split. |
| **Collection / shape checks** | `isObject`, `isPlainObject`, `isIterable`, `isEmpty` plus `Is.array` — distinguishes `{}` from class instances, handles `Map`/`Set`/`Date` correctly. |
| **Format predicates** | `isJson`, `isUrl`, `isEmail`, `isRegex`, `isValidId` — convenience filters for the four formats every project needs. |
| **Environment detection** | `isMobile.android()`/`.ios()`/`.iphone()`/`.ipad()`/`.ipod()`/`.windows()`/`.any()`, `isDesktop`, `isMac`, `isBrowser(name)`, plus vendor probes (`isChrome`/`isFirefox`/`isSafari`/`isOpera`/`isIE`/`isEdge`). |
| **Object-kind checks** | `isPromise`, `isDate`, `isGenerator`, `isFormElement`, `isFormData`. |
| **Smart `isEmpty`** | One call covers `null`, `undefined`, `""`, `[]`, `{}`, `new Map()`, `new Set()` — with `0`, `false`, `new Date()`, and `NaN` deliberately reported as **not** empty. |
| **Legacy `Is` namespace** | `import Is from "@mongez/supportive-is"; Is.empty(x)` still works — same functions, different shape, no tree-shaking. |
| **SSR-safe imports** | DOM-touching predicates read `navigator`/`window`/`document` *at call time*, never at module-eval. Importing the package on the server is always safe. |
| **Zero runtime dependencies** | One source file. No transitive packages. |
| **TypeScript-first** | `isString` is a real `value is string` type guard out of the box. |

---

## Installation

```sh
npm install @mongez/supportive-is
```

```sh
yarn add @mongez/supportive-is
```

```sh
pnpm add @mongez/supportive-is
```

---

## Quick start

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

isString("hello");                          // true
isEmpty({});                                // true
isEmpty(0);                                 // false  — zero is not empty
isNumeric("12.5");                          // true
isUrl("https://example.com");               // true
isEmail("user@example.com");                // true
isPlainObject(new Date());                  // false
isPromise(fetch("/api"));                   // true
if (isMobile.any()) { /* mobile UI */ }
```

That's the entire happy path. Everything below is depth on the same set of predicates.

---

## Primitive checks

Six predicates for primitive and numeric types. All run in `O(1)` everywhere.

| Export | Rule | Notes |
|---|---|---|
| `isString(value)` | `typeof value === "string"` | TS narrows correctly. Excludes `new String("x")`. |
| `isNumeric(value)` | Number or numeric string | Accepts `"12"`, `"-1.5"`, `"+1"`, `"1.5E-3"`. Rejects `""`, `"1."`, `"12abc"`. |
| `isInt(value)` | `typeof value === "number"` AND `Number.isInteger(value)` | Accepts signed ints, rejects `1.5`, `"2"`, `NaN`, `Infinity`. |
| `isFloat(value)` | Finite `number` whose string form has a fractional part | Accepts `1.5`, `-0.1`. Rejects `1`, `1.0`, `"1.5"`. |
| `isPrimitive(value)` | `string` / `number` / `boolean` / `bigint` | **Excludes `symbol`** and `null`/`undefined`. |
| `isScalar(value)` | `string` / `number` / `boolean` / `bigint` / `symbol` | The "anything that isn't an object reference" check. |

```ts
import { isNumeric, isInt, isFloat, isPrimitive, isScalar } from "@mongez/supportive-is";

isNumeric(0);          // true
isNumeric("12");       // true
isNumeric("1e10");     // true
isNumeric("1.");       // false  — trailing dot
isNumeric("hello");    // false

isInt(0);              // true
isInt(-1);             // true
isInt(1.5);            // false
isInt("2");            // false  — data type matters

isFloat(1.5);          // true
isFloat(-0.1);         // true
isFloat(1);            // false  — no fractional part
isFloat(1.0);          // false  — `String(1.0) === "1"`

isPrimitive(Symbol("x"));  // false  — by design
isScalar(Symbol("x"));     // true
```

> **`isString` is the only one that narrows in TypeScript out of the box.** The others are typed as `(value: any) => boolean` because the parameter is `any`. Wrap them in your own typed guard (`function isObjLike<T extends object>(v: unknown): v is T { return isPlainObject(v); }`) when you need narrowing on union types.

---

## Collection and shape checks

Five predicates that answer "what shape is this, and is there anything in it?".

| Export | Rule |
|---|---|
| `isObject(value)` | Truthy AND `typeof value === "object"`. Includes arrays, dates, regexes, class instances. Excludes `null` and functions. |
| `isPlainObject(value)` | `{}` / `new Object()` / `Object.create(null)` only — **not** arrays, dates, class instances. |
| `Is.array(value)` | Alias for `Array.isArray`. |
| `isIterable(value)` | Implements `[Symbol.iterator]` — arrays, strings, `Set`, `Map`, custom generators. |
| `isEmpty(value)` | Smart emptiness — see [Empty semantics](#empty-semantics). |

```ts
import { isObject, isPlainObject, isIterable, isEmpty, Is } from "@mongez/supportive-is";

isObject({});                       // true
isObject([]);                       // true
isObject(new Date());               // true
isObject(null);                     // false

isPlainObject({ a: 1 });            // true
isPlainObject(Object.create(null)); // true
isPlainObject([]);                  // false
isPlainObject(new Date());          // false
isPlainObject(new class {});        // false

Is.array([1, 2, 3]);                // true
Is.array(new Set());                // false  — iterable, but not an Array
Is.array({ length: 0 });            // false  — array-like, but not an Array

isIterable("hello");                // true
isIterable("");                     // true   — empty string IS iterable
isIterable(new Map());              // true
isIterable({});                     // false
```

`isPlainObject` is the right predicate for "should I merge into this, or replace it?" — class instances, `Date`, `Map`, `Set`, and `RegExp` all want to be replaced wholesale, and `isPlainObject` returns `false` for every one of them. See the [deep-merge recipe](#a-deep-merge-that-respects-class-instances).

### Empty semantics

`isEmpty` is the most-used predicate in the package. It collapses the ten lines you'd write by hand into one:

| Input | Result | Why |
|---|---|---|
| `null`, `undefined`, `""` | `true` | Listed in the empty set |
| `[]`, `{}` | `true` | Zero own keys / zero length |
| `new Map()`, `new Set()` | `true` | `.size === 0` |
| `0`, `true`, `false`, `"0"`, `" "` | `false` | Real values |
| `[0]`, `{ a: 1 }`, `1`, `-1` | `false` | Has content |
| `new Date()` | `false` | A constructed date is not empty |
| `NaN` | `false` | Still a numeric value |
| Other iterables | `.length === 0` | Generic check |

```ts
import { isEmpty } from "@mongez/supportive-is";

isEmpty(null);                  // true
isEmpty(undefined);             // true
isEmpty("");                    // true
isEmpty([]);                    // true
isEmpty({});                    // true
isEmpty(new Map());             // true
isEmpty(new Set());             // true

isEmpty(0);                     // false  — zero is a real value
isEmpty(false);                 // false  — false is a real value
isEmpty("0");                   // false  — string "0" is not empty
isEmpty(" ");                   // false  — whitespace counts
isEmpty([0]);                   // false  — one element
isEmpty({ a: 1 });              // false  — one key
isEmpty(new Date());            // false  — constructed Date is not empty
isEmpty(NaN);                   // false  — still a numeric value
```

> **`isEmpty` does not trim whitespace.** `isEmpty(" ")` returns `false`. If you mean "empty after trimming", call `isEmpty(value?.trim?.() ?? value)` at the call site, or use a dedicated string library.

### Falsy-return note

`isObject`, `isPlainObject`, `isRegex`, `isPromise`, `isDate`, and `isIterable` use the truthiness shape `Boolean(value) && …` — they return real `false` for `null`/`undefined`. In `if`/`!`/ternary contexts they behave exactly as you'd expect. Don't compare them to `false` with `===`:

```ts
import { isObject } from "@mongez/supportive-is";

if (isObject(null) === false) { /* runs */ }   // safe — returns real false
if (!isObject(null)) { /* runs */ }            // idiomatic
```

---

## Format predicates

Five string-format predicates. **None of these are security gates.** They're convenience filters — for input you don't trust (auth flows, redirect targets, persisted emails), pair them with a real validator like `zod` or `valibot`, or do the actual operation in a `try`/`catch`.

| Export | Rule |
|---|---|
| `isRegex(value)` | RegExp instance or regex literal. |
| `isValidId(value)` | Valid HTML `id` attribute — `/^[A-Za-z]+[\w\-:.]*$/`. Also aliased as `Is.validHtmlId`. |
| `isJson(value)` | Valid JSON string starting with `{` or `[`. **Rejects primitive JSON** (`"true"`, `"123"`, `'"hello"'`). |
| `isUrl(value)` | Constructable `new URL(value)` with `http:` / `https:` protocol and a non-empty dotted hostname. |
| `isEmail(value)` | Standard RFC 5322 subset regex. |

```ts
import { isRegex, isValidId, isJson, isUrl, isEmail } from "@mongez/supportive-is";

isRegex(/x/);                         // true
isRegex(new RegExp("x"));             // true
isRegex("/x/");                       // false  — string, not RegExp

isValidId("base-id");                 // true
isValidId("has.dots");                // true
isValidId("has:colon");               // true
isValidId("1starts-with-digit");      // false
isValidId("_starts-with-underscore"); // false
isValidId(null);                      // false  — real boolean

isJson('{"name":"John"}');            // true
isJson("[1, 2, 3]");                  // true
isJson("12");                         // false  — numeric JSON rejected by prefix
isJson('"hello"');                    // false  — string JSON rejected by prefix
isJson("{name:1}");                   // false  — unquoted key

isUrl("https://example.com");         // true
isUrl("http://example.com:8080/p?q"); // true
isUrl("google.com");                  // false  — no scheme
isUrl("ftp://example.com");           // false  — wrong scheme
isUrl("https://google.");             // false  — empty hostname label
isUrl("https://google..com");         // false  — empty middle label

isEmail("user@example.com");          // true
isEmail("a.b.c@example.co.uk");       // true
isEmail("user+tag@example.com");      // true
isEmail("a@b");                       // false  — no TLD with ≥ 2 letters
isEmail(["x@y.com"]);                 // false  — must be a string
```

> **`isJson` rejects primitive JSON by design.** `JSON.parse("123")` succeeds but `isJson("123")` returns `false` because the first character isn't `{` or `[`. If you need to accept primitives, call `JSON.parse` inside a `try`/`catch` directly.

---

## Object-kind checks

Five predicates for specific built-in object types. Use them when you need to branch on what kind of object you received — a `Promise`, a `Date`, a form node, etc.

| Export | Rule |
|---|---|
| `isPromise(value)` | `value instanceof Promise` — accepts subclasses too. |
| `isDate(value)` | `value instanceof Date`. Invalid dates (`new Date("nope")`) still count. |
| `isGenerator(value)` | Duck-typed: object + `.next` function + self-iterable. |
| `isFormElement(value)` | `value instanceof HTMLFormElement`. SSR-safe — returns `false` when `HTMLFormElement` is undefined. Aliased as `Is.form`. |
| `isFormData(value)` | `value instanceof FormData`. |

```ts
import { isPromise, isDate, isGenerator, isFormElement, isFormData } from "@mongez/supportive-is";

isPromise(Promise.resolve());          // true
isPromise(fetch("/api"));              // true
isPromise(async () => 1)();            // true   — async fn returns a Promise
isPromise({ then() {} });              // false  — thenable is not enough

isDate(new Date());                    // true
isDate(new Date("not real"));          // true   — invalid Date is still a Date
isDate("2024-01-01");                  // false  — string, not Date
isDate(Date.now());                    // false  — number, not Date

function* count() { yield 1; }
isGenerator(count());                  // true
isGenerator(count);                    // false  — that's the generator function

isFormElement(document.createElement("form"));  // true
isFormElement(document.createElement("div"));   // false
isFormData(new FormData());            // true
```

> **`isDate` returns `true` for invalid dates.** `new Date("not real")` is still a `Date` instance — the timestamp is `NaN`, but the type is intact. If you need "is it a *valid* Date", combine with `Number.isFinite(value.getTime())`:
>
> ```ts
> function isValidDate(v: unknown): v is Date {
>   return isDate(v) && !Number.isNaN((v as Date).getTime());
> }
> ```

---

## Environment checks

Predicates that read `navigator`, `window`, and `document`. They're safe to **import** on the server — none of them touch a global at module-eval. They throw on the server if you **call** them without a polyfill.

| Export | Reads | Use for |
|---|---|---|
| `isMobile.android()` / `.ios()` / `.iphone()` / `.ipad()` / `.ipod()` / `.windows()` / `.any()` | `navigator.userAgent` | Device-class branching. |
| `isDesktop()` | `navigator.userAgent` | `!isMobile.any()`. |
| `isMac()` | `navigator.userAgent` | Cmd-vs-Ctrl keyboard hints. |
| `isBrowser(name)` | Vendor-specific globals | One entry point, takes `"chrome" \| "safari" \| "firefox" \| "opera" \| "edge" \| "ie"`. |
| `isChrome()` / `isFirefox()` / `isSafari()` / `isOpera()` / `isIE()` / `isEdge()` | Vendor-specific globals | Direct vendor probes (faster than `isBrowser`). |

```ts
import { isMobile, isMac, isDesktop, isBrowser, isChrome } from "@mongez/supportive-is";

isMobile.any();             // true on phones (Android/iOS/Windows Phone)
isMobile.iphone();          // narrower
isDesktop();                // !isMobile.any()
isMac();                    // true on macOS

isChrome();                 // true in Chrome
isBrowser("firefox");       // same as isFirefox()
isBrowser("Safari");        // case-insensitive
```

`isMobile.any()` reads `navigator.userAgent` *every call*, which is cheap but adds up in tight render loops — cache the result if you reference it more than a couple of times per render.

### SSR safety

```ts
// Module top — safe everywhere
import { isMobile, isMac } from "@mongez/supportive-is";

// Call time — throws on the server because `navigator` is undefined
export function DeviceClass() {
  return isMobile.any();    // ← throws in Node without a polyfill
}
```

Gate the call when the same code runs in both environments:

```ts
const onClient = typeof window !== "undefined";
const device = onClient ? (isMobile.any() ? "mobile" : "desktop") : "unknown";
```

For server-side UA-aware rendering in Next.js / Remix / TanStack Start, parse `request.headers.get("user-agent")` yourself with a dedicated UA parser — these predicates are written for the browser, not for the request-handler path.

---

## Recipes

### Validate a form input is a valid email

Reach for this when a form has a required email field and you want a single function that returns a `Record<field, message>` of errors. Combine `isEmpty` (for the required check) with `isEmail` (for format) — and use `isUrl` for optional URL fields the same way.

```ts
import { isEmail, isEmpty, isUrl } from "@mongez/supportive-is";

type ContactForm = {
  name?: string;
  email?: string;
  website?: string;
};

function validate(form: ContactForm) {
  const errors: Partial<Record<keyof ContactForm, string>> = {};

  if (isEmpty(form.name))  errors.name  = "Name is required";

  if (isEmpty(form.email)) {
    errors.email = "Email is required";
  } else if (!isEmail(form.email!)) {
    errors.email = "Email is invalid";
  }

  // Website is optional, but if present it must be a full URL.
  if (!isEmpty(form.website) && !isUrl(form.website!)) {
    errors.website = "Website must be a full http(s) URL";
  }

  return errors;
}

validate({ name: "", email: "u@x.com" });
// { name: "Name is required" }

validate({ name: "Hasan", email: "not-an-email" });
// { email: "Email is invalid" }
```

### Branch logic based on environment

Reach for this when the same component needs different padding, different keyboard hints, or different navigation chrome on mobile vs desktop.

```ts
import { isMac, isMobile } from "@mongez/supportive-is";

// Cache once at module-eval (or per render) — `isMobile.any()` re-reads the UA on every call.
const onMobile = isMobile.any();
const modKey = isMac() ? "Cmd" : "Ctrl";

export function CommandBar() {
  return (
    <div style={{ padding: onMobile ? 12 : 24 }}>
      {onMobile ? <MobileNav /> : <DesktopNav />}
      <kbd>{modKey} + K</kbd> to open the command palette
    </div>
  );
}
```

> If your bundle runs in SSR, gate the call sites with `typeof window !== "undefined"` or move the read into a `useEffect` — `isMobile.any()` throws when `navigator` isn't defined.

### A deep merge that respects class instances

Reach for this when you want to merge nested config objects but **not** merge into `Date`, `Map`, `RegExp`, or class instances — those should be replaced wholesale. `isPlainObject` returns `false` for all of them.

```ts
import { isPlainObject } from "@mongez/supportive-is";

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const next = source[key];
    const current = target[key];

    if (isPlainObject(next) && isPlainObject(current)) {
      target[key] = deepMerge(current as object, next as object) as T[keyof T];
    } else {
      target[key] = next as T[keyof T];
    }
  }
  return target;
}

deepMerge(
  { user: { name: "A", joined: new Date("2024-01-01") } },
  { user: { joined: new Date("2025-01-01") } },
);
// { user: { name: "A", joined: 2025-01-01 } }
// — the Date is replaced, not merged
```

### Filter empty fields out of an outbound payload

Reach for this before sending a form payload to an API: drop the keys with no real value (so the server's `PATCH` semantics only touch what the user actually filled in), but keep `0` and `false`, which `isEmpty` correctly preserves.

```ts
import { isEmpty } from "@mongez/supportive-is";

function pickNotEmpty<T extends Record<string, unknown>>(input: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(input) as (keyof T)[]) {
    if (!isEmpty(input[k])) out[k] = input[k];
  }
  return out;
}

pickNotEmpty({
  name: "Hasan",
  bio: "",
  age: 0,
  preferences: {},
  newsletter: false,
  website: null,
});
// { name: "Hasan", age: 0, newsletter: false }
// — empty string, empty object, and null are dropped
// — 0 and false are kept (they're real values)
```

### Safely coerce user input into a URL object

Reach for this when a user pastes a link into your app and you want to parse it before rendering. `new URL(...)` throws on bad input; `isUrl` gives you a fast pre-check, and the `try`/`catch` is the belt-and-suspenders pair.

```ts
import { isUrl } from "@mongez/supportive-is";

function safeUrl(input: string): URL | null {
  if (!isUrl(input)) return null;
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

const u = safeUrl("https://example.com/search?q=mongez");
u?.searchParams.get("q");   // "mongez"

safeUrl("not a url");       // null
safeUrl("ftp://x.com");     // null  — isUrl rejects non-http(s)
```

> **For untrusted input, do the actual fetch / navigation inside a `try`/`catch`.** `isUrl` is a convenience filter, not a security gate. If you're rendering an `<a href>` on the client, also sanitize the hostname (block `javascript:`, `data:`, `file:`, etc — `isUrl` already rejects those, but defense-in-depth never hurts).

### Build a polymorphic "string-or-regex" search API

Reach for this when you want a single function that takes either a literal string or a pre-built regex — pretty much every "find" / "match" / "highlight" helper you'll ever write.

```ts
import { isRegex } from "@mongez/supportive-is";

function findAll(haystack: string, needle: string | RegExp): string[] {
  const re = isRegex(needle) ? needle : new RegExp(needle, "g");
  return Array.from(haystack.matchAll(re), (m) => m[0]);
}

findAll("alice bob alice", "alice");        // ["alice", "alice"]
findAll("alice bob alice", /\balice\b/g);   // ["alice", "alice"]
findAll("v1.2.3 and v4.5.6", /v\d+/g);      // ["v1", "v4"]
```

### Narrow a union type in TypeScript

Reach for this when you have a `string | number` (or similar) and want both branches typed correctly. `isString` is a built-in `value is string` guard. For the other predicates the parameter is typed as `any`, so you wrap them in your own type guard.

```ts
import { isString, isPlainObject } from "@mongez/supportive-is";

function format(v: string | number): string {
  if (isString(v)) {
    return v.toUpperCase();          // v narrowed to string
  }
  return v.toFixed(2);               // v narrowed to number
}

// For predicates without built-in narrowing, wrap your own:
function isRecord(v: unknown): v is Record<string, unknown> {
  return isPlainObject(v);
}

function readConfig(input: unknown) {
  if (!isRecord(input)) throw new Error("Expected a plain object");
  // input is now typed as Record<string, unknown>
  return input.port ?? 3000;
}
```

---

## Migrating from v1

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

The exported `Is` object collects the canonical predicates from this package; methods removed in v2 (`Is.cssSelector`, `Is.htmlTag`, `Is.callable`, …) stay removed.

> **Named imports are roughly 80 bytes per predicate after minify+gzip; the whole `Is` namespace is ~3 KB.** If you only use one or two predicates, named imports cut the cost by ~95%.

---

## TypeScript

The package ships its types from source — no separate `@types/` package needed. Every export is typed, and you can re-import the legacy namespace as a type when you need to:

```ts
import { isEmpty, isPlainObject, Is } from "@mongez/supportive-is";
import type { default as IsType } from "@mongez/supportive-is";

const ns: typeof Is = Is;          // value reference
type Namespace = typeof IsType;    // type-only reference (e.g. for generics)
```

Most predicates are typed as `(value: any) => boolean` because they accept anything you can hand them. The exception is `isString`, which TypeScript narrows to `value is string` automatically:

```ts
import { isString } from "@mongez/supportive-is";

function format(v: string | number): string {
  if (isString(v)) return v.toUpperCase();  // v: string
  return v.toFixed(2);                       // v: number
}
```

For the others, wrap them in your own typed guard when you need narrowing on a union:

```ts
import { isPlainObject, isPromise, isDate } from "@mongez/supportive-is";

function isRecord(v: unknown): v is Record<string, unknown> {
  return isPlainObject(v);
}

function isThenable<T>(v: unknown): v is Promise<T> {
  return isPromise(v);
}

function isDateInstance(v: unknown): v is Date {
  return isDate(v);
}
```

This wrapping pattern is one line, and you only need to do it once per predicate per project. The wrapper compiles to a single call — there's no runtime cost.

---

## Quick rules

1. **One predicate = one named import.** Don't import the default `Is` namespace just for tree-shaking convenience — bundlers can't statically prove which keys you'll touch on a namespace object.
2. **No runtime dependencies.** Every predicate is one short function. If you need date math, regex composition, or schema validation, use the right tool — not this package.
3. **DOM predicates run lazily.** Importing `isMobile` on the server is safe; calling `isMobile.android()` on the server throws because `navigator` isn't defined.
4. **Predicates are not validators.** `isUrl` / `isEmail` / `isJson` are convenience filters. For trust decisions (open the link / send to address / interpret as JSON), do the actual operation in a `try`/`catch` or pair with `zod`/`valibot`.
5. **`isEmpty` keeps `0`, `false`, and `new Date()`.** Use `value == null || value === ""` directly if you want a stricter "nullish-or-blank" check.

---

## Related packages

| Package | Use when you need |
|---|---|
| [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) | The transformations you reach for **after** the predicate passes — object/string/array helpers (`get`, `set`, `clone`, `slugify`, `groupBy`, …). |
| [`@mongez/atom`](https://github.com/hassanzohdy/atom) | Framework-agnostic reactive state — pairs with `isPlainObject` for safe atom payloads. |
| [`@mongez/events`](https://github.com/hassanzohdy/events) | Tiny event bus. |
| [`@mongez/dotenv`](https://github.com/hassanzohdy/mongez-dotenv) | Typed `.env` loader — pairs naturally with `isEmpty(env("X"))` checks at boot. |

For deeper validation (schema, transformation, custom error shapes), use `zod` or `valibot` directly — those are full validation libraries and a different scope than the predicates here.

---

## Further reading

- [`CHANGELOG.md`](./CHANGELOG.md) — release notes and the v1 → v2 migration list.
- [`llms-full.txt`](./llms-full.txt) — exhaustive single-file API surface for tool-assisted development.
- [`skills/`](./skills) — per-topic deep-dives (primitives, collections, formats, misc, environment, recipes).

---

## License

MIT — see [LICENSE](./LICENSE).
