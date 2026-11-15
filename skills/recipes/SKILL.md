---
name: mongez-supportive-is-recipes
description: |
  Idiomatic composition patterns for `@mongez/supportive-is` predicates, covering form validation, deep merge, empty filtering, mobile-aware UI, keyboard shortcuts, URL coercion, polymorphic APIs, and TypeScript type narrowing.
---

# Recipes

Idiomatic compositions across `@mongez/supportive-is` predicates.

## Form validation

```ts
import { isEmpty, isEmail, isUrl } from "@mongez/supportive-is";

type ContactForm = {
  name?: string;
  email?: string;
  website?: string;
};

function validate(form: ContactForm) {
  const errors: Partial<Record<keyof ContactForm, string>> = {};

  if (isEmpty(form.name))  errors.name = "Name is required";
  if (isEmpty(form.email)) errors.email = "Email is required";
  else if (!isEmail(form.email!)) errors.email = "Email is invalid";

  // Website is optional, but if present must be a URL.
  if (!isEmpty(form.website) && !isUrl(form.website!)) {
    errors.website = "Website must be a full http(s) URL";
  }
  return errors;
}
```

## A deep merge that respects class instances

`isPlainObject` is the right predicate for "should I merge into this, or replace it?" — it returns `false` for Dates, Maps, Sets, and class instances, all of which want to be replaced, not merged.

```ts
import { isPlainObject } from "@mongez/supportive-is";

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const next = source[key];
    const current = target[key];
    if (isPlainObject(next) && isPlainObject(current)) {
      target[key] = deepMerge(
        current as object,
        next as object,
      ) as T[keyof T];
    } else {
      target[key] = next as T[keyof T];
    }
  }
  return target;
}
```

## Filtering nullable / empty entries

```ts
import { isEmpty } from "@mongez/supportive-is";

function pickNotEmpty<T extends Record<string, unknown>>(input: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(input) as (keyof T)[]) {
    if (!isEmpty(input[k])) out[k] = input[k];
  }
  return out;
}

pickNotEmpty({ a: "x", b: "", c: null, d: 0 });
// { a: "x", d: 0 }   — note that 0 is kept (it's not empty)
```

## Mobile-aware UI without a state library

```ts
import { isMobile } from "@mongez/supportive-is";

// Read once and cache — `isMobile.any()` re-reads `navigator.userAgent` on
// every call, which is cheap but adds up in tight render loops.
const isMobileDevice = isMobile.any();

export function Card() {
  return (
    <article style={{ padding: isMobileDevice ? 12 : 24 }}>
      ...
    </article>
  );
}
```

## Cmd vs Ctrl for keyboard shortcuts

```ts
import { isMac } from "@mongez/supportive-is";

const MOD = isMac() ? "Cmd" : "Ctrl";

export function SaveHint() {
  return <kbd>{MOD} + S</kbd>;
}
```

## Safe URL coercion

`new URL("...")` throws on bad input. Wrap with `isUrl` first:

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

const u = safeUrl("https://example.com/page?q=1");
u?.searchParams.get("q");  // "1"
```

## Polymorphic API — string or regex

```ts
import { isRegex } from "@mongez/supportive-is";

function find(haystack: string, needle: string | RegExp) {
  const re = isRegex(needle) ? needle : new RegExp(needle, "g");
  return Array.from(haystack.matchAll(re), (m) => m[0]);
}
```

## Type narrowing in TypeScript

The type-checking guards are declared type predicates on `unknown`, so no wrapper is needed:

```ts
import { isString, isPlainObject } from "@mongez/supportive-is";

function greet(v: string | number) {
  if (isString(v)) {
    return `Hello, ${v.toUpperCase()}`;  // v is narrowed to string here
  }
  return `Number: ${v.toFixed(2)}`;       // v is narrowed to number here
}

function readPort(input: unknown) {
  if (!isPlainObject(input)) throw new Error("Expected a plain object");
  return input.port ?? 3000;                // input: Record<string, unknown>
}
```

| Function | Narrows `unknown` to |
|---|---|
| `isString` | `string` |
| `isPlainObject` | `Record<string, unknown>` |
| `isObject` | `object` |
| `isDate` | `Date` |
| `isRegex` | `RegExp` |
| `isPromise` | `Promise<unknown>` |
| `isIterable` | `Iterable<unknown>` |
| `isGenerator` | `IterableIterator<unknown>` (duck-typed: `next()` plus self-iterable) |
| `isScalar` | `string \| boolean \| number \| symbol \| bigint` |
| `isPrimitive` | `string \| boolean \| number \| bigint` |
| `isFormElement` | `HTMLFormElement` (`object` when the DOM lib is not in your compilation) |
| `isFormData` | `FormData` (`object` when `FormData` is not in your compilation) |

`isInt`, `isFloat`, `isNumeric`, `isJson`, `isUrl`, `isEmail`, `isValidId`, `isEmpty` and the environment checks (`isMobile`, `isBrowser`, ...) return plain `boolean`. They accept a *subset* of their base type, so a predicate would narrow the false branch wrongly: with `n: number`, `if (isInt(n)) {} else { n }` would make `n` `never` although `1.5` lands in the else branch. `isNumeric` also accepts numeric strings and single-element arrays (`String([5])` is `"5"`), so it cannot be typed as `number` either.

Caveats: `isObject` and `isPlainObject` are structural, so a function-typed union member is dropped from the false branch of `isObject` even though it returns `false` for functions. `isRegex` is a brand check (the built-in `RegExp.prototype.source` getter), so RegExp subclasses and RegExps from another realm (iframe, `vm` context) return `true`, and an object that fakes `constructor.name` or `Symbol.toStringTag` returns `false`.
