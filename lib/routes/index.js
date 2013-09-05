var path  = require('path'),
    error = require('../utils').error;

exports.render   = render;
exports.redirect = redirect;
exports.layouts  = require('./layouts');

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


