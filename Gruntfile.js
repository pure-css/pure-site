'use strict';

var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        broccoli_build: {
            build: {
                dest: 'build'
            }
        },

        clean: {
            build: ['build']
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
        }
    });

    // npm tasks.
    grunt.loadNpmTasks('grunt-broccoli-build');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-pure-grids');

    grunt.registerTask('default', ['clean', 'broccoli_build']);
};
