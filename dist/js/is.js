const Is = is = {
    null: variable => variable === null,
    undefined: variable => typeof variable == 'undefined',
    numeric: value => /^(\d)+(\.(\d)+)?$/.test(value),
    nan: value => isNaN(value),
    NaN: value => isNaN(value),
    int: variable => typeof variable === 'number' && /^(\d)+$/.test(variable),
    float: variable => typeof variable === 'number' && /^(\d)+(\.(\d)+)?$/.test(variable),
    object: value => ! is.null(value) && typeof value === 'object',
    array: value => value instanceof Array,
    jquery: variable => variable instanceof jQuery,
    dom: variable => variable instanceof HTMLElement,
    string: variable => typeof variable === 'string',
    bool: variable => typeof variable == 'boolean',
    function: variable => typeof variable == 'function',
    scalar: variable => /string|number|boolean/.test(typeof variable),
    empty(variable) {
        if (is.undefined(variable) || is.null(variable)) return true;

        if (is.object(variable)) return Object.keys(variable).length == 0;

        if (is.numeric(variable)) return false;

        if (is.string(variable) || is.array(variable)) return variable.length == 0;

        return true;
    },
    url: variable =>  (new RegExp('(?:(?:https?|ftp):\/\/|www\.)?[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]','i')).test(variable),
    cookieEnabled() {
        return navigator.cookieEnabled;
    },
    json(value) {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    },
    email: email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
    mobile: {
        android() {
            return navigator.userAgent.match(/Android/i);
        },
        blackBerry() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        ios() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        windows() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any() {
            return Boolean(Is.android() || Is.blackBerry() || Is.ios() || Is.windows());
        },
    },
    desktop() {
        return ! Is.mobile.any();
    },
};