YUI().use('grid-router', 'grid-input-view', 'grid-output-view', 'grid-model', function (Y) {
    'use strict';

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

        gridRouter = new Y.GridRouter({
            model: gridModel,
            inputView: inputView,
            outputView: outputView
        });

    inputView.render();
    outputView.render();
});
