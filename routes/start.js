'use strict';

module.exports = function (req, res, next) {
    res.expose(req.query, 'app.start.query');
    res.render('start');
};
