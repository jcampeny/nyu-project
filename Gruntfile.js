/*jslint node: true */
"use strict";


module.exports = function(grunt) {
  var vendorScripts = [
    "bower_components/angular/angular.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "bower_components/angular-resource/angular-resource.min.js",
    "bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "bower_components/angular-sanitize/angular-sanitize.min.js",
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js"
  ];

  var vendorStyles = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/angular-bootstrap/ui-bootstrap-csp.css",
    "bower_components/font-awesome/css/font-awesome.min.css",
    "bower_components/font-awesome/css/font-awesome.css"
  ];


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
        src: [ 'app/**/*.html' ],
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
        separator: '\n'
      },
      dist: {
        src: [ 'app/core/*.js', 'app/**/*.js', 'tmp/*.js' ], // Include redundant core/*.js to process it first and create angular main module
        dest: 'dist/app.js'
      },
      distVendorJs: {
        src: vendorScripts,
        dest: 'dist/vendor.js'
      },
      distVendorCss: {
        src: vendorStyles,
        dest: 'dist/vendor.css'
      },
    },
    sass: {
      dist: {
        files: {
          'dist/style.css' : 'app/core/main.scss'
        }
      }
    },
    jshint: {
      all: [ 'Gruntfile.js', 'app/**/*.js' ]
    },
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'app/**/*.js', 'app/**/*.html', 'app/**/*.scss', '*.html' ],
        tasks: [ 'jshint', 'html2js:dist', 'concat:dist', 'sass:dist', 'concat:distVendorJs', 'concat:distVendorCss', 'clean:temp', 'karma:unit' ],
        options: {
          atBegin: true
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true, 
            src: ['index.html', '.htaccess', 'dist/**', 'assets/**', 'upload/**', 'php/**'], 
            dest: 'release/<%= pkg.name %>-<%= pkg.version %>/'
          }
        ]
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'release/<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [{
          dot: true,
          expand: true,
          src: [ '<%= pkg.name %>-<%= pkg.version %>/**' ],
          cwd: 'release/',
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
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('dev', [ 'watch:dev' ]);
  grunt.registerTask('test', [ 'bower', 'jshint', 'karma:continuous' ]);
  grunt.registerTask('package', [ 
    'jshint', 'html2js:dist', 
    'concat:dist', 'sass:dist', 'concat:distVendorJs', 'concat:distVendorCss',
    'uglify:dist', 'clean:temp', 'copy:dist', 'compress:dist', 'karma:unit' ]);
};
