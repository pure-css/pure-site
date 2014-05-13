'use strict';

var mergeTrees     = require('broccoli-merge-trees'),
    pickFiles      = require('broccoli-static-compiler'),
    compileModules = require('./lib/compile-modules'),
    cssWithMQs     = require('./lib/css-with-mqs'),
    stripMQs       = require('./lib/css-strip-mqs'),
    mapFiles       = require('./lib/map-files');

var bower_components = mapFiles('bower_components/', {
    '/rainbow/js/': '/rainbow/'
});

var node_modules = mapFiles('node_modules/', {
    '/css-mediaquery/index.js'              : '/css-mediaquery.js',
    '/handlebars/dist/handlebars.runtime.js': '/handlebars.runtime.js'
});

// Move vendor scripts to "vendor/".
var vendor = pickFiles(mergeTrees([
    bower_components,
    node_modules
]), {
    srcDir : '/',
    destDir: 'vendor/'
});

var pub = 'public/';

// Compile ES6 Modules in `pub`.
pub = compileModules(pub, {type: 'yui'});

// Strip Media Queries from CSS files and save copy as "-old-ie.css".
var oldIECSS = stripMQs(cssWithMQs(pub), {suffix: '-old-ie'});

// Export merged trees.
module.exports = mergeTrees([vendor, pub, oldIECSS]);
