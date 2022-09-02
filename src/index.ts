declare let opr: any;
declare let window: any;
declare let document: any;
declare let safari: any;
declare let jQuery: any;

/**
 * Supportive Is v1.1
 * A simple lightweight library to validate values agains certain types of data
 * For full documentation on github
 * Repo: https://github.com/hassanzohdy/supportive-is
 *
 * released 01/12/2017
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
export const Is = {
  /**
   * Determine whether the given value is null
   *
   * @param mixed value
   * @return bool
   */
  null: (value: any): boolean => value === null,
  /**
   * Determine whether the given value is undefined
   *
   * @param mixed value
   * @return bool
   */
  undefined: (value: any): boolean => typeof value === "undefined",
  /**
   * Determine whether the given value is a number whatever if its data type is String or Number
   *
   * @param mixed value
   * @return bool
   */
  numeric: (value: any): boolean =>
    /^[+-]?\d+(\.\d+)?([Ee][+-]?\d+)?$/g.test(String(value)),
  /**
   * Determine whether the given value is an integer and its data type is number
   * As Number.isInteger considers 1.0 to be valid integer, regex will be used instead
   * @param mixed value
   * @return bool
   */
  int: (value: any): boolean =>
    typeof value === "number" && /^\d+$/.test(String(value)),
  /**
   * Determine whether the given value is a float number and its data type is number
   *
   * @param mixed value
   * @return bool
   */
  float: (value: any): boolean =>
    typeof value === "number" && /^\d+.(\d+)$/.test(String(value)),
  /**
   * Determine whether the given value is not a number
   *
   * @param mixed value
   * @return bool
   */
  NaN: isNaN,
  /**
   * Determine whether the given value is a regular expression
   *
   * @param mixed value
   * @return bool
   */
  regex: (value: any): boolean =>
    typeof value !== "undefined" && value.constructor.name === "RegExp",
  /**
   * Determine whether the given value is an object
   *
   * @param mixed value
   * @return bool
   */
  object: (value: any): boolean => !Is.null(value) && typeof value === "object",
  /**
   * Determine whether the given value is a plain object
   *
   * @param mixed value
   * @return bool
   */
  plainObject: (value: any): boolean =>
    !Is.null(value) &&
    !Is.undefined(value) &&
    value.constructor.name === "Object",
  /**
   * Determine whether the given value is an array
   *
   * @param mixed value
   * @return bool
   */
  array: Array.isArray,
  /**
   * Determine whether the given value is valid html attribute `id`
   */
  validHtmlId: (value: any): boolean =>
    Boolean(value && /^[A-Za-z]+[\w\-\:\.]*$/.test(String(value))),
  /**
   * Determine whether the given value is a jquery object
   *
   * @param mixed value
   * @return bool
   */
  jquery: (value: any): boolean => value instanceof jQuery,
  /**
   * Determine whether the given value is a dom element
   *
   * @param mixed value
   * @return bool
   */
  dom: (value: any): boolean => value instanceof HTMLElement,
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
   * @param object object
   * @param string className
   * @returns bool
   */
  a: (object: any, className: string): boolean =>
    object.constructor.name === className,
  /**
   * Determine whether the given value is iterable
   *
   * @param object object
   * @returns bool
   */
  iterable: (object: any): boolean =>
    object && typeof object[Symbol.iterator] === "function",
  /**
   * Check if the given value is symbol
   */
  symbol: (value: any): boolean => typeof value === "symbol",
  /**
   * Determine whether the given value is a string
   *
   * @param mixed value
   * @return bool
   */
  string: (value: any): boolean => typeof value === "string",
  /**
   * Determine whether the given value is an boolean
   *
   * @param mixed value
   * @return bool
   */
  bool: (value: any): boolean => typeof value === "boolean",
  /**
   * Determine whether the given value is an boolean
   *
   * @param mixed value
   * @return bool
   */
  boolean: (value: any): boolean => typeof value === "boolean",
  /**
   * Determine whether the given value is a function
   *
   * @param mixed value
   * @return bool
   */
  function: (value: any): boolean => typeof value === "function",
  /**
   * Determine whether the given value is callable
   * Alias to function
   *
   * @param mixed value
   * @return bool
   */
  callable: (value: any): boolean => typeof value === "function",
  /**
   * Returns `true` if the passed function is native to the browser, and is not
   * polyfilled
   *
   * @param {function()|undefined} func A function that is attached to a JS
   * object.
   * @return {boolean}
   */
  native: (func: any): boolean =>
    !!func && func.toString().indexOf("[native code]") !== -1,
  /**
   * Determine whether the given value is a scalar
   * Scalar types are strings, booleans, integers and
   *
   * @param mixed value
   * @return bool
   */
  scalar: (value: any): boolean => /string|number|boolean/.test(typeof value),
  /**
   * Determine whether the given value if an empty
   * This can be validated against any type of values
   * undefined or nullable values will be considered empty
   * Objects that doesn't have any properties will be considered empty
   * Arrays and Strings will be empty based on its length
   * The 0 'Zero" number will not be considered empty
   *
   * @param mixed value
   * @return bool
   */
  empty(value: any): boolean {
    if (Is.undefined(value) || Is.null(value)) return true;

    if (Is.string(value)) return value.length === 0;

    if (Is.iterable(value)) {
      return value.length === 0;
    }

    if (Is.boolean(value)) return false;

    if (Is.object(value)) {
      return Object.keys(value).length === 0;
    }

    // this is used here for zero
    if (Is.numeric(value)) return false;

    return true;
  },
  /**
   * determine if the given value is an instance of form element
   *
   * @param  mixed value
   * @returns bool
   */
  formElement: (value: any): boolean =>
    typeof HTMLFormElement === "undefined"
      ? false
      : value instanceof HTMLFormElement,
  /**
   * determine if the given value is an instance of form data
   *
   * @param  mixed value
   * @returns bool
   */
  formData: (value: any): boolean =>
    typeof FormData === "undefined" ? false : value instanceof FormData,
  /**
   * Determine whether the given value is a valid json string
   *
   * @param mixed value
   * @return bool
   */
  json(value: any) {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  },
  /**
   * Determine whether the given value is a valid url
   *
   * @param mixed value
   * @return bool
   */
  url: (value: any): boolean =>
    new RegExp(
      "^(https?:\\/\\/||//)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%@_.~+&:]*)*(\\?[;&a-z\\d%@_.,~+&:=-]*)?(\\#[-a-z\\d_]*)?$",
      "i"
    ).test(value),
  /**
   * Determine whether the given value is a valid email
   *
   * @param mixed value
   * @return bool
   */
  email: (value: any): boolean =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    ),
  /**
   * Determine whether the given mobile number is a valid Egyptian mobile number
   * The following formats are valid
   * 010[another-8digs]
   * 2010[another-8digs]
   * +2010[another-8digs]
   *
   * Available mobile numbers are 010|011|012|015
   *
   * @param string value
   * @param bool withCode => If set to true, then user can add the +(num) on the beginning of the number
   * @returns bool
   */
  mobileNumber: {
    eg: (value: any, withCode = true): boolean => {
      let expression = "^";
      if (withCode) {
        expression += "(\\+?2)?";
      }

      expression += "01(0|1|2|5)\\d{8}$";
      let regex = new RegExp(expression);

      return regex.test(value);
      // (value: any): boolean => /^(\+?2)?01(0|1|2|5)\d{8}$/.test(value);
    },
  },
  /**
   * Determine whether cookies are enabled
   *
   * @return bool
   */
  cookieEnabled: (): boolean => navigator.cookieEnabled,
  /**
   * Determine the current visitor is opening from mobile
   * Please Note this method depends on the user agent
   *
   * @return bool
   */
  mobile: {
    /**
     * Determine whether the current visitor is opening from an Android device
     *
     * @return bool
     */
    android: (): boolean => Boolean(navigator.userAgent.match(/Android/i)),
    /**
     * Determine whether the current visitor is opening from a blackberry mobile
     *
     * @return bool
     */
    blackBerry: (): boolean =>
      Boolean(navigator.userAgent.match(/BlackBerry/i)),
    /**
     * Determine whether the current visitor is opening from an ios device
     *
     * @return bool
     */
    ios() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    /**
     * Determine whether the current visitor is opening from an Iphone
     *
     * @return bool
     */
    iphone() {
      return navigator.userAgent.match(/iPhone/i);
    },
    /**
     * Determine whether the current visitor is opening from an ipad
     *
     * @return bool
     */
    ipad() {
      return navigator.userAgent.match(/iPad/i);
    },
    /**
     * Determine whether the current visitor is opening from an ipod
     *
     * @return bool
     */
    ipod() {
      return navigator.userAgent.match(/iPod/i);
    },
    /**
     * Determine whether the current visitor is opening from an windows mobile
     *
     * @return bool
     */
    windows() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    /**
     * Determine whether the current visitor is opening from mobile whatever its type
     *
     * @return bool
     */
    any(): boolean {
      return Boolean(
        Is.mobile.android() ||
          Is.mobile.blackBerry() ||
          Is.mobile.ios() ||
          Is.mobile.windows()
      );
    },
  },
  /**
   * Determine whether the current visitor is opening from desktop
   *
   * @return bool
   */
  desktop(): boolean {
    return !Is.mobile.any();
  },

  /**
   * Check if the current browser is the given name
   * To detect browser version as well, pass the version number as the second argument
   *
   * @param   string browser
   * @param   string|number browser
   * @returns bool
   * @see     https://stackoverflow.com/a/9851769/3380387
   */
  browser(browser: string, browserVersion?: string | number): boolean {
    const browserMatch = navigator.userAgent.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
    );

    if (browserMatch !== null) {
      return (
        browser.toLowerCase() === (browserMatch[1] as string).toLowerCase() &&
        (browserVersion ? String(browserMatch) === browserMatch[2] : true)
      );
    }

    // Opera 8.0+
    let isOpera: boolean =
      (!!window.opr && !!opr.addons) ||
      !!window.opera ||
      navigator.userAgent.indexOf(" OPR/") >= 0;

    // Firefox 1.0+
    let isFirefox: boolean = typeof window.InstallTrigger !== "undefined";

    // Safari 3.0+ "[object HTMLElementConstructor]"
    let isSafari: boolean =
      /constructor/i.test(window.HTMLElement) ||
      ((p) => {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && safari.pushNotification)
      );

    // Internet Explorer 6-11
    let isIE: boolean = !!document.documentMode;

    // Edge 20+
    let isEdge: boolean = !isIE && !!window.StyleMedia;

    // Chrome 1 - 71
    let isChrome: boolean =
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Blink engine detection
    let isBlink: boolean = (isChrome || isOpera) && !!window.CSS;

    let browsersList: { [key: string]: boolean } = {
      chrome: isChrome,
      firefox: isFirefox,
      opera: isOpera,
      edge: isEdge,
      ie: isIE,
      safari: isSafari,
      blink: isBlink,
    };

    return browsersList[browser.toLowerCase()] === true;
  },
};

export default Is;
