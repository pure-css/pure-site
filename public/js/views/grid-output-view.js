YUI.add('grid-output-view', function (Y, NAME, imports, exports) {
    'use strict';

    var GridTabView = imports['grid-tab-view'];

    return Y.Base.create('grid-output-view', GridTabView, [], {
        render: function () {
            var container = this.get('container'),
                css       = this.get('model').generate(),
                html      = this.template({css: css});

            container.one('#css').empty().append(html);
            Rainbow.color();
        }
    });

}, '0.0.1', {
    es: true,
    requires: [
        'grid-tab-view'
    ]
});
