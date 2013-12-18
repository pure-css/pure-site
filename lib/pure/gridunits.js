'use strict';

var fs       = require('fs'),
    path     = require('path'),
    parseCSS = require('css-parse'),
    Promise  = require('es6-promise').Promise;

var utils = require('../utils');

module.exports = function gridUnits(pureDir, callback) {
    readUnits(path.join(pureDir, 'grids-units.css'))
        .then(parseCSS)
        .then(getUnits)
        .then(utils.passValue(callback))
        .catch(utils.passError(callback));
};

// -----------------------------------------------------------------------------

function getUnits(unitsCSS) {
    var units = {n5: [], n24: []};

    unitsCSS.stylesheet.rules.forEach(function (rule) {
        if (!rule.declarations) { return; }

        rule.declarations.forEach(function (declaration) {
            if (declaration.property !== 'width') { return; }

            rule.selectors.map(function (selector) {
                return selector.substring(1);
            }).forEach(function (selector) {
                var captures    = selector.match(/(\d+)(?:-(\d+))?$/),
                    numerator   = captures[1],
                    denominator = captures[2] || null;

                var entry = {
                    width    : numerator + (denominator ? '-' + denominator : ''),
                    selector : selector,
                    isReduced: isReducedFraction(numerator, denominator)
                };

                switch (denominator) {
                    case null:
                    case '1':
                        units.n5.push(entry);
                        units.n24.push(entry);
                        break;
                    case '5' :
                        units.n5.push(entry);
                        break;
                    default:
                        units.n24.push(entry);
                }
            });
        });
    });

    units.n5.sort(compareWidths);
    units.n24.sort(compareWidths);

    return units;
}

function compareWidths(a, b) {
    a = a.width.split('-').map(Number);
    b = b.width.split('-').map(Number);

    // Whole numbers.
    a[1] || (a[1] = 1);
    b[1] || (b[1] = 1);

    if ((a[0] / a[1]) < (b[0] / b[1])) { return -1; }
    if ((a[0] / a[1]) > (b[0] / b[1])) { return 1; }

    if (a[1] < b[1]) { return -1; }
    if (a[1] > b[1]) { return 1; }

    return 0;
}

function isReducedFraction(numerator, denominator) {
    numerator   = Number(numerator);
    denominator = Number(denominator) || 1;

    var gcd          = getGCD(numerator, denominator),
        rNumerator   = numerator / gcd,
        rDenominator = denominator / gcd;

    return rNumerator === numerator && rDenominator === denominator;
}

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function readUnits(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, file) {
            if (err) { return reject(err); }
            resolve(file);
        });
    });
}
