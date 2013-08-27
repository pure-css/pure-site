var path  = require('path'),
    error = require('../utils').error;

exports.render   = render;
exports.redirect = redirect;
exports.layout   = layout;

function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }

        res.render(viewName || req.route.annotations.name);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}

function layout(layoutsDir) {
    return function (req, res, next) {
        var layout = req.params.layout.toLowerCase();

        res.locals.layout = 'blank';
        res.render(path.join(layoutsDir, layout), function (err, body) {
            if (err) {
                delete res.locals.layout;
                next(error(404));
            } else {
                res.send(body);
            }
        });
    };
}
