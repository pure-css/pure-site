var COL_INPUT           = '[data="cols-input"]',
    PREFIX_INPUT        = '[data="prefix-input"]',
    MQ_ADD              = '[data="add-mq"]',
    MQ_TABLE            = '#media-query-table',
    MQ_LIST             = '#media-query-table tbody',
    MQ_KEY              = '.mq-key',
    MQ_VAL              = '.mq-value',
    SELECTED_PANEL      = '.grid-panel-selected',
    SELECTED_TAB        = '.grid-tab-link-selected';

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
            '.mq-key'                  : {focus: 'storeMediaQueryId',
                                          blur: 'addMediaQueryById'},
            '.mq-value'                : {focus: 'storeMediaQueryValue',
                                          blur: 'addMediaQueryByValue'}
        },

        initializer: function (cfg) {
            var model = this.get('model');
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
                mq = this.get('model').get('mediaQueries'),
                key = e.target.ancestor('tr', MQ_LIST).one(MQ_KEY).get('value');

            e.target.ancestor('tr', MQ_LIST).remove();
            container.one(MQ_ADD).removeAttribute('disabled');
            if (!list.hasChildNodes()) {
                table.setAttribute('hidden');
            }

            //we only want to update the route if the row had some contents
            if (key) {
                mq.remove(mq.getById(key));
            }

            this.get('model').set('mediaQueries', mq);
        },

        storeMediaQueryId: function (e) {
            this.mediaQueryId = e.target.get('value');
        },

        storeMediaQueryValue: function (e) {
            this.mediaQueryValue = e.target.get('value');
        },
        addMediaQueryById: function (e) {
            //check to see if this media query has a value associated with it.
            var key     = e.target.get('value'),
                oldKey  = this.mediaQueryId,
                val     = e.target.get('parentNode').next().one(MQ_VAL).get('value'),
                mq      = this.get('model').get('mediaQueries'),
                existingModel = mq.getById(oldKey),
                index   = mq.size();


            //dont want to do anything unless the key has an explicit value
            if (key && key !== oldKey) {

                //if we had an existing model, then remove that
                if (existingModel) {
                    index = mq.indexOf(existingModel);
                    mq.remove(existingModel);
                }
                //add a new media query
                mq.add({
                    id: key,
                    mq: val
                }, {index: index});

                this.get('model').set('mediaQueries', mq);
            }
        },

        addMediaQueryByValue: function (e) {
            var val = e.target.get('value'),
                oldVal = this.mediaQueryValue,
                key = e.target.get('parentNode').previous().one(MQ_KEY).get('value'),
                mq  = this.get('model').get('mediaQueries'),
                existingModel = mq.getById(key);


            //dont want to do anything unless `val` has an explicit value
            if (val && val !== oldVal) {
                if (existingModel) {
                    //find the existing model and update it.
                    existingModel.set('mq', val);
                }
                //add a new model to the model list
                else {
                    mq.add({id: key, mq: val});
                }
                this.get('model').set('mediaQueries', mq);
            }
        },

        generateDefaultMediaQuery: function () {
            var defaults = this.get('model')
                                .get('mediaQueries').get('defaultMq'),
                mq = this.get('model').get('mediaQueries');

            mq.reset().add(defaults);
            this.get('model').set('mediaQueries', mq);
            this.render();
        },

        inputCols: function (e) {
            var cols = e.target.get('value');
            this.get('model').set('cols', cols);
        },

        inputPrefix: function (e) {
            var prefix = e.target.get('value');
            this.get('model').set('prefix', prefix);
        }
    });

}, '0.0.1', {
    requires: [
        'view',
        'node',
        'event-focus'
    ]
});



