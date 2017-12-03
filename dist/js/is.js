; /**
 * Supportive Is v1.0.1
 * A simple lightwegiht library to validate values agains certain types of data
 * For full documentation on github
 * Repo: https://github.com/hassanzohdy/supportive-is
 *
 * released 01/12/2017
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
const Is = {
     /**
     * Determine whether the given value is null
     *
     * @param mixed value
     * @return bool
     */
    null: value => value === null,
     /**
     * Determine whether the given value is undefined
     *
     * @param mixed value
     * @return bool
     */
    undefined: value => typeof value == 'undefined',
     /**
     * Determine whether the given value is a number whatever if its data type is String or Number
     *
     * @param mixed value
     * @return bool
     */
    numeric: value => /^(\d)+(\.(\d)+)?$/.test(value),
     /**
     * Determine whether the given value is an integer and its data type is number
     *
     * @param mixed value
     * @return bool
     */
    int: value => typeof value === 'number' && /^(\d)+$/.test(value),
     /**
     * Determine whether the given value is a float number and its data type is number
     *
     * @param mixed value
     * @return bool
     */
    float: value => typeof value === 'number' && /^(\d)+(\.(\d)+)?$/.test(value),
     /**
     * Determine whether the given value is not a number
     *
     * @param mixed value
     * @return bool
     */
    NaN: value => isNaN(value),
     /**
     * Determine whether the given value is an object
     *
     * @param mixed value
     * @return bool
     */
    object: value => ! Is.null(value) && typeof value === 'object',
     /**
     * Determine whether the given value is an array
     *
     * @param mixed value
     * @return bool
     */
    array: value => value instanceof Array,
     /**
     * Determine whether the given value is a jquery object
     *
     * @param mixed value
     * @return bool
     */
    jquery: value => value instanceof jQuery,
     /**
     * Determine whether the given value is a dom element
     *
     * @param mixed value
     * @return bool
     */
    dom: value => value instanceof HTMLElement,
     /**
     * Determine whether the given value is a string
     *
     * @param mixed value
     * @return bool
     */
    string: value => typeof value === 'string',
     /**
     * Determine whether the given value is an boolean
     *
     * @param mixed value
     * @return bool
     */
    bool: value => typeof value == 'boolean',
     /**
     * Determine whether the given value is a function
     *
     * @param mixed value
     * @return bool
     */
    function: value => typeof value == 'function',
     /**
     * Determine whether the given value is a scalar
     * Scalalr types are strings, booleans, integers and
     *
     * @param mixed value
     * @return bool
     */
    scalar: value => /string|number|boolean/.test(typeof value),
     /**
     * Determine whether the given value if an empty
     * This can be validated agains any type of values
     * undefined or nullable values will be considered empty
     * Objects that doesn't have any properties will be considered empty
     * Arrays and Strings will be empty based on its length
     * The 0 'Zero" number will not be considered empty
     *
     * @param mixed value
     * @return bool
     */
    empty(value) {
        if (Is.undefined(value) || Is.null(value)) return true;

        if (Is.jquery(value)) return value.length == 0;

        if (Is.object(value)) return Object.keys(value).length == 0;

        // this is used here fo zero
        if (Is.numeric(value)) return false;

        if (Is.string(value) || Is.array(value)) return value.length == 0;

        return true;
    },
     /**
     * Determine whether the given value is a valid json string
     *
     * @param mixed value
     * @return bool
     */
    json(value) {
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
    url: value =>  (new RegExp('^(https?:\\/\\/||\/\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%@_.~+&:]*)*(\\?[;&a-z\\d%@_.,~+&:=-]*)?(\\#[-a-z\\d_]*)?$','i')).test(value),
     /**
     * Determine whether the given value is a valid email
     *
     * @param mixed value
     * @return bool
     */
    email: value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value),
     /**
     * Determine whether cookies are enabled
     *
     * @return bool
     */
    cookieEnabled() {
        return navigator.cookieEnabled;
    },
     /**
     * Determine the current visitor is opening from mobile
     * Please Note this method depends on the user agent
     *
     * @return bool
     */
    mobile: {
         /**
         * Determine whether the current visior is openning from an andriod device
         *
         * @return bool
         */
        android() {
            return navigator.userAgent.match(/Android/i);
        },
         /**
         * Determine whether the current visior is openning from a blackberry mobile
         *
         * @return bool
         */
        blackBerry() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
         /**
         * Determine whether the current visior is openning from an ios device
         *
         * @return bool
         */
        ios() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
         /**
         * Determine whether the current visior is openning from an iphone
         *
         * @return bool
         */
        iphone() {
            return navigator.userAgent.match(/iPhone/i);
        },
         /**
         * Determine whether the current visior is openning from an ipad
         *
         * @return bool
         */
        ipad() {
            return navigator.userAgent.match(/iPad/i);
        },
         /**
         * Determine whether the current visior is openning from an ipod
         *
         * @return bool
         */
        ipod() {
            return navigator.userAgent.match(/iPod/i);
        },
         /**
         * Determine whether the current visior is openning from an windows mobile
         *
         * @return bool
         */
        windows() {
            return navigator.userAgent.match(/IEMobile/i);
        },
         /**
         * Determine whether the current visior is openning from mobile whatever its type
         *
         * @return bool
         */
        any() {
            return Boolean(Is.mobile.android() || Is.mobile.blackBerry() || Is.mobile.ios() || Is.mobile.windows());
        },
    },
     /**
     * Determine whether the current visior is openning from desktop
     *
     * @return bool
     */
    desktop() {
        return ! Is.mobile.any();
    },
};