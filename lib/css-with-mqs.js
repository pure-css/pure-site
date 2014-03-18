'use strict';

var fs        = require('fs'),
    path      = require('path'),
    mkdirp    = require('mkdirp'),
    walkSync  = require('walk-sync'),
    parseCSS  = require('css-parse'),
    helpers   = require('broccoli-kitchen-sink-helpers'),
    Transform = require('broccoli-transform');

module.exports = CSSWithMQs;

// -----------------------------------------------------------------------------

function CSSWithMQs(inputTree) {
    if (!(this instanceof CSSWithMQs)) {
        return new CSSWithMQs(inputTree);
    }

    Transform.call(this, inputTree);
}

CSSWithMQs.prototype = Object.create(Transform.prototype);
CSSWithMQs.prototype.constructor = CSSWithMQs;

CSSWithMQs.prototype.transform = function (srcDir, destDir) {
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
            helpers.linkAndOverwrite(srcPath, path.join(destDir, relPath));
        }
    });
};
