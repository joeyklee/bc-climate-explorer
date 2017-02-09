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
      build: {
        src: ['src/index.js'],
        dest: 'build/bundle.js'
      },
      release: {
        src: ['src/index.js'],
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
          {expand: false, src: ['src/index.html'], dest: 'build/index.html'}
        ]
      },
      release: {
        files: [
          {expand: false, src: ['src/index.html'], dest: 'release/index.html'}
        ]
      }
    },
    clean: {
      build: ['build/*'],
      release: ['release/bundle.js']
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
    }
  });

  grunt.registerTask('build', ['clean:build', 'browserify', 'copy:build']);
  grunt.registerTask('release', ['clean:release', 'browserify', 'uglify', 'copy:release']);
  grunt.registerTask('serve', ['clean:build', 'browserify', 'copy:build', 'connect:server', 'watch:serve']);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
};
