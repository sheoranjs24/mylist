module.exports = function (gulp, plugins, config, $) {
  'use strict';

  // ---------------------------------------------------------------------
  // | Main tasks                                                        |
  // ---------------------------------------------------------------------

  gulp.task('archive', function (done) {
    plugins.runSequence(
      'build',
      'archive:create_archive_dir',
      'archive:zip',
    done);
  });


  // ---------------------------------------------------------------------
  // | Helper tasks                                                      |
  // ---------------------------------------------------------------------

  gulp.task('archive:create_archive_dir', function () {
    plugins.fs.mkdirSync(plugins.path.resolve(config.dirs.archive), '0755');
  });

  gulp.task('archive:zip', function (done) {
    var archiveName = plugins.path.resolve(
      config.dirs.archive,
      config.pkg.name + '_v' + config.pkg.version + '.zip'
    );
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
      'cwd': config.dirs.dist,
      'dot': true // include hidden files
    });
    var output = plugins.fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
      done();
      throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {
      var filePath = plugins.path.resolve(dirs.dist, file);

      // `archiver.bulk` does not maintain the file
      // permissions, so we need to add files individually
      archiver.append(plugins.fs.createReadStream(filePath), {
        'name': file,
        'mode': plugins.fs.statSync(filePath).mode
      });
    });
    archiver.pipe(output);
    archiver.finalize();
  });

}
