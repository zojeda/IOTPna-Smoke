var gulp = require('gulp'),
  create = require('gulp-cordova-create'),
  plugin = require('gulp-cordova-plugin'),
  android = require('gulp-cordova-build-android'),
  version = require('gulp-cordova-version'),
  author = require('gulp-cordova-author')
  description = require('gulp-cordova-description')
  icon = require('gulp-cordova-icon')
  pkg = require('../package.json');

require('shelljs/global');


module.exports = function(options) {
  gulp.task('build_mobile', ['build'], function(done) {
    return gulp.src('dist')
      .pipe(create(options))
      .pipe(version(pkg.version))
      .pipe(description('Hexacta Smoke Sensor App'))
      .pipe(author('Hexacta IoT Team'))
      .pipe(icon('src/smoke-icon.png'))
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
