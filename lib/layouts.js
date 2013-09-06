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

/*
This provides metadata about the layout examples. If the `cache` option is set,
then the hard work is only performed once. A copy of the layouts metadata is
returned to the caller via the `callback`, therefore they are free to mute the
data and it won't affect any other caller.
*/
function loadLayouts(options, callback) {
    // Options are optional.
    if (typeof options === 'function') {
        callback = options;
        options  = null;
    }

    options || (options = {});

    // Check cache.
    if (options.cache && cache) {
        // Return clone of the cache.
        callback(null, cloneLayouts(cache, options));
        return;
    }

    // Put caller on the queue if the hard work of compiling the layouts
    // metadata is currently in progress for another caller.
    if (pending) {
        pending.push(callback);
        return;
    }

    pending = [callback];

    function createLayouts(filenames, callback) {
        // Default context values that mascarade as being the "app" and make the
        // layout examples render in a particular way.
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
                // Replace the list of CSS filenames used by this layout with a
                // collection of metadata for each file which includes its:
                // name, filename, and contents.
                layout.css = files;
                callback(err, files);
            });
        }, function (err) {
            callback(err, layouts);
        });
    }

    // Run the show!
    // 1) Glob the layout examples dir to get a list of filenames.
    //
    // 2) Create the metadata for the layout examples:
    //      a) Render each layout and capture its output *and* metadata set from
    //         within the template itself.
    //
    //      b) Create a metadata object to represent the layout based on the
    //         data siphoned from the context object in which it was rendered.
    //
    // 3) Read the CSS associated with the layout example from the filesystem
    //    and capture it as part of the metadata.
    //
    // 4) Cache the result and call all queued calls with their own copy of the
    //    layout examples metadata.
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
