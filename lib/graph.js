/*jshint globalstrict: true, node: true*/
'use strict';

var path         = require('path'),
    fs           = require('fs'),
    util         = require('util'),
    extend       = require('./utils').extend,
    moduleFormat = require('js-module-formats'),
    graph        = require('module-graph'),
    Writer       = require('broccoli-writer'),
    helpers      = require('broccoli-kitchen-sink-helpers'),
    walkSync     = require('walk-sync');

module.exports = GraphWriter;

function hash(a) {
    var result = {};
    a.forEach(function (entry) {
        result[entry.key] = entry.value;
    });
    return result;
}

function GraphWriter(inputTree, options) {
    if (!(this instanceof GraphWriter)) {
        return new GraphWriter(inputTree, options);
    }
    this.inputTree = inputTree;
    this.options   = extend({}, this.defaults, options || {});
    this._cache    = {};
}
util.inherits(GraphWriter, Writer);

GraphWriter.prototype.defaults = {
    dest: 'graph.json'
};

GraphWriter.prototype.write = function (readTree, destDir) {
    var options  = this.options,
        destFile = path.join(destDir, this.options.dest),
        basePath = options.basePath || '',
        cache    = this._cache;

    return readTree(this.inputTree).then(function (srcDir) {
        var sources = walkSync(srcDir)
            .filter(function (relPath) {
                return path.extname(relPath) === '.js';
            })
            .map(function (relPath) {
                var cacheEntry = cache[relPath],
                    srcPath    = path.join(srcDir, relPath),
                    statsHash  = helpers.hashTree(srcPath),
                    type,
                    source,
                    dir,
                    key;

                if (!cacheEntry || cacheEntry.statsHash !== statsHash) {
                    source = fs.readFileSync(srcPath, 'utf8');
                    type = moduleFormat.detect(source);

                    // Resolve the module's name from a specified `basePath`.
                    dir = path.dirname(path.relative(basePath, relPath));
                    key = path.join(dir, path.basename(relPath, '.js'));

                    cacheEntry = cache[relPath] = {
                        key: key,
                        statsHash: statsHash,
                        type: type,
                        value: type === 'es' ? graph(source) : null
                    };

                    // If specified, resolve the module's imports against its
                    // own path.
                    if (cacheEntry.value && options.resolveImports) {
                        cacheEntry.value = cacheEntry.value.map(function (imp) {
                            if (imp.charAt(0) !== '.') { return imp; }
                            return path.resolve('/', dir, imp).substring(1);
                        });
                    }
                }

                return cacheEntry;
            })
            .filter(function (entry) {
                return entry.type === 'es';
            });

        fs.writeFileSync(destFile, JSON.stringify(hash(sources)), 'utf8');
    });
};
