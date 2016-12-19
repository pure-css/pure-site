'use strict';

var crypto = require('crypto'),
    fs     = require('fs'),
    path   = require('path');

var serveLocally = process.argv.slice(2).some(function (arg) {
    return arg === '--pure-local';
});

var bowerPureDir = path.resolve('bower_components', 'pure'),
    bowerPure    = require(path.join(bowerPureDir, 'bower.json')),
    pureMin      = fs.readFileSync(path.resolve(bowerPureDir, (serveLocally ? 'build' : ''), 'pure-min.css'), 'utf-8');

exports.version = bowerPure.version;
exports.modules = ['base', 'grids', 'forms', 'buttons', 'tables', 'menus'];
exports.local   = path.dirname(path.join(bowerPureDir, bowerPure.main));
exports.sriHash = crypto
                    .createHash('sha384')
                    .update(pureMin, 'utf8')
                    .digest('base64');

exports.serveLocally = serveLocally;
