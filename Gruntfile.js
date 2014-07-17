var os = require('os');
module.exports = function (grunt) {

    var runAppCmd = function () {
        if (os.platform() === "darwin") {
            return "bin/atom-shell-darwin/Atom.app/Contents/MacOS/Atom app";
        } else {
            return "bin/atom-shell-linux/atom app";
        }
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "download-atom-shell": {
            version: "0.13.3",
            outputDir: "bin/atom-shell-" + os.platform(),
            rebuild: true
        },
        shell : {
            runApp : {
                command : runAppCmd(),
                options: {
                    async: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["app/client/vendor/bootstrap/less"]
                },
                files: {
                    "app/client/css/app.css": "app/client/css/app.less"
                }
            }
        },
        watch: {
            less: {
                files: ['**/*.less'],
                tasks: ['less:development'],
                options: {
                    spawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-download-atom-shell');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['download-atom-shell', 'less', 'shell:runApp','watch']);

};
