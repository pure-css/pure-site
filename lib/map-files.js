'use strict';

var Promise = global.Promise || require('ypromise');

var path    = require('path'),
    helpers = require('broccoli-kitchen-sink-helpers'),
    Writer  = require('broccoli-writer');

module.exports = MapFiles;

// -----------------------------------------------------------------------------

function MapFiles(srcDir, mappings) {
    if (!(this instanceof MapFiles)) {
        return new MapFiles(srcDir, mappings);
    }

    this.srcDir = srcDir;

    this.mappings = Object.keys(mappings || {}).map(function (key) {
        return {
            src : key,
            dest: mappings[key]
        };
    });
}

MapFiles.prototype = Object.create(Writer.prototype);
MapFiles.prototype.constructor = MapFiles;

MapFiles.prototype.map = function (src, dest) {
    this.mappings.push({
        src : src,
        dest: dest
    });
};

MapFiles.prototype.write = function (readTree, destDir) {
    this.mappings.forEach(function (mapping) {
        helpers.copyRecursivelySync(
            path.join(this.srcDir, mapping.src),
            path.join(destDir, mapping.dest)
        );
    }, this);
};
