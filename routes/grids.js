var mediaQuery = require('css-mediaquery'),
    utils      = require('../lib/utils');

exports.index = render;

function render (req, res) {
    res.locals.selectedUnits = {
        sm: new GridUnits('screen and (min-width: 35.5em)'),
        md: new GridUnits('screen and (min-width: 48em)'),
        lg: new GridUnits('screen and (min-width: 64em)'),
        xl: new GridUnits('screen and (min-width: 80em)')
    };

    res.render('grids');
}

function GridUnits(mq) {
    utils.extend(this, {mq: mq}, mediaQuery.parse(mq)[0]);
}
