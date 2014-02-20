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

                'handlebars-runtime': {
                    path: 'vendor/handlebars.runtime.js'
                },

                'rework': {
                    path: 'vendor/rework.js'
                },

                'rework-pure-grids': {
                    path: 'vendor/rework-pure-grids.js'
                },

                'grid-model': {
                    path: 'js/models/grid-model.js',
                    requires: [
                        'model',
                        'mq-model-list',
                        'rework',
                        'rework-pure-grids',
                        'querystring'
                    ]
                },

                'mq-model-list': {
                    path: 'js/models/mq-model-list.js',
                    requires: [
                        'model-list',
                        'css-mediaquery'
                    ]
                },

                'grid-input-view': {
                    path: 'js/views/grid-input-view.js',
                    requires: [
                        'view',
                        'node',
                        'event-focus'
                    ]
                },

                'grid-output-view': {
                    path: 'js/views/grid-output-view.js',
                    requires: [
                        'view',
                        'node'
                    ]
                }
            }
        }
    }
};
