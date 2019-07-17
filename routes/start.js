'use strict';

var archiver   = require('archiver'),
    mediaQuery = require('css-mediaquery'),
    rework     = require('rework'),
    grids      = require('rework-pure-grids'),
    path       = require('path'),
    stripmq    = require('stripmq');

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

exports.css = [
    normalizeOptions,
    generateCSS,
    sendCSS
];

exports.download = [
    normalizeOptions,
    generateCSS,
    generateHTML,
    downloadStart
];

// -----------------------------------------------------------------------------

var LIMITS = {
    cols        : {min: 2, max: 100},
    prefix      : {min: 0, max: 20},
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
        pure    : config.pure,
        needsCSS: res.needsCSS,
        css     : res.css,
        cssOldIE: res.cssOldIE
    }, {
        cache: req.app.enabled('view cache')
    }).then(function (html) {
        res.html = html;
        setImmediate(next);
    }).catch(utils.passError(next));
}

function generateCSS(req, res, next) {
    var defaults     = res.locals.pure.responsive,
        startOptions = req.startOptions,
        mediaQueries = startOptions.mediaQueries,
        numMQs       = mediaQueries.length,
        gridsGenOpts = {},
        genGridsCSS  = false;

    if ((startOptions.cols && startOptions.cols !== defaults.cols) ||
        (numMQs && numMQs !== defaults.mediaQueries.length)) {

        genGridsCSS = true;
    }

    if (startOptions.prefix && startOptions.prefix !== defaults.prefix) {
        genGridsCSS = true;
        gridsGenOpts.selectorPrefix = startOptions.prefix;
    }

    gridsGenOpts.mediaQueries = mediaQueries.reduce(function (mqs, mq, i) {
        var dmq = defaults.mediaQueries[i];

        if (!(dmq && dmq.id === mq.id && dmq.mq === mq.mq)) {
            genGridsCSS = true;
        }

        mqs[mq.id] = mq.mq;
        return mqs;
    }, {});

    res.needsCSS = genGridsCSS || !!numMQs;
    res.css      = null;
    res.cssOldIE = null;

    if (genGridsCSS) {
        res.css = rework('')
                .use(grids.units(startOptions.cols, gridsGenOpts))
                .toString({indent: '    '});

        if (numMQs) {
            res.cssOldIE = stripmq(res.css, null, {indent: '    '});
        }
    }

    next();
}

function showStart(req, res, next) {
    var pure         = res.locals.pure,
        defaults     = pure.responsive,
        startOptions = req.startOptions;

    res.locals.needsCSS = res.needsCSS;
    res.locals.css      = res.css;
    res.locals.cssOldIE = res.cssOldIE;
    res.locals.query    = req._parsedUrl.search;

    res.locals(startOptions);

    res.expose(pure.version, 'pure.version');
    res.expose(LIMITS,       'start.limits');
    res.expose(defaults,     'start.defaults');
    res.expose(startOptions, 'start.options');

    res.render('start');
}

function sendCSS(req, res, next) {
    res.json({
        css     : res.css,
        cssOldIE: res.cssOldIE
    });
}

function downloadStart(req, res, next) {
    var archive = archiver('zip');

    archive.append(res.html, {name: 'index.html'});

    if (res.css) {
        archive.append(res.css, {name: 'grid.css'});
    }

    if (res.cssOldIE) {
        archive.append(res.cssOldIE, {name: 'grid-old-ie.css'});
    }

    res.set('Content-Disposition', 'attachment; filename="pure-start.zip"');
    archive.pipe(res);
    archive.finalize();
}
