var combo     = require('combohandler'),
    express   = require('express'),
    exphbs    = require('express3-handlebars'),
    expmap    = require('express-map'),
    expparams = require('express-params'),
    expstate  = require('express-state'),
    expyui    = require('express-yui'),
    path      = require('path');

var config     = require('./config'),
    hbs        = require('./lib/hbs'),
    middleware = require('./middleware'),
    routes     = require('./routes');

var app = module.exports = express();

// -- Configure App ------------------------------------------------------------

expmap.extend(app);
expparams.extend(app);
expstate.extend(app);
expyui.extend(app);

app.set('name', 'Pure');
app.set('env', config.env);
app.set('port', config.port);
app.set('state namespace', 'app');
app.enable('strict routing');
app.enable('case sensitive routing');

app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
app.set('views', config.dirs.views);

app.yui.applyGroupConfig('app', {
    combine  : config.isProduction,
    comboBase: '/combo/' + config.version + '?',
    base     : '/',
    root     : '/',
    modules  : config.yui.modules
});

if (config.isDevelopment) {
    // Creates Broccoli watcher which manages the build/ dir.
    app.watcher = require('./lib/watcher');
}

if (config.isProduction) {
    app.yui.setCoreFromCDN();
}

// -- Middleware ---------------------------------------------------------------

if (config.isDevelopment) {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon(path.join(config.dirs.pub, 'favicon.ico')));
app.use(middleware.pure(config.pure));
app.use(expyui.expose());
app.use(app.router);
app.use(middleware.slash());

if (config.pure.serveLocally) {
    app.use('/css/pure/', express.static(config.pure.local));
    console.log('Serving Pure v%s from: "%s"',
        config.pure.version, config.pure.local);
}

if (app.watcher) {
    app.use(require('broccoli/lib/middleware')(app.watcher));
} else {
    app.use(express.static(config.dirs.pub));
}

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
page('/grids/',     'grids',     'Grids');
page('/forms/',     'forms',     'Forms');
page('/buttons/',   'buttons',   'Buttons');
page('/tables/',    'tables',    'Tables');
page('/menus/',     'menus',     'Menus');
page('/start/',     'start',     'Get Started', routes.start.index);
page('/layouts/',   'layouts',   'Layouts',     routes.layouts.index);
page('/tools/',     'tools',     'Tools');
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

page('/start/css',      'start-css',      routes.start.css);
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

// -- Locals -------------------------------------------------------------------

app.locals({
    site          : 'Pure',
    copyright_year: '2014',

    version    : config.version,
    yui_version: app.yui.config().version,

    isDevelopment: config.isDevelopment,
    isProduction : config.isProduction,

    servePureLocally: config.pure.serveLocally,

    min: config.isProduction ? '-min' : '',

    ga       : config.isProduction && config.ga,
    typekit  : config.typekit,
    html5shiv: config.html5shiv
});

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
