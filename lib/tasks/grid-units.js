'use strict';

var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

module.exports = function (grunt) {
    grunt.registerMultiTask('grid_units', 'Generates grid units.', function () {
        var options = this.options({
            indent: '    '
        });

        this.files.forEach(function (fileGroup) {
            var css = rework('').use(pureGrids.units(options.units, options));

            grunt.file.write(fileGroup.dest, css.toString(options));
            grunt.log.writeln('File "' + fileGroup.dest + '" created.');
        });
    });
};
