var CSS_CODE = '#css',
    SELECTED_PANEL      = '.grid-panel-selected',
    SELECTED_TAB        = '.grid-tab-link-selected';

YUI.add('grid-output-view', function (Y) {
    Y.GridOutputView = Y.Base.create('grid-input-view', Y.View, [], {

        events: {
            '.grid-tab-link': {click: 'handleTabClick'}
        },

        render: function () {
            var container = this.get('container'),
                css = this.get('model').generate();

            container.one(CSS_CODE).empty().append('<pre class="code code-wrap" data-language="css">' + css + '</pre>');
        },

        handleTabClick: function (e) {
            var container = this.get('container'),
                id = e.target.getAttribute('href'),
                selectedTab = container.one(SELECTED_TAB);
            e.preventDefault();

            //add selected-tab class to the tab
            if (selectedTab) {
                selectedTab.removeClass(SELECTED_TAB.slice(1));
            }
            e.target.addClass(SELECTED_TAB.slice(1));

            //add selected-panel class to the panel
            //there will always be a selected panel because of server-side rendering
            container.one(SELECTED_PANEL).removeClass(SELECTED_PANEL.slice(1));
            container.one(id).addClass(SELECTED_PANEL.slice(1));
        }

    });
}, '0.0.1', {
    requires: [
        'view',
        'node'
    ]
});
