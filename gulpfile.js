/* global require */
var jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  header = require('gulp-header'),
  connect = require('gulp-connect'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  fs = require('fs');
  qunit = require('gulp-qunit'),
  gulp = require('gulp'),
  rimraf = require('gulp-rimraf');

var testDir = 'test/fixture'

gulp.task('lintJS', function(){
  gulp.src(['*/**.js', '!**/*.min.js', '!bower_components', '!node_modules'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('cleanAssets', function(){
  rimraf('/assets');
});

gulp.task('prepTestFiles', function(){
  gulp.src('src/oForm.js')
    .pipe(replace('/* expose default functions */', 'jQuery.oFormDefaultFunctions = defaultOptions;'))
    .pipe(replace('/* expose combined function */', 'jQuery.oFormFunctions = settings;'))
    .pipe(rename('oFormTest.js'))
    .pipe(gulp.dest(testDir + '/assets/'));
  gulp.src([
    'bower_components/qunit/qunit/qunit.js',
    'bower_components/qunit/qunit/qunit.css',
    'bower_components/jquery/jquery.js',
    'src/assets/scss/javascripts/bootstrap.js'
    ])
      .pipe(gulp.dest(testDir + '/assets/'));
});

gulp.task('css', function(){
  gulp.src('src/assets/scss/stylesheets/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest(testDir + '/assets/css/'));
});

gulp.task('connect', function(){
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
  gulp.src(testDir + '/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function(){
  gulp.watch(['*/**.js', '!bower_component', '!node_modules', '!tests/assets'], ['lintJS', 'prepTestFiles', 'reloadHTML']);
  gulp.watch(['src/**/*.scss'], ['css']);
  gulp.watch(['tests/*.html'], ['prepTestFiles', 'reloadHTML']);
});

gulp.task('compress', function(){
  gulp.src('src/oForm.js')
    .pipe(uglify({mangle: false}))
    .pipe(header('/* oForm - Author: Kyle Rush - MIT license - https://github.com/kylerush/oform */ \n'))
    .pipe(rename('oForm.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('checkFiles', function(){

  var files, foundFile;

  files = ['oFormTest.js', 'jquery.js', 'qunit.js'];

  files.forEach(function(script){

    console.log(script + ': ' + typeof( fs.readFileSync('./test/fixture/assets/' + script, {encoding: 'utf-8'}) ) );

  });

});

/*
gulp.task('qunit', function(done){
  qunit('./test/fixture/index.html', {}, function(code){
    if(code !== 0){
      process.exit(1);
    }
  });
});
*/

gulp.task('qunit', function(){
  return gulp.src('./test/fixture/index.html')
         .pipe(qunit());
});

//gulp.task('test', ['prepTestFiles', 'css', 'qunit']);

gulp.task('dev', ['prepTestFiles', 'css', 'connect', 'watch']);

gulp.task('build', ['lintJS', 'compress', 'prepTestFiles', 'css', 'checkFiles', 'qunit']);
