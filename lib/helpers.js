var Handlebars = require('handlebars'),

    escape = Handlebars.Utils.escapeExpression;

exports.addCdnCSS = function (version, module, options) {
    options = (options && options.hash) || {};

    var css  = this.cdnCSS || (this.cdnCSS = []),
        base = options.base || '',
        min  = this.min,
        url;

    // Overrides default `min` setting.
    if ('min' in options) {
        min = options.min ? '-min' : '';
    }

    url = ['pure', version, module + min + '.css'].join('/');

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

exports.addRemoteCSS = function (path, options) {
    var css = this.remoteCSS || (this.remoteCSS = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
};

exports.addLocalJS = function (path, options) {
    var js = this.localJS || (this.localJS = []);
    js[options.hash.prepend ? 'unshift' : 'push'](path);
};

exports.cdnCSS = function (options) {
    var host   = 'http://yui.yahooapis.com/',
        urls   = this.cdnCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction && urls.length > 1) {
        urls = [urls.join('&')];
        host += 'combo?';
    }

    urls.forEach(function (url) {
        output += options.fn(host + url);
    });

    return output;
};

exports.localCSS = function (options) {
    var urls   = this.localCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction) {
        urls = ['/combo/' + this.version + '?' + urls.join('&')];
    }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
};

exports.remoteCSS = function (options) {
    var urls   = this.remoteCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
};

exports.localJS = function (options) {
    var urls   = this.localJS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction) {
        urls = ['/combo/' + this.version + '?' + urls.join('&')];
    }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
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

exports.setActiveNav = function (name) {
    var nav = [];

    this.nav.forEach(function (item) {
        var newItem = {};

        Object.keys(item).forEach(function (key) {
            newItem[key] = item[key];
        });

        if (newItem.name === name) {
            newItem.isActive = true;
        }

        nav.push(newItem);
    });

    this.nav = nav;
};

exports.pageTitle = function () {
    var site    = this.site,
        section = this.section,
        title   = this.title,
        pageTitle;

    if (!title || title === site) {
        pageTitle = escape(site);
    } else {
        pageTitle = escape(title) + ' &ndash; ' +
            (section ? (escape(section) + ' &ndash; ') : '') + escape(site);
    }

    return new Handlebars.SafeString(pageTitle);
};

exports.setTitle = function (title) {
    this.title = title;
};

exports.setTags = function (tags) {
    this.tags = [].slice.call(arguments, 0, -1);
};

exports.setSubTitle = function (subTitle) {
    this.subTitle = subTitle;
};

exports.fileSize = function (module, decimals) {
    typeof decimals === 'number' || (decimals = 1);
    var filesize = (this.filesizes[module] / 1024);
    return filesize.toFixed(decimals) + 'KB';
};

exports.filePercent = function (module) {
    var filesizes = this.filesizes,
        total     = 0;

    total = this.modules.reduce(function (size, module) {
        return size + filesizes[module];
    }, total);

    return (filesizes[module] / total * 100).toFixed(4) + '%';
};

exports.sectionHeading = function (heading, tagName, classnames) {
    tagName    = tagName && typeof tagName === 'string' ? tagName : 'h2';
    classnames = classnames && typeof classnames === 'string' ?
                 classnames : 'content-subhead';

    var id, html;

    // Remove HTML entities, and all chars except whitespace, word chars, and -
    // from the `heading`.
    // Jacked from: https://github.com/yui/selleck/blob/master/lib/higgins.js
    id = heading.toLowerCase()
                .replace(/&[^\s;]+;?/g, '')
                .replace(/[^\s\w\-]+/g, '')
                .replace(/\s+/g, '-');

    html = '<' + tagName + ' id="' + id + '" class="' + classnames + '">' +
               heading + '<a href="#' + id + '" class="content-link"></a>' +
           '</' + tagName + '>';

    return new Handlebars.SafeString(html);
};
