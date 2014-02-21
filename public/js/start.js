YUI().require('router', 'view', 'handlebars-runtime', 'grid-input-view', 'grid-output-view', 'grid-model', function (Y, imports) {
    'use strict';

    var GridModel = imports['grid-model'],
        GridInputView = imports['grid-input-view'],
        GridOutputView = imports['grid-output-view'];

    var GridRouter = Y.Base.create('grid-router', Y.Router, [], {

        initializer: function (cfg) {
            this.get('model').on('change', Y.bind(this.updateRoute, this));
            this.get('model').get('mediaQueries').on('change', Y.bind(this.updateRoute, this));
        },

        updateRoute: function () {
            this.save('/?' + this.get('model').toString());
        },

        renderViews: function (req) {
            this.get('outputView').render();
            this.get('downloadView').render();
        }
    }, {
      ATTRS: {
        inputView: {},
        outputView: {},
        downloadView: {},
        model: {}
      }
    });


    var gridModel = new GridModel(app.start.options),
        inputView = new GridInputView({
            model: gridModel,
            container: '.grid-input',
            template: Handlebars.template(app.templates.start.rows)
        }),

        outputView = new GridOutputView({
            model: gridModel,
            container: '.grid-output',
            template: Handlebars.template(app.templates.start.css)
        }),

        downloadView = new Y.View({
            model: gridModel,
            container: '.grid-download',
            template: 'download/?{query}'
        }),

        router = new GridRouter({
            root : '/start/',
            routes: [
                {path: '/',    callbacks: 'renderViews'}
            ],
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
