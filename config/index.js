'use strict';

var env   = process.env,
    path  = require('path');

exports = module.exports = {
    env          : env.NODE_ENV,
    isDevelopment: env.NODE_ENV !== 'production',
    isProduction : env.NODE_ENV === 'production',

    port: env.PORT || 5000,

    dirs: {
        pub     : path.resolve('build/'),
        views   : path.resolve('views/pages/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/'),
        shared  : path.resolve('shared/templates/')
    },

    version: require('../package').version,

    pure     : require('./pure'),
    ga       : 'UA-41480445-1',
    html5shiv: '3.7'
};

try {
    exports.graph = require(path.join(exports.dirs.pub, 'graph.json'));
} catch (e) {
    if (exports.isProduction) {
        throw e;
    }
}
