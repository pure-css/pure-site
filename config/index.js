'use strict';

var env  = process.env,
    path = require('path');

module.exports = {
    env          : env.NODE_ENV,
    isDevelopment: env.NODE_ENV !== 'production',
    isProduction : env.NODE_ENV === 'production',

    port: env.PORT || 5000,

    dirs: {
        pub     : path.resolve('build/public/'),
        views   : path.resolve('views/pages/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/'),
        shared  : path.resolve('shared/templates/')
    },

    version: require('../package').version,

    pure     : require('./pure'),
    yui      : require('./yui'),
    ga       : 'UA-41480445-1',
    typekit  : 'gis6vng',
    html5shiv: '3.7'
};
