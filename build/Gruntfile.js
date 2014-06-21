var os = require('os');
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "download-atom-shell": {
      version: "0.13.2",
      outputDir: "./atom-shell-" + os.platform(),
      rebuild: true
    }
  });

  grunt.loadNpmTasks('grunt-download-atom-shell');

};
