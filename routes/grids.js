'use strict';

var mediaQuery = require('css-mediaquery'),
    utils      = require('../lib/utils');

exports.index = render;

function render (req, res) {
    var defaults = res.locals.pure.responsive;
    res.locals.defaultMQs = defaults.mediaQueries.map(function (mq) {
        return new GridUnits(mq.id, mq.mq);
    });
    res.render('grids');
}

function GridUnits(id, mq) {
    utils.extend(this, {
        id: id,
        mq: mq
    }, mediaQuery.parse(mq)[0]);
}
