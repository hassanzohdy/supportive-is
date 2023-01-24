declare let opr: any;
declare let window: any;
declare let document: any;
declare let safari: any;

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
   * Determine whether the given value is null
   */
  null: (value: any) => value === null,
  /**
   * Determine whether the given value is undefined
   */
  undefined: (value: any) => typeof value === "undefined",
  /**
   * Determine whether the given value is a number whatever if its data type is String or Number
   */
  numeric: (value: any) =>
    /^[+-]?\d+(\.\d+)?([Ee][+-]?\d+)?$/g.test(String(value)),
  /**
   * Determine if given value is number type
   */
  number: (value: any) => typeof value === "number",
  /**
   * Determine whether the given value is an integer and its data type is number
   * As Number.isInteger considers 1.0 to be valid integer, regex will be used instead
   */
  int: (value: any) => typeof value === "number" && /^\d+$/.test(String(value)),
  /**
   * @alias Is.int
   */
  integer: (value: any) =>
    typeof value === "number" && /^\d+$/.test(String(value)),
  /**
   * Determine whether the given value is a big int
   */
  bigint: (value: any) => typeof value === "bigint",
  /**
   * Check if the given value is an instance of Map
   */
  map: (value: any) => value instanceof Map,
  /**
   * Check if the given value is an instance of Set
   */
  set: (value: any) => value instanceof Set,
  /**
   * Check if the given value is an instance of WeakMap
   */
  weakmap: (value: any) => value instanceof WeakMap,
  /**
   * Check if the given value is an instance of WeakSet
   */
  weakset: (value: any) => value instanceof WeakSet,
  /**
   * Determine whether the given value is a float number and its data type is number
   */
  float: (value: any) =>
    typeof value === "number" && /^\d+.(\d+)$/.test(String(value)),
  /**
   * Determine whether the given value is not a number
   */
  NaN: isNaN,
  /**
   * Determine whether the given value is a regular expression
   */
  regex: (value: any) =>
    typeof value !== "undefined" && value.constructor.name === "RegExp",
  /**
   * Determine whether the given value is an object
   */
  object: (value: any) => !Is.null(value) && typeof value === "object",
  /**
   * Determine whether the given value is a plain object
   */
  plainObject: (value: any) =>
    !Is.null(value) &&
    !Is.undefined(value) &&
    value.constructor.name === "Object",
  /**
   * Determine whether the given value is an array
   */
  array: Array.isArray,
  /**
   * Determine whether the given value is valid html attribute `id`
   */
  validHtmlId: (value: any) =>
    Boolean(value && /^[A-Za-z]+[\w\-\:\.]*$/.test(String(value))),
  /**
   * Determine whether the given value is a dom element
   */
  dom: (value: any) => value instanceof HTMLElement,
  /**
   * determine if the given value is an instance of form element
   */
  formElement: (value: any) =>
    typeof HTMLFormElement === "undefined"
      ? false
      : value instanceof HTMLFormElement,
  /**
   * @alias formElement
   */
  form: (value: any) =>
    typeof HTMLFormElement === "undefined"
      ? false
      : value instanceof HTMLFormElement,
  /**
   * determine if the given value is an instance of form data
   */
  formData: (value: any) =>
    typeof FormData === "undefined" ? false : value instanceof FormData,
  /**
   * Check if the given value is a form element either an input, textarea, select
   */
  input: (value: any) => {
    if (typeof HTMLInputElement === "undefined") {
      return false;
    }

    return (
      value instanceof HTMLInputElement ||
      value instanceof HTMLTextAreaElement ||
      value instanceof HTMLSelectElement
    );
  },
  /**
   * @alias Is.dom
   */
  element: (value: any) => value instanceof HTMLElement,
  /**
   * Check if the given value is visible element in the window screen
   */
  visible: (value: any) => {
    if (!Is.element(value)) return false;
    return value.offsetWidth > 0 || value.offsetHeight > 0;
  },
  /**
   * Check if the given value is hidden element
   */
  hidden: (value: any) => {
    if (!Is.element(value)) return false;
    return value.hidden;
  },
  /**
   * Check if the given element is in the dom tree
   */
  inDom: (value: any) => {
    if (!Is.element(value)) return false;
    return document.body.contains(value);
  },
  /**
   * Determine whither the given object is instance of the given class name
   * Please note that this method won't work with parent classes
   * use `instanceof` expression instead
   * i.e
   * class A{}
   * class B extends A {}
   * let object = new B;
   *
   * Using Is.instanceof()
   * console.log(Is.instanceof(object, 'B')); // true
   * console.log(Is.instanceof(object, 'A')); // false
   *
   * Using the normal instanceof
   * console.log(object instanceof B); // true
   * console.log(object instanceof A); // true
   *
   */
  a: (object: any, className: string) => object.constructor.name === className,
  /**
   * Determine whether the given value is iterable
   */
  iterable: (object: any): boolean =>
    object && typeof object[Symbol.iterator] === "function",
  /**
   * Check if the given value is symbol
   */
  symbol: (value: any) => typeof value === "symbol",
  /**
   * Determine whether the given value is a string
   */
  string: (value: any) => typeof value === "string",
  /**
   * Determine whether the given value is an boolean
   */
  bool: (value: any) => typeof value === "boolean",
  /**
   * Determine whether the given value is an boolean
   */
  boolean: (value: any) => typeof value === "boolean",
  /**
   * Determine whether the given value is a function
   */
  function: (value: any) => typeof value === "function",
  /**
   * Determine whether the given value is callable
   * @alias Is.function
   */
  callable: (value: any) => typeof value === "function",
  /**
   * Determine whether the given value is a function
   * @alias Is.function
   */
  fn: (value: any) => typeof value === "function",
  /**
   * Returns `true` if the passed function is native to the browser, and is not
   * polyfilled
   */
  native: (func: any) =>
    !!func && func.toString().indexOf("[native code]") !== -1,
  /**
   * Determine whether the given value is a scalar
   * Scalar types are strings, booleans, integers and
   */
  scalar: (value: any) => /string|number|boolean/.test(typeof value),
  /**
   * Determine whether the given value is a promise
   */
  promise: (value: any) => value instanceof Promise,
  /**
   * Determine whether the given value is a date
   */
  date: (value: any) => value instanceof Date,
  /**
   * Determine whether the given value is a generator
   */
  generator: (value: any) => value && value.constructor.name === "Generator",
  /**
   * Determine if the given value is a primitive value
   */
  primitive: (value: any) =>
    ["string", "boolean", "number", "symbol", "bigint", "undefined"].includes(
      typeof value
    ) || value === null,
  /**
   * Determine whether the given value if an empty
   * This can be validated against any type of values
   * undefined or nullable values will be considered empty
   * Objects that doesn't have any properties will be considered empty
   * Arrays and Strings will be empty based on its length
   * The 0 'Zero" number will not be considered empty
   */
  empty(value: any) {
    if (Is.undefined(value) || Is.null(value)) return true;

    if (Is.boolean(value)) return false;

    if (Is.string(value)) return value.length === 0;

    // check for map and set
    if (Is.map(value) || Is.set(value)) return value.size === 0;

    if (Is.iterable(value)) {
      return value.length === 0;
    }

    if (Is.object(value)) {
      return Object.keys(value).length === 0;
    }

    // this is used here for zero
    if (Is.numeric(value)) return false;

    return true;
  },
  /**
   * Determine if the given value is an instance of Error
   */
  error: (value: any) => value instanceof Error,
  /**
   * Determine whether the given value is a valid json string
   */
  json(value: any): boolean {
    if (typeof value !== "string") return false;
    try {
      const output = JSON.parse(value);

      return output && typeof output === "object";
    } catch (e) {
      return false;
    }
  },
  /**
   * Determine whether the given value is a valid url
   */
  url: (value: any) =>
    new RegExp(
      "^" +
        // protocol identifier (optional)
        // short syntax // still required
        "(?:(?:(?:https?|ftp):)?\\/\\/)" +
        // user:pass BasicAuth (optional)
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broadcast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host & domain names, may end with dot
        // can be replaced by a shortest alternative
        // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
        "(?:" +
        "(?:" +
        "[a-z0-9\\u00a1-\\uffff]" +
        "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
        ")?" +
        "[a-z0-9\\u00a1-\\uffff]\\." +
        ")+" +
        // TLD identifier name, may end with dot
        "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
        ")" +
        // port number (optional)
        "(?::\\d{2,5})?" +
        // resource path (optional)
        "(?:[/?#]\\S*)?" +
        "$",
      "i"
    ).test(value),
  /**
   * Determine whether the given value is a valid email
   */
  email: (value: any) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    ),
  /**
   * Enabled list
   */
  enabled: {
    cookies: () => navigator.cookieEnabled,
    notifications: () =>
      "Notification" in window && Notification.permission === "granted",
    pushNotifications: () => "PushManager" in window,
    geolocation: () => "geolocation" in navigator,
    geoLocation: () => "geolocation" in navigator,
    webWorkers: () => "Worker" in window,
    serviceWorker: () => "serviceWorker" in navigator,
    microphone: () =>
      "mediaDevices" in navigator && "getUserMedia" in navigator,
    camera: () => "mediaDevices" in navigator && "getUserMedia" in navigator,
    cam: () => "mediaDevices" in navigator && "getUserMedia" in navigator,
    webcam: () => "mediaDevices" in navigator && "getUserMedia" in navigator,
    webRTC: () => "RTCPeerConnection" in window,
    webAudio: () => "AudioContext" in window,
    speechRecognition: () => "webkitSpeechRecognition" in window,
    speechSynthesis: () => "speechSynthesis" in window,
    localStorage: () => "localStorage" in window,
    sessionStorage: () => "sessionStorage" in window,
    indexedDB: () => "indexedDB" in window,
    fetch: () => "fetch" in window,
    history: () => "history" in window,
    fullScreen: () => "fullscreenEnabled" in document,
    fullscreen: () => "fullscreenEnabled" in document,
    vibration: () => "vibrate" in navigator,
    touch: () => "ontouchstart" in window,
    battery: () => "getBattery" in navigator,
    darkMode: () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    lightMode: () => window.matchMedia("(prefers-color-scheme: light)").matches,
    animation: () => "AnimationEvent" in window,
    transition: () => "TransitionEvent" in window,
  },
  /**
   * Determine the current visitor is opening from mobile
   * Please Note this method depends on the user agent
   */
  mobile: {
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
  },
  /**
   * Determine whether the current visitor is opening from desktop
   */
  desktop: () => !Is.mobile.any(),
  /**
   * Check if the current browser is the given name
   * To detect browser version as well, pass the version number as the second argument
   */
  browser(browser: "chrome" | "safari" | "firefox" | "opera" | "edge" | "ie") {
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
  },
  chrome: () =>
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
  firefox: () => typeof window.InstallTrigger !== "undefined",
  safari: () => {
    const isSafari =
      /constructor/i.test(window.HTMLElement) ||
      ((p) => {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && safari.pushNotification)
      );
    return isSafari;
  },
  opera: () => {
    let isOpera =
      (!!window.opr && !!opr.addons) ||
      !!window.opera ||
      navigator.userAgent.indexOf(" OPR/") >= 0;
    return isOpera;
  },
  ie: () => !!document.documentMode,
  edge: () => {
    // Internet Explorer 6-11
    const isIE = !!document.documentMode;

    const isEdge = !isIE && !!window.StyleMedia;
    return isEdge;
  },
};

export default Is;
