---
name: mongez-supportive-is-overview
description: |
  High-level introduction to @mongez/supportive-is — a tree-shakable library of ~60 type and shape predicates with server-safe imports.
---

# @mongez/supportive-is — Overview

A small library of **type and shape predicates** — `isString`, `isEmpty`, `isUrl`, `isPromise`, `isMobile.*`, and friends. Each one is a named export, so bundlers drop the ones you don't use. Pure predicates run anywhere; DOM-touching predicates read globals lazily so server-side imports stay safe.

## Highlighted features

<div class="mongez-highlights">

<div class="mongez-highlight" data-accent="ice">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  <h3>~60 named predicates</h3>
  <p>One named export per predicate — <code>isString</code>, <code>isEmail</code>, <code>isUrl</code>, <code>isPromise</code>, <code>isPlainObject</code>, dozens more.</p>
</div>

<div class="mongez-highlight" data-accent="ice">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>
  <h3>Tree-shake to ~80 bytes</h3>
  <p><code>sideEffects: false</code> + per-predicate exports. Pull <code>isEmail</code> alone and ship ~80 bytes, not the whole 3KB bag.</p>
</div>

<div class="mongez-highlight" data-accent="fire">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  <h3>Server-safe imports</h3>
  <p>DOM/browser predicates read <code>navigator</code> / <code>window</code> / <code>document</code> lazily. Safe to import on the server; <code>isFormElement</code> returns <code>false</code> there instead of throwing.</p>
</div>

<div class="mongez-highlight" data-accent="bolt">
  <svg class="mongez-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <h3>"Smart" emptiness</h3>
  <p><code>isEmpty</code> collapses <code>null</code> / <code>undefined</code> / <code>""</code> / <code>[]</code> / <code>{}</code> / Maps / Sets into one check. <code>0</code> and <code>false</code> are deliberately NOT empty.</p>
</div>

</div>

## Install

```sh
npm install @mongez/supportive-is
# or: yarn add @mongez/supportive-is
# or: pnpm add @mongez/supportive-is
```

## Quick peek

```ts
import { isEmail, isEmpty, isPlainObject, isUrl } from "@mongez/supportive-is";

isEmail("user@example.com");   // true
isEmpty({});                   // true
isEmpty(0);                    // false  — zero is a real value
isPlainObject(new Date());     // false  — Date is an instance, not a literal
isUrl("https://example.com");  // true
```

Tree-shakable predicates — import only what you use.

## Mental model

| Concept | What it means |
|---|---|
| **Pure predicates** | Single-argument functions: take a value, return boolean-ish. No side effects, no allocation. |
| **`Is` namespace** | A bag of references to the same functions, kept for v1 compatibility. Doesn't tree-shake — prefer named imports. |
| **Environment probes** | Touch `navigator` / `window` / `document` at call time. Server-safe to import, server-unsafe to call. |
| **"Smart" emptiness** | `isEmpty` collapses null / undefined / "" / [] / {} / `new Map()` / `new Set()` into one check, with `0` and `false` deliberately not empty. |

## Scope boundaries

| Concern | Lives in | Why |
|---|---|---|
| General object/string/array helpers | [`@mongez/reinforcements`](/reinforcements/overview/) | Different package, different scope |
| Schema validation (`z.string().email()`) | `zod`, `valibot` | Predicates are guards, not validators |
| HTML sanitization | `DOMPurify` | Regex-based stripping is a footgun |

## Where to go next

- **[Primitives](../primitives/)** — `isString`, `isNumber`, `isBoolean`, `isFunction`, etc.
- **[Collections](../collections/)** — `isArray`, `isPlainObject`, `isMap`, `isSet`, `isEmpty`
- **[Formats](../formats/)** — `isEmail`, `isUrl`, `isJson`, `isIp`
- **[Environment](../environment/)** — `isBrowser`, `isMobile`, `isMac`, vendor probes
- **[Misc](../misc/)** — edge-case predicates
- **[Recipes](../recipes/)** — composition patterns
