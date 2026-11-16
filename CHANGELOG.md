# Changelog — @mongez/supportive-is

## [3.0.1] — 2026-11-16

Security fixes for predicates that apps use as validation gates. Type signatures are unchanged. The return value changes only for the inputs listed below.

### Fixed

- **`isNumeric` rejects values that overflow to `Infinity`.** `isNumeric("1e400")` and `isNumeric("9".repeat(400))` were `true`, although `Number(value)` is `Infinity`; they are now `false`. `isNumeric` also never throws: `Object.create(null)` threw `TypeError: Cannot convert object to primitive value` and now returns `false`.
- **`isPlainObject` checks the prototype instead of `constructor.name`,** which untrusted data controls. A JSON object with a `constructor` key (`JSON.parse('{"constructor":"x"}')`) is now plain; it was not. An instance of a user class named `Object` is no longer plain. Null-prototype and cross-realm plain objects are still plain.
- **`isRegex` can no longer be spoofed** by `{ constructor: { name: "RegExp" } }` (or a `Symbol.toStringTag` of `"RegExp"`): it is now a brand check through the built-in `RegExp.prototype.source` getter. RegExp subclasses and cross-realm RegExps return `true`; `Object.create(RegExp.prototype)`, which is not a real RegExp, now returns `false`.
- **`isEmail` is stricter:**
  - Quoted local parts (`"a b"@x.com`, `"<a>"@x.com`, `"a@b.com"@x.com`) are rejected, because they let `<`, `>` and spaces into an "email" field.
  - Domain labels that start or end with `-` are rejected.
  - Addresses longer than 254 characters, or with a local part longer than 64, are rejected.
  - Normal addresses, `+tag` addresses, subdomains and IP literals are unchanged.
- **`isPlainObject(Object.prototype)` and `isPlainObject(Array.prototype)` return `false`,** including another realm's. A recursive walker gated on `isPlainObject` could otherwise descend into and write onto `Object.prototype`. The same holds for any object that is its own constructor's `prototype` (for example `Map.prototype`, or the `prototype` of a class or function), which also returned `true` before.

### Changed

- Development tooling only: pnpm 12 with a standalone `pnpm-lock.yaml`, TypeScript 7, Vite 8 and Vitest 5. CI runs on Node 22 and 24. `tsconfig.json` sets `moduleResolution: "bundler"`.
- The test DOM is now `happy-dom` ^21.0.4, because 15.x has 1 critical, 3 high and 1 moderate advisory. It is a dev dependency only.

## [3.0.0] — 2026-09-30

The runtime is byte-for-byte the same: no predicate returns a different value for any input. This is a major release because the **types** are now stricter, and stricter narrowing breaks a common pattern (see *Breaking (types only)*).

### Changed

