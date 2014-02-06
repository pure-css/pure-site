var fs   = require('fs'),
    path = require('path');

var bowerPureDir = path.resolve('bower_components', 'pure');

exports.version = require(path.join(bowerPureDir, 'bower.json')).version;
exports.modules = ['base', 'grids', 'forms', 'buttons', 'tables', 'menus'];
exports.local   = getLocalPureDir(bowerPureDir);

exports.serveLocally = process.argv.slice(2).some(function (arg) {
    return arg === '--pure-local';
});

// -----------------------------------------------------------------------------

function getLocalPureDir(bowerPureDir) {
    var localPureDir = null;

    // Find the Pure's code in the Bower component. This supports both `pure`
    // and `pure-release` repo structures.
    if (fs.existsSync(path.join(bowerPureDir, 'pure.css'))) {
        localPureDir = bowerPureDir;
    } else if (fs.existsSync(path.join(bowerPureDir, 'build', 'pure.css'))) {
        localPureDir = path.join(bowerPureDir, 'build');
    }

    return localPureDir;
}
