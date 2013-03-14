var Handlebars = require('handlebars');

exports.addCdnCSS = function (version, module, options) {
    var css = this.cdnCSS || (this.cdnCSS = []),
        url = [version, 'build', module, module + '.css'].join('/');

    options = (options && options.hash) || {};
    css[options.prepend ? 'unshift' : 'push'](url);
};

exports.addGithubCSS = function (user, repo, path, options) {
    var css = this.githubCSS || (this.githubCSS = []),
        url = 'http://rawgithub.com/' + [user, repo, path].join('/');

    options = (options && options.hash) || {};
    css[options.prepend ? 'unshift' : 'push'](url);
};

exports.addLocalCSS = function (path, options) {
    var css = this.localCSS || (this.localCSS = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
};

exports.cdnCSSURL = function () {
    var urls = this.cdnCSS,
        url  = null;

    if (urls.length) {
        url = 'http://yui.yahooapis.com/combo?' + urls.join('&');
    }

    return url;
};

exports.code = function (content, options) {
    if (typeof content !== 'string') {
        options = content;
        content = null;
    }

    var type, open, close;

    // Determine if this helper is being used as an inline or block helper. When
    // `options.fn` is defined this helper was invoked as a block helper.
    if (options.fn) {
        type    = content || 'html';
        content = options.fn(this);
        open    = '<pre class="snippet" data-language="' + type + '"><code>';
        close   = '</code></pre>';
    } else {
        open  = '<code>';
        close = '</code>';
    }

    // Escape code contents.
    content = Handlebars.Utils.escapeExpression(content.trim());

    return new Handlebars.SafeString(open + content + close);
};

exports.setActiveNav = function (id) {
    var nav = [];

    this.nav.forEach(function (item) {
        var newItem = {};

        Object.keys(item).forEach(function (key) {
            newItem[key] = item[key];
        });

        if (newItem.id === id) {
            newItem.isActive = true;
        }

        nav.push(newItem);
    });

    this.nav = nav;
};

exports.setTitle = function (title) {
    this.title = title;
};

exports.setSubTitle = function (subTitle) {
    this.subTitle = subTitle;
};
