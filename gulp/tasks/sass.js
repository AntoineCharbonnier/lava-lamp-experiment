var gulp       = require('gulp');
var config     = require('../config').sass;
var rubySass   = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify     = require('gulp-notify');
var reload     = require('browser-sync').reload;

gulp.task('sass', function(){
    compile(false);
});

gulp.task('sass-build', function(){
    compile(true);
});

function compile(minify) {
  var options = config.options.dev;

  if (minify) options = config.options.dist;

  options.loadPath = require('node-bourbon').includePaths;

  return rubySass(config.srcPath, options)
          .on('error', notify.onError(function(error){
              return 'ERROR: ' + error
          }))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dstPath));
}
