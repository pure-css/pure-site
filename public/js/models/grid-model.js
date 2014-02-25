YUI.add('grid-model', function (Y, NAME, imports, exports) {

    'use strict';

    var rework      = Y.config.global.rework,
        pureGrids   = imports['rework-pure-grids'],
        MqModelList = imports['mq-model'].MqModelList;

    exports = Y.Base.create('grid-model', Y.Model, [], {

        initializer: function (cfg) {
            this._mq = new MqModelList();
            this._mq.addTarget(this);
        },

        toString: function () {
            var obj = this.toJSON(),
                mq  = obj.mediaQueries;

            delete obj.mediaQueries;
            delete obj.id;

            Y.Object.each(obj, function (val, key) {
                if (!val) {
                    delete obj[key];
                }
            });

            mq = Y.Array.reduce(mq.toArray(), {}, function (map, mq) {
                map[mq.get('id')] = mq.getReduced();
                return map;
            });

            return Y.QueryString.stringify(Y.merge(obj, mq));
        },

        generate: function () {
            // TODO move default prefix out somewhere else.
            return rework('').use(pureGrids.units(this.get('cols'), {
                mediaQueries  : this.get('mediaQueries').toObject(),
                selectorPrefix: this.get('prefix') || '.pure-u-'
            })).toString({indent: '    '});
        },

        _validateCols: function (val) {
            // TODO move these limits out to public/start.js.
            return (!val || (val <= app.start.limits.cols.max &&
                    val >= app.start.limits.cols.min));
        },

        _setCols: function (val) {
            return parseInt(val, 10);
        },

        _validatePrefix: function (val) {
            // TODO move these limits out to public/start.js.
            var prefixLimits = app.start.limits.prefix;

            return (!val || (val.length <= prefixLimits.max &&
                    val.length >= prefixLimits.min));
        },

        _getMediaQueries: function () {
            return this._mq;
        },

        _setMediaQueries: function (val) {
            return this._mq.reset(val);
        }

    }, {
        ATTRS: {
            cols: {
                setter   : '_setCols',
                validator: '_validateCols'
            },

            prefix: {
                validator: '_validatePrefix'
            },

            mediaQueries: {
                getter: '_getMediaQueries',
                setter: '_setMediaQueries'
            }
        }
    });

    return exports;

}, '0.0.1', {
    es: true,
    requires: [
        'mq-model',
        'rework',
        'rework-pure-grids',
        'querystring'
    ]
});
