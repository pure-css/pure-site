var isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.freeze({
    version: '3.10.1',

    config: {
        gallery: 'gallery-2013.03.27-22-06',
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw'
    }
});
