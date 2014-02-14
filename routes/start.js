'use strict';

var mediaQuery = require('css-mediaquery'),
    rework     = require('rework'),
    grids      = require('rework-pure-grids');

var hbs           = require('../lib/hbs'),
    utils         = require('../lib/utils'),
    middleware    = require('../middleware'),
    gridUnits     = require('../config').pure.grid,
    COL_LIMIT     = 100,
    MQ_LIMIT      = 10,
    selectedUnits = {
        med: mediaQuery.parse(gridUnits.med)[0],
        lrg: mediaQuery.parse(gridUnits.lrg)[0]
    };

exports.index = [
    normalizeOptions,
    middleware.exposeTemplates('start'),
    showStart
];

// -----------------------------------------------------------------------------

var LIMITS = {
    cols        : {min: 2, max: 100},
    prefix      : {min: 0, max: 80},
    mediaQueries: {min: 0, max: 10}
};

function normalizeOptions(req, res, next) {
    var mediaQueries = [],
        cols, prefix;

    function badRequest(label, message) {
        res.locals.message = message;
        throw utils.error(400, 'Bad Request: ' + label);
    }

    Object.keys(req.query).forEach(function (param) {
        var val = req.query[param];

        if (Array.isArray(val)) {
            badRequest('Duplicate param',
                '"' + param + '" must only have a single value.');
        }

        switch (param.toLowerCase()) {
            case 'cols':
                val = parseInt(val, 10);

                if (val < LIMITS.cols.min || val > LIMITS.cols.max) {
                    badRequest('Column range',
                        '"cols" must be between 2—100, inclusively.');
                }

                cols = val;
                break;

            case 'prefix':
                if (val.length > LIMITS.prefix.max) {
                    badRequest('Prefix length',
                        '"prefix" must be between 0—80 characters.');
                }

                prefix = val;
                break;

            // Assume it's a media query.
            default:
                try {
                    val = normalizeMediaQuery(val);
                } catch (e) {
                    badRequest('Media Query',
                        'Invalid CSS Media Query: "' + val + '".');
                }

                mediaQueries.push({
                    id: param,
                    mq: val
                });

                break;
        }
    });

    if (mediaQueries.length > LIMITS.mediaQueries.max) {
        badRequest('Media Query',
            'More than 10 CSS Media Queries were provided.');
    }

    req.startOptions = {
        cols        : cols,
        prefix      : prefix,
        mediaQueries: mediaQueries,
        gridUnits   : selectedUnits
    };
    next();
}


function normalizeMediaQuery(mq, options) {
    mq = mq.trim();
    var expand = options && options.expand;

    if (expand) {
        mq = 'screen and (min-width: ' + mq + ')';
    }

    try {
        mediaQuery.parse(mq);
        return mq;
    } catch (e) {
        // When we've already expanded the short-hand MQ syntax, or when the
        // short-hand form doesn't look like a length value, re-throw the error.
        if (expand || !/^(\d|\.)/.test(mq)) {
            throw e;
        }
    }

    // Try again, this time expanding the `mq` assuming it's in the short-hand.
    return normalizeMediaQuery(mq, {expand: true});
}

function showStart(req, res, next) {
    var options = req.startOptions;

    res.locals(options);

    res.locals.css = rework('').use(grids.units(options.cols, {
        mediaQueries: options.mediaQueries.reduce(function (map, mq) {
            map[mq.id] = mq.mq;
            return map;
        }, {})
    })).toString({indent: '    '});

    res.expose(LIMITS, 'start.limits');
    res.expose(options, 'start.options');
    res.render('start');
}
