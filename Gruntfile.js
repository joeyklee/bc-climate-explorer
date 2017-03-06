module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          livereload: true,
          port: 8000,
          base: 'build'
        }
      }
    },
    browserify: {
      options: {
        transform: [["babelify"]]
      },
      build: {
        src: ['src/**/*.js'],
        dest: 'build/bundle.js'
      },
      release: {
        src: ['src/**/*.js'],
        dest: 'release/bundle.js'
      }
    },
    uglify: {
      release: {
        files: {
          'release/bundle.js': ['release/bundle.js']
        }
      }
    },
    copy: {
      build: {
        files: [
          {expand: true, flatten: true, src: ['src/**/*.html'], dest: 'build/'},
          {
            expand: false,
            src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css'],
            dest: 'build/css/bootstrap.min.css'
          }
        ]
      },
      release: {
        files: [
          {expand: true, flatten: true, src: ['src/**/*.html'], dest: 'release/'},
          {
            expand: false,
            src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css'],
            dest: 'release/css/bootstrap.min.css'
          }
        ]
      }
    },
    clean: {
      build: ['build/*'],
      release: ['release/bundle.js']
    },
    concat: {
      build: {
        files: {
          'build/css/styles.css': ['src/**/*.css']
        }
      },
      release: {
        files: {
          'release/css/styles.css': ['src/**/*.css']
        }
      }
    },
    watch: {
      serve: {
        files: [
          'src/**/*.js',
          'src/**/*.html',
          'src/**/*.css'
        ],
        tasks: [
          'build'
        ],
        options: {
          livereload: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('build', ['clean:build', 'browserify', 'copy:build', 'concat:build']);
  grunt.registerTask('release', ['test', 'clean:release', 'browserify', 'concat:release', 'uglify', 'copy:release']);
  grunt.registerTask('serve', ['clean:build', 'browserify', 'copy:build', 'connect:server', 'concat:build', 'watch:serve']);
  grunt.registerTask('test', ['karma']);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');
};
