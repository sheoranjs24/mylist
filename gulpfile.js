var fs = require('fs');
var path = require('path');

var gulp = require('gulp');ß

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files']
  replaceString: /\bgulp[\-.]/
});

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {
    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });
    });
    archiver.pipe(output);
    archiver.finalize();
});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    //'copy:.htaccess',
    'copy:index.html',
    'copy:main.sass',
    'copy:jquery',
    'copy:license',
    'copy:settings',
    'copy:misc'
]);

gulp.task('copy:.htaccess', function () {
    return gulp.src('/lib/node_modules/apache-server-configs/dist/.htaccess')
               .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/templates/index.html')
               .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['/lib/node_modules/jquery/dist/jquery.min.js'])
               .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
               .pipe(gulp.dest(dirs.dist + '/assets/js/vendor'));
});

gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:settings', function () {
    return gulp.src([dirs.src + '/settings/*'])
      .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/sass/main.scss',
        '!' + dirs.src + '/templates/index.html',
        '!' + dirs.src + 'settings/*',
        '!' + dirs.src + '/static/js/*.js'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});


gulp.task('styles', function() { 
    return gulp.src(dirs.src + '/static/sass/style.scss')
         .pipe(sass({
             style: 'compressed',
             loadPath: [
                '!' + dirs.src + '/static/sass/main.scss',
                 dirs.src + '/static/sass',
                 dirs.bower + '/fontawesome/scss',
                dirs.bower + '/normalize.scss'
             ]
         }) 
        .on("error", notify.onError(function (error) {
             return "Error: " + error.message;
         }))) 
         .pipe(gulp.dest(dirs.dist + '/assets/css')); 
});
gulp.task('css', function() {
	var cssFiles = ['src/css/*'];
	gulp.src(plugins.mainBowerFiles().concat(cssFiles))
		.pipe(plugins.filter('*.css'))
		.pipe(plugins.order([
			'normalize.css',
			'*'
		]))
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(dest + 'css'));

});

gulp.task('scripts', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/static/js/*.js',
        dirs.test + '/*.js'
    ]).pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/assets/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(dirs.dist + '/assets/js'))
      .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('js', function() {
	var jsFiles = ['src/js/*'];
	gulp.src(plugins.mainBowerFiles().concat(jsFiles))
		.pipe(plugins.filter('*.js'))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(dest + 'js'));

});

gulp.task('images', function() {
  return gulp.src(dirs.src + '/static/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(dirs.dist + '/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('icons', function() { 
    return gulp.src(dirs.bower + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest(dirs.dist + '/assets/fonts')); 
});

//gulp.task('default', ['minify', 'fix-template', 'fix-paths', 'add-headers']);
gulp.task('minify', ['clean'], function() {
   return gulp.src(dirs.src + '/templates/index.src.tpl.html')
        .pipe(usemin({
            assetsDir: dirs.dist + '/assets',
            css: [minifyCss(), 'concat'],
            js: [uglify(), 'concat']
        }))
        .pipe(gulp.dest(dirs.dist + '/assets'));
});

gulp.task('fix-template', ['minify'], function() {
    return gulp.src('public/layout.src.tpl')
        .pipe(rimraf())
        .pipe(rename("layout.tpl"))
        .pipe(gulp.dest('src/templates'));
});

gulp.task('fix-paths', ['minify'], function() {
    gulp.src('public/css/site.css')
        .pipe(replace('../', '../bower_components/bootstrap/dist/'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('add-headers', ['fix-template'], function() {
    gulp.src('src/templates/layout.tpl')
        .pipe(header("<!-- This file is generated — do not edit by hand! -->\n"))
        .pipe(gulp.dest('src/templates'));

    gulp.src('public/js/site.js')
        .pipe(header("/* This file is generated — do not edit by hand! */\n"))
        .pipe(gulp.dest('public/js'));

    gulp.src('public/css/site.css')
        .pipe(header("/* This file is generated — do not edit by hand! */\n"))
        .pipe(gulp.dest('public/css'));
});


gulp.task('watch', ['default'], function() {

  gulp.watch(dirs.src + '/static/sass/*.scss', ['styles']);
  gulp.watch(dirs.src + '/static/js/*.js', ['scripts']);
  gulp.watch(dirs.src + '/static/img/**/*', ['images']);
  gulp.watch(dirs.src + '/static/fonts/**/*', ['icons']);

  // Watch any files in dist/, reload on change
  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
});
gulp.task('watch', ['default'], function() {
    var watchFiles = [
        'src/templates/layout.src.tpl',
        'public/bower_components/*/dist/js/*.js',
        '!public/bower_components/*/dist/js/*.min.js',
        'public/bower_components/*/dist/*.js',
        'public/bower_components/*/dist/css/*.css',
        '!public/bower_components/*/dist/css/*.min.css',
        'public/bower_components/*/dist/font/*'
    ];

    gulp.watch(watchFiles, ['default']);
});

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(dirs.bower));
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'styles', 'scripts', 'images', 'icons'],
        'copy',
    done);
});

gulp.task('default', ['build']);
