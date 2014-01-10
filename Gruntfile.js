'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        grid_units: {
            dest : 'build/css/responsive-grid.css',
            options: {
                mediaQueries: {
                    med : 'screen and (min-width: 48em)', // 768px
                    lrg : 'screen and (min-width: 75em)'  // 1200px
                }
            }
        },

        stripmq: {
            all: {
                files: {
                    'build/css/responsive-grid-old-ie.css': ['build/css/responsive-grid.css'],
                    'build/css/main-old-ie.css': ['public/css/main.css'],

                    // Layout Files
                    'build/css/layouts/blog-old-ie.css': ['public/css/layouts/blog.css']
                }
            }
        }
    });

    // Local tasks.
    grunt.loadTasks('lib/tasks/');
    grunt.loadNpmTasks('grunt-stripmq');

    grunt.registerTask('default', ['grid_units', 'stripmq']);
};
