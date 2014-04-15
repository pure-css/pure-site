import {Lang, config} from 'yui';
import {Base} from 'base-build';
import {View} from 'view';

export default Base.create('grid-download-view', View, [], {
    initializer: function (config) {
        config || (config = {});

        this.urlTemplate   = config.urlTemplate || this.urlTemplate;
        this.trackTemplate = config.trackTemplate || this.trackTemplate;
    },

    render: function () {
        var downloadLink = this.get('container').one('.download-link'),
            url, onclick;

        url = Lang.sub(this.urlTemplate, {
            query: config.win.location.search
        });

        onclick = Lang.sub(this.trackTemplate, {
            label: this._getTrackLabel()
        });

        downloadLink.setAttribute('href', url);
        downloadLink.setAttribute('onclick', onclick);
    },

    _getTrackLabel: function () {
        var model = this.get('model');

        if (model.get('css')) {
            return 'custom';
        }

        return model.get('mediaQueries').size() ? 'default-mqs' : 'default';
    }
}, {
    _NON_ATTRS_CFG: [
        'urlTemplate',
        'trackTemplate'
    ]
});
