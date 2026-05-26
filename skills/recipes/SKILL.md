---
name: mongez-supportive-is-recipes
description: |
  Idiomatic composition patterns for `@mongez/supportive-is` predicates, covering form validation, deep merge, empty filtering, mobile-aware UI, keyboard shortcuts, URL coercion, polymorphic APIs, and TypeScript type narrowing.
  TRIGGER when: code combines multiple `@mongez/supportive-is` imports (e.g. `isEmpty` + `isEmail` + `isUrl` for forms, or `isPlainObject` for deep merge); user asks "how do I validate a form with supportive-is", "deep merge that respects class instances", "filter out empty values", "Cmd vs Ctrl shortcut", "polymorphic string-or-regex argument", or "TS type narrowing with isString"; typical import is `import { isEmpty, isEmail, isUrl } from "@mongez/supportive-is"` — combining several predicates in one module.
  SKIP: single-predicate questions — use the category-specific skill (`mongez-supportive-is-primitives`/`-collections`/`-formats`/`-misc`/`-environment`); React-specific form-state libraries like `react-hook-form` or `formik`; `@mongez/reinforcements` recipes for object/array transformations.
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

> Heads up: `isEmpty({ a: 1 })` returns `true` due to a known bug — see [`collections.md`](./collections.md#isempty) for the workaround if your input can contain plain-object values.

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

> Heads up: `isUrl("https://google.")` returns `true` due to a known bug. If your input is untrusted, add a TLD-segment check after the URL constructor — see [`formats.md`](./formats.md#isurl).

## Polymorphic API — string or regex

```ts
import { isRegex } from "@mongez/supportive-is";

function find(haystack: string, needle: string | RegExp) {
  const re = isRegex(needle) ? needle : new RegExp(needle, "g");
  return Array.from(haystack.matchAll(re), (m) => m[0]);
}
```

## Type narrowing in TypeScript

Vanilla `isString` is a type guard out of the box:

```ts
import { isString } from "@mongez/supportive-is";

function greet(v: string | number) {
  if (isString(v)) {
    return `Hello, ${v.toUpperCase()}`;  // v is narrowed to string here
  }
  return `Number: ${v.toFixed(2)}`;       // v is narrowed to number here
}
```

For the others, TypeScript doesn't infer narrowing from the current signatures (the parameter is `any`). Either use `as` after the check or wrap with your own typed guard:

```ts
import { isPlainObject } from "@mongez/supportive-is";

function isObjLike<T extends object>(v: unknown): v is T {
  return isPlainObject(v);
}
```
