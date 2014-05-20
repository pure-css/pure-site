YUI().use('node', function (Y) {
    var slider = Y.one('#layout-slider'),
        wrapper = Y.one('#layout-wrapper');

    slider.on('change', function (e) {
        wrapper.setStyle('width', e._event.srcElement.valueAsNumber + 'px');
    });
});
