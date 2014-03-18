'use strict';

module.exports = function (broccoli) {
    var pickFiles      = require('broccoli-static-compiler'),
        compileModules = require('./lib/compile-modules'),
        cssWithMQs     = require('./lib/css-with-mqs'),
        stripMQs       = require('./lib/css-strip-mqs');

    var bower_components = new broccoli.Tree('bower_components/'),
        node_modules     = new broccoli.Tree('node_modules/'),
        pub              = broccoli.makeTree('public/');

    bower_components.map('rainbow/js/', '/rainbow/');

    node_modules.map('css-mediaquery/index.js',               '/css-mediaquery.js');
    node_modules.map('rework/rework.js',                      '/rework.js');
    node_modules.map('rework-pure-grids/index.js',            '/rework-pure-grids.js');
    node_modules.map('handlebars/dist/handlebars.runtime.js', '/handlebars.runtime.js');

    // Move vendor scripts to "vendor/".
    var vendor = pickFiles(new broccoli.MergedTree([
        bower_components,
        node_modules
    ]), {
        srcDir : '/',
        destDir: 'vendor/'
    });

    // Strip Media Queries from CSS files and save copy as "-old-ie.css".
    var oldIECSS = stripMQs(cssWithMQs(pub), {suffix: '-old-ie'});

    // Compile ES6 Modules in `pub`.
    pub = compileModules(pub, {type: 'yui'});

    return [vendor, pub, oldIECSS];
};
