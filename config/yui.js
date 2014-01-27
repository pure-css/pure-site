'use strict';

var isProduction = process.env.NODE_ENV === 'production';

exports.version = '3.14.1';

exports.config = {
    combine: isProduction,
    filter : isProduction ? 'min' : 'raw',
    root   : exports.version + '/',

    groups: {
        'app': {
            combine  : isProduction,
            comboBase: '/combo/' + require('../package').version + '?',
            base     : '/',
            root     : '/',

            modules: {
                'css-mediaquery': {
                    path: 'vendor/css-mediaquery.js'
                },

                'rework': {
                    path: 'vendor/rework.js'
                },

                'rework-pure-grids': {
                    path: 'vendor/rework-pure-grids.js'
                }
            }
        }
    }
};
