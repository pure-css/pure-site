YUI.add('grid-model', function (Y, NAME, imports, exports) {

    'use strict';

    var rework      = Y.config.global.rework,
        pureGrids   = imports['rework-pure-grids'],
        MqModelList = imports['mq-model'].MqModelList;

    exports = Y.Base.create('grid-model', Y.Model, [], {

        initializer: function (cfg) {
            this._mqs = new MqModelList();
            this._mqs.addTarget(this);

            this.after(['*:change', '*:add', '*:remove'], this._fireUpdate);
        },

        toString: function () {
            var obj = this.toJSON(),
                mqs = obj.mediaQueries;

            // Prune model details and mix in `mqs` map.
            delete obj.mediaQueries;
            delete obj.id;

            mqs.each(function (mq) {
                obj[mq.get('id')] = mq.getReduced();
            });

            // Prune query string of any falsy values before serialization.
            Y.Object.each(obj, function (val, key) {
                if (!val) {
                    delete obj[key];
                }
            });

            return Y.QueryString.stringify(obj);
        },

        generate: function () {
            // TODO move default prefix out somewhere else.
            return rework('').use(pureGrids.units(this.get('cols'), {
                mediaQueries  : this.get('mediaQueries').toObject(),
                selectorPrefix: this.get('prefix') || '.pure-u-'
            })).toString({indent: '    '});
        },

        _fireUpdate: function (e) {
            this.fire('update', {originEvent: e});
        },

        _validateCols: function (val) {
            // TODO move these limits out to public/start.js.
            return (!val || (val <= app.start.limits.cols.max &&
                    val >= app.start.limits.cols.min));
        },

        _setCols: function (val) {
            return parseInt(val, 10) || undefined;
        },

        _validatePrefix: function (val) {
            // TODO move these limits out to public/start.js.
            var prefixLimits = app.start.limits.prefix;

            return (!val || (val.length <= prefixLimits.max &&
                    val.length >= prefixLimits.min));
        },

        _getMediaQueries: function () {
            return this._mqs;
        },

        _setMediaQueries: function (val) {
            return this._mqs.reset(val);
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
