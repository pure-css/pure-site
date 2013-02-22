var isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.freeze({
    version: '3.8.1',

    config: JSON.stringify({
        combine: isProduction,
        filter : isProduction ? 'min' : 'raw',

        modules: {

        }
    })
});
