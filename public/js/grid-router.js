YUI.add('grid-router', function (Y) {
    'use strict';

    Y.GridRouter = Y.Base.create('grid-router', Y.Router, [], {

        initializer: function (cfg) {
            this.set('inputView', cfg.inputView);
            this.set('model', cfg.model);
            this.get('model').after('change', this.updateRoute);
            this.get('inputView').after('updateMediaQuery',
                Y.bind(this.updateMediaQuery, this));
            this.get('inputView').after('removeMediaQuery',
                Y.bind(this.removeMediaQuery, this));
            this.get('inputView').after('updateColumns',
                Y.bind(this.updateColumns, this));
            this.get('inputView').after('updatePrefix',
                Y.bind(this.updatePrefix, this));
        },

        parseCurrentQueryString: function () {
            var qs = window.location.search.slice(1); //remove `?`
            return Y.QueryString.parse(qs);
        },

        removeMediaQuery: function (e) {
            var qs = this.parseCurrentQueryString();
            delete qs[e.id];
            this.saveRoute(qs);
        },

        updateMediaQuery: function (e) {
            var qs = this.parseCurrentQueryString(),
                mqModelList = this.get('model').get('mediaQueries');

            //for each media query object, we want to:
            //Check if `id` exists
            //  -> update `value` if it does
            //  -> add a new model to the model list if it doesnt
            Y.Array.each(e.mq, function (o) {
                var existingModel = mqModelList.getById(e.oldKey || o.id);
                if (existingModel) {
                    existingModel.setAttrs({
                        id: o.id,
                        mq: o.mq
                    });

                    //remove the old key from the query string.
                    delete qs[e.oldKey];
                }
                else {
                    mqModelList.add({id: o.id, mq: o.mq});
                }
            });
            this.saveRoute(Y.merge(qs, mqModelList.toObject()));
        },

        updateColumns: function (e) {
            var qs = this.parseCurrentQueryString();
            this.saveRoute(Y.merge(qs, {cols: e.cols}));
        },

        updatePrefix: function (e) {
            var qs = this.parseCurrentQueryString();
            this.saveRoute(Y.merge(qs, {prefix: e.prefix}));
        },

        updateModel: function (req) {
            var query = req.query,
                cols = query.cols || '',
                prefix = query.prefix || '',
                model = this.get('model'),
                mq = [];

            delete query.cols;
            delete query.prefix;

            //convert query into an array
            Y.Object.each(query, function (val, key) {
                mq.push({id: key, mq: val});
            });

            model.setAttrs({
                cols: cols,
                prefix: prefix,
                mediaQueries: new Y.MqModelList({items: mq})
            });

            this.set('model', model);
        },

        saveRoute: function (obj) {
            this.save('/?' + Y.QueryString.stringify(obj));
        }
    }, {
        ATTRS: {
            root: {
                value: '/start/'
            },
            routes: {
                value: [
                    {path: '/', callbacks: 'updateModel'}
                ]
            }
        }
    });
}, '0.0.1', {
    requires: [
        'mq-model-list',
        'querystring',
        'router'
    ]
});

