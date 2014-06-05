'use strict';

var path = require('path');

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
        if (needsToExpose) {
            app.expose(graphToYUIConfig(graph),
                    'window.YUI_config.groups.app.modules', {cache: true});

            needsToExpose = false;
        }

        next();
    };
}

function graphToYUIConfig(graph) {
    var yuiConfig = {};

    Object.keys(graph).forEach(function (modulePath) {
        yuiConfig[modulePath] = {
            path    : modulePath + '.js',
            requires: graph[modulePath]
        };
    });

    return yuiConfig;
}
