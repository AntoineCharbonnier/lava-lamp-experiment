var gulp   = require('gulp')
var config = require('../config')

gulp.task('compile', ['sass', 'browserify']);
gulp.task('compile-and-watch', ['sass', 'browserify:watch', 'watch']);
gulp.task('build',   ['sass-build', 'browserify:build']);

gulp.task('server', ['browserSync', 'compile-and-watch']);

// gulp.task('server', ['serve', 'compile-and-watch']);

gulp.task('default', ['prompt']);
