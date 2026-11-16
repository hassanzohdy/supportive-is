declare let window: any;
declare let document: any;

/**
 * The `HTMLFormElement` type when the DOM lib is part of the consumer's
 * compilation, otherwise the closest honest fallback (`object`). Resolving it
 * through `typeof globalThis` keeps this package's typings from requiring
 * `lib: ["dom"]` in Node-only projects.
 */
export type FormElementType = typeof globalThis extends {
  HTMLFormElement: { prototype: infer Form };
}
  ? Form
  : object;

/**
 * The `FormData` type when it is available in the consumer's compilation
 * (DOM lib or `@types/node`), otherwise `object`.
 */
export type FormDataType = typeof globalThis extends {
  FormData: { prototype: infer Data };
}
  ? Data
  : object;

/**
 * Every value `isScalar` accepts.
 */
export type ScalarValue = string | boolean | number | symbol | bigint;

/**
 * Every value `isPrimitive` accepts (note: no `symbol`, `null` or `undefined`).
 */
export type PrimitiveValue = string | boolean | number | bigint;

/**
 * Determine whether the given value is a number whatever if its data type is String or Number
 */
export function isNumeric(value: unknown): boolean {
  let text: string;

  try {
    text = String(value);
  } catch {
    // e.g. Object.create(null) or an object whose toString throws
    return false;
  }

  // "1e400" matches the shape but is Infinity, which is not a usable number
  return (
    /^[+-]?\d+(\.\d+)?([Ee][+-]?\d+)?$/.test(text) &&
    Number.isFinite(Number(text))
  );
}

/**
 * Check if the given value is int
 */
export const isInt = (value: unknown): boolean =>
  typeof value === "number" && Number.isInteger(value);

/**
 * Check if the given value is float
 */
export const isFloat = (value: unknown): boolean =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  /^-?\d+\.\d+$/.test(String(value));

const regexSourceGetter = Object.getOwnPropertyDescriptor(
  RegExp.prototype,
  "source",
)?.get;

/**
 * Check if the given value is a regex
 * Brand check: the `source` getter only accepts real RegExps (any realm,
 * subclasses included), so neither a fake `constructor.name` nor a
 * `Symbol.toStringTag` of "RegExp" can spoof it
 */
