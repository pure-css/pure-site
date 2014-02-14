'use strict';

var fs   = require('fs'),
    path = require('path');

var bowerPureDir = path.resolve('bower_components', 'pure'),
    bowerPure    = require(path.join(bowerPureDir, 'bower.json'));

exports.version = bowerPure.version;
exports.modules = ['base', 'grids', 'forms', 'buttons', 'tables', 'menus'];
exports.local   = path.dirname(path.join(bowerPureDir, bowerPure.main));
exports.grid    = {
    sm : 'screen and (min-width: 35.5em)', // 568px
    med: 'screen and (min-width: 48em)',   // 768px
    lrg: 'screen and (min-width: 58em)',   // 928px
    xl : 'screen and (min-width: 75em)'    // 1200px
};

exports.serveLocally = process.argv.slice(2).some(function (arg) {
    return arg === '--pure-local';
});
