var env  = process.env,
    path = require('path');

module.exports = Object.freeze({
    env          : env.NODE_ENV,
    isDevelopment: env.NODE_ENV !== 'production',
    isProduction : env.NODE_ENV === 'production',

    port: env.PORT || 5000,

    dirs: Object.freeze({
        pub     : path.resolve('public/'),
        views   : path.resolve('views/pages/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/')
    }),

    version: require('../package').version,

    ga     : 'UA-41480445-1',
    pure   : require('./pure'),
    typekit: 'ajf8ggy',
    yui    : require('./yui')
});
