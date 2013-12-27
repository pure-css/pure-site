module.exports = function (grunt) {
    grunt.initConfig({
        grid_units: {
            dest : 'public/css/responsive-grid.css',
            units: [5, 24],
            options: {
                mediaQueries: {
                    med : 'screen and (min-width: 48em)', //approx 767px at 16px base font
                    lrg : 'screen and (min-width: 75em)' //approx 1200px at 16px base font
                }

            }
        }
    })

    // Local tasks.
    grunt.loadTasks('lib/tasks/');

    grunt.registerTask('default', 'grid_units');
};

