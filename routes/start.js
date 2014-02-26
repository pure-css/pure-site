'use strict';

var archiver   = require('archiver'),
    mediaQuery = require('css-mediaquery'),
    rework     = require('rework'),
    grids      = require('rework-pure-grids'),
    path       = require('path');

var config     = require('../config'),
    hbs        = require('../lib/hbs'),
    utils      = require('../lib/utils'),
    middleware = require('../middleware');

exports.index = [
    normalizeOptions,
    middleware.exposeTemplates('start'),
    generateCSS,
    showStart
];

exports.download = [
    normalizeOptions,
    generateHTML,
    generateCSS,
    downloadStart
];

// -----------------------------------------------------------------------------

var LIMITS = {
    cols        : {min: 2, max: 100},
    prefix      : {min: 0, max: 20},
    mediaQueries: {min: 0, max: 10}
};

var SELECTED_GRIDS_UNITS = {
    med: new GridUnits(config.pure.grid.med),
    lrg: new GridUnits(config.pure.grid.lrg)
};

function GridUnits(mq) {
    utils.extend(this, {mq: mq}, mediaQuery.parse(mq)[0]);
}

GridUnits.prototype.toString = function () {
    return this.mq;
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
                        '"prefix" must be between 0—20 characters.');
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
        mediaQueries: mediaQueries
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

function generateHTML(req, res, next) {
    var template = path.join(config.dirs.shared, 'start', 'html' + hbs.extname);

    hbs.render(template, {
        cache: req.app.enabled('view cache'),
        pure : config.pure
    }, function (err, html) {
        if (err) { return next(err); }
        res.html = html;
        next();
    });
}

function generateCSS(req, res, next) {
    var startOptions = req.startOptions,
        mediaQueries = startOptions.mediaQueries,
        gridsGenOpts = {};

    gridsGenOpts.mediaQueries = mediaQueries.reduce(function (mqs, mq) {
        mqs[mq.id] = mq.mq;
        return mqs;
    }, {});

    if (startOptions.prefix) {
        gridsGenOpts.selectorPrefix = startOptions.prefix;
    }

    res.css = rework('')
            .use(grids.units(startOptions.cols, gridsGenOpts))
            .toString({indent: '    '});

    next();
}

function showStart(req, res, next) {
    var startOptions = req.startOptions;

    res.locals.selectedUnits = SELECTED_GRIDS_UNITS;
    res.locals.css           = res.css;
    res.locals.query         = req._parsedUrl.search;
    res.locals(startOptions);

    res.expose(LIMITS, 'start.limits');
    res.expose(startOptions, 'start.options');
    res.render('start');
}

function downloadStart(req, res, next) {
    var archive = archiver('zip');

    archive.append(res.html,         {name: 'index.html'});
    archive.append(res.css || '\n',  {name: 'grid.css'});

    res.set('Content-Disposition', 'attachment; filename="pure-start.zip"');
    archive.finalize().pipe(res);
}
