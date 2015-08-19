var gulp = require('gulp'),
  create = require('gulp-cordova-create'),
  plugin = require('gulp-cordova-plugin'),
  android = require('gulp-cordova-build-android');

require('shelljs/global');


module.exports = function(options) {
  gulp.task('build_mobile', ['build'], function(done) {
    return gulp.src('dist')
      .pipe(create())
      .pipe(plugin('cordova-plugin-whitelist'))
      .pipe(plugin('../ZeroConf'))
      //.pipe(plugin('https://github.com/vstirbu/ZeroConf'))
      .pipe(android())
      .pipe(gulp.dest('dist/apk'))
  });

  gulp.task('run_android', ['build_mobile'], function(done) {
    options = options || {};
    var self = this,
      dir = options.dir || '.cordova';

    cd(dir);
    exec('cordova run android', done);
  });

}
