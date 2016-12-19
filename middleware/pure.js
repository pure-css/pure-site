'use strict';

var async = require('async');

var fileSizes  = require('../lib/pure/filesizes'),
    gridUnits  = require('../lib/pure/gridunits'),
    responsive = require('../lib/pure/responsive');

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
        filesizes : fileSizes.bind(null, pure.local),
        gridunits : gridUnits.bind(null, pure.local),
        responsive: responsive.bind(null, pure.local)
    }, function (err, results) {
        if (err) { return callback(err); }

        pureMetadata = {
            version   : pure.version,
            modules   : pure.modules,
            sriHash   : pure.sriHash,
            filesizes : results.filesizes,
            gridunits : results.gridunits,
            responsive: results.responsive
        };

        callback(null, pureMetadata);
    });
}
