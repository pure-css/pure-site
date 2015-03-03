'use strict';

var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        broccoli_build: {
            build: {
                dest: 'build/'
            }
        },

        clean: {
            build: 'build/',
            tmp  : 'tmp/'
        },

        pure_grids: {
            main: {
                dest: 'public/css/main-grid.css',

                options: {
                    selectorPrefix: '.u-',

                    mediaQueries: {
                        sm: 'screen and (min-width: 35.5em)', // 568px
                        md: 'screen and (min-width: 48em)',   // 768px
                        lg: 'screen and (min-width: 58em)',   // 928px
                        xl: 'screen and (min-width: 75em)'    // 1200px
                    }
                }
            },

            gallery: {
                dest: 'public/css/layouts/gallery-grid.css',

                options: {
                    selectorPrefix: '.u-',
                    units         : 6,

                    mediaQueries: {
                        med : 'screen and (min-width: 30em)',
                        lrg : 'screen and (min-width: 48em)'
                    }
                }
            }
        },

        shell: {
            health_check: {
                command: 'mkdir -p artifacts/test/health-check &&' +
                    ' ./node_modules/.bin/mocha --reporter tap tests/health-check.js --host=' + (grunt.option('host') || 'localhost:5000') +
                        ' | tee artifacts/test/health-check/results.tap'
            }
        }
    });

    // npm tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-broccoli-build');
    grunt.loadNpmTasks('grunt-pure-grids');
    grunt.loadNpmTasks('grunt-shell-spawn');

    grunt.registerTask('build', ['clean', 'broccoli_build', 'clean:tmp']);

    grunt.registerTask('health.check', ['shell:health_check']);

    grunt.registerTask('default', ['build']);
};
