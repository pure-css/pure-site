'use strict';

var path         = require('path'),
    moduleFormat = require('js-module-formats'),
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

    this.type = options.type;
}

CompileModules.prototype = Object.create(Filter.prototype);
CompileModules.prototype.constructor = CompileModules;

CompileModules.prototype.extensions      = ['js'];
CompileModules.prototype.targetExtension = 'js';

CompileModules.prototype.processString = function (src, relPath) {
    if (moduleFormat.detect(src) !== 'es') {
        return src;
    }

    var name     = path.basename(relPath, '.js'),
        compiler = new Compiler(src, name);

    return compiler[formats[this.type]]();
};
