var fs   = require('fs'),
    path = require('path');

exports.slash = require('express-slash');

fs.readdirSync(__dirname).forEach(function (filename) {
    if (filename === 'index.js' || path.extname(filename) !== '.js') { return; }
    var module = path.basename(filename, '.js');
    exports[module] = require(path.join(__dirname, module));
});
