---
name: mongez-supportive-is-overview
description: |
  High-level introduction to `@mongez/supportive-is` — what it is, how to install and import it, its mental model, and where its scope ends.
  TRIGGER when: code imports anything from `@mongez/supportive-is` (named export OR default `Is`); user asks "what does @mongez/supportive-is do", "how do I install or import supportive-is", "named exports vs the Is namespace", or "which predicates does this package give me"; typical import is `import { isEmpty } from "@mongez/supportive-is"` for tree-shaking, or legacy `import Is from "@mongez/supportive-is"; Is.empty(x)` — note this package commonly exports a default `Is` object with methods, not many top-level functions.
  SKIP: deep-dive on a specific predicate group (use the category-specific `mongez-supportive-is-*` skill — primitives, collections, formats, misc, environment); `@mongez/reinforcements` general object/string/array utilities which are transformations not predicates; schema validation via `zod`/`valibot`.
---

# Overview

`@mongez/supportive-is` is a small library of **type and shape predicates** — `isString`, `isEmpty`, `isUrl`, `isPromise`, `isMobile.*`, and friends. Each one is a named export so bundlers can drop the ones you don't use.

The library has no runtime dependencies. Pure predicates work anywhere (Node, browser, Deno, edge runtimes). DOM-touching predicates (`isFormElement`, `isFormData`, `isMobile.*`, `isMac`, `isBrowser`, vendor probes) read globals lazily — they're safe to import on the server but throw if invoked there.

## Install

```sh
yarn add @mongez/supportive-is
```

## Import pattern

```ts
import {
  isString,
  isNumeric,
  isEmpty,
  isUrl,
  isEmail,
  isPlainObject,
  isPromise,
  isMobile,
  // …
  Is,                    // optional — legacy default export
} from "@mongez/supportive-is";
```

Both `import { isEmpty } from "@mongez/supportive-is"` and `import Is from "@mongez/supportive-is"; Is.empty(x)` work. The former tree-shakes; the latter doesn't.

## Mental model

| Concept | Mental model |
|---|---|
| **Pure predicates** | Single-argument functions: take a value, return a boolean-ish. No side effects, no allocation. |
| **`Is` namespace** | A bag of references to the same functions, kept for v1 compatibility. |
| **Environment probes** | Touch `navigator`/`window`/`document` at call time. Server-safe to import, server-unsafe to call. |
| **"Smart" emptiness** | `isEmpty` collapses null / undefined / "" / [] / {} / `new Map()` / `new Set()` into one check, with `0` and `false` deliberately not empty. |

## Scope boundaries

| Concern | Lives in | Why |
|---|---|---|
| General object/string/array helpers (`get`, `set`, `clone`, `slugify`, …) | [`@mongez/reinforcements`](https://github.com/hassanzohdy/reinforcements) | Different package, different scope |
| Atom state primitives | [`@mongez/atom`](https://github.com/hassanzohdy/atom) | Stateful — opposite of pure predicates |
| Schema validation (`z.string().email()`) | `zod`, `valibot` | Out of scope — these predicates are guards, not validators |
| Date math | `dayjs`, `date-fns`, `Temporal` | `isDate` only tells you "is it a Date instance" |
| HTML sanitization | `DOMPurify` | Regex-based stripping is a footgun |
| Server-side user-agent parsing | Parse `request.headers.get("user-agent")` yourself | Browser predicates read `navigator` and crash on the server |

## Why "one named export each"

`Is.empty(...)` and `import { isEmpty } from "@mongez/supportive-is"` resolve to the same function. The difference shows up in your bundle: if you import `Is` you take the full set, because the bundler can't statically prove which keys you'll touch. If you import named predicates, the rest fall away.

```ts
// Whole namespace — ~3 KB in the bundle
import Is from "@mongez/supportive-is";
Is.empty(x);

// Named — ~80 bytes per predicate
import { isEmpty } from "@mongez/supportive-is";
isEmpty(x);
```

The package is marked `sideEffects: false` so tree-shakers can drop unused exports for real.
