'use strict';

var path      = require('path'),
    sharedDir = require('../config').dirs.shared;

module.exports = function exposeTemplates(exphbs, templatesDir) {
    templatesDir || (templatesDir = '');

    // Make sure dir ends with a "/".
    if (templatesDir && templatesDir.charAt(templatesDir.length - 1) !== '/') {
        templatesDir += '/';
    }

    return function (req, res, next) {
        // Uses the `ExpressHandlebars` instance to get the get the
        // **precompiled** templates which will be shared with the client-side
        // of the app.
        exphbs.loadTemplates(path.join(sharedDir, templatesDir), {
            precompiled: true
        }, function (err, templates) {
            if (err) { return next(err); }

            // RegExp to remove the ".handlebars" extension from the template
            // names.
            var extRegex = new RegExp(exphbs.extname + '$');

            // Exposes the templates via express-state.
            templates = Object.keys(templates).forEach(function (name) {
                var namespace = 'templates.' +
                        (templatesDir ? templatesDir.replace(/\//g, '.') : '') +
                        name.replace(extRegex, '');

                res.expose(templates[name], namespace);
            });

            next();
        });
    };
};
