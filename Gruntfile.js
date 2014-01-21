'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: ['build/']
        },

        copy : {
            pub: {
                src    : 'public/**',
                dest   : 'build/',
                expand : true
            },

            bower: {
                cwd   : 'bower_components/',
                expand: true,
                dest  : 'build/public/vendor/',
                src   : ['rainbow/js/**']
            }
        },

        grid_units: {
            main: {
                dest : 'build/public/css/main-grid.css',
                options: {
                    mediaQueries: {
                        sm : 'screen and (min-width: 35.5em)', // 568px
                        med: 'screen and (min-width: 48em)',   // 768px
                        lrg: 'screen and (min-width: 58em)',   // 928px
                        xl : 'screen and (min-width: 75em)'    // 1200px
                    }
                }
            },

            gallery: {
                dest : 'build/public/css/layouts/gallery-grid.css',
                options: {
                    units: 6,
                    mediaQueries: {
                        med : 'screen and (min-width: 30em)',
                        lrg : 'screen and (min-width: 48em)'
                    }
                }
            }
        },

        stripmq: {
            site: {
                expand: true,
                src   : ['build/public/css/{main,main-grid,home}.css'],
                des   : 'build/public/css/',
                ext   : '-old-ie.css'
            },

            layouts: {
                expand: true,
                src   : ['build/public/css/layouts/*.css'],
                des   : 'build/public/css/layouts/',
                ext   : '-old-ie.css'
            }
        },

        observe: {
            bower: {
                files: ['bower_components/**', '!bower_components/pure/**'],
                tasks: ['copy:bower']
            },

            pub: {
                files: 'public/**',
                tasks: ['default']
            }
        }
    });

    // npm tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-stripmq');

    // Local tasks.
    grunt.loadTasks('lib/tasks/');

    grunt.registerTask('default', ['clean', 'copy', 'grid_units', 'stripmq']);

    // Makes the `watch` task run a build first.
    grunt.renameTask('watch', 'observe');
    grunt.registerTask('watch', ['default', 'observe']);
};
