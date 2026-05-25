# Changelog — @mongez/supportive-is

## Unreleased

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

### Removed

- `tests/` directory (replaced by `src/__tests__/`).
- Stale devDeps listed above.

### Dependency notes

- Dropped: `jest`, `ts-jest`, `@types/jest`, `jest-esm-jsx-transform`. The package no longer carries a Jest config.
- Added: `vitest@^2.1`, `happy-dom@^15`.
- Bumped: `typescript@^4.5` → `^5.4`.
- No runtime dependencies. The package remains zero-dep.

### Tests

```
89 passing + 0 skipped = 89 total across 5 files
```
