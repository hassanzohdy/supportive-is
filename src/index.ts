declare let opr: any;
declare let window: any;
declare let document: any;
declare let safari: any;

/**
 * Determine whether the given value is a number whatever if its data type is String or Number
 */
export function isNumeric(value: any) {
  return /^[+-]?\d+(\.\d+)?([Ee][+-]?\d+)?$/g.test(String(value));
}

/**
 * Check if the given value is int
 */
export const isInt = (value: any) =>
  typeof value === "number" && /^\d+$/.test(String(value));

/**
 * Check if the given value is float
 */
export const isFloat = (value: any) =>
  typeof value === "number" && /^\d+.(\d+)$/.test(String(value));

/**
 * Check if the given value is a regex
 */
export const isRegex = (value: any) =>
  value && value.constructor.name === "RegExp";

/**
 * Check if the given value is an object
 */
export const isObject = (value: any) => value && typeof value === "object";

/**
 * Check if the given value is a plain object
 */
export const isPlainObject = (value: any) =>
  value && value.constructor.name === "Object";

/**
 * Check if the given value is validId
 */
export const isValidId = (value: any) =>
  Boolean(value && /^[A-Za-z]+[\w\-\:\.]*$/.test(String(value)));

/**
 * Check if the given value is a form element
 */
export const isFormElement = (value: any) =>
  typeof HTMLFormElement === "undefined"
    ? false
    : value instanceof HTMLFormElement;

/**
 * Check if the given value is a form data
 */
export const isFormData = (value: any) => value instanceof FormData;

/**
 * Check if the given value is iterable
 */
export const isIterable = (value: any) =>
  value && typeof value[Symbol.iterator] === "function";

/**
 * Check if the given value is a scalar value
 */
export const isScalar = (value: any) =>
  ["string", "boolean", "number", "symbol", "bigint"].includes(typeof value);

/**
 * Check if the given value is a pr value
 */
export const isPrimitive = (value: any) =>
  ["string", "boolean", "number", "bigint"].includes(typeof value);

/**
 * Check if the given value is a promise
 */
export const isPromise = (value: any) =>
  value && value.constructor.name === "Promise";

/**
 * Check if the given value is a date
 */
export const isDate = (value: any) =>
  value && typeof value === "object" && value.constructor === Date;

/**
 * Check if the given value is a generator
 */
export const isGenerator = (value: any) =>
  value &&
  typeof value === "object" &&
  value.constructor.name === "GeneratorFunction";

/**
 * Check if the given value is empty
 * Zero does not considered empty
 * Empty object is considered empty
 * Empty array is considered empty
 */
export const isEmpty = (value: any) => {
  if ([0, true, false].includes(value)) return false;

  if (value === undefined || value === null || value === "") return true;

  // check for map and set
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (isIterable(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  // this is used here for zero
  if (isNumeric(value)) return false;

  return true;
};

/**
 * Check if the given value is a valid json
 */
export const isJson = (value: any) => {
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
export const isUrl = (value: any) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the given value is a valid email
 */
export const isEmail = (value: any) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  );

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
  any: () => Is.mobile.android() || Is.mobile.ios() || Is.mobile.windows(),
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
) => {
  // Opera 8.0+
  let isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  const isFirefox = typeof window.InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    ((p) => {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );

  // Internet Explorer 6-11
  const isIE = !!document.documentMode;

  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 71
  const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  const browsersList: { [key: string]: boolean } = {
    chrome: isChrome,
    firefox: isFirefox,
    opera: isOpera,
    edge: isEdge,
    ie: isIE,
    safari: isSafari,
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
export const isSafari = () => {
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    ((p) => {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );
  return isSafari;
};

/**
 * Check if current browser is opera
 */
export const isOpera = () => {
  let isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  return isOpera;
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
