import {Object as YObject, config} from 'yui';
import {Base} from 'base-build';
import {Router} from 'router';
import {PjaxBase} from 'pjax-base';
import {View} from 'view';
import GridModel from 'grid-model';
import GridInputView from 'grid-input-view';
import GridOutputView from 'grid-output-view';
import GridDownloadView from 'grid-download-view';

var Handlebars = config.global.Handlebars,
    GridRouter = Base.create('grid-router', Router, PjaxBase);

var gridModel = new GridModel(app.start.options);

var inputView = new GridInputView({
    defaultMQs: app.start.defaults.mediaQueries,
    model     : gridModel,
    container : '.grid-input',
    template  : Handlebars.template(app.templates.start.rows)
});

var outputView = new GridOutputView({
    pure        : app.pure,
    model       : gridModel,
    container   : '.grid-output',
    cssTemplate : Handlebars.template(app.templates.start.css),
    htmlTemplate: Handlebars.template(app.templates.start.html)
});

var downloadView = new GridDownloadView({
    urlTemplate  : 'download{query}',
    trackTemplate: 'return Pure.trackDownload.call(this, \'start\', \'{label}\');',
    container    : '.grid-output-download',
    model        : gridModel
});

var router = new GridRouter({
    root        : '/start/',
    linkSelector: '.grid-input a'
});

gridModel.on('update', function (e) {
    // Avoid caring about changes made to the model in the route handler.
    if (e.originEvent.src !== 'url') {
        router.save('/?' + this.toString());
    }
});

router.route('/', function (req) {
    var query = req.query;

    var attrs = {
        cols        : query.cols,
        prefix      : query.prefix,
        mediaQueries: []
    };

    delete query.cols;
    delete query.prefix;

    YObject.each(query, function (val, key) {
        attrs.mediaQueries.push({
            id: key,
            mq: val
        });
    });

    gridModel.setAttrs(attrs, {src: 'url'});

    // Render ASAP since it doesn't depend on output.
    inputView.render();

    // Fetch CSS, then render the output view.
    gridModel.load({silent: true}, function () {
        outputView.render();
        downloadView.render();
    });
});

inputView.attachEvents();
outputView.attachEvents();
router.upgrade();
