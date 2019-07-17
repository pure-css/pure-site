var archiver = require('archiver'),
    async    = require('async'),
    escape   = require('handlebars').Utils.escapeExpression,
    fs       = require('fs'),
    glob     = require('glob'),
    path     = require('path'),
    yui      = require('yui');

var config = require('../config'),
    hbs    = require('./hbs'),
    utils  = require('../lib/utils');

exports.archive = archiveLayout;
exports.clone   = cloneLayouts;
exports.find    = findLayout;
exports.load    = loadLayouts;

// -----------------------------------------------------------------------------

var DIR_PATH = path.join(config.dirs.views, 'layouts', 'examples'),
    LICENSE  = fs.readFileSync(path.join(process.cwd(), 'LICENSE.md')),
    README   = fs.readFileSync(path.join(DIR_PATH, 'README.md')),

    cache   = null,
    pending = null;

function archiveLayout(layout) {
    if (!layout) { return null; }

    var archive = archiver('zip');

    archive.append(LICENSE,     {name: 'LICENSE.md'});
    archive.append(README,      {name: 'README.md'});
    archive.append(layout.html, {name: 'index.html'});

    // Layout resources.
    ['css', 'js', 'imgs'].forEach(function (type) {
        layout[type].forEach(function (file) {
            archive.append(file.data, {name: file.filename});
        });
    });

    return archive;
}

function cloneLayouts(layouts, options) {
    layouts = clone(layouts);
    options || (options = {});

    layouts.forEach(function (layout) {
        // Convert imgs back into Buffers.
        layout.imgs.forEach(function (img) {
            img.data = new Buffer(img.data);
        });

        if (options.escape) {
            layout.description = escape(layout.description);
            layout.html        = escape(layout.html);

            ['css', 'js'].forEach(function (type) {
                layout[type].forEach(function (file) {
                    file.data = escape(file.data);
                });
            });
        }
    });

    return layouts;
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
    // 3) Read the CSS, JS, and images associated with the layout example from
    //    the filesystem and capture it as part of the metadata.
    //
    // 4) Cache the result and call all queued calls with their own copy of the
    //    layout examples metadata.
    async.waterfall([
        glob.bind(null, '*' + hbs.extname, {cwd: DIR_PATH}),
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

// -- Utilities ----------------------------------------------------------------

function clone(obj) {
    // Poor-man's clone.
    return JSON.parse(JSON.stringify(obj));
}

function createLayouts(filenames, callback) {
    // Default context values that mascarade as being the "app" and make the
    // layout examples render in a particular way.
    var contextProto = {
        forDownload: true,

        site   : 'Pure',
        section: 'Layout Examples',

        pure: {
            version: config.pure.version
        },

        yui_version: yui.YUI.version,

        min: '-min',

        layout      : 'blank',
        relativePath: '/',

        helpers: {
            pathTo: function () { return ''; }
        }
    };

    function createLayout(filename, context, html, callback) {
        var css = [];

        // Include all `localCSS` files, including old IE versions.
        (context.localCSS || []).forEach(function (entry) {
            css.push(entry.path);

            if (entry.oldIE) {
                css.push(entry.oldIE);
            }
        });

        callback(null, {
            name       : path.basename(filename, path.extname(filename)),
            label      : context.title,
            description: context.subTitle,
            tags       : context.tags,

            html: html,
            css : css,
            js  : context.localJS   || [],
            imgs: context.localImgs || []
        });
    }

    function renderTemplate(filename, callback) {
        // Create a new context object that mixes from the defaults so when the
        // template is rendered we'll be able to sniff out the data added by
        // the Handlebars helpers.
        var context = utils.extend({}, contextProto);

        async.waterfall([
            hbs.renderView.bind(hbs, path.join(DIR_PATH, filename), context),
            createLayout.bind(null, filename, context)
        ], callback);
    }

    async.map(filenames, renderTemplate, callback);
}

function loadResources(layouts, callback) {
    function processFile(type, filename, callback) {
        fs.readFile(path.join(config.dirs.pub, filename), {
            // Set the encoding for non-binary files.
            encoding: type === 'imgs' ? null : 'utf8'
        }, function (err, data) {
            callback(err, {
                name    : path.basename(filename),
                filename: filename,
                data    : data
            });
        });
    }

    function loadFiles(layout, type, callback) {
        async.map(layout[type], processFile.bind(null, type), function (err, files) {
            // Replace the list of filenames used by this layout with a
            // collection of metadata for each file which includes its:
            // name, filename, and contents.
            layout[type] = files;
            callback(err, files);
        });
    }

    async.each(layouts, function (layout, callback) {
        async.parallel([
            loadFiles.bind(null, layout, 'css'),
            loadFiles.bind(null, layout, 'js'),
            loadFiles.bind(null, layout, 'imgs')
        ], callback);
    }, function (err) {
        callback(err, layouts);
    });
}
