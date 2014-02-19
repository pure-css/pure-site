var COL_INPUT           = '[data="cols-input"]',
    PREFIX_INPUT        = '[data="prefix-input"]',
    COLS_MESSAGE        = '#cols-message',
    PREFIX_MESSAGE      = '#prefix-message',
    MQ_ADD              = '[data="add-mq"]',
    MQ_TABLE            = '#media-query-table',
    MQ_LIST             = '#media-query-table tbody',
    MQ_KEY              = '.mq-key',
    MQ_VAL              = '.mq-value',
    SELECTED_PANEL      = '.grid-panel-selected',
    SELECTED_TAB        = '.grid-tab-link-selected',
    IS_ERROR_INPUT      = '.is-error-input';

YUI.add('grid-input-view', function (Y) {

    'use strict';

    Y.GridInputView = Y.Base.create('grid-input-view', Y.View, [], {
        events: {
            '.grid-tab-link'           : {click: 'handleTabClick'},
            '[data="add-mq"]'          : {click: 'renderNewMediaQuery'},
            '[data="remove-mq"]'       : {click: 'removeRenderedMediaQuery'},
            '[data="add-default-mq"]'  : {click: 'generateDefaultMediaQuery'},
            '[data="cols-input"]'      : {blur: 'inputCols'},
            '[data="prefix-input"]'    : {blur: 'inputPrefix'},
            '.mq-key'                  : {blur: 'addMediaQueryById'},
            '.mq-value'                : {blur: 'addMediaQueryByValue'}
        },

        initializer: function (cfg) {
            var model = this.get('model');

            model.after('change', this.render, this);
            model.get('mediaQueries').after('change', this.render, this);
            model.after('destroy', this.destroy, this);
            this.set('template', cfg.template);
        },

        render: function () {
            //We are just going to manipulate the input values inside render(). No need to re-render all the DOM elements.
            var container = this.get('container'),
                model = this.get('model'),
                mq = model.get('mediaQueries'),
                list = container.one(MQ_LIST);

            if (model.get('cols')) {
                container.one(COL_INPUT).set('value', model.get('cols'));
            }

            if (model.get('prefix')) {
                container.one(PREFIX_INPUT).set('value', model.get('prefix'));
            }

            list.empty();
            mq.each(function (m) {
                this._renderNewMediaQuery(m.get('id'), m.get('mq'));
            }, this);
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
        },

        //This will create a new <tr> and populate it with media query values, if they exist.
        _renderNewMediaQuery: function (key, mq) {
            var container = this.get('container'),
                template = this.get('template'),
                table = container.one(MQ_TABLE),
                html;

            html = template({id: key || '', mq: mq || ''});

            if (table.hasAttribute('hidden')) {
                table.removeAttribute('hidden');
            }
            container.one(MQ_LIST).appendChild(html);
        },

        //This will just pass through to _renderNewMediaQuery() to create an empty row.
        renderNewMediaQuery: function () {
            this._renderNewMediaQuery();

            var container = this.get('container'),
                numMediaQueries = container.one(MQ_TABLE).all('tr').size();

            if (numMediaQueries > app.start.limits.mediaQueries.max ||
                numMediaQueries < app.start.limits.mediaQueries.min) {

                container.one(MQ_ADD).setAttribute('disabled', true);
            }
        },

        removeRenderedMediaQuery: function (e) {
            var container = this.get('container'),
                list = container.one(MQ_LIST),
                table = container.one(MQ_TABLE),
                key = e.target.ancestor('tr', MQ_LIST).one(MQ_KEY).get('value');

            e.target.ancestor('tr', MQ_LIST).remove();
            container.one(MQ_ADD).removeAttribute('disabled');
            if (!list.hasChildNodes()) {
                table.setAttribute('hidden');
            }

            //we only want to update the route if the row had some contents
            if (key) {
                this.fire('removeMediaQuery', {
                    id: key
                });
            }
        },

        addMediaQueryById: function (e) {
            //check to see if this media query has a value associated with it.
            var arr = [],
                key = e.target.get('value'),
                val = e.target.get('parentNode').next().one(MQ_VAL).get('value');

            //dont want to do this unless the key has an explicit value
            if (key) {
                arr.push({id: key, mq: val});
                this.fire('updateMediaQuery', {
                    mq: arr,
                    oldKey: e.target.get('defaultValue')
                });
            }
        },

        addMediaQueryByValue: function (e) {
            var arr = [],
                val = e.target.get('value'),
                key = e.target.get('parentNode').previous().one(MQ_KEY).get('value');

            //dont want to do this unless the key and val have an explicit value
            if (val && key) {
                arr.push({id: key, mq: val});
                this.fire('updateMediaQuery', {
                    mq: arr
                });
            }
        },

        generateDefaultMediaQuery: function () {
            this.fire('updateMediaQuery', {
                mq: this.get('model').get('mediaQueries').get('defaultMq')
            });
        },

        inputCols: function (e) {

            var cols = e.target.get('value'),
                message = this.get('container').one(COLS_MESSAGE);
            if (!cols || (cols < app.start.limits.cols.max &&
                cols >= app.start.limits.cols.min)) {

                e.target.removeClass(IS_ERROR_INPUT);
                message.hide();

                this.fire('updateColumns', {
                    cols: e.target.get('value')
                });
            }

            else {
                message.set('text', 'The number of columns needs to be between ' + app.start.limits.cols.min + ' and ' + app.start.limits.cols.max).show();
                e.target.addClass(IS_ERROR_INPUT);
            }

        },

        inputPrefix: function (e) {
            var prefix = e.target.get('value'),
                message = this.get('container').one(PREFIX_MESSAGE);

            if (prefix.length < app.start.limits.prefix.max &&
                prefix.length >= app.start.limits.prefix.min) {

                e.target.removeClass('is-error-input');
                message.hide();

                this.fire('updatePrefix', {
                    prefix: e.target.get('value')
                });
            }

            else {
                message.set('text', 'The prefix needs to have atleast 1 character, up to a maximum of ' + app.start.limits.prefix.max + ' characters.').show();
                e.target.addClass('is-error-input');
            }
        }
    });

}, '0.0.1', {
    requires: [
        'view',
        'node',
        'event-focus'
    ]
});



