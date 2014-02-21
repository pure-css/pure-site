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
            this.get('outputView').render();
            this.get('downloadView').render();
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

        inputView: {},
        outputView: {},
        downloadView: {},
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
            container: '.grid-output',
            template: Handlebars.template(app.templates.start.css)
        }),

        downloadView = new Y.View({
            model: gridModel,
            container: '.grid-download',
            template: 'download/?{query}'
        }),

        router = new Y.GridRouter({
            root : '/start/',
            inputView: inputView,
            outputView: outputView,
            downloadView: downloadView,
            model: gridModel
        });

        downloadView.render = function () {
            var link = Y.Lang.sub(this.template, {
                query: this.get('model').toString()
            });
            this.get('container').one('.download-link').setAttribute('href', link);
        };

        inputView.render(); //this view just needs to render once.
        router.dispatch(); //let's start the show
});
