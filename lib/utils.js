var STATUS_CODES = require('http');

exports.error  = error;
exports.extend = extend;

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
