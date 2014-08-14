/* global require */
var gulp = require('gulp');

var testDir = 'test/fixture'

gulp.task('lintJS', function(){
  var jshint = require('gulp-jshint'),
      stylish = require('jshint-stylish');
  gulp.src(['*/**.js', '!**/*.min.js', '!bower_components', '!node_modules'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('prepTestFiles', function(){
  var replace = require('gulp-replace'),
      rename = require('gulp-rename');
  gulp.src('src/oForm.js')
    .pipe(replace('/* expose default functions */', 'jQuery.oFormDefaultFunctions = defaultOptions;'))
    .pipe(replace('/* expose combined function */', 'jQuery.oFormFunctions = settings;'))
    .pipe(rename('oFormTest.js'))
    .pipe(gulp.dest(testDir + '/assets/'));
});

gulp.task('css', function(){
  var sass = require('gulp-sass');
  gulp.src('src/assets/scss/stylesheets/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest(testDir + '/assets/css/'));
});

gulp.task('connect', function(){
  var connect = require('gulp-connect'),
      fs = require('fs');
  connect.server({
    root: 'test',
    livereload: true,
    middleware: function(connect, options, middlewares){
      return[
        function(req, res, next){
          if(req.method === 'POST'){
            if(req.url === '/success'){
              fs.readFile(testDir + '/json/success.json',
              {
                encoding: 'utf-8'
              },
              function(err, data){
                if(err){
                  res.writeHead(500, {'Content-Type': 'application/json'});
                } else {
                  res.writeHead(200, {'Content-Type': 'application/json'});
                }
                res.end(data);
              });
            }
          } else {
            next();
          }
        }
      ];
    }
  });
});

gulp.task('reloadHTML', function(){
  var connect = require('gulp-connect');
  gulp.src(testDir + '/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function(){
  gulp.watch(['*/**.js', '!bower_component', '!node_modules', '!tests/assets'], ['lintJS', 'prepTestFiles', 'reloadHTML']);
  gulp.watch(['src/**/*.scss'], ['css']);
  gulp.watch(['tests/*.html'], ['prepTestFiles', 'reloadHTML']);
});

gulp.task('compress', function(){
  var uglify = require('gulp-uglify'),
      header = require('gulp-header'),
      rename = require('gulp-rename');
  gulp.src('src/oForm.js')
    .pipe(uglify({mangle: false}))
    .pipe(header('/* oForm - Author: Kyle Rush - MIT license - https://github.com/kylerush/oform */ \n'))
    .pipe(rename('oForm.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('qunit', function(){
  var qunit = require('gulp-qunit');
  return gulp.src('./test/fixture/index.html')
         .pipe(qunit());
});

gulp.task('dev', ['prepTestFiles', 'css', 'connect', 'watch']);

gulp.task('test', ['lintJS', 'qunit']);

gulp.task('build', ['lintJS', 'compress']);
