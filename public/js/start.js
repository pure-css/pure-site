YUI().use('css-mediaquery', 'rework', 'rework-pure-grids', 'handlebars-runtime', function (Y) {
    'use strict';

    var exported   = Y.Env._exported,
        rework     = Y.config.global.rework,
        pureGrids  = exported['rework-pure-grids'],
        mediaQuery = exported['css-mediaquery'];

    var css = rework('').use(pureGrids.units({
        mediaQueries: {
            med: 'screen and (min-width: 48em)',
            lrg: 'screen and (min-width: 75em)'
        }
    })).toString();

    console.log(mediaQuery.parse('screen and (min-width: 48em)'));
    console.log(css);
    console.log(app.start.query);
});
