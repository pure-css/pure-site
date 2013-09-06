var path   = require('path'),

    config     = require('../../config'),
    liblayouts = require('../layouts');

exports.index  = [loadLayouts, showIndex];
exports.layout = showLayout;

function loadLayouts(req, res, next) {
    liblayouts.load({
        cache: req.app.enabled('view cache')
    }, function (err, layouts) {
        res.locals.layouts = layouts;
        next();
    });
}

function showIndex(req, res, next) {
    res.render('layouts');
}

function showLayout(req, res, next) {
    var layout   = req.params.layout.toLowerCase(),
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
