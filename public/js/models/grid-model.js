YUI.add('grid-model', function (Y) {

    'use strict';

    var exported   = Y.Env._exported,
        rework     = Y.config.global.rework,
        pureGrids  = exported['rework-pure-grids'];

    Y.GridModel = Y.Base.create('grid-model', Y.Model, [], {

        initializer: function (cfg) {
            console.log(cfg);
            var mq = new Y.MqModelList({items: cfg.mediaQueries});
            this.set('mediaQueries', mq);
        },

        generate: function () {
            var mediaQueries = this.get('mediaQueries'),
                css = '';
            css += rework('').use(pureGrids.units(this.get('cols'), {
                mediaQueries: mediaQueries.toObject(),
                selectorPrefix: this.get('prefix') || '.pure-u-'
            })).toString();

            return css;
        }

    }, {
        ATTRS: {}
    });

}, '0.0.1', {
    requires: [
        'model',
        'mq-model-list',
        'rework',
        'rework-pure-grids'
    ]
});



