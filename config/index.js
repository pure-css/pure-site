var env  = process.env,
    path = require('path');

module.exports = Object.freeze({
    env          : env.NODE_ENV,
    isDevelopment: env.NODE_ENV !== 'production',
    isProduction : env.NODE_ENV === 'production',

    port: env.PORT || 5000,

    dirs: Object.freeze({
        pub     : path.resolve('public/'),
        views   : path.resolve('views/'),
        layouts : path.resolve('views/layouts/'),
        partials: path.resolve('views/partials/')
    }),

    nav: [
        {id: 'home',  url: '/',       label: 'Home'},
        {id: 'forms', url: '/forms/', label: 'Forms'},
        {id: 'tables', url: '/tables/', label: 'Tables'}
    ],

    typekit: 'ajf8ggy',
    yui    : require('./yui')
});
