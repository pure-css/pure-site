YUI().use('node-base', function (Y) {
    var menu = Y.one('#menu'),
        menuLink = Y.one('.yui3-menu-link'),
        layout = Y.one('#layout');

    Y.one(menuLink).on('click', function (e) {
        layout.toggleClass('active');
        menu.toggleClass('active');
    });
});
