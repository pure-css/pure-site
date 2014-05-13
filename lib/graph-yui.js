'use strict';

var path = require('path');

module.exports = function (graph) {
    var yuiGraph = {};

    Object.keys(graph).forEach(function (modulePath) {
        yuiGraph[path.basename(modulePath)] = {
            path    : modulePath + '.js',
            requires: Object.keys(graph[modulePath].imports)
        };
    });

    return yuiGraph;
};
