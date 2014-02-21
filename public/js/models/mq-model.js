YUI.add('mq-model', function (Y, NAME, imports, exports) {

    var mediaQuery = imports['css-mediaquery'];

    exports.MqModel = Y.Base.create('mq-model', Y.Model, [], {
        isValidMediaQuery: function () {
            try {
                mediaQuery.parse(this.get('mq'));
            } catch (e) {
                return false;
            }
            return true;
        }
    });

    exports.MqModelList = Y.Base.create('mq-model-list', Y.ModelList, [], {
        model: exports.MqModel,

        toObject: function () {
            var o = {};
            this.each(function (model) {
                o[model.get('id')] = model.get('mq');
            });
            return o;
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



