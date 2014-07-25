/* global require */
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jsonlint = require('gulp-jsonlint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var gulp = require('gulp');

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

gulp.task('build', ['lintJSON', 'lintJS', 'compress']);
