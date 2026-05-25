---
name: mongez-supportive-is-formats
description: Documents the five string-format predicates — isRegex, isValidId, isJson, isUrl, and isEmail — including their rules, limitations, and known bugs.
when_to_use: User calls isRegex(), isValidId(), isJson(), isUrl(), or isEmail() from @mongez/supportive-is, or asks about URL validation, email checking, JSON detection, HTML id validation, or regex-vs-string branching.
---

# Formats

Five string-format predicates. **None of them are security gates** — they're convenience filters. For validation that needs to be trustworthy (auth flows, redirect targets, stored emails), use a real validator like `zod` plus a domain-specific library.

| Predicate | Quick rule |
|---|---|
| `isRegex(v)` | RegExp instance / literal |
| `isValidId(v)` | Valid HTML `id` attribute |
| `isJson(v)` | Valid JSON string starting with `{` or `[` |
| `isUrl(v)` | `http(s)://` URL with a dotted hostname |
| `isEmail(v)` | Standard email regex |

## `isRegex`

```ts
isRegex(/x/);                  // true
isRegex(/abc/gi);              // true
isRegex(new RegExp("x"));      // true

isRegex("/x/");                // false  (string, not RegExp)
isRegex("x");                  // false
isRegex(null);                 // null   (falsy non-boolean)
```

Useful for "did the caller pass a regex or a string" branches:

```ts
function match(pattern: string | RegExp, text: string) {
  const re = isRegex(pattern) ? pattern : new RegExp(pattern);
  return re.test(text);
}
```

## `isValidId` (`Is.validHtmlId`)

Matches `/^[A-Za-z]+[\w\-:.]*$/`. Letters start, followed by word characters / dashes / colons / dots. Wrapped in `Boolean(...)` so falsy inputs return real `false`.

```ts
isValidId("base-id");          // true
isValidId("BASE-ID");          // true
isValidId("has.dots");         // true
isValidId("has:colon");        // true
isValidId("has_underscore");   // true
isValidId("has-number-3");     // true

isValidId("1starts-with-digit");      // false
isValidId("_starts-with-underscore"); // false
isValidId("has,comma");               // false
isValidId("has spaces");              // false
isValidId("");                        // false
isValidId(null);                      // false  (real boolean!)
```

## `isJson`

Valid JSON string starting with `{` or `[`. Doesn't accept primitive JSON values (`"true"`, `"null"`, `"123"`, `'"hello"'`) — only objects and arrays.

```ts
isJson('{"name":"John"}');     // true
isJson("[]");                  // true
isJson("[1,2,3]");             // true
isJson('{"nested":{"a":1}}');  // true

isJson("");                    // false
isJson("12");                  // false  (numeric JSON, but rejected by prefix)
isJson('"hello"');             // false  (string JSON, same reason)
isJson("null");                // false
isJson("true");                // false
isJson("{name:1}");            // false  (unquoted key)
isJson(null);                  // false
isJson({});                    // false  (non-string)
isJson([]);                    // false
```

Worth knowing the prefix gate exists: `JSON.parse("12")` would succeed but `isJson("12")` returns `false`. If you need to accept primitives, use `try { JSON.parse(value); return true } catch { return false }` directly.

## `isUrl`

Tries to construct `new URL(value)`, then checks:
1. Protocol is `http:` or `https:` (no FTP, file, data, etc.)
2. Hostname contains a `.`
3. Hostname length > position of the first `.`

```ts
isUrl("https://google.com");          // true
isUrl("http://example.com:8080");     // true
isUrl("https://sub.example.co.uk");   // true
isUrl("https://example.com/p?q=1");   // true

isUrl("google.com");                  // false  (no scheme)
isUrl("www.google.com");              // false
isUrl("ftp://example.com");           // false  (wrong scheme)
isUrl("file:///etc/passwd");          // false
isUrl("javascript:alert(1)");         // false
isUrl("");                            // false
isUrl(null);                          // false
isUrl(undefined);                     // false
isUrl(12);                            // false
```

> **BUGS (`src/index.ts:149`)**:
> - `isUrl("https://google.")` returns `true`. The URL parser accepts it, and the hostname check (`length > indexOf(".")`) doesn't require a non-empty TLD label.
> - `isUrl("https://google..com")` returns `true`. Empty labels in the middle aren't caught.
>
> If you're using `isUrl` to decide whether to render a link, this is mostly OK. If you're using it to validate untrusted input, **add another check**: `url.hostname.split(".").every(part => part.length > 0)` after `new URL(value)`.

## `isEmail`

Standard email regex from RFC 5322 (the practical subset most projects use).

```ts
isEmail("user@example.com");       // true
isEmail("a.b.c@example.co.uk");    // true
isEmail("u+tag@example.com");      // true
isEmail("user-name@sub.example.com"); // true

isEmail("user");                   // false
isEmail("user@");                  // false
isEmail("@example.com");           // false
isEmail("a@b");                    // false   (no TLD with ≥ 2 letters)
isEmail("a b@example.com");        // false
isEmail("");                       // false
isEmail(null);                     // false   (regex coerces non-strings to false)
isEmail(undefined);                // false
isEmail(12);                       // false
```

> **BUG (`src/index.ts:168`)**: matches single-element arrays. `RegExp.prototype.test` coerces with `String()` and `["x@y.com"].toString() === "x@y.com"`. So `isEmail(["x@y.com"]) === true`. If your input could be an array (e.g. a query-string parser that returns `string | string[]`), gate it yourself: `typeof v === "string" && isEmail(v)`.

## Notes

- These are predicates, not validators. They tell you "does this look like X". For trust decisions (open the link / send to address / interpret as JSON), do the actual operation in a `try/catch`.
- `isJson` will reject valid primitive JSON (`"123"`, `"true"`, `"null"`, `'"hello"'`). This is intentional but easy to miss.
- `isUrl` rejects schemes other than `http(s):`. Use the URL constructor directly if you need to accept `mailto:` or `tel:` URIs.
