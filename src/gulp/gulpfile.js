var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')({
  DEBUG: false,
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  config: '../../package.json',
  scope: ['dependencies', 'devDependencies', 'peerDependencies'],
  replaceString: /\bgulp[\-.]/,
  camelize: true,
  lazy: true,
  rename: {
    'gulp-ruby-sass': 'sass'
  }
});

plugins.fs = require('fs');
plugins.path = require('path');

var config = {};
config.webpackConfig = require('./config.js');
plugins.webpack = require('webpack');
plugins.webpackDevServer = require('webpack-dev-server');
plugins.stream = require('webpack-stream');

plugins.sassdoc = require('sassdoc');
config.sassdocOptions = {
  dest: './docs/sassdoc'
};

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
plugins.runSequence = require('run-sequence');

config.pkg = require('../../package.json');
config.dirs = config.pkg['h5bp-configs'].directories;

config.autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

taskPath = './tasks/'
// async readdir does not identify task names
taskList = plugins.fs.readdirSync(taskPath);
taskList.forEach(function (taskFile) {
  require(taskPath + taskFile)(gulp, plugins, config);
});

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

// install dependencies
gulp.task('install:dep', function() { 
    return gulp.src([
      './package.json',     // npm dependencies
      './bower.json',       // bower dependencies
      './requirements.txt'  // python dependencies
    ])
    .pipe(install());
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('default', function (done) {
  runSequence(
      'build',
      ['webpack-dev-server', 'watch'],
  done);
});
