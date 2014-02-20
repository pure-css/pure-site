YUI().use('router', 'view', 'handlebars-runtime', 'grid-input-view', 'grid-output-view', 'grid-model', function (Y) {
    'use strict';

    Y.GridRouter = Y.Base.create('grid-router', Y.Router, [], {

        initializer: function (cfg) {
            this.get('model').on('change', Y.bind(this.updateRoute, this));
            this.get('model').get('mediaQueries').on('change', Y.bind(this.updateRoute, this));
        },

        updateRoute: function () {
            this.save('/?' + this.get('model').stringify());
        },

        renderViews: function (req) {
            Y.Array.each(this.get('views'), function (view) {
                view.render();
            });
        }
    }, {
      ATTRS: {
        root: {
          value: ''
        },

        routes: {
          value: [
            {path: '/',    callbacks: 'renderViews'}
          ]
        },

        views: {},
        model: {}
      }
    });


    var gridModel = new Y.GridModel(app.start.options),
        inputView = new Y.GridInputView({
            model: gridModel,
            container: '.grid-input',
            template: Handlebars.template(app.templates.start.rows)
        }),

        outputView = new Y.GridOutputView({
            model: gridModel,
            container: '.grid-output'
        }),

        downloadView = new Y.View({
            model: gridModel,
            container: '.grid-download',
            template: '/download/?{query}'
        }),

        router = new Y.GridRouter({
            root : '/start/',
            views: [inputView, outputView, downloadView],
            model: gridModel
        });

        downloadView.render = function () {
            var link = Y.Lang.sub(this.template, {
                query: this.get('model').stringify()
            });
            this.get('container').one('.download-link').setAttribute('href', link);
        };

        router.dispatch(); //let's start the show
});