export const isRegex = (value: unknown): value is RegExp => {
  if (!value || typeof value !== "object" || !regexSourceGetter) return false;
  // RegExp.prototype passes the getter but is not a RegExp
  if (value === RegExp.prototype) return false;

  try {
    regexSourceGetter.call(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if the given value is an object
 * Arrays, dates and class instances are objects; `null` and functions are not
 */
export const isObject = (value: unknown): value is object =>
  Boolean(value) && typeof value === "object";

/**
 * Check if the given value is a plain object
 * Built-in prototypes such as `Object.prototype` and `Array.prototype` are not
 */
export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  // A built-in prototype object (`Object.prototype`, `Array.prototype`, from
  // any realm) is never plain: it is the shared prototype, not a data object.
  // It is the one object whose own `constructor` points back at it.
  if (Array.isArray(value)) return false;
  const ctor = Object.prototype.hasOwnProperty.call(value, "constructor")
    ? (value as { constructor: unknown }).constructor
    : undefined;
  if (typeof ctor === "function" && ctor.prototype === value) return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  // Cross-realm plain object (iframe, vm context): its prototype is that
  // realm's Object.prototype, which itself has a null prototype
  return (
    Object.getPrototypeOf(proto) === null &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
};

/**
 * Check if the given value is validId
 */
export const isValidId = (value: unknown): boolean =>
  Boolean(value && /^[A-Za-z][\w\-:.]*$/.test(String(value)));

/**
 * Check if the given value is a form element
 */
export const isFormElement = (value: unknown): value is FormElementType =>
  typeof HTMLFormElement === "undefined"
    ? false
    : value instanceof HTMLFormElement;

/**
 * Check if the given value is a form data
 */
export const isFormData = (value: unknown): value is FormDataType =>
  value instanceof FormData;

/**
 * Check if the given value is iterable
 */
export const isIterable = (value: unknown): value is Iterable<unknown> =>
  value !== null &&
  value !== undefined &&
  typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
    "function";

/**
 * Check if the given value is a scalar value
 */
export const isScalar = (value: unknown): value is ScalarValue =>
  ["string", "boolean", "number", "symbol", "bigint"].includes(typeof value);

/**
 * Check if the given value is a string
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/**
 * Check if the given value is a primitive value
 * (string, boolean, number or bigint — symbols, `null` and `undefined` are not)
 */
export const isPrimitive = (value: unknown): value is PrimitiveValue =>
  ["string", "boolean", "number", "bigint"].includes(typeof value);

/**
 * Check if the given value is a promise
 */
export const isPromise = (value: unknown): value is Promise<unknown> =>
  Boolean(value) && value instanceof Promise;

/**
 * Check if the given value is a date
 */
export const isDate = (value: unknown): value is Date =>
  Boolean(value) && typeof value === "object" && value instanceof Date;

/**
 * Check if the given value is a generator
 * Duck-typed: any object with a `next()` method that is its own iterator, so
 * the predicate is `IterableIterator` (not `Generator`, whose `return` and
 * `throw` methods are not verified)
 */
export const isGenerator = (value: unknown): value is IterableIterator<unknown> =>
  Boolean(value) &&
  typeof value === "object" &&
  typeof (value as { next?: unknown }).next === "function" &&
  typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
    "function" &&
  (value as IterableIterator<unknown>)[Symbol.iterator]() === value;

/**
 * Check if the given value is empty
 * Zero does not considered empty
 * Empty object is considered empty
 * Empty array is considered empty
 */
export const isEmpty = (value: unknown): boolean => {
  if (([0, true, false] as unknown[]).includes(value)) return false;

  if ((["", null, undefined] as unknown[]).includes(value)) return true;

  // NaN: treat as non-empty (it is still a number value)
  if (typeof value === "number" && Number.isNaN(value)) return false;

  // Date instances: a constructed Date is not empty
  if (value instanceof Date) return false;

  // check for map and set
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Plain objects (no Symbol.iterator) — compare by own-key count
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] !==
      "function"
  ) {
    return Object.keys(value as object).length === 0;
  }

  if (isIterable(value)) {
    return (value as { length?: number }).length === 0;
  }

  // this is used here for zero
  if (isNumeric(value)) return false;

  return true;
};

/**
 * Check if the given value is a valid json
 */
export const isJson = (value: unknown): boolean => {
  if (!value || typeof value !== "string") return false;

  if (!["[", "{"].includes(value[0])) return false;

  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the given value is valid url
 */
export const isUrl = (value: unknown): boolean => {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname;
    if (!hostname.includes(".")) return false;
    // Reject empty labels (e.g. "google..com", "google.", ".com")
    const labels = hostname.split(".");
    if (labels.some((label) => label.length === 0)) return false;
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the given value is a valid email
 */
export const isEmail = (value: unknown): boolean => {
  if (typeof value !== "string" || value.length > 254) return false;

  const at = value.lastIndexOf("@");

  // local part is capped at 64 characters
  if (at < 1 || at > 64) return false;

  return /^[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}))$/.test(
    value,
  );
};

/**
 * Check if current user is opening from mobile
 */
export const isMobile = {
  /**
   * Determine whether the current visitor is opening from an Android device
   */
  android: () => navigator.userAgent.match(/Android/i) !== null,
  /**
   * Determine whether the current visitor is opening from an ios device
   */
  ios: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
  /**
   * Determine whether the current visitor is opening from an Iphone
   */
  iphone: () => navigator.userAgent.match(/iPhone/i) !== null,
  /**
   * Determine whether the current visitor is opening from an ipad
   */
  ipad: () => navigator.userAgent.match(/iPad/i) !== null,
  /**
   * Determine whether the current visitor is opening from an ipod
   */
  ipod: () => navigator.userAgent.match(/iPod/i) !== null,
  /**
   * Determine whether the current visitor is opening from an windows mobile
   */
  windows: () => navigator.userAgent.match(/IEMobile/i) !== null,
  /**
   * Determine whether the current visitor is opening from mobile whatever its type
   */
  any: () => isMobile.android() || isMobile.ios() || isMobile.windows(),
};

/**
 * Determine if current user is opening from  macOS
 */
export const isMac = () => navigator.userAgent.match(/mac/i) !== null;

/**
 * Check if current browser is the given name
 */
export const isBrowser = (
  browser: "chrome" | "safari" | "firefox" | "opera" | "edge" | "ie"
): boolean => {
  const browsersList: { [key: string]: boolean } = {
    chrome: isChrome(),
    firefox: isFirefox(),
    opera: isOpera(),
    edge: isEdge(),
    ie: isIE(),
    safari: isSafari(),
  };

  return browsersList[browser.toLowerCase()] === true;
};

/**
 * Check if current browser is chrome browser
 */
export const isChrome = () =>
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

/**
 * Check if current browser is firefox
 */
export const isFirefox = () => typeof window.InstallTrigger !== "undefined";

/**
 * Check if current browser is safari
 */
export const isSafari = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Real Safari contains "Safari" and does NOT contain "Chrome", "Chromium",
  // "Edg", "OPR", or "Android" (the Android System WebView is Chromium).
  return (
    /Safari/i.test(ua) &&
    !/Chrome|Chromium|Edg|OPR|Android/i.test(ua)
  );
};

