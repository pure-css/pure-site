YUI.add('grid-tab-view', function (Y, NAME, imports, exports) {
    'use strict';

    var SELECTED_PANEL = 'grid-panel-selected',
        SELECTED_TAB   = 'grid-tab-link-selected';

    return Y.Base.create('grid-tab-view', Y.View, [], {
        tabEvents: {
            '[data-action="tab"]': {click: 'handleTabClick'}
        },

        initializer: function () {
            this.events = Y.merge(this.tabEvents, this.events);
        },

        handleTabClick: function (e) {
            var container     = this.get('container'),
                id            = e.target.getAttribute('href'),
                selectedTab   = container.one('.' + SELECTED_TAB),
                selectedPanel = container.one('.' + SELECTED_PANEL);

            e.preventDefault();

            if (selectedTab) {
                selectedTab.removeClass(SELECTED_TAB);
            }

            if (selectedPanel) {
                selectedPanel.removeClass(SELECTED_PANEL);
            }

            e.target.addClass(SELECTED_TAB);
            container.one(id).addClass(SELECTED_PANEL);
        }
    });

}, '0.0.1', {
    es: true,
    requires: [
        'view',
        'node'
    ]
});
