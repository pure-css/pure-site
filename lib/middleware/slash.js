module.exports = function (req, res, next) {
    var routes   = req.app.routes[req.method.toLowerCase()],
        urlParts = req.url.match(/^(.*?)(\?.*)?$/),
        path     = urlParts[1],
        query    = urlParts[2] || '',
        match;

    if (!routes) { return next(); }

    // Look for matching route.
    match = routes.some(function (r) {
        return r.match(path + '/');
    });

    if (match) {
        res.redirect(301, path + '/' + query);
    } else {
        next();
    }
};
