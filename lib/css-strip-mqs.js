'use strict';

var path    = require('path'),
    rework  = require('rework'),
    stripmq = require('./stripmq'),
    Filter  = require('broccoli-filter');

module.exports = StripMQs;

// -----------------------------------------------------------------------------

function StripMQs(inputTree, options) {
    options || (options = {});

    if (!(this instanceof StripMQs)) {
        return new StripMQs(inputTree, options);
    }

    Filter.call(this, inputTree, options);

    this.suffix = options.suffix || '';
}

StripMQs.prototype = Object.create(Filter.prototype);
StripMQs.prototype.constructor = StripMQs;

StripMQs.prototype.extensions      = ['css'];
StripMQs.prototype.targetExtension = 'css';

StripMQs.prototype.getDestFilePath = function (relPath) {
    relPath = Filter.prototype.getDestFilePath.call(this, relPath);

    var fileName;

    if (relPath) {
        fileName = path.basename(relPath, '.css') + this.suffix +
                '.' + this.targetExtension;

        return path.join(path.dirname(relPath), fileName);
    }
};

StripMQs.prototype.processString = function (content) {
    return rework(content).use(stripmq()).toString({indent: '    '});
};
