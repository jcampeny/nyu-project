/*jslint node: true */
"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower: {
      install: {
        options: {
          install: true,
          copy: false,
          targetDir: './bower_components',
          cleanTargetDir: true
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/app.js': [ 'dist/app.js' ]
        },
        options: {
          mangle: false
        }
      }
    },
    html2js: {
      dist: {
        src: [ 'app/components/**/*.html', 'app/core/*.html' ],
        dest: 'tmp/templates.js'
      }
    },
    clean: {
      temp: {
        src: [ 'tmp' ]
      }
    },
    concat: {
      options: {
        separator: '\n;'
      },
      dist: {
        src: [ 'app/core/*.js', 'app/services/*.js', 'app/components/**/*.js', 'tmp/*.js' ],
        dest: 'dist/app.js'
      },
      distCss: {
        src: [ 'app/components/**/*.css', 'assets/css/*.css'],
        dest: 'dist/style.css'
      }
    },
    jshint: {
      all: [ 'Gruntfile.js', 'app/core/*.js', 'app/services/*.js', 'app/components/**/*.js' ]
    },
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'app/core/*.js', 'app/services/*.js', 'app/components/**/*.js', 'app/components/**/*.html', 'app/components/**/*.css', 'app/core/*.html', '*.html', 'assets/css/*.css' ],
        tasks: [ 'jshint', 'html2js:dist', 'concat:dist', 'concat:distCss', 'clean:temp', 'karma:unit' ],
        options: {
          atBegin: true
        }
      },
      min: {
        files: [ 'Gruntfile.js', 'app/core/*.js', 'app/services/*.js', 'app/components/**/*.js', '*.html' ],
        tasks: [ 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'concat:distCss', 'clean:temp', 'uglify:dist' ],
        options: {
          atBegin: true
        }
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [{
          src: [ 'index.html', '.htaccess' ],
          dest: '/'
        }, {
          src: [ 'dist/**' ],
          dest: '/'
        }, {
          src: [ 'assets/**' ],
          dest: '/'
        }, {
          src: [ 'bower_components/**' ],
          dest: '/'
        }, {
          src: [ 'app/**' ],
          dest: '/'
        }, {
          src: [ 'export/**' ],
          dest: '/'
        }, {
          src: [ 'upload/**' ],
          dest: '/'
        }, {
          src: [ 'php/**' ],
          dest: '/'
        }, {
          src: [ 'data/**' ],
          dest: '/'
        }]
      }
    },

    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      unit: {
        singleRun: true
      },

      continuous: {
        singleRun: false,
        autoWatch: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('dev', [ /*'bower','connect:server', */ 'watch:dev' ]);
  grunt.registerTask('test', [ 'bower', 'jshint', 'karma:continuous' ]);
  grunt.registerTask('minified', [ 'bower', /*'connect:server', */ 'watch:min' ]);
  grunt.registerTask('package', [ /*'bower',*/ 'jshint', 'html2js:dist', 'concat:dist', 'uglify:dist',
    'clean:temp', 'compress:dist', 'karma:unit' ]);
};
