YUI.add('mq-model-list', function (Y) {

    var mediaQuery = Y.Env._exported['css-mediaquery'];

    Y.MqModelList = Y.Base.create('mq-model-list', Y.ModelList, [], {

        model: Y.Model,

        checkMediaQuery: function (mq) {
            return mediaQuery.parse(mq);
        },

        toObject: function () {
            var o = {};
            this.each(function (model) {
                o[model.get('id')] = model.get('mq');
            });
            return o;
        }

    }, {
        ATTRS: {
            defaultMq: {
                value: [
                    {
                        id: 'med',
                        mq: 'screen and (min-width: 48em)'
                    },
                    {
                        id: 'lrg',
                        mq: 'screen and (min-width: 60em)'
                    }
                ],
                readOnly: true
            }
        }
    });

}, '0.0.1', {
    requires: [
        'model-list',
        'css-mediaquery'
    ]
});



