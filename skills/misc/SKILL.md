---
name: mongez-supportive-is-misc
description: Documents the five object-kind predicates — isPromise, isDate, isGenerator, isFormElement, and isFormData — including constructor-name semantics and known bugs.
when_to_use: User calls isPromise(), isDate(), isGenerator(), isFormElement(), or isFormData() from @mongez/supportive-is, or asks about detecting Promise instances, Date objects, generator functions, HTML form elements, or FormData objects.
---

# Object kinds

Five predicates for specific built-in object types. None of them work on subclasses (they're all constructor-name checks).

| Predicate | Quick rule |
|---|---|
| `isPromise(v)` | `v.constructor.name === "Promise"` |
| `isDate(v)` | `typeof v === "object" && v.constructor === Date` |
| `isGenerator(v)` | `v.constructor.name === "GeneratorFunction"` (broken — see below) |
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
isPromise(null);                           // null   (falsy non-boolean)
```

> **BUG (`src/index.ts:87`)**: subclasses don't match (`class MyPromise extends Promise`). The constructor name of an instance is `"MyPromise"`, not `"Promise"`. Use `value instanceof Promise` if you need to catch subclasses.

## `isDate`

```ts
isDate(new Date());            // true
isDate(new Date(0));           // true
isDate(new Date("2024-01-01"));// true
isDate(new Date("not real"));  // true   (invalid Date is still a Date)

isDate("2024-01-01");          // false  (string, not Date)
isDate(Date.now());            // false  (number)
isDate({});                    // false
isDate(null);                  // null
```

Note: `isDate(new Date("invalid"))` is `true`. To check "is it a valid Date instance":

```ts
function isValidDate(v: unknown): v is Date {
  return isDate(v) && !Number.isNaN((v as Date).getTime());
}
```

## `isGenerator`

```ts
isGenerator({});               // false
isGenerator(() => {});         // false
isGenerator("hello");          // false
isGenerator(null);             // null
```

> **BUG (`src/index.ts:99`)**: never matches generator INSTANCES. In V8, `gen().constructor.name` is `""`, not `"GeneratorFunction"`. The canonical detection is:
>
> ```ts
> function isReallyGenerator(v: unknown): boolean {
>   return Object.prototype.toString.call(v) === "[object Generator]";
> }
> ```
>
> Or duck-type:
>
> ```ts
> function isReallyGenerator(v: any): boolean {
>   return v != null && typeof v.next === "function" && typeof v[Symbol.iterator] === "function";
> }
> ```

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

- All five use constructor-identity or constructor-name checks. None of them recognize subclasses (except `isFormElement` / `isFormData` which use `instanceof` — those DO follow the prototype chain).
- The constructor-name pattern (`v && v.constructor.name === "X"`) is the source of the falsy-return issue: `isPromise(null)` returns `null`, not `false`. See [`collections.md`](./collections.md#falsy-return-pattern) for the boolean-coercion fix.
- For Promise-shaped checks (the *thenable protocol* — anything with a `.then(onFulfill, onReject)` method), use `value != null && typeof value.then === "function"` directly. `isPromise` is stricter on purpose.
