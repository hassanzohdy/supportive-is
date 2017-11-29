const is = {
    null: variable => variable === null,
    email: email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
    numeric: value => /^(\d)+(\.(\d)+)?$/.test(value),
    int: variable => typeof variable === 'number' && /^(\d)+$/.test(variable),
    float: variable => typeof variable === 'number' && /^(\d)+(\.(\d)+)?$/.test(variable),
    object: value => ! is.null(value) && typeof value === 'object',
    array: value => value instanceof Array,
    string: variable => typeof variable === 'string',
    undefined: variable => typeof variable == 'undefined',
    bool: variable => typeof variable == 'boolean',
    function: variable => typeof variable == 'function',
    scalar: variable => /string|number|boolean/.test(typeof variable),
    jquery: variable => variable instanceof jQuery,
    dom: variable => variable instanceof HTMLElement,
    url: variable =>  (new RegExp('(?:(?:https?|ftp):\/\/|www\.)?[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]','i')).test(variable),
    cookieEnabled: () => {
        return navigator.cookieEnabled;
    },
    empty: (variable) => {
        if (is.undefined(variable) || is.null(variable)) return true;

        if (is.object(variable)) return Object.keys(variable).length == 0;

        if (is.numeric(variable)) return false;

        if (is.string(variable) || is.array(variable)) return variable.length == 0;

        return true;
    },
    json: (value) => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    },
    mobile: {
        android: () => {
            return navigator.userAgent.match(/Android/i);
        },
        blackBerry: () => {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        ios: () => {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        windows: () => {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return Boolean(this.android() || this.blackBerry() || this.ios() || this.windows());
        },
    },
    desktop: function () {
        return ! this.mobile.any();
    },
};