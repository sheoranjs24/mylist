module.exports = function (gulp, plugins, config, $) {
  'use strict';

  // ---------------------------------------------------------------------
  // | Main tasks                                                        |
  // ---------------------------------------------------------------------

  gulp.task('build', function (done) {
    plugins.runSequence(
        ['clean', 'images', 'icons', 'styles', 'scripts'],
        'copy',
    done);
  });


  // ---------------------------------------------------------------------
  // | Helper tasks                                                      |
  // ---------------------------------------------------------------------

  // clean distribution directories
  gulp.task('clean', function (done) {
    require('del')([
      config.dirs.archive,
      config.dirs.dist
    ]).then(function () {
      done();
    });
  });

  // Build Images
  gulp.task('images', function() {
    return gulp.src(config.dirs.src + '/assets/img/**/*')
      .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest(config.dirs.dist + '/static/img'))
      .pipe(plugins.notify({ message: 'Images task complete' }));
  });

  // Build Icons
  gulp.task('icons', function() { 
    return gulp.src([
      config.dirs.src + '/assets/fonts/**/*',
      config.dirs.bower + '/fontawesome/fonts/**.*', //*.{eot,svg,ttf,woff}'],
      config.dirs.bower + '/bootstrap/fonts/**.*'
    ])
      .pipe(gulp.dest(config.dirs.dist + '/static/fonts'))
      .pipe(plugins.notify({ message: 'Icons task complete' }));
  });


  // build CSS file
  gulp.task('styles', function (done) {
    plugins.runSequence(
      'sass',
      'css',
      'sassdoc',
      done);
  });

  gulp.task('sass', function() { 
    return gulp.src(config.dirs.src + '/assets/sass/*.scss')
      .pipe(plugins.sourcemaps.init())
     .pipe(plugins.sass({
        style: 'compressed',
       loadPath: [
          //'!' + dirs.src + '/static/sass/main.scss',
         config.dirs.src + '/assets/sass',
         config.dirs.bower + '/fontawesome/scss',
        config.dirs.bower + '/normalize-scss/scss'
       ]
     }) 
      .on("error", plugins.notify.onError(function (error) {
       return "Error: " + error.message;
     }))) 
      .pipe(plugins.sourcemaps.write()) //dirs.build + '/css/maps'
      .pipe(plugins.autoprefixer(autoprefixerOptions))
       .pipe(gulp.dest(config.dirs.build + '/static/css'));
  });

  gulp.task('css', function() {
  	var cssFiles = [config.dirs.build + '/static/css/*'];
  	return gulp.src(plugins.mainBowerFiles().concat(cssFiles))
  		.pipe(plugins.filter('*.css'))
  		.pipe(plugins.order([
  			'normalize.css',
  			'*'
  		]))
  		.pipe(plugins.concat('main.css'))
  		.pipe(gulp.dest(config.dirs.dist + '/static/css'))
  		.pipe(plugins.uglify())
  		.pipe(gulp.dest(config.dirs.dist + '/static/css'));
  });

  gulp.task('sassdoc', function() {
    return gulp.src('/assets/sass/**/*.scss')
    .pipe(plugins.sassdoc(sassdocOptions))
    .resume();
  });


  // build JS file with webpack
  // webpack
  gulp.task('scripts', [], function() {
    return gulp.src([
        config.dirs.src + '/frontend/**/*.jsx',
        config.dirs.src + '/frontend/**/*.js'
        //plugins.mainBowerFiles()
      ])
      //gulp.src(plugins.mainBowerFiles().concat(jsFiles))
      //.pipe(plugins.filter('*.js', '*.jsx'))
     .pipe(plugins.sourcemaps.init())
     .pipe(plugins.stream(webpackConfig))
     .pipe(plugins.jscs())
     .pipe(plugins.jshint())
     .pipe(plugins.jshint.reporter('jshint-stylish'))
     .pipe(plugins.jshint.reporter('fail'))
     //.pipe(concat('main.js'))
     //.pipe(gulp.dest('dist/assets/js'))
     //.pipe(rename({suffix: '.min'}))
     .pipe(plugins.uglify())
     .pipe(plugins.sourcemaps.write())
     .pipe(gulp.dest(config.dirs.build + '/static/js'))
     .pipe(plugins.notify({ message: 'Scripts task complete' }));
  });

  // gulp.task('js-doc', shell.task(['./node_modules/jsdoc/jsdoc .']));

  /*
  gulp.task('fix-template', ['minify'], function() {
    return gulp.src('public/layout.src.tpl')
      .pipe(rimraf())
      .pipe(rename("layout.tpl"))
      .pipe(gulp.dest('src/templates'));
  });
  */

  // Add Headers
  gulp.task('add-headers', function() {
    /*
    gulp.src('src/templates/layout.tpl')
      .pipe(plugins.header("<!-- This file is generated — do not edit by hand! -->\n"))
      .pipe(gulp.dest('src/templates'));
    */
    gulp.src(config.dirs.dist + 'static/js/main.min.js')
      .pipe(plugins.header("/* This file is generated — do not edit by hand! */\n"))
      .pipe(gulp.dest(config.dirs.dist + 'static/js'));

    gulp.src(config.dirs.dist + 'static/css/main.css')
      .pipe(plugins.header("/* This file is generated — do not edit by hand! */\n"))
      .pipe(gulp.dest(config.dirs.dist + 'static/css'));
  });


  // Copy Files
  gulp.task('copy', [
    'copy:index.html',
    'copy:license',
    'copy:settings',
    'copy:misc'
    //'copy:.htaccess',
    //'copy:main.sass',
    //'copy:jquery',
  ]);

  gulp.task('copy:index.html', function () {
    return gulp.src(config.dirs.src + '/templates/index.html')
      .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
      .pipe(gulp.dest(config.dirs.dist));
  });

  gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
        .pipe(gulp.dest(config.dirs.dist));
  });

  gulp.task('copy:settings', function () {
    return gulp.src([config.dirs.src + '/settings/*'])
      .pipe(gulp.dest(config.dirs.dist));
  });

  /*
  gulp.task('copy:.htaccess', function () {
    return gulp.src('/lib/node_modules/apache-server-configs/dist/.htaccess')
       .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
       .pipe(gulp.dest(config.dirs.dist));
  });

  gulp.task('copy:jquery', function () {
    return gulp.src(['/lib/node_modules/jquery/dist/jquery.min.js'])
     .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
     .pipe(gulp.dest(config.dirs.dist + '/assets/js/vendor'));
  });
  */

  gulp.task('copy:misc', function () {
    return gulp.src([
      // Copy all files
      config.dirs.src + 'backend/**/*',
      config.dirs.src + 'templates/**/*',

      // Exclude the following files
      // (other tasks will handle the copying of these files)
      '!' + config.dirs.src + '/templates/index.html'
    ], {
      // Include hidden files by default
      dot: true
    }).pipe(gulp.dest(config.dirs.dist));
  });

}
