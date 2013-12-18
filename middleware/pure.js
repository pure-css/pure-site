'use strict';

var async = require('async');

var fileSizes = require('../lib/pure/filesizes'),
    gridUnits = require('../lib/pure/gridunits');

module.exports = function (pure) {
    return function (req, res, next) {
        getPureMetadata(pure, function (err, pureMetadata) {
            if (err) { return next(err); }
            res.locals.pure = pureMetadata;
            next();
        });
    };
};

// -----------------------------------------------------------------------------

var pureMetadata = null;

function getPureMetadata(pure, callback) {
    if (pureMetadata) {
        return callback(null, pureMetadata);
    }

    async.parallel({
        filesizes: fileSizes.bind(null, pure.local),
        gridunits: gridUnits.bind(null, pure.local)
    }, function (err, results) {
        if (err) { return callback(err); }

        pureMetadata = {
            version  : pure.version,
            modules  : pure.modules,
            filesizes: results.filesizes,
            gridunits: results.gridunits
        };

        callback(null, pureMetadata);
    });
}
