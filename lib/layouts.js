var async  = require('async'),
    escape = require('handlebars').Utils.escapeExpression,
    fs     = require('fs'),
    glob   = require('glob'),
    path   = require('path'),

    config = require('../config'),
    hbs    = require('./hbs'),

    dirPath = path.join(config.dirs.views, 'layouts', 'examples'),
    cache   = null,
    pending = null;

exports.load  = loadLayouts;
exports.find  = findLayout;
exports.clone = cloneLayouts;

function loadLayouts(options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options  = null;
    }

    options || (options = {});

    if (options.cache && cache) {
        // Return clone of the cache.
        callback(null, cloneLayouts(cache, options));
        return;
    }

    if (pending) {
        pending.push(callback);
        return;
    }

    pending = [callback];

    function createLayouts(filenames, callback) {
        var contextProto = {
            site        : 'Pure',
            section     : 'Layout Examples',
            pure_version: config.pure.version,
            layout      : 'blank',

            helpers: {
                pathTo: function () { return ''; }
            }
        };

        function createLayout(filename, context, html, callback) {
            callback(null, {
                name       : path.basename(filename, path.extname(filename)),
                label      : context.title,
                description: context.subTitle,
                tags       : context.tags,
                html       : html,
                css        : context.localCSS
            });
        }

        function renderTemplate(filename, callback) {
            var context = Object.create(contextProto);

            async.waterfall([
                hbs.renderView.bind(hbs, path.join(dirPath, filename), context),
                createLayout.bind(null, filename, context)
            ], callback);
        }

        async.map(filenames, renderTemplate, callback);
    }

    function loadResources(layouts, callback) {
        function processFile(filename, callback) {
            fs.readFile(path.join(config.dirs.pub, filename), {
                encoding: 'utf-8'
            }, function (err, data) {
                callback(err, {
                    name    : path.basename(filename),
                    filename: filename,
                    data    : data
                });
            });
        }

        async.each(layouts, function (layout, callback) {
            async.map(layout.css, processFile, function (err, files) {
                layout.css = files;
                callback(err, files);
            });
        }, function (err) {
            callback(err, layouts);
        });
    }

    async.waterfall([
        glob.bind(null, '*' + hbs.extname, {cwd: dirPath}),
        createLayouts,
        loadResources
    ], function (err, layouts) {
        if (!err) { cache = layouts; }

        while (pending.length) {
            pending.shift().call(null, err, cloneLayouts(layouts, options));
        }

        pending = null;
    });
}

function findLayout(layouts, name) {
    var layout = null;

    layouts.some(function (l) {
        if (l.name === name) {
            layout = l;
            return true;
        }
    });

    return layout;
}

function cloneLayouts(layouts, options) {
    layouts = clone(layouts);

    if (options && options.escape) {
        layouts.forEach(function (layout) {
            layout.description = escape(layout.description);
            layout.html        = escape(layout.html);

            layout.css.forEach(function (file) {
                file.data = escape(file.data);
            });
        });
    }

    return layouts;
}

// -- Utilities ----------------------------------------------------------------

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
