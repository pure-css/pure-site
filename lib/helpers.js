var Handlebars = require('handlebars'),

    escape = Handlebars.Utils.escapeExpression;

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
    content = escape(content.trim());

    return new Handlebars.SafeString(open + content + close);
};

exports.id = function (id) {
    if (this.__idPrefix) {
        id = this.__idPrefix + '-' + id;
    }

    return id;
};

exports.prefixIds = function (prefix, options) {
    var content;

    this.__idPrefix = prefix;
    content         = options.fn(this);
    this.__idPrefix = null;

    return content;
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

exports.pageTitle = function () {
    var site  = this.site,
        title = this.title,
        pageTitle;

    if (!title || title === site) {
        pageTitle = escape(site);
    } else {
        pageTitle = escape(title) + ' &ndash; ' + escape(site);
    }

    return new Handlebars.SafeString(pageTitle);
};

exports.setTitle = function (title) {
    this.title = title;
};

exports.setSubTitle = function (subTitle) {
    this.subTitle = subTitle;
};
