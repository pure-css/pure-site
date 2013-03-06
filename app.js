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
    title         : 'YUI CSS',
    copyright_year: '2013',

    nav: [
        {id: 'home',   url: '/',        label: 'Home'},
        {id: 'grids',  url: '/grids/',  label: 'Grids'},
        {id: 'base',   url: '/base/',   label: 'Base'},
        {id: 'forms',  url: '/forms/',  label: 'Forms'},
        {id: 'tables', url: '/tables/', label: 'Tables'},
        {id: 'lists',  url: '/lists/',  label: 'Navigation'}
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

app.get('/',        routes.home);
app.get('/base/',   routes.base);
app.get('/grids/',  routes.grids);
app.get('/forms/',  routes.forms);
app.get('/tables/', routes.tables);
app.get('/lists/',  routes.lists);


// -- Exports ------------------------------------------------------------------

module.exports = app;
