'use strict';

var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

module.exports = function (grunt) {
    grunt.registerTask('grid_units', 'Generates grid units.', function (target) {
        var config = grunt.config.get(this.name),
            css    = rework('').use(pureGrids.units(config.units, config.options));

        grunt.file.write(config.dest, css.toString({indent: '    '}));
        grunt.log.writeln('File "' + config.dest + '" created.');

        grunt.log.oklns('Delete the non-media query CSS from ' + config.dest + ', until https://github.com/ericf/rework-pure-grids/issues/6 is fixed.')
    });
};
