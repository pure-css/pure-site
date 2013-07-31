exports.render = function (viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }

        res.render(viewName);
    };
};

exports.redirect = function (url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
};
