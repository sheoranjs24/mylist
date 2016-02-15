module.exports = function(gulp, plugins, config, $) {
  'use strict';

  gulp.task('watch', function() {
    gulp.watch(config.dirs.src + '/assets/img/**/*', ['images']);
    gulp.watch(config.dirs.src + '/assets/fonts/**/*', ['icons']);

    gulp.watch(config.dirs.src + '/assets/sass/*.scss', ['styles'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    gulp.watch([
      config.dirs.src + '/frontend/**/*.jsx',
      config.dirs.src + '/frontend/**/*.js'
      ],
      ['webpack']
    )
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

   // Watch any files in dist/, reload on change
   livereload.listen();
   gulp.watch(['dist/**']).on('change', livereload.changed);
 });

}
