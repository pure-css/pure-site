var error = require('../lib/utils').error;

module.exports = function (req, res, next) {
    if (!res.locals.message) {
        res.locals.message = 'Sorry, whatever you’re looking for isn’t here.';
    }

    next(error(404));
};
