'use strict';

var mergeTrees     = require('broccoli-merge-trees'),
    unwatchedTree  = require('broccoli-unwatched-tree'),
    compileModules = require('./lib/compile-modules'),
    graphModules   = require('./lib/graph'),
    cssWithMQs     = require('./lib/css-with-mqs'),
    stripMQs       = require('./lib/css-strip-mqs'),
    mapFiles       = require('./lib/map-files');

var node_modules     = unwatchedTree('node_modules/');

var vendor = mergeTrees([
    mapFiles(node_modules, {
        'css-mediaquery/index.js'           : 'vendor/css-mediaquery.js',
        'handlebars/dist/handlebars.runtime.js' : 'vendor/handlebars.runtime.js'
    })
]);

var pub = 'public/';

// Calculate the ES6 module dependency graph.
var modGraph = graphModules(pub, {
    basePath      : 'js/',
    resolveImports: true
});

// Compile ES6 Modules in `pub`.
pub = compileModules(pub, {
    basePath: 'js/',
    type    : 'yui'
});

// Strip Media Queries from CSS files and save copy as "-old-ie.css".
var oldIECSS = stripMQs(cssWithMQs(pub), {suffix: '-old-ie'});

// Export merged trees.
module.exports = mergeTrees([vendor, pub, oldIECSS, modGraph]);
