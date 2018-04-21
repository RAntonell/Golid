const gulp             = require('gulp'),
      browserSync      = require('browser-sync').create(),
      pug              = require('gulp-pug'),
      sass             = require('gulp-sass'),
      bourbon          = require("bourbon").includePaths,
      neat             = require("bourbon-neat").includePaths,
      sourcemaps       = require("gulp-sourcemaps"),
      autoprefixer     = require('gulp-autoprefixer'),
      babel            = require('gulp-babel'),
      newer            = require('gulp-newer'),
      imagemin         = require('gulp-imagemin'),
      concat           = require('gulp-concat'),
      stripdebug       = require('gulp-strip-debug'),
      uglify           = require('gulp-uglify'),
      gutil            = require('gulp-util'),
      merge            = require('merge2'),
      buffer           = require('gulp-buffer'),
      mmq              = require('gulp-merge-media-queries'),
      svgmin           = require('gulp-svgmin'),
      // development mode?
      isProd           = gutil.env.type === 'prod',
      // folders
      folder           = {
        src: './src/',
        dist: './dist/'
      };

// image processing
gulp.task('images', function() {
  var out = folder.dist + 'img/';
  gulp.src(folder.src + 'img/*')
    .pipe(newer(out))
    .pipe(imagemin())
    .pipe(gulp.dest(out));
});

//optimize the svg in the same folder
gulp.task('svg', function () {
  return gulp.src(folder.src + 'img/svg/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest(folder.src + 'img/svg'));
});

// JavaScript processing
gulp.task('js', function() {
  var jquery = gulp.src('node_modules/jquery/dist/jquery.js');
  var main = gulp.src(folder.src + 'js/*.js');
  main = main.pipe(babel({presets: ['env']}));
  return merge(jquery, main)
    .pipe(sourcemaps.init())
    .pipe(buffer())
    .pipe(concat('main.js'))
    .pipe(isProd ? stripdebug() : gutil.noop())
    .pipe(isProd ? uglify() : gutil.noop())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(!isProd ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest(folder.dist + 'js/'));
});

gulp.task('browser-sync', function() {
  if(!isProd) {
    browserSync.init({
      server: {
          baseDir: folder.dist
      },
      browser: "google chrome",
      notify: false,
      files: [folder.dist + '**/*']
    });
  }
});

//Pug
gulp.task('pug', function() {
  gulp.src(folder.src + '*.pug')
  .pipe(!isProd ? pug({pretty: true}) : gutil.noop())
  .pipe(isProd ? pug({pretty: false}) : gutil.noop())
  .pipe(gulp.dest(folder.dist));
});

//Sass
gulp.task('sass', function() {
  gulp.src(folder.src + 'styles/*.sass')
  .pipe(sourcemaps.init())
  .pipe(!isProd ? sass({
    outputStyle: 'expanded',
    includePaths: [bourbon, neat]
  }) : gutil.noop())
  .pipe(isProd ? sass({
    outputStyle: 'compressed',
    includePaths: [bourbon, neat]
  }) : gutil.noop())
  .pipe(autoprefixer({
    versions: ['last 2 browsers']
  }))
  .pipe(mmq({
      log: false
  }))
  .pipe(!isProd ? sourcemaps.write('./') : gutil.noop())
  .pipe(gulp.dest(folder.dist  + 'styles/'));
});

// Fonts
gulp.task('fonts', function() {
  gulp.src(folder.src + '/fonts/*')
  .pipe(gulp.dest(folder.dist + '/fonts/'));
});

//Default task
gulp.task('default',['images', 'svg', 'pug', 'sass', 'js', 'fonts', 'browser-sync'], function() {
  if(!isProd) {
    gulp.watch(folder.src  + '**/*.pug', ['pug']);
    gulp.watch(folder.src  + '**/*.sass', ['sass']);
    gulp.watch('src/img/**/*', ['images', 'svg']);
    gulp.watch(folder.src  + '**/*.js', ['js']);
    gulp.watch('src/fonts/**/*', ['fonts']);
  }
});
