module.exports = function (grunt) {
    grunt.initConfig({
        grid_units: {
            dest : 'public/css/responsive-grid.css',
            units: [5, 24],
            options: {
                mediaQueries: {
                    med : 'screen and (min-width: 40em)', //approx 767px at 16px base font
                    lrg : 'screen and (min-width: 75em)' //approx 1200px at 16px base font
                }

            }
        },

        stripmq: {
            all: {
                files: {
                    'public/css/responsive-grid-old-ie.css': ['public/css/responsive-grid.css'],
                    'public/css/main-old-ie.css': ['public/css/main.css']
                }
            }
        }
    })

    // Local tasks.
    grunt.loadTasks('lib/tasks/');
    grunt.loadNpmTasks('grunt-stripmq');

    grunt.registerTask('default', ['grid_units', 'stripmq']);
};

