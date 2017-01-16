'use strict';

var crypto = require('crypto'),
    fs     = require('fs'),
    path   = require('path');

var serveLocally = process.argv.slice(2).some(function (arg) {
    return arg === '--pure-local';
});

var pureDir      = path.resolve('node_modules', 'purecss'),
    purePkg      = require(path.join(pureDir, 'package.json')),
    pureMin      = fs.readFileSync(path.resolve(pureDir, 'build', 'pure-min.css'), 'utf-8');

exports.version = purePkg.version;
exports.modules = ['base', 'grids', 'forms', 'buttons', 'tables', 'menus'];
exports.local   = path.dirname(path.join(pureDir, purePkg.browser));
exports.sriHash = crypto
                    .createHash('sha384')
                    .update(pureMin, 'utf8')
                    .digest('base64');

exports.serveLocally = serveLocally;
