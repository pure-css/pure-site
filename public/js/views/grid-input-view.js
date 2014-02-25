YUI.add('grid-input-view', function (Y, NAME, imports, exports) {

    'use strict';

    var COL_INPUT           = '[data-content="cols-input"]',
        PREFIX_INPUT        = '[data-content="prefix-input"]',
        TAB                 = '[data-action="tab"]',
        MQ_ADD              = '[data-action="add-mq"]',
        MQ_REMOVE           = '[data-action="remove-mq"]',
        MQ_ADD_DEFAULT      = '[data-action="add-default-mq"]',
        MQ_TABLE            = '#media-query-table',
        MQ_LIST             = '#media-query-table tbody',
        MQ_KEY              = '[data-content="mq-key"]',
        MQ_VAL              = '[data-content="mq-value"]',
        MQ_ROW              = '[data-row="media-query"]';

    var events = {};

    events[TAB]            = {click:  'handleTabClick'};
    events[COL_INPUT]      = {change: 'inputCols'};
    events[PREFIX_INPUT]   = {change: 'inputPrefix'};
    events[MQ_KEY]         = {change: 'addMediaQueryById'};
    events[MQ_VAL]         = {change: 'addMediaQueryByValue'};
    events[MQ_ADD]         = {click:  'renderMediaQuery'};
    events[MQ_REMOVE]      = {click:  'removeRenderedMediaQuery'};
    events[MQ_ADD_DEFAULT] = {click:  'generateDefaultMediaQuery'};

    var MqModel = imports['mq-model'].MqModel,
        GridTabView = imports['grid-tab-view'];

    return Y.Base.create('grid-input-view', GridTabView, [], {
        events: events,

        render: function () {
            //We are just going to manipulate the input values inside render(). No need to re-render all the DOM elements.
            var container = this.get('container'),
                model = this.get('model'),
                mqs = model.get('mediaQueries'),
                rows = container.all(MQ_ROW);

            if (model.get('cols')) {
                container.one(COL_INPUT).set('value', Y.Escape.html(model.get('cols')));
            }

            if (model.get('prefix')) {
                container.one(PREFIX_INPUT).set('value', Y.Escape.html(model.get('prefix')));
            }

            //for each media query, populate the input field within the row,
            //or create a new row.
            mqs.each(function (m, i) {
                this._renderMediaQuery(m.get('id'), m.get('mq'), rows.item(i));
            }, this);
        },

        //This will create a new <tr> and populate it with media query values, if they exist.
        _renderMediaQuery: function (key, mq, row) {
            var container = this.get('container'),
                table = container.one(MQ_TABLE),
                html;

            //if a row exists, populate the input fields within that row
            if (row) {
                row.one(MQ_KEY).set('value', key);
                row.one(MQ_VAL).set('value', mq);
            }

            //otherwise create a new row from the template
            else {
                html = this.template({id: key || '', mq: mq || ''});

                if (table.hasAttribute('hidden')) {
                    table.removeAttribute('hidden');
                }
                container.one(MQ_LIST).append(html);
            }
        },

        //This will just pass through to _renderMediaQuery() to create an empty row.
        renderMediaQuery: function () {
            this._renderMediaQuery();

            var container = this.get('container'),
                numMediaQueries = container.one(MQ_TABLE).all(MQ_ROW).size();

            if (numMediaQueries > app.start.limits.mediaQueries.max ||
                numMediaQueries < app.start.limits.mediaQueries.min) {

                container.one(MQ_ADD).setAttribute('disabled', true);
            }
        },

        removeRenderedMediaQuery: function (e) {
            var container = this.get('container'),
                list = container.one(MQ_LIST),
                table = container.one(MQ_TABLE),
                mqs = this.get('model').get('mediaQueries'),
                key = e.target.ancestor(MQ_ROW, MQ_LIST)
                        .one(MQ_KEY).get('value'),
                index = this.get('container').all(MQ_ROW).indexOf(e.target.ancestor(MQ_ROW));

            e.target.ancestor(MQ_ROW, MQ_LIST).remove();
            container.one(MQ_ADD).removeAttribute('disabled');
            if (!list.hasChildNodes()) {
                table.setAttribute('hidden');
            }

            //we only want to update the route if the row had some contents
            if (key) {
                mqs.remove(mqs.item(index));
            }

            this.get('model').set('mediaQueries', mqs);
        },

        addMediaQueryById: function (e) {
            //check to see if this media query has a value associated with it.
            var key   = e.target.get('value'),
                index = this.get('container').all(MQ_ROW).indexOf(e.target.ancestor(MQ_ROW)),
                val, mqs, existingModel;

            //dont want to do anything unless the key has an explicit value
            if (key) {

                val = e.target.get('parentNode').next().one(MQ_VAL).get('value'),
                mqs = this.get('model').get('mediaQueries'),
                existingModel = mqs.item(index);

                //if we had an existing model, then remove that
                if (existingModel) {
                    existingModel.setAttrs({
                        id: key,
                        mq: val
                    });
                }

                else {
                    //add a new media query
                    mqs.add({
                        id: key,
                        mq: val
                    });

                }

                this.get('model').set('mediaQueries', mqs);
            }
        },

        addMediaQueryByValue: function (e) {
            var val = e.target.get('value'),
                index = this.get('container').all(MQ_ROW).indexOf(e.target.ancestor(MQ_ROW)),
                key, mqs, existingModel, model;

            //dont want to do anything unless `val` has an explicit value
            if (val) {
                key = e.target.get('parentNode').previous().one(MQ_KEY).get('value'),
                mqs = this.get('model').get('mediaQueries'),
                existingModel = mqs.item(index),
                model = new MqModel({id: key, mq: val});

                if (!model.isValidMediaQuery()) {
                    e.target.setAttribute('invalid', true);
                }
                else {
                    if (existingModel) {
                        //find the existing model and update it.
                        existingModel.set('mq', val);
                    }
                    //add a new model to the model list
                    else {
                        mqs.add(model);
                    }
                    this.get('model').set('mediaQueries', mqs);
                }
            }
        },

        generateDefaultMediaQuery: function () {
            var defaults = [{
                    id: 'med',
                    mq: 'screen and (min-width: 48em)'
                },
                {
                    id: 'lrg',
                    mq: 'screen and (min-width: 60em)'
                }],
                mqs = this.get('model').get('mediaQueries');

            mqs.reset().add(defaults);
            this.get('model').set('mediaQueries', mqs);
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
    es: true,
    requires: [
        'mq-model',
        'grid-tab-view'
    ]
});



