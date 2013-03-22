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

    nav: [
        {id: 'home',    url: '/',         label: 'Home'},
        {id: 'base',    url: '/base/',    label: 'Base'},
        {id: 'grids',   url: '/grids/',   label: 'Grids'},
        {id: 'layouts', url: '/layouts/', label: 'Layouts'},
        {id: 'forms',   url: '/forms/',   label: 'Forms'},
        {id: 'tables',  url: '/tables/',  label: 'Tables'},
        {id: 'lists',   url: '/lists/',   label: 'Navigation'}
    ],

    yui    : config.yui,
    min    : config.isProduction ? '-min' : '',
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

app.get('/',         routes.render('home'));
app.get('/base/',    routes.render('base'));
app.get('/grids/',   routes.render('grids'));
app.get('/layouts/', routes.render('layouts'));
app.get('/forms/',   routes.render('forms'));
app.get('/tables/',  routes.render('tables'));
app.get('/lists/',   routes.render('lists'));

app.get('/layouts/marketing/', routes.render('layouts/marketing', 'blank'));
app.get('/layouts/gallery/', routes.render('layouts/gallery', 'blank'));


// -- Exports ------------------------------------------------------------------

module.exports = app;
