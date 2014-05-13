'use strict';

var fs       = require('fs'),
    path     = require('path'),
    mkdirp   = require('mkdirp'),
    walkSync = require('walk-sync'),
    parseCSS = require('css-parse'),
    helpers  = require('broccoli-kitchen-sink-helpers'),
    Writer   = require('broccoli-writer');

module.exports = CSSWithMQs;

// -----------------------------------------------------------------------------

function CSSWithMQs(inputTree) {
    if (!(this instanceof CSSWithMQs)) {
        return new CSSWithMQs(inputTree);
    }

    this.inputTree = inputTree;
    this._cache    = {};
}

CSSWithMQs.prototype = Object.create(Writer.prototype);
CSSWithMQs.prototype.constructor = CSSWithMQs;

CSSWithMQs.prototype.write = function (readTree, destDir) {
    var cache = this._cache;

    return readTree(this.inputTree).then(function (srcDir) {
        var cssFiles = walkSync(srcDir).filter(function (relPath) {
            return path.extname(relPath) === '.css';
        });

        cssFiles.forEach(function (relPath) {
            var cacheEntry = cache[relPath],
                srcPath    = path.join(srcDir, relPath),
                statsHash  = helpers.hashTree(srcPath),
                hasMQs, file;

            if (cacheEntry && cacheEntry.statsHash === statsHash) {
                hasMQs = cacheEntry.hasMQs;
            } else {
                file   = fs.readFileSync(srcPath, 'utf8');
                hasMQs = parseCSS(file).stylesheet.rules.some(function (rule) {
                    return rule.type === 'media';
                });

                cache[relPath] = {
                    hasMQs   : hasMQs,
                    statsHash: statsHash
                };
            }

            if (hasMQs) {
                mkdirp.sync(path.join(destDir, path.dirname(relPath)));
                helpers.copyPreserveSync(srcPath, path.join(destDir, relPath));
            }
        });
    });
};
