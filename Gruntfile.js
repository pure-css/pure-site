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
            all: {
                files: {
                    'build/public/css/main-grid-old-ie.css':
                        ['build/public/css/main-grid.css'],

                    'build/public/css/main-old-ie.css':
                        ['build/public/css/main.css'],


                    // Layout Grids
                    'build/public/css/layouts/gallery-grid-old-ie.css':
                        ['build/public/css/layouts/gallery-grid.css'],

                    //Layout CSS
                    'build/public/css/layouts/blog-old-ie.css':
                        ['build/public/css/layouts/blog.css'],

                    'build/public/css/layouts/marketing-old-ie.css':
                        ['build/public/css/layouts/marketing.css'],

                    'build/public/css/layouts/pricing-old-ie.css':
                        ['build/public/css/layouts/pricing.css'],

                    'build/public/css/layouts/side-menu-old-ie.css':
                        ['build/public/css/layouts/side-menu.css'],

                    'build/public/css/layouts/gallery-old-ie.css':
                        ['build/public/css/layouts/gallery.css'],

                    'build/public/css/layouts/email-old-ie.css':
                        ['build/public/css/layouts/email.css']
                }
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
