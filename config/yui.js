/*jshint globalstrict: true, node: true*/
'use strict';

var extend = require('../lib/utils').extend,
    path   = require('path'),
    fs     = require('fs'),
    graph   = JSON.parse(fs.readFileSync('../build/graph.json')),
    config = {};

Object.keys(graph).forEach(function (modulePath) {
    config[path.basename(modulePath)] = {
        path: modulePath + '.js',
        requires: Object.keys(graph[modulePath].imports)
    };
});

exports.modules = extend({
    'css-mediaquery': {
        path: 'vendor/css-mediaquery.js',
        requires: []
    },

    'handlebars-runtime': {
        path: 'vendor/handlebars.runtime.js',
        requires: []
    }
}, config);
