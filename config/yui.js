'use strict';

exports.modules = {
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
            'mq-model',
            'rework',
            'rework-pure-grids',
            'querystring'
        ]
    },

    'mq-model': {
        path: 'js/models/mq-model.js',
        requires: [
            'model',
            'model-list',
            'css-mediaquery'
        ]
    },

    'grid-tab-view': {
        path: 'js/views/grid-tab-view.js',
        requires: [
            'view',
            'node'
        ]
    },

    'grid-input-view': {
        path: 'js/views/grid-input-view.js',
        requires: [
            'grid-tab-view',
            'event-focus'
        ]
    },

    'grid-output-view': {
        path: 'js/views/grid-output-view.js',
        requires: [
            'grid-tab-view'
        ]
    },

    'start': {
        path: 'js/start.js',
        requires: [
            'grid-model',
            'grid-input-view',
            'grid-output-view',
            'base-build',
            'router',
            'pjax-base',
            'view',
            'yui',
            // TODO this is right!
            'handlebars-runtime'
        ]
    }
};
