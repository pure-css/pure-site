import {Base} from 'base-build';
import {Escape} from 'escape';
import GridTabView from 'grid-tab-view';

export default Base.create('grid-output-view', GridTabView, [], {
    render: function () {
        var defaults   = this.get('defaults'),
            model      = this.get('model'),
            container  = this.get('container'),
            defaultMQs = defaults.get('mediaQueries').toJSON(),
            cols       = model.get('cols'),
            prefix     = model.get('prefix'),
            mqs        = model.get('mediaQueries').toJSON(),
            css;

        if (cols && cols !== defaults.get('cols') ||
            prefix && prefix !== defaults.get('prefix') ||
            mqs.length !== defaultMQs.length) {

            css = model.generate();
        } else {
            mqs.some(function (mq, i) {
                var dmq = defaultMQs[i];

                if (!(dmq && dmq.id === mq.id && dmq.mq === mq.mq)) {
                    css = model.generate();
                    return true;
                }
            });
        }

        container.one('#html code').removeClass('rainbow').setHTML(
            Escape.html(this.get('htmlTemplate')({
                pure    : this.get('pure'),
                needsCSS: css || !!mqs.length,
                css     : css
            }))
        );

        container.one('#css').setHTML(
            this.get('cssTemplate')({css: css})
        );

        Rainbow.color();
    }
});
