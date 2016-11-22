'use strict';

var fs         = require('fs'),
    path       = require('path'),
    PromiseLib = global.Promise || require('ypromise'),
    zlib       = require('zlib');

var utils = require('../utils');

module.exports = function fileSizes(pureDir, callback) {
    getModules(pureDir)
        .then(getFileSizes.bind(null, pureDir))
        .then(utils.passValue(callback))
        .catch(utils.passError(callback));
};

// -----------------------------------------------------------------------------

function getModules(pureDir) {
    return new PromiseLib(function (resolve, reject) {
        fs.readdir(pureDir, function (err, files) {
            if (err) { return reject(err); }

            resolve(files.filter(function (file) {
                return (/\-min\.css$/).test(file);
            }).map(function (file) {
                return file.replace(/\-min\.css$/, '');
            }));
        });
    });
}

function getFileSizes(pureDir, modules) {
    return PromiseLib.all(modules.map(function (module) {
        var filePath = path.join(pureDir, module + '-min.css');
        return readModule(filePath).then(getSize);
    })).then(function (sizes) {
        return sizes.reduce(function (map, size, i) {
            map[modules[i]] = size;
            return map;
        }, {});
    });
}

function readModule(filePath) {
    return new PromiseLib(function (resolve, reject) {
        fs.readFile(filePath, function (err, file) {
            if (err) { return reject(err); }
            resolve(file);
        });
    });
}

function getSize(file) {
    return new PromiseLib(function (resolve, reject) {
        zlib.gzip(file, function (err, compressed) {
            if (err) { return reject(err); }
            resolve(compressed.length);
        });
    });
}
