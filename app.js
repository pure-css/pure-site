var express = require('express'),
    exphbs  = require('express3-handlebars'),
    path    = require('path'),

    config     = require('./config'),
    hbs        = require('./lib/hbs'),
    middleware = require('./lib/middleware'),
    routes     = require('./lib/routes'),

    app = express();

// -- Config -------------------------------------------------------------------

app.set('name', 'YUI CSS');
app.set('env', config.env);
app.set('port', config.port);
app.enable('strict routing');

app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
app.set('views', config.dirs.views);

app.locals({
    site          : 'YUI CSS',
    copyright_year: '2013',

    nav  : [],
    pages: {},

    isDevelopment: config.isDevelopment,
    isProduction : config.isProduction,

    min: config.isProduction ? '-min' : '',

    yui    : config.yui,
    typekit: config.typekit
});

// -- Middleware ---------------------------------------------------------------

if (config.isDevelopment) {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon(path.join(config.dirs.pub, 'favicon.ico')));
app.use(app.router);
app.use(middleware.slash);
app.use(express.static(config.dirs.pub));
app.use(middleware.errors.notfound);

if (config.isDevelopment) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack     : true
    }));
} else {
    app.use(middleware.errors.server);
}

// -- Routes -------------------------------------------------------------------

function routePage(id, path, label, callbacks) {
    if (typeof label !== 'string') {
        callbacks = label;
        label     = null;
    }

    app.get(path, callbacks);

    app.locals.pages[id] = path;

    if (label) {
        app.locals.nav.push({id: id, url: path, label: label});
    }
}

routePage('home',    '/',         'Home',       routes.render('home'));
routePage('base',    '/base/',    'Base',       routes.render('base'));
routePage('grids',   '/grids/',   'Grids',      routes.render('grids'));
routePage('forms',   '/forms/',   'Forms',      routes.render('forms'));
routePage('tables',  '/tables/',  'Tables',     routes.render('tables'));
routePage('menus',   '/menus/',   'Menus',      routes.render('menus'));
routePage('layouts', '/layouts/', 'Layouts',    routes.render('layouts'));

routePage('layoutsGallery',   '/layouts/gallery/',   routes.render('layouts/gallery', 'blank'));
routePage('layoutsMarketing', '/layouts/marketing/', routes.render('layouts/marketing', 'blank'));

app.get('/combo', routes.combo);

// -- Exports ------------------------------------------------------------------

module.exports = app;
