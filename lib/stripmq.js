'use strict';

var mediaQuery = require('css-mediaquery');

module.exports = function (options) {
    options || (options = {});

    options = {
        type           : options.type || 'screen',
        width          : options.width || 1024,
        'device-width' : options['device-width'] || options.width || 1024,
        height         : options.height || 768,
        'device-height': options['device-height'] || options.height || 768,
        resolution     : options.resolution || '1dppx',
        orientation    : options.orientation || 'landscape',
        'aspect-ratio' : options['aspect-ratio'] || options.width/options.height || 1024/768,
        color          : options.color || 3
    };

    return function (style) {
        style.rules = style.rules.reduce(function (rules, rule) {
            if (rule.type === 'media') {
                if (mediaQuery.match(rule.media, options)) {
                    rules.push.apply(rules, rule.rules);
                }
            } else {
                rules.push(rule);
            }

            return rules;
        }, []);
    };
};
