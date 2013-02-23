var exphbs = require('express3-handlebars'),

    config  = require('../config'),
    helpers = require('./helpers');

module.exports = exphbs.create({
    helpers    : helpers,
    layoutsDir : config.dirs.layouts,
    partialsDir: config.dirs.partials
});
