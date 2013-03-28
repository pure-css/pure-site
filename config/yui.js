var isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.freeze({
    version: '3.9.0',
    gallery: 'gallery-2013.03.27-22-06',
    config: JSON.stringify({
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw',

        modules: {

        }
    })
});
