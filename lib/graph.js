/*jshint globalstrict: true, node: true*/
'use strict';

var path         = require('path'),
    fs           = require('fs'),    
    util         = require('util'),
    moduleFormat = require('js-module-formats'),
    graph        = require('module-graph'),
    Writer       = require('broccoli-writer'),
    helpers      = require('broccoli-kitchen-sink-helpers'),
    walkSync     = require('walk-sync');

module.exports = GraphWriter;

function hash(list) {
    var result = {};

    list.forEach(function (o) {
        result[o.key] = o.value;
    });

    return result;
}

function assign(target/*, ...sources*/) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    });
    return target;
}

function GraphWriter(inputTree, options) {
    if (!(this instanceof GraphWriter)) {
        return new GraphWriter(inputTree, options);
    }
    this.inputTree = inputTree;
    this.options   = assign({}, this.defaults, options || {});
    this._cache    = {};
}
util.inherits(GraphWriter, Writer);

GraphWriter.prototype.defaults = {
    dest: 'graph.json'
};

GraphWriter.prototype.write = function (readTree, destDir) {
    var options  = this.options,
        destFile = path.join(destDir, this.options.dest),
        cache    = this._cache;

    return readTree(this.inputTree).then(function (srcDir) {
        var sources, deps;

        sources = walkSync(srcDir)
            .filter(function (relPath) {
                return path.extname(relPath) === '.js';
            })
            .map(function (relPath) {
                var cacheEntry = cache[relPath],
                    srcPath    = path.join(srcDir, relPath),
                    statsHash  = helpers.hashTree(srcPath);

                if (!cacheEntry || cacheEntry.statsHash !== statsHash) {
                    cacheEntry = cache[relPath] = {
                        statsHash: statsHash,
                        key: path.basename(relPath, '.js'),
                        value: fs.readFileSync(srcPath, 'utf8')
                    };
                }

                return cacheEntry;
            })
            .filter(function (entry) {
                return moduleFormat.detect(entry.value) === 'es';
            });
        
        deps = graph(hash(sources));

        fs.writeFileSync(destFile, JSON.stringify(deps), 'utf8');
    });
};
