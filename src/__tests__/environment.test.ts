import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isMobile,
  isMac,
  isDesktop,
  isBrowser,
  isChrome,
  isFirefox,
  isSafari,
  isOpera,
  isIE,
  isEdge,
} from "../index";

// happy-dom ships a working `navigator`, `window`, and `document` for these
// predicates. The user-agent string is configurable per-test by reassigning
// `navigator.userAgent` via Object.defineProperty.

function setUserAgent(ua: string) {
  Object.defineProperty(globalThis.navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
}

const ORIGINAL_UA = globalThis.navigator?.userAgent;

afterEach(() => {
  if (ORIGINAL_UA !== undefined) setUserAgent(ORIGINAL_UA);
});

describe("isMobile.android", () => {
  it("returns true on an Android user-agent", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5) ...");
    expect(isMobile.android()).toBe(true);
  });

  it("returns false on a desktop user-agent", () => {
    setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36");
    expect(isMobile.android()).toBe(false);
  });
});

describe("isMobile.iphone / ipad / ipod / ios", () => {
  it("detects iPhone", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    expect(isMobile.iphone()).toBe(true);
    expect(isMobile.ios()).toBe(true);
    expect(isMobile.ipad()).toBe(false);
    expect(isMobile.ipod()).toBe(false);
  });

  it("detects iPad", () => {
    setUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)");
    expect(isMobile.ipad()).toBe(true);
    expect(isMobile.ios()).toBe(true);
    expect(isMobile.iphone()).toBe(false);
  });

  it("detects iPod", () => {
    setUserAgent("Mozilla/5.0 (iPod touch; CPU iPhone OS 12_0 like Mac OS X)");
    expect(isMobile.ipod()).toBe(true);
    expect(isMobile.ios()).toBe(true);
  });

  it("returns false on a non-iOS user agent", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isMobile.iphone()).toBe(false);
    expect(isMobile.ipad()).toBe(false);
    expect(isMobile.ipod()).toBe(false);
    expect(isMobile.ios()).toBe(false);
  });
});

describe("isMobile.windows", () => {
  it("returns true on an IEMobile user-agent", () => {
    setUserAgent("Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; IEMobile/9.0)");
    expect(isMobile.windows()).toBe(true);
  });

  it("returns false otherwise", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isMobile.windows()).toBe(false);
  });
});

describe("isMobile.any", () => {
  it(
    "BUG: references the global `Is` before `export const Is` is initialized (src/index.ts:204)",
    () => {
      // `any: () => Is.mobile.android() || Is.mobile.ios() || Is.mobile.windows()`
      // uses `Is` (not `this`) — the binding is hoisted but the value is
      // assigned later in the module. At module-evaluation order this is
      // fine *after* module init, but it's still a circular self-reference
      // that breaks tree-shaking and would crash if `any()` were called
      // during the IIFE of `isMobile`. Replace with direct calls
      // (`isMobile.android()` etc).
      setUserAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5)");
      expect(isMobile.any()).toBe(true);
    },
  );

  it("returns true for android UA", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5) ...");
    // The implementation routes through the global `Is.mobile`, so we
    // exercise the happy path here (works in test environment once `Is` is
    // assigned).
    expect(isMobile.any()).toBe(true);
  });

  it("returns false for plain desktop UA", () => {
    setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36");
    expect(isMobile.any()).toBe(false);
  });
});

describe("isMac", () => {
  it("returns true on a Mac user-agent", () => {
    setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0)");
    expect(isMac()).toBe(true);
  });

  it("returns false on Windows/Linux", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isMac()).toBe(false);
    setUserAgent("Mozilla/5.0 (X11; Linux x86_64)");
    expect(isMac()).toBe(false);
  });
});

describe("isDesktop", () => {
  it("returns true on a desktop UA", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isDesktop()).toBe(true);
  });

  it("returns false on a mobile UA", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5) ...");
    expect(isDesktop()).toBe(false);
  });
});

describe("browser detection (isChrome / isFirefox / isSafari / isOpera / isIE / isEdge / isBrowser)", () => {
  // happy-dom doesn't expose the bespoke vendor properties (`window.chrome`,
  // `window.InstallTrigger`, `window.opr`, `document.documentMode`,
  // `window.StyleMedia`) so all detectors return falsy in this environment.
  // We assert the shape — that they don't throw and return a stable falsy
  // value — rather than the answer, which depends on the real browser.
  it("returns boolean-ish values without throwing", () => {
    expect(() => isChrome()).not.toThrow();
    expect(() => isFirefox()).not.toThrow();
    expect(() => isSafari()).not.toThrow();
    expect(() => isOpera()).not.toThrow();
    expect(() => isIE()).not.toThrow();
    expect(() => isEdge()).not.toThrow();
  });

  it("isBrowser returns false for vendors not exposing their probe", () => {
    // happy-dom doesn't expose `window.chrome`, `window.InstallTrigger`,
    // `window.opr`, `document.documentMode`, or `window.StyleMedia`, so the
    // corresponding probes are all falsy. (Safari's probe is exercised
    // separately because it false-positives on happy-dom — see skipped
    // BUG test below.)
    expect(isBrowser("chrome")).toBe(false);
    expect(isBrowser("firefox")).toBe(false);
    expect(isBrowser("opera")).toBe(false);
    expect(isBrowser("ie")).toBe(false);
    expect(isBrowser("edge")).toBe(false);
  });

  it("isBrowser is case-insensitive on the vendor name", () => {
    expect(isBrowser("Chrome" as "chrome")).toBe(false);
    expect(isBrowser("FIREFOX" as "firefox")).toBe(false);
  });

  it(
    "BUG: isSafari false-positives on non-Safari hosts (src/index.ts:273)",
    () => {
      // The body reduces to `/constructor/i.test(window.HTMLElement)` once
      // the second branch's `((p) => p.toString() === "[object Safari…]")(…)`
      // resolves — `.toString()` on a boolean never equals the marker
      // string. Any host whose `HTMLElement.toString()` contains the word
      // "constructor" (which is most class-based DOM polyfills, including
      // happy-dom) is reported as Safari. Switch to a userAgent-based
      // detection that actually looks for "Safari" while excluding
      // "Chrome".
      expect(isSafari()).toBe(false);
      expect(isBrowser("safari")).toBe(false);
    },
  );

  it(
    "BUG: isOpera reads `opr.addons` from a global with no declaration (src/index.ts:288)",
    () => {
      // `(!!window.opr && !!opr.addons)` references bare `opr` (not
      // `window.opr`). In strict mode this throws a ReferenceError when
      // `opr` is undefined; loose mode coerces to undefined and the short
      // circuit hides it. Either way, switch to `window.opr?.addons`.
      expect(() => isOpera()).not.toThrow();
      expect(() => isBrowser("opera")).not.toThrow();
      // happy-dom exposes no `window.opr`, no `window.opera`, and the UA
      // does not contain " OPR/", so the predicate must be exactly `false`.
      setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
      expect(isOpera()).toBe(false);
      expect(isBrowser("opera")).toBe(false);
    },
  );
});
