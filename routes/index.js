'use strict';

var fs    = require('fs'),
    path  = require('path'),
    error = require('../lib/utils').error;

exports.render   = render;
exports.redirect = redirect;

// Load up all middleware modules from this dir (except this file), and auto
// export them as part of this module.
fs.readdirSync(__dirname).forEach(function (filename) {
    if (filename === 'index.js' || path.extname(filename) !== '.js') { return; }

    var module = path.basename(filename, '.js'),
        route  = require(path.join(__dirname, module));

    exports[route.name || module] = route;
});

// -----------------------------------------------------------------------------

function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }

        res.render(viewName);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}
