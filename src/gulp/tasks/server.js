module.exports = function (gulp, plugins, config, $) {
  'use strict';

  function browserSyncInit(baseDir, files) {
    browserSync.instance = browserSync.init(files, {
      startPath: '/', server: { baseDir: baseDir }
    });
  }

  // starts a development server
  // runs preprocessor tasks before,
  // and serves the src and .tmp folders
  //gulp.task(
  //    'serve',
  //    ['typescript', 'jade', 'sass', 'inject' ],
  //    function () {
  //  browserSyncInit([
  //    paths.tmp
  //    paths.src
  //  ], [
  //    paths.tmp + '/**/*.css',
  //    paths.tmp + '/**/*.js',
  //    paths.tmp + '/**/*.html'
  //  ]);
  //});

  // starts a production server
  // runs the build task before,
  // and serves the dist folder
  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(config.dirs.dist);
  });


  // Webpack dev server
  gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(plugins.webpack(myConfig), {
      publicPath: "/" + myConfig.output.publicPath,
      stats: {
        colors: true
      }
    }).listen(8080, "localhost", function(err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
  });

}
