import {Base} from 'base-build';
import {Escape} from 'escape';
import GridTabView from 'grid-tab-view';

export default Base.create('grid-output-view', GridTabView, [], {
    render: function () {
        var model     = this.get('model'),
            container = this.get('container'),
            css       = model.get('css');

        container.one('#html code').removeClass('rainbow').setHTML(
            Escape.html(this.get('htmlTemplate')({
                pure    : this.get('pure'),
                needsCSS: css || !!model.get('mediaQueries').size(),
                css     : css
            }))
        );

        container.one('#css').setHTML(
            this.get('cssTemplate')({css: css})
        );

        Rainbow.color();
    }
});
