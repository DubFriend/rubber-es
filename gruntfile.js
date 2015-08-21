module.exports = function(grunt) {
    grunt.initConfig({
        mochaTest: {
            all: {
                options: { reporter: 'dot' },
                src: ['test.js']
            }
        },
        watch: {
            scripts: {
                files: ['**/*'],
                tasks: ['mochaTest'],
                options: { spawn: true }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('test', ['mochaTest']);
};
