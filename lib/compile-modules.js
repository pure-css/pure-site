'use strict';

var path         = require('path'),
    moduleFormat = require('js-module-formats'),
    util         = require('util'),
    Filter       = require('broccoli-filter'),
    Compiler     = require("es6-module-transpiler").Compiler;

module.exports = CompileModules;

// -----------------------------------------------------------------------------

var formats = {
    amd    : 'toAMD',
    cjs    : 'toCJS',
    yui    : 'toYUI',
    globals: 'toGlobals'
};

function CompileModules(inputTree, options) {
    options || (options = {});

    if (!(this instanceof CompileModules)) {
        return new CompileModules(inputTree, options);
    }

    Filter.call(this, inputTree, options);

    this.type     = options.type;
    this.basePath = options.basePath || '';
}

util.inherits(CompileModules, Filter);

CompileModules.prototype.extensions      = ['js'];
CompileModules.prototype.targetExtension = 'js';

CompileModules.prototype.processString = function (src, relPath) {
    if (moduleFormat.detect(src) !== 'es') {
        return src;
    }

    // Resolve the module's name from it's path, relative to any `basePath`.
    var dir  = path.dirname(path.relative(this.basePath, relPath)),
        file = path.basename(relPath, '.' + this.targetExtension),
        name = path.join(dir, file);

    var compiler = new Compiler(src, name);

    // Resolve the module's relative imports against its own path.
    compiler.imports.forEach(function (imp) {
        var name = imp.source.value,
            resolved;

        if (name.charAt(0) === '.') {
            resolved = path.resolve('/', dir, name).substring(1);

            imp.source.value = resolved;
            imp.source.raw.replace(name, resolved);
        }
    });

    // Compile the module to the specified `type` format.
    return compiler[formats[this.type]]();
};
