YUI().require(
    'router', 'pjax-base', 'view', 'handlebars-runtime',
    'grid-input-view', 'grid-output-view', 'grid-model',
function (Y, imports) {

    'use strict';

    var GridModel      = imports['grid-model'],
        GridInputView  = imports['grid-input-view'],
        GridOutputView = imports['grid-output-view'],
        GridRouter     = Y.Base.create('grid-router', Y.Router, [Y.PjaxBase]);

    var gridModel = new GridModel(app.start.options);

    var inputView = new GridInputView({
        model    : gridModel,
        container: '.grid-input',
        template : Handlebars.template(app.templates.start.rows)
    });

    var outputView = new GridOutputView({
        model    : gridModel,
        container: '.grid-output',
        template : Handlebars.template(app.templates.start.css)
    });

    var downloadView = new Y.View({
        container: '.grid-download',
        template : 'download/{query}'
    });

    var router = new GridRouter({
        root        : '/start/',
        linkSelector: '.grid-input a'
    });

    gridModel.on('change', function (e) {
        if (e.src !== 'routeHandler') {
            router.save('/?' + this.toString());
        }
    });

    downloadView.render = function () {
        var url = Y.Lang.sub(this.template, {
            query: Y.config.win.location.search
        });

        this.get('container').one('.download-link').setAttribute('href', url);
    };

    router.route('/', function (req) {

        var query = req.query,
            o = {
                cols: query.cols,
                prefix: query.prefix,
                mediaQueries: []
            };
            delete query.cols;
            delete query.prefix;

        Y.Object.each(query, function (val, key) {
            o.mediaQueries.push({id: key, mq: val});
        });

        gridModel.setAttrs(o, {src: 'routeHandler'});

        inputView.render();
        outputView.render();
        downloadView.render();
    });

    inputView.attachEvents();
    outputView.attachEvents();
    router.upgrade();
});
