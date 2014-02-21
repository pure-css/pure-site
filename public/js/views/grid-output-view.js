var CSS_CODE = '#css';

YUI.add('grid-output-view', function (Y, NAME, imports, exports) {
    exports = Y.Base.create('grid-output-view', Y.GridTabView,
        [], {

        events: {
            '[data-action="tab"]': {click: 'handleTabClick'}
        },

        initializer: function (cfg) {
            var model = this.get('model');
            model.after('destroy', this.destroy, this);
            this.set('template', cfg.template);
        },

        render: function () {
            var container = this.get('container'),
                template = this.get('template'),
                css = this.get('model').generate();

            html = template({css: css});
            container.one(CSS_CODE).empty().append(html);
        }
    });

    return exports;

}, '0.0.1', {
    es: true,
    requires: [
        'grid-tab-view'
    ]
});
