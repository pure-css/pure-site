var isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.freeze({
    version: '3.9.0',
    gallery: 'gallery-2013.03.20-19-59',
    config: JSON.stringify({
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw',

        modules: {

        }
    })
});
