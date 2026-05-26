---
name: mongez-supportive-is-environment
description: |
  Documents the browser and device-environment predicates — `isMobile`, `isMac`, `isDesktop`, `isBrowser`, `isChrome`, `isFirefox`, `isSafari`, `isOpera`, `isIE`, and `isEdge` — including SSR safety rules and known bugs.
  TRIGGER when: code imports `isMobile`, `isMac`, `isDesktop`, `isBrowser`, `isChrome`, `isFirefox`, `isSafari`, `isOpera`, `isIE`, or `isEdge` from `@mongez/supportive-is`; user asks "how do I detect mobile / iOS / Android", "Cmd vs Ctrl on Mac", "browser sniff for Safari/Chrome/Firefox", or "is this code running in browser vs SSR"; typical import is `import { isMobile, isMac } from "@mongez/supportive-is"` (or `Is.mobile.android()` via the legacy default export — note this package commonly exposes methods through the `Is` object too).
  SKIP: server-side user-agent parsing from request headers — use a dedicated UA parser library on `request.headers.get("user-agent")`; React-Native or Capacitor device-info APIs; CSS media queries for responsive layout; feature-detection beyond what these vendor probes cover.
---

# Environment / browser

Predicates that read `navigator`, `window`, and `document`. Importing them on the server is safe; calling them on the server throws. Don't put them in module-top-level code if your module runs in SSR.

| Predicate | Reads | Quick rule |
|---|---|---|
| `isMobile.android()` | `navigator.userAgent` | `/Android/i` |
| `isMobile.ios()` | `navigator.userAgent` | `/iPhone\|iPad\|iPod/i` |
| `isMobile.iphone()` | `navigator.userAgent` | `/iPhone/i` |
| `isMobile.ipad()` | `navigator.userAgent` | `/iPad/i` |
| `isMobile.ipod()` | `navigator.userAgent` | `/iPod/i` |
| `isMobile.windows()` | `navigator.userAgent` | `/IEMobile/i` |
| `isMobile.any()` | `navigator.userAgent` | Logical OR of `.android \| .ios \| .windows` |
| `isMac()` | `navigator.userAgent` | `/mac/i` |
| `isDesktop()` | `navigator.userAgent` | `!isMobile.any()` |
| `isBrowser(name)` | `window`, `navigator`, `document` | Vendor-feature probe by name |
| `isChrome()` | `window.chrome` | `webstore \|\| runtime` truthy |
| `isFirefox()` | `window.InstallTrigger` | Truthy |
| `isSafari()` | `navigator.userAgent` | `/Safari/i` AND NOT `/Chrome\|Chromium\|Edg\|OPR\|Android/i` |
| `isOpera()` | `window.opr?.addons`, `window.opera`, UA | OR of three signals |
| `isIE()` | `document.documentMode` | Truthy |
| `isEdge()` | `document.documentMode`, `window.StyleMedia` | Not-IE AND has StyleMedia |

## Patterns

### Conditional rendering

```ts
import { isMobile } from "@mongez/supportive-is";

function Layout() {
  return isMobile.any() ? <MobileNav /> : <DesktopNav />;
}
```

### Modifier keys

```ts
import { isMac } from "@mongez/supportive-is";

const modKey = isMac() ? "Cmd" : "Ctrl";
```

### Touch-aware sizing

```ts
import { isMobile } from "@mongez/supportive-is";

const buttonSize = isMobile.any() ? 44 : 32;   // 44px tap target on touch devices
```

## `isMobile.any()`

The implementation now calls the sibling predicates directly:

```ts
any: () => isMobile.android() || isMobile.ios() || isMobile.windows()
```

No circular reference through the `Is` namespace — `isMobile.any` is safe to import on its own without dragging in the rest of the package.

## SSR safety

```ts
// At module top — safe, never reads navigator
import { isMobile, isMac } from "@mongez/supportive-is";

// At call time — throws on the server because `navigator` is undefined
export function DeviceClass() {
  const device = isMobile.any();   // ← throws in Node without a polyfill
  return device;
}
```

Gate the call:

```ts
const isClient = typeof window !== "undefined";
const device = isClient ? (isMobile.any() ? "mobile" : "desktop") : "unknown";
```

Or parse `request.headers.get("user-agent")` on the server with a proper UA parser — these predicates are written for the browser, not for the request-handler path.

## Browser-vendor probes

Each vendor probe reads a different bespoke property. All of them are 2018-era hacks; treat the answers as advisory, not authoritative.

- `isSafari` is userAgent-based: it requires `/Safari/i` AND excludes `Chrome|Chromium|Edg|OPR|Android`. Class-based DOM polyfills (happy-dom, JSDOM) no longer trigger a false positive.
- `isOpera` reads `window.opr?.addons` (with optional chaining) plus `window.opera` and the ` OPR/` UA token — no bare `opr` global reference.

## `isBrowser(name)` vs individual probes

`isBrowser` is a single entry point that internally calls each probe:

```ts
isBrowser("chrome");    // calls isChrome()
isBrowser("firefox");   // calls isFirefox()
isBrowser("safari");    // calls isSafari()
isBrowser("CHROME");    // case-insensitive
```

Internally, `isBrowser` evaluates ALL vendor probes every call (it builds a lookup table), so it's strictly slower than the named predicates. If you only need one vendor, prefer `isChrome()` over `isBrowser("chrome")`.

## Notes

- These predicates work for "what's running this code right now", not "what device sent this request". For server-side UA parsing, use a dedicated parser library on the request headers.
- The `IEMobile` UA token is from Windows Phone 7+ — modern Windows phones (which mostly don't exist anyway) won't match.
- `isDesktop()` is `!isMobile.any()` — it doesn't distinguish "desktop" from "tablet" from "unknown".
