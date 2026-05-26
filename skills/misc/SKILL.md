---
name: mongez-supportive-is-misc
description: |
  Documents the five object-kind predicates — `isPromise`, `isDate`, `isGenerator`, `isFormElement`, and `isFormData` — including constructor-name semantics and known bugs.
  TRIGGER when: code imports `isPromise`, `isDate`, `isGenerator`, `isFormElement`, or `isFormData` from `@mongez/supportive-is`; user asks "how do I detect a Promise / Date / generator / form element / FormData", "is this thing a thenable", or "check Date vs string vs number"; typical import is `import { isPromise, isDate } from "@mongez/supportive-is"` (or `Is.promise(x)` / `Is.date(x)` / `Is.form(x)` via the legacy default `Is` namespace).
  SKIP: thenable-protocol checks for non-native Promises (these are constructor-name checks that miss subclasses — use `value instanceof Promise` instead); date math or arithmetic — use `dayjs`/`date-fns`/`Temporal`, this only tells you "is it a Date instance"; `@mongez/reinforcements` general utilities.
---

# Object kinds

Five predicates for specific built-in object types.

| Predicate | Quick rule |
|---|---|
| `isPromise(v)` | `v instanceof Promise` (recognizes subclasses) |
| `isDate(v)` | `typeof v === "object" && v instanceof Date` |
| `isGenerator(v)` | Object with `.next()` AND `[Symbol.iterator]() === v` (duck-typed) |
| `isFormElement(v)` | `v instanceof HTMLFormElement` |
| `isFormData(v)` | `v instanceof FormData` |

## `isPromise`

```ts
isPromise(Promise.resolve());              // true
isPromise(new Promise((r) => r(1)));       // true
isPromise(fetch("/api"));                  // true

isPromise({ then() {} });                  // false  (thenable, not a Promise)
isPromise(async function () {}());         // true   (async fn returns a Promise)
isPromise({});                             // false
isPromise(null);                           // false

class MyPromise extends Promise<unknown> {}
isPromise(new MyPromise((r) => r(1)));     // true   (subclasses match via instanceof)
```

## `isDate`

```ts
isDate(new Date());            // true
isDate(new Date(0));           // true
isDate(new Date("2024-01-01"));// true
isDate(new Date("not real"));  // true   (invalid Date is still a Date)

isDate("2024-01-01");          // false  (string, not Date)
isDate(Date.now());            // false  (number)
isDate({});                    // false
isDate(null);                  // false
```

Note: `isDate(new Date("invalid"))` is `true`. To check "is it a valid Date instance":

```ts
function isValidDate(v: unknown): v is Date {
  return isDate(v) && !Number.isNaN((v as Date).getTime());
}
```

## `isGenerator`

Duck-typed: an object that has a `.next` function AND whose `[Symbol.iterator]()` returns itself (the defining trait of a generator instance).

```ts
function* gen() { yield 1; }
isGenerator(gen());            // true   (generator instance)

isGenerator(gen);              // false  (the generator FUNCTION, not an instance)
isGenerator({});               // false
isGenerator(() => {});         // false
isGenerator("hello");          // false
isGenerator(null);             // false
```

## `isFormElement` (`Is.form`)

Checks `value instanceof HTMLFormElement`. Guards on `typeof HTMLFormElement === "undefined"` so it returns `false` on the server instead of throwing.

```ts
const form = document.createElement("form");
isFormElement(form);              // true
isFormElement(document.createElement("div")); // false
isFormElement({});                // false
isFormElement(null);              // false
```

Aliased as `Is.form` and `Is.formElement` — both point at the same function.

## `isFormData`

Checks `value instanceof FormData`. Throws on the server if `FormData` is undefined (it isn't on Node 18+, where `FormData` is global).

```ts
isFormData(new FormData());       // true
isFormData({});                   // false
isFormData(null);                 // false
```

## Notes

- `isPromise`, `isDate`, `isFormElement`, and `isFormData` all use `instanceof`, so subclasses match. `isGenerator` is duck-typed and matches generator instances regardless of how they were produced.
- All five return a real `false` (not the operand) for non-matches — safe to compare with `=== false` or `!`.
- For Promise-shaped checks (the *thenable protocol* — anything with a `.then(onFulfill, onReject)` method), use `value != null && typeof value.then === "function"` directly. `isPromise` is stricter on purpose.
