module.exports = function (grunt) {
    grunt.initConfig({
        grid_units: {
            dest : 'public/css/responsive-grid.css',
            units: [5, 24],
            options: {
                mediaQueries: {
                    med : 'screen and (min-width: 767px)'
                }

            }
        }
    })

    // Local tasks.
    grunt.loadTasks('lib/tasks/');

    grunt.registerTask('default', 'grid_units');
};

