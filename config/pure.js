var path  = require('path'),
    fs    = require('fs'),

    isProduction = process.env.NODE_ENV === 'production',
    isPureLocal, bowerrc, bower;

exports.version   = '0.3.0';
exports.filesizes = require('./filesizes');
exports.modules   = ['base', 'grids', 'forms', 'buttons', 'tables', 'menus'];

// We always want to serve from the CDN in production.
if (isProduction) { return; }

isPureLocal = process.argv.slice(2).some(function (arg) {
    return arg === '--pure-local';
});

// Export the path at which to serve Pure from the locally-linked Bower package.
if (isPureLocal) {
    bowerrc = path.join(process.cwd(), '.bowerrc');
    bower   = JSON.parse(fs.readFileSync(bowerrc));

    exports.local = path.join(process.cwd(), bower.directory, 'pure', 'build');

    if (!fs.existsSync(exports.local)) {
        console.warn('Your setup to serve Pure locally is wrong!');
    }
}
