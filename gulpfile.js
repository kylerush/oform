/* global require */
var jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  jsonlint = require('gulp-jsonlint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  header = require('gulp-header'),
  connect = require('gulp-connect'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  fs = require('fs');
  qunit = require('node-qunit-phantomjs'),
  gulp = require('gulp');

gulp.task('lintJSON', function(){
  gulp.src(['*.json', '.jshintrc'])
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lintJS', function(){
  gulp.src(['*/**.js', '!**/*.min.js', '!bower_components', '!node_modules'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('prepTestFiles', function(){
  gulp.src('src/oForm.js')
    .pipe(replace('/* expose default functions */', 'jQuery.oFormDefaultFunctions = defaultOptions;'))
    .pipe(replace('/* expose combined function */', 'jQuery.oFormFunctions = settings;'))
    .pipe(rename('oFormTest.js'))
    .pipe(gulp.dest('tests/assets'));
  gulp.src([
    'bower_components/qunit/qunit/qunit.js',
    'bower_components/qunit/qunit/qunit.css',
    'bower_components/jquery/jquery.js',
    'src/assets/scss/javascripts/bootstrap.js'
    ])
      .pipe(gulp.dest('tests/assets/'));
});

gulp.task('css', function(){
  gulp.src('src/assets/scss/stylesheets/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('tests/assets/css/'));
});

gulp.task('connect', function(){
  connect.server({
    root: 'tests',
    livereload: true,
    middleware: function(connect, options, middlewares){
      return[
        function(req, res, next){
          if(req.method === 'POST'){
            if(req.url === '/success'){
              res.writeHead(200, {'Content-Type': 'application/json'});
              fs.readFile('tests/json/success.json',
              {
                encoding: 'utf-8'
              },
              function(err, data){
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

gulp.task('html', function(){
  gulp.src('tests/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function(){
  gulp.watch(['*/**.js', '!bower_component', '!node_modules', '!tests/assets'], ['lintJS', 'prepTestFiles', 'html']);
  gulp.watch(['src/**/*.scss'], ['css']);
  gulp.watch(['tests/*.html'], ['prepTestFiles', 'html']);
});

gulp.task('compress', function(){
  gulp.src('oForm.js')
    .pipe(uglify({mangle: false}))
    .pipe(header('/* oForm - Author: Kyle Rush - MIT license - https://github.com/kylerush/oform */ \n'))
    .pipe(rename('oForm.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('qunit', function(){
  qunit('./tests/index.html');
});

//gulp.task('test', ['prepTestFiles', 'css', 'qunit']);

gulp.task('dev', ['prepTestFiles', 'css', 'connect', 'watch']);

gulp.task('build', ['lintJSON', 'lintJS', 'compress']);