- **Twelve checkers are now TypeScript type predicates** (`value is T`), so `tsc` narrows in both branches. Every checker's parameter is `unknown` instead of `any`.

  | Function | Predicate |
  |---|---|
  | `isString` | `value is string` |
  | `isPlainObject` | `value is Record<string, unknown>` |
  | `isObject` | `value is object` |
  | `isDate` | `value is Date` |
  | `isRegex` | `value is RegExp` |
  | `isPromise` | `value is Promise<unknown>` |
  | `isIterable` | `value is Iterable<unknown>` |
  | `isGenerator` | `value is IterableIterator<unknown>` (duck-typed: `next()` plus self-iterable; `Generator`'s `return`/`throw` are not verified) |
  | `isScalar` | `value is string \| boolean \| number \| symbol \| bigint` |
  | `isPrimitive` | `value is string \| boolean \| number \| bigint` |
  | `isFormElement` | `value is HTMLFormElement` (falls back to `object` when the DOM lib is not in the consumer's compilation, so the typings never require `lib: ["dom"]`) |
  | `isFormData` | `value is FormData` (falls back to `object` when `FormData` is not declared) |

- **Kept as plain `boolean`, on purpose:** `isInt`, `isFloat`, `isNumeric`, `isJson`, `isUrl`, `isEmail`, `isValidId`, `isEmpty` and the environment checks. These accept a *subset* of their base type, so a predicate would narrow the false branch wrongly: with `n: number`, `if (isInt(n)) {} else { n }` would make `n` `never` although `1.5` takes the else branch. `isNumeric` additionally accepts numeric strings and single-element arrays (`String([5]) === "5"`), so neither `number` nor `` number | `${number}` `` would be true. `isEmpty` is not a test for one type.
- Known limits of the predicates, documented in the README: `isObject` returns `false` for functions although `Function` is assignable to `object`; `isRegex` checks `constructor.name === "RegExp"`, so a RegExp subclass under another class name returns `false`.

### Breaking (types only)

- A value typed `any` is narrowed by a type predicate. Code such as `if (isPlainObject(data)) { data.user.name }` (with `data: any`, e.g. a `JSON.parse` result) compiled before and now fails with `'data.user' is of type 'unknown'`; the same applies to `isObject`, `isIterable` and `isPromise` on `any`. Type the value (`const data: Payload`), or narrow further after the guard. No runtime change, no change for `unknown`- or union-typed values.

### Added

- Exported helper types: `ScalarValue`, `PrimitiveValue`, `FormElementType`, `FormDataType`.
- Type-level tests (`src/__tests__/types.test-d.ts`, `expectTypeOf`, run by `vitest` typecheck mode) and runtime narrowing tests (`src/__tests__/guards.test.ts`). `npm run test:types` runs `tsc --noEmit`.

### Docs

- README, `llms.txt`, `llms-full.txt` and the skills describe the predicates and the boolean-only checkers. They previously claimed `isString` (or nothing) was a type guard.

### Tests

```
102 runtime tests across 6 files + 6 type-level tests (types.test-d.ts) = 108
```

## [2.1.4] — 2026-08-17

### Security

- **`isValidId` regex is now linear** (`src/index.ts:50`). The previous pattern nested a quantified group inside another quantifier, giving a match cost that grows quadratically-to-exponentially in the input length — so a long crafted string passed to `Is.validHtmlId(...)` pinned the thread instead of returning `false`. A validator is exactly the surface that gets pointed at untrusted input, which is what makes this worth a release. The pattern is now `/^[A-Za-z][\w\-:.]*$/`: a single unambiguous character class with no nested quantifier, so there is nothing to backtrack over. Accepted and rejected values are unchanged.

## [2.1.3] — 2026-05-26

### Fixed

- **`isNumeric` — stateful regex** (`src/index.ts:10`). Dropped the `/g` flag so `RegExp.prototype.test` no longer advances `lastIndex` between calls. Repeated calls on the same input now return a stable `true`.
- **`isInt` — rejects negative integers** (`src/index.ts:16`). Replaced the regex with `Number.isInteger(value)` so signed integers are accepted.
- **`isInt` — rejects integers in scientific notation** (`src/index.ts:16`). Same fix — `Number.isInteger(1e21)` correctly returns `true`.
- **`isFloat` — rejects negative floats / unescaped `.` in regex** (`src/index.ts:22`). Regex is now `/^-?\d+\.\d+$/` (sign branch + escaped `.`), gated on `Number.isFinite` so `NaN`/`Infinity` are rejected.
- **`isObject`, `isRegex`, `isPlainObject`, `isPromise`, `isDate`, `isGenerator`, `isIterable` — non-boolean falsy returns** (multiple lines). Predicates now coerce with `Boolean(...)` / explicit `value !== null` checks instead of leaking the raw falsy value (`null`, `undefined`, `0`, `""`).
- **`isPlainObject` — throws on `Object.create(null)`** (`src/index.ts:39`). Now short-circuits to `true` when the prototype is `null`; otherwise falls back to the `constructor?.name === "Object"` check with an optional chain.
- **`isPromise` — doesn't recognize subclasses** (`src/index.ts:79`). Switched to `value instanceof Promise`, which accepts subclasses while still rejecting bare thenables.
- **`isGenerator` — never matches a generator instance** (`src/index.ts:91`). Replaced the constructor-name check with a duck-typed test: object + `.next` function + self-iterable (`value[Symbol.iterator]() === value`).
- **`isEmpty` — returns `true` for non-empty plain objects** (`src/index.ts:103`). Added an `Object.keys(value).length === 0` fast-path for non-iterable plain objects, so `{ a: 1 }` is now correctly reported as non-empty.
- **`isEmpty` — returns `true` for `new Date()`** (`src/index.ts:103`). Constructed Date instances now short-circuit to `false`.
- **`isEmpty` — returns `true` for `NaN`** (`src/index.ts:103`). `NaN` is now treated as non-empty (it's still a numeric value).
- **`isIterable` — returns the empty string instead of `true` for `""`** (`src/index.ts:64`). Replaced the truthy guard with explicit null/undefined checks so the empty string flows through to the `Symbol.iterator` test.
- **`isUrl` — accepts trailing dots and `..`** (`src/index.ts:142`). Hostname is now split on `.` and rejected if any label is empty, so `https://google.` and `https://google..com` both return `false`.
- **`isEmail` — matches single-element arrays** (`src/index.ts:160`). Added a `typeof value === "string"` guard before the regex test, so arrays / non-strings can't sneak through via `String()` coercion.
- **`isSafari` — false-positives on class-based DOM polyfills** (`src/index.ts:273`). Replaced the `/constructor/i.test(window.HTMLElement)` heuristic with a userAgent-based detector that requires `Safari` AND excludes `Chrome|Chromium|Edg|OPR|Android`.
- **`isOpera` — references bare `opr` global** (`src/index.ts:288`). Switched to `window.opr?.addons` so the predicate no longer risks a `ReferenceError` in strict mode.
- **`isBrowser` — duplicated buggy logic for `safari` / `opera`** (`src/index.ts:243`). The function now delegates to `isChrome()`, `isFirefox()`, `isSafari()`, `isOpera()`, `isIE()`, `isEdge()` instead of inlining (and re-introducing) the same bugs.
- **`isMobile.any` — circular self-reference through `Is`** (`src/index.ts:232`). Replaced `Is.mobile.X()` calls with direct `isMobile.X()` calls so the object no longer depends on its own export being initialized.

### Added

- **README.md** — marketing-style index with a 30-second tour, a categorized predicate table, an `isEmpty` semantics section, an SSR-safety note, and a curated list of known bugs.
- **CHANGELOG.md** — this file.
- **AI kit** — `llms.txt`, `llms-full.txt`, and `skills/` cards (`README`, `overview`, `primitives`, `collections`, `formats`, `misc`, `environment`, `recipes`).
- **Test suite** — 89 passing tests across `primitives`, `collections`, `formats`, `misc`, and `environment`. The suite uses Vitest under `happy-dom` so DOM-touching predicates (`isFormElement`, `isFormData`, `isMobile.*`, `isMac`, `isBrowser`, `isChrome`/`isFirefox`/`isSafari`/`isOpera`/`isIE`/`isEdge`) can be exercised with a configurable `navigator.userAgent`.
- **CI** — GitHub Actions matrix: Node 18 / 20 / 22 on Ubuntu plus Node 20 on Windows.

### Changed

- **Test runner**: Jest → Vitest. Tests moved from `tests/` to `src/__tests__/` (matches `@mongez/atom`'s layout) and are organized by category (`primitives.test.ts`, `collections.test.ts`, `formats.test.ts`, `misc.test.ts`, `environment.test.ts`).
- **`package.json`**:
  - Description rewritten to actually describe the package ("tree-shakable type & shape predicates").
  - Added `sideEffects: false` so bundlers can drop unused exports for real.
  - Keyword list expanded from 10 generic terms to a comprehensive index of every exported predicate.
  - Removed Jest config block.
  - `devDependencies`: dropped `jest`, `ts-jest`, `@types/jest`, `jest-esm-jsx-transform`; bumped `typescript` to `^5.4`; added `vitest@^2.1` and `happy-dom@^15`.
- Dropped dev dependencies: `jest`, `ts-jest`, `@types/jest`, `jest-esm-jsx-transform`. The package no longer carries a Jest config.
- Added dev dependencies: `vitest@^2.1`, `happy-dom@^15`.
- Bumped: `typescript@^4.5` → `^5.4`.

### Removed

- `tests/` directory (replaced by `src/__tests__/`).
- Stale devDeps listed above.

### Tests

```
89 passing + 0 skipped = 89 total across 5 files
```
