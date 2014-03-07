'use strict';

var path = require('path');

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
            },

            npm: {
                expand : true,
                cwd    : 'node_modules/',
                dest   : 'build/public/vendor/',

                src: [
                    'css-mediaquery/index.js',
                    'rework/rework.js',
                    'rework-pure-grids/index.js',
                    'handlebars/dist/handlebars.runtime.js'
                ],

                rename: function (dest, src) {
                    var name = path.basename(src);

                    if (name === 'index.js') {
                        name = path.dirname(src) + '.js';
                    }

                    return path.join(dest, name);
                }
            }
        },

        pure_grids: {
            main: {
                dest: 'build/public/css/main-grid.css',

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
                dest: 'build/public/css/layouts/gallery-grid.css',

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
    grunt.loadNpmTasks('grunt-pure-grids');

    grunt.registerTask('default', ['clean', 'copy', 'pure_grids', 'stripmq']);

    // Makes the `watch` task run a build first.
    grunt.renameTask('watch', 'observe');
    grunt.registerTask('watch', ['default', 'observe']);
};
