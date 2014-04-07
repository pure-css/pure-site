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
}

CSSWithMQs.prototype = Object.create(Writer.prototype);
CSSWithMQs.prototype.constructor = CSSWithMQs;

CSSWithMQs.prototype.write = function (readTree, destDir) {
    return readTree(this.inputTree).then(function (srcDir) {
        walkSync(srcDir).forEach(function (relPath) {
            if (relPath.slice(-1) === '/') { return; }
            if (path.extname(relPath) !== '.css') { return; }

            var srcPath = path.join(srcDir, relPath),
                file    = fs.readFileSync(srcPath, 'utf8');

            var hasMQs = parseCSS(file).stylesheet.rules.some(function (rule) {
                return rule.type === 'media';
            });

            if (hasMQs) {
                mkdirp.sync(path.join(destDir, path.dirname(relPath)));
                helpers.copyPreserveSync(srcPath, path.join(destDir, relPath));
            }
        });
    });
};
