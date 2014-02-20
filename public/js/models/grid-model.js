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

        stringify: function () {

            var o = this.toJSON(),
                mq = this.get('mediaQueries');

            delete o.mediaQueries;
            delete o.id;

            Y.Object.each(o, function (val, key) {
                if (!val) {
                    delete o[key];
                }
            });

            mq.each(function (val) {
                o[val.get('id')] = val.get('mq');
            });
            return Y.QueryString.stringify(o);
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
        ATTRS: {
            cols: {
                setter: function (val) {
                    return parseInt(val, 10);
                },

                validator: function (val) {
                    //no value is fine
                    if (!val || (val <= app.start.limits.cols.max
                        && val >= app.start.limits.cols.min)) {
                        return true;
                    }
                    return false;
                }
            },

            prefix: {
                validator: function (val) {
                    if (!val || (val.length <= app.start.limits.prefix.max
                        && val.length >= app.start.limits.prefix.min)) {
                        return true;
                    }
                    return false;
                }
            }
        }
    });

}, '0.0.1', {
    requires: [
        'model',
        'mq-model-list',
        'rework',
        'rework-pure-grids',
        'querystring'
    ]
});



