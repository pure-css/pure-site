'use strict';

var path   = require('path'),
    extend = require('../lib/utils').extend;

module.exports = exposeModuleGraph;

// -----------------------------------------------------------------------------

function exposeModuleGraph(app, graph) {
    var needsToExpose = true;

    // Update the YUI dependency graph after each build during development.
    if (app.watcher) {
        app.watcher.on('change', function (results) {
            graph         = require(path.join(results.directory, 'graph.json'));
            needsToExpose = true;
        });
    }

    return function (req, res, next) {
        var existingModules;

        if (needsToExpose) {
            existingModules = app.yui.config().groups.app.modules;

            app.expose(extend({}, existingModules, graphToYUIConfig(graph)),
                    'window.YUI_config.groups.app.modules', {cache: true});

            needsToExpose = false;
        }

        next();
    };
}

function graphToYUIConfig(graph) {
    var yuiConfig = {};

    Object.keys(graph).forEach(function (modulePath) {
        yuiConfig[path.basename(modulePath)] = {
            path    : modulePath + '.js',
            requires: graph[modulePath]
        };
    });

    return yuiConfig;
}
