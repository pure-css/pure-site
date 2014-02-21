YUI.add('mq-model', function (Y) {

    var mediaQuery = Y.Env._exported['css-mediaquery'];

    Y.MqModel = Y.Base.create('mq-model', Y.Model, [], {
        isValidMediaQuery: function () {
            try {
                mediaQuery.parse(this.get('mq'));
            } catch (e) {
                return false;
            }
            return true;
        }
    });

    Y.MqModelList = Y.Base.create('mq-model-list', Y.ModelList, [], {
        model: Y.MqModel,

        toObject: function () {
            var o = {};
            this.each(function (model) {
                o[model.get('id')] = model.get('mq');
            });
            return o;
        }

    });

}, '0.0.1', {
    requires: [
        'model',
        'model-list',
        'css-mediaquery'
    ]
});



