'use strict';
var utils = require('../lib/utils');
/*
    Routes for /start/ could be any of the following:
    * `/start/`
    * `/start/?cols=6&med=48em&lrg=60em`
    * `/start/?cols=6&sm=screen and (min-device-width: 480px)`
*/
module.exports = function (req, res, next) {


    var query = utils.extend({
        cols: '5,24',
        fonts: 'sans-serif',
        prefix: '.pure-u-',
    }, req.query);

    //If no media queries were specified, we'll create some defaults.
    if (!hasMQ(query)) {
        query.med = 'screen and (min-width: 48em)';
        query.lrg = 'screen and (min-width: 60em)';
    }

    res.expose(query, 'app.start.query');
    res.render('start');
};


function hasMQ (obj) {
    var o = utils.extend({}, obj);
    delete o.cols;
    delete o.fonts;
    delete o.prefix;
    if (Object.getOwnPropertyNames(o).length === 0) {
        return false;
    }
    return o;
}
