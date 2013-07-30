#!/usr/bin/env node

var path = require('path'),
    fs   = require('fs'),
    zlib = require('zlib'),

    bowerrc   = JSON.parse(fs.readFileSync('.bowerrc', 'utf8')),
    pureDir   = path.resolve(bowerrc.directory, 'pure', 'build'),
    output    = path.resolve('./config/filesizes.json'),
    filesizes = {},

    modules, pending;

modules = fs.readdirSync(pureDir).filter(function (filename) {
    return (/\-min\.css$/).test(filename);
}).map(function (filename) {
    return filename.replace(/\-min\.css$/, '');
});

pending = modules.length;

console.log('Reading in Pure files from:', pureDir);
modules.forEach(function (module) {
    var file = fs.readFileSync(path.join(pureDir, module + '-min.css'));

    zlib.gzip(file, function (err, compressed) {
        if (err) { throw err; }
        filesizes[module] = compressed.length;
        done();
    });
});

function done() {
    pending--;
    if (pending) { return; }

    fs.writeFileSync(output, JSON.stringify(filesizes));
    console.log('Wrote Pure file sizes to:', output);
}
