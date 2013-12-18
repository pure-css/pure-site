var libpath    = require('path'),
    Handlebars = require('handlebars'),

    extend = require('./utils').extend,
    escape = Handlebars.Utils.escapeExpression;

// CSS
exports.addCdnCSS    = addCdnCSS;
exports.addLocalCSS  = addLocalCSS;
exports.addRemoteCSS = addRemoteCSS;
exports.cdnCSS       = cdnCSS;
exports.localCSS     = localCSS;
exports.remoteCSS    = remoteCSS;

// JS
exports.addLocalJS = addLocalJS;
exports.localJS    = localJS;

// Title, headings, and nav
exports.setTitle       = setTitle;
exports.setSubTitle    = setSubTitle;
exports.pageTitle      = pageTitle;
exports.sectionHeading = sectionHeading;
exports.setActiveNav   = setActiveNav;

// Code
exports.code = code;

// Ids
exports.id        = genId;
exports.prefixIds = prefixIds;

// Tags
exports.setTags = setTags;

// Imgs
exports.addLocalImg = addLocalImg;

// Pure file sizes
exports.fileSize    = fileSize;
exports.filePercent = filePercent;

// -----------------------------------------------------------------------------

function addCdnCSS(version, module, options) {
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
}

function addLocalCSS(path, options) {
    var css = this.localCSS || (this.localCSS = []);

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    css[options.hash.prepend ? 'unshift' : 'push'](path);
}

function addRemoteCSS(path, options) {
    var css = this.remoteCSS || (this.remoteCSS = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
}

function addLocalJS(path, options) {
    var js = this.localJS || (this.localJS = []);

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    js[options.hash.prepend ? 'unshift' : 'push'](path);
}

function addLocalImg(path, options) {
    var imgs = this.localImgs || (this.localImgs = []),
        attrs;

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    imgs.push(path);

    attrs = extend(options.hash, {src: path});
    attrs = Object.keys(attrs).map(function (attr) {
        return escape(attr) + '="' + escape(attrs[attr]) + '"';
    }).join(' ');

    return new Handlebars.SafeString('<img ' + attrs + '>');
}

function cdnCSS(options) {
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
}

function localCSS(options) {
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
}

function remoteCSS(options) {
    var urls   = this.remoteCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
}

function localJS(options) {
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
}

function code(content, options) {
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
}

function genId(id) {
    if (this.__idPrefix) {
        id = this.__idPrefix + '-' + id;
    }

    return id;
}

function prefixIds(prefix, options) {
    var content;

    this.__idPrefix = prefix;
    content         = options.fn(this);
    this.__idPrefix = null;

    return content;
}

function setActiveNav(name) {
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
}

function pageTitle() {
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
}

function setTitle(title) {
    this.title = title;
}

function setTags(tags) {
    this.tags = [].slice.call(arguments, 0, -1);
}

function setSubTitle(subTitle) {
    this.subTitle = subTitle;
}

function fileSize(module, decimals) {
    typeof decimals === 'number' || (decimals = 1);
    var filesize = (this.pure.filesizes[module] / 1024);
    return filesize.toFixed(decimals) + 'KB';
}

function filePercent(module) {
    var filesizes = this.pure.filesizes,
        total     = 0;

    total = this.pure.modules.reduce(function (size, module) {
        return size + filesizes[module];
    }, total);

    return (filesizes[module] / total * 100).toFixed(4) + '%';
}

function sectionHeading(heading, options) {
    options = (options && options.hash) || {};

    var tagname    = options.tagname || 'h2',
        classnames = options.classnames || 'content-subhead',
        id, html;

    // Remove HTML entities, and all chars except whitespace, word chars, and -
    // from the `heading`.
    // Jacked from: https://github.com/yui/selleck/blob/master/lib/higgins.js
    id = options.id ? options.id : heading.toLowerCase()
            .replace(/&[^\s;]+;?/g, '')
            .replace(/[^\s\w\-]+/g, '')
            .replace(/\s+/g, '-');

    html = '<' + tagname + ' id="' + id + '" class="' + classnames + '">' +
               heading + '<a href="#' + id + '" class="content-link"></a>' +
           '</' + tagname + '>';

    return new Handlebars.SafeString(html);
}
