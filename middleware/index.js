'use strict';

var fs   = require('fs'),
    path = require('path');

exports.slash = require('express-slash');

// Load up all middleware modules from this dir (except this file), and auto
// export them as part of this module.
fs.readdirSync(__dirname).forEach(function (filename) {
    if (filename === 'index.js' || path.extname(filename) !== '.js') { return; }

    var module     = path.basename(filename, '.js'),
        middleware = require(path.join(__dirname, module));

    exports[middleware.name || module] = middleware;
});
