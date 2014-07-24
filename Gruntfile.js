module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      gruntfile: {
        options: {
          trailing: true,
          curly: true,
          eqeqeq: true,
          indent: 4,
          latedef: true,
          noempty: true,
          nonbsp: true,
          undef: true,
          unused: true,
          quotmark: 'single',
          browser: true,
          globals: {
            module: false
          }
        },
        files: {
          src: ['Gruntfile.js']
        }
      },
      oform: {
        options: {
          trailing: true,
          curly: true,
          eqeqeq: true,
          indent: 4,
          latedef: true,
          noempty: true,
          nonbsp: true,
          undef: true,
          unused: true,
          quotmark: 'single',
          browser: true,
          globals: {
            jQuery: true,
            $: true
          }
        },
        files: {
          src: ['oForm.js']
        }
      }
    },
    jsonlint: {
      src: ['package.json', 'bower.json']
    },
    uglify: {
      options: {
        mangle: false,
        compress: true,
        wrap: true
      },
      oform: {
        options: {
          banner: '/* oForm - Author: Kyle Rush - MIT license - https://github.com/kylerush/oform */ \n'
        },
        files: {
          'dist/oForm.min.js': ['oForm.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build', [
    'jshint',
    'jsonlint',
    'uglify'
  ]);

  grunt.registerTask('default', []);

};
