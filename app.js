var combo     = require('combohandler'),
    express   = require('express'),
    expparams = require('express-params'),
    expmap    = require('express-map'),
    expstate  = require('express-state'),
    exphbs    = require('express3-handlebars'),
    path      = require('path'),

    config     = require('./config'),
    hbs        = require('./lib/hbs'),
    middleware = require('./middleware'),
    routes     = require('./routes');

var app = module.exports = express();

// -- Configure App ------------------------------------------------------------

expmap.extend(app);
expparams.extend(app);
expstate.extend(app);

app.set('name', 'Pure');
app.set('env', config.env);
app.set('port', config.port);
app.set('state namespace', 'app');
app.enable('strict routing');
app.enable('case sensitive routing');

app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
app.set('views', config.dirs.views);

app.locals({
    site          : 'Pure',
    copyright_year: '2014',

    version    : config.version,
    yui_version: config.yui.version,

    isDevelopment: config.isDevelopment,
    isProduction : config.isProduction,

    min: config.isProduction ? '-min' : '',

    ga       : config.isProduction && config.ga,
    typekit  : config.typekit,
    html5shiv: config.html5shiv
});

app.expose(config.yui.config, 'window.YUI_config', {cache: true});

// -- Middleware ---------------------------------------------------------------

if (config.isDevelopment) {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon(path.join(config.dirs.pub, 'favicon.ico')));
app.use(middleware.pure(config.pure));
app.use(app.router);
app.use(middleware.slash());

if (config.isDevelopment || config.pure.serveLocally) {
    app.locals.servePureLocally = true;
    app.use('/css/pure/', express.static(config.pure.local));
    console.log('Serving Pure', config.pure.version, 'from:', config.pure.local);
}

app.use(express.static(config.dirs.pub));
app.use(middleware.notfound);

if (config.isDevelopment) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack     : true
    }));
} else {
    app.use(middleware.error);
}

// -- Routes -------------------------------------------------------------------

// Sugar to route pages and add them to the nav menu.
function page(path, name, label, callbacks) {
    if (typeof label !== 'string') {
        callbacks = label;
        label     = null;
    }

    app.get(path, callbacks || routes.render(name));
    app.map(path, name);

    if (label) {
        app.annotate(path, {label: label});
    }
}

// Basic docs pages.

page('/',           'home');
page('/base/',      'base',      'Base');
page('/grids/',     'grids',     'Grids',       routes.grids.index);
page('/forms/',     'forms',     'Forms');
page('/buttons/',   'buttons',   'Buttons');
page('/tables/',    'tables',    'Tables');
page('/menus/',     'menus',     'Menus');
page('/start/',     'start',     'Get Started', routes.start.index);
page('/layouts/',   'layouts',   'Layouts',     routes.layouts.index);
page('/customize/', 'customize', 'Customize');
page('/extend/',    'extend',    'Extend');

// Layout examples.

app.param('layout', function (val) {
    var valLowerCase = val.toLowerCase();

    if (app.enabled('case sensitive routing')) {
        return valLowerCase === val && val;
    }

    return valLowerCase;
});

page('/layouts/:layout/',         'layout',          routes.layouts.layout);
page('/layouts/:layout/download', 'layout-download', routes.layouts.download);

page('/start/download', 'start-download', routes.start.download);

// Static asset combo.
app.get('/combo/:version', [
    combo.combine({rootPath: config.dirs.pub}),
    combo.respond
]);

// Redirects
app.get('/updates/', routes.redirect('http://blog.purecss.io/', 301));

// Create Handlebars `pathTo` helper using the routes map.
app.pathTo = expmap.pathTo(app.getRouteMap());
hbs.helpers.pathTo = function (name, options) {
    return app.pathTo(name, options.hash);
};

// Create `nav` local with all labeled routes.
app.locals.nav = app.findAll('label').get.map(function (route) {
    var annotations = app.annotations[route.path];

    return {
        path   : route.path,
        name   : annotations.name,
        label  : annotations.label,
        divider: annotations.name === 'start'
    };
});
