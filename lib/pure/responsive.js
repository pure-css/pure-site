'use strict';

var Promise = global.Promise || require('ypromise');

var fs         = require('fs'),
    path       = require('path'),
    parseCSS   = require('css-parse'),
    mediaQuery = require('css-mediaquery');

var utils = require('../utils');

module.exports = function gridUnits(pureDir, callback) {
    readFile(path.join(pureDir, 'grids-responsive.css'))
        .then(parseCSS)
        .then(getDefaults)
        .then(utils.passValue(callback))
        .catch(utils.passError(callback));
};

// -----------------------------------------------------------------------------

function getDefaults(responsiveCSS) {
    var defaults = {
        cols        : 24,
        prefix      : '.pure-u-',
        mediaQueries: []
    };

    responsiveCSS.stylesheet.rules.forEach(function (rule) {
        if (!(rule.type === 'media' && rule.rules.length)) { return; }

        var selector  = rule.rules[0].selectors[0],
            keyRegexp = new RegExp('^' + defaults.prefix + '([^-]+)');

        defaults.mediaQueries.push({
            id: selector.match(keyRegexp)[1],
            mq: rule.media
        });
    });

    return defaults;
}

function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, file) {
            if (err) { return reject(err); }
            resolve(file);
        });
    });
}
