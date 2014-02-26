YUI.add('mq-model', function (Y, NAME, imports, exports) {

    'use strict';

    var mediaQuery = imports['css-mediaquery'];

    exports.MqModel = Y.Base.create('mq-model', Y.Model, [], {
        isValidMediaQuery: function () {
            try {
                return !!mediaQuery.parse(this.get('mq'));
            } catch (e) {
                return false;
            }
        },

        getReduced: function () {
            var query = this.get('mq'),
                parsed, exp;

            if (!this.isValidMediaQuery()) { return query; }

            parsed = mediaQuery.parse(query);
            if (parsed.length !== 1) { return query; }

            parsed = parsed[0];
            if (parsed.inverse || parsed.type !== 'screen' ||
                    parsed.expressions.length !== 1) { return query; }

            exp = parsed.expressions[0];
            if (exp.feature === 'width' && exp.modifier === 'min') {
                query = exp.value;
            }

            return query;
        },

        _setMq: function (mq, options) {
            mq = mq.trim();
            var expand = options && options.expand;

            if (expand) {
                mq = 'screen and (min-width: ' + mq + ')';
            }

            try {
                mediaQuery.parse(mq);
                return mq;
            } catch (e) {
                // When we've already expanded the short-hand MQ syntax, or when
                // the short-hand form doesn't look like a length value, signal
                // that the valid is invalid.
                if (expand || !/^(\d|\.)/.test(mq)) {
                    return Y.Attribute.INVALID_VALUE;
                }
            }

            // Try again, this time expanding the `mq` assuming it's in the
            // short-hand.
            return this._setMq(mq, {expand: true});
        }
    }, {
        ATTRS: {
            mq: {
                setter: '_setMq'
            }
        }
    });

    exports.MqModelList = Y.Base.create('mq-model-list', Y.ModelList, [], {
        model: exports.MqModel,

        toObject: function () {
            var obj = {};

            this.each(function (model) {
                obj[model.get('id')] = model.get('mq');
            });

            return obj;
        }
    });

    return exports;

}, '0.0.1', {
    es: true,
    requires: [
        'model',
        'model-list',
        'css-mediaquery'
    ]
});
