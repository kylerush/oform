/* global require */
var jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  jsonlint = require('gulp-jsonlint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  header = require('gulp-header'),
  connect = require('gulp-connect'),
  gulp = require('gulp');

gulp.task('lintJSON', function(){
  gulp.src(['*.json', '.jshintrc'])
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lintJS', function(){
  gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('compress', function(){
  gulp.src('oForm.js')
    .pipe(uglify({mangle: false}))
    .pipe(header('/* oForm - Author: Kyle Rush - MIT license - https://github.com/kylerush/oform */ \n'))
    .pipe(rename('oForm.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function(){
  gulp.src([
    'bower_components/qunit/qunit/qunit.js',
    'bower_components/qunit/qunit/qunit.css',
    'bower_components/jquery/jquery.js',
    'src/oForm.js'
    ])
      .pipe(gulp.dest('tests/assets/'));

    connect.server({
      root: 'tests',
      livereload: true
    });
});

gulp.task('build', ['lintJSON', 'lintJS', 'compress']);
