var STATUS_CODES = require('http');

exports.error  = error;
exports.extend = extend;
exports.passError = passError;
exports.passValue = passValue;

// -----------------------------------------------------------------------------

function error(statusCode, message) {
    var err;

    if (message instanceof Error) {
        err = message;
    } else {
        err = new Error(message || STATUS_CODES[statusCode]);
    }

    err.status = statusCode;
    return err;
}

function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (!source) { return; }

        for (var key in source) {
            obj[key] = source[key];
        }
    });

    return obj;
}

function passError(callback) {
    return function (reason) {
        setImmediate(function () {
            callback(reason);
        });
    };
}

function passValue(callback) {
    return function (value) {
        setImmediate(function () {
            callback(null, value);
        });
    };
}