/**
 * Check if current browser is opera
 */
export const isOpera = (): boolean => {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return (
    (!!w.opr && !!w.opr.addons) ||
    !!w.opera ||
    (typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf(" OPR/") >= 0)
  );
};

/**
 * Check if current browser is internet explorer
 */
export const isIE = () => !!document.documentMode;

/**
 * Check if current browser is edge
 */
export const isEdge = () => {
  // Internet Explorer 6-11
  const isIE = !!document.documentMode;

  const isEdge = !isIE && !!window.StyleMedia;
  return isEdge;
};

/**
 * Determine whether the current visitor is opening from desktop
 */
export const isDesktop = () => !isMobile.any();

/**
 * A simple lightweight library to validate values against certain types of data
 * For full documentation on github
 * Repo: https://github.com/hassanzohdy/supportive-is
 *
 * First released 01/12/2017
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
export const Is = {
  /**
   * Determine whether the given value is a number whatever if its data type is String or Number
   */
  numeric: isNumeric,
  /**
   * Determine whether the given value is an integer and its data type is number
   * As Number.isInteger considers 1.0 to be valid integer, regex will be used instead
   */
  int: isInt,
  /**
   * Determine whether the given value is a float number and its data type is number
   */
  float: isFloat,
  /**
   * Determine whether the given value is a regular expression
   */
  regex: isRegex,
  /**
   * Determine whether the given value is an object
   */
  object: isObject,
  /**
   * Determine whether the given value is a plain object
   */
  plainObject: isPlainObject,
  /**
   * Determine whether the given value is an array
   */
  array: Array.isArray,
  /**
   * Determine whether the given value is valid html attribute `id`
   */
  validHtmlId: isValidId,
  /**
   * determine if the given value is an instance of form element
   */
  formElement: isFormElement,
  /**
   * @alias formElement
   */
  form: isFormElement,
  /**
   * determine if the given value is an instance of form data
   */
  formData: isFormData,
  /**
   * Determine whether the given value is iterable
   */
  iterable: isIterable,
  /**
   * Determine whether the given value is a scalar
   * Scalar types are strings, booleans, integers and
   */
  scalar: isScalar,
  /**
   * Determine if the given value is a primitive value
   */
  primitive: isPrimitive,
  /**
   * Determine whether the given value is a promise
   */
  promise: isPromise,
  /**
   * Determine whether the given value is a date
   */
  date: isDate,
  /**
   * Determine whether the given value is a generator
   */
  generator: isGenerator,
  /**
   * Determine whether the given value if an empty
   * This can be validated against any type of values
   * undefined or nullable values will be considered empty
   * Objects that doesn't have any properties will be considered empty
   * Arrays and Strings will be empty based on its length
   * The 0 'Zero" number will not be considered empty
   */
  empty: isEmpty,
  /**
   * Determine whether the given value is a valid json string
   */
  json: isJson,
  /**
   * Determine whether the given value is a valid url
   */
  url: isUrl,
  /**
   * Determine whether the given value is a valid email
   */
  email: isEmail,
  /**
   * Determine the current visitor is opening from mobile
   * Please Note this method depends on the user agent
   */
  mobile: isMobile,
  /**
   * Determine if current user is opening from  macOS
   */
  mac: isMac,
  /**
   * Determine whether the current visitor is opening from desktop
   */
  desktop: isDesktop,
  /**
   * Check if the current browser is the given name
   * To detect browser version as well, pass the version number as the second argument
   */
  browser: isBrowser,
  chrome: isChrome,
  firefox: isFirefox,
  safari: isSafari,
  opera: isOpera,
  ie: isIE,
  edge: isEdge,
};

export default Is;
