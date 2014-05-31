'use strict';

var fs       = require('fs'),
    mkdirp   = require('mkdirp'),
    rimraf   = require('rimraf'),
    broccoli = require('broccoli'),
    Watcher  = require('broccoli/lib/watcher');

var config = require('../config');

var tree    = broccoli.loadBrocfile(),
    builder = new broccoli.Builder(tree),
    watcher = new Watcher(builder);

function rmBuildDir() {
    rimraf.sync(config.dirs.pub);
}

function exit() {
    process.exit(1);
}

function cleanup() {
    rmBuildDir();
    builder.cleanup();
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('exit', cleanup);

// Remove existing build/ dir or symlink, and create an empty dir to satisfy the
// app's startup process.
rmBuildDir();
mkdirp(config.dirs.pub);

watcher.on('change', function (results) {
    // Remove existing build/ dir or symlink, and create a new symlink to the
    // new Broccoli build dir.
    rmBuildDir();
    fs.symlinkSync(results.directory, config.dirs.pub, 'dir');

    console.log('BUILD');
});

watcher.on('error', function (err) {
    console.log('\x07BUILD ERROR:');
    console.log(err.stack);
    console.log('');
});

module.exports = watcher;
