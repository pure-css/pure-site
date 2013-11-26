var path = require('path'),

    config     = require('../config'),
    liblayouts = require('../lib/layouts'),
    error      = require('../lib/utils').error;

exports.index    = [loadLayouts, showIndex];
exports.layout   = showLayout;
exports.download = downloadLayout;

// -----------------------------------------------------------------------------

function loadLayouts(req, res, next) {
    liblayouts.load({
        cache: req.app.enabled('view cache')
    }, function (err, layouts) {
        if (err) { return next(err); }
        res.locals.layouts = layouts;
        next();
    });
}

function showIndex(req, res, next) {
    res.render('layouts');
}

function showLayout(req, res, next) {
    var layout   = req.params.layout,
        template = path.join('layouts', 'examples', layout);

    res.render(template, {
        section: 'Layout Examples',
        layout : 'blank'
    }, function (err, body) {
        if (err) {
            // Unset the "blank" page layout so that the 404 page uses the app's
            // default page layout.
            delete res.locals.layout;
            next(error(404));
        } else {
            res.send(body);
        }
    });
}

function downloadLayout(req, res, next) {
    var layoutName = req.params.layout;

    liblayouts.load({
        cache: req.app.enabled('view cache')
    }, function (err, layouts) {
        if (err) { return next(err); }

        var layout   = liblayouts.find(layouts, layoutName),
            filename = 'pure-layout-' + layoutName + '.zip';

        if (!layout) { return next(error(404)); }

        res.set('Content-Disposition', 'attachment; filename="' + filename + '"');
        liblayouts.archive(layout).pipe(res);
    });
}
