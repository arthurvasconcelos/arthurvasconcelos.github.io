'use strict';

// Gulp
var gulp = require('gulp');
var path = require('path');
var debug = require('gulp-debug');
var pkg = require('./package.json');

// CSS
var sass =  require('gulp-ruby-sass');
var minifyCSS = require('gulp-minify-css');

// JS
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// HTML
var htmlmin = require('gulp-htmlmin');

// Browser Sync
var browserSync = require('browser-sync');

// Image
var imagemin = require('gulp-imagemin');

// Utils
var utils = require('gulp-util');
var options = require('minimist')(process.argv.slice(2));
var addsrc = require('gulp-add-src');
var spawn = require('child_process').spawn;

// PATHS
var root = './'
/*========================================*/
var dist = '_dist/';
var distAssets = dist + 'assets/';
var distStylesheets = distAssets + 'css/';
var distJavascripts = distAssets + 'js/';
var distImages = distAssets + 'images/';
var distFonts = distAssets + 'fonts/';
/*========================================*/
var src = '_source/';
var srcAssets = src + '_assets/';
var srcStylesheets = srcAssets + 'scss/';
var srcJavascripts = srcAssets + 'js/';
var srcImages = srcAssets + 'images/';
// var srcFonts = srcAssets + 'fonts/';
var srcIncludes = src + '_includes/';
var srcLayouts = src + '_layouts/';
var srcPosts = src + '_posts/';
/*========================================*/
var bowerDir = root + 'bower_components/';

// -->
// Browser Sync
// <--
gulp.task('browser-sync', function() {
  return browserSync.init(null, {
    server: {
      baseDir: "./" + dist
    }
  });
});
// Reload all Browsers
gulp.task('bs-reload', function () {
  return browserSync.reload();
});

// -->
// HTML
// <--
gulp.task('html', ['jekyll'], function() {
  // --> Minhtml
  return gulp.src([
    path.join(dist, '*.html'),
    path.join(dist, '*/*/*.html'),
    path.join(dist, '*/*/*/*.html')
  ])
  .pipe(options.production ? htmlmin({collapseWhitespace: true}) : utils.noop())
  .pipe(gulp.dest(dist))
  .pipe( options.production ? utils.noop() : browserSync.reload({stream:true, once: true}) );
});

// -->
// Compass & SASS
// <--
gulp.task('compass', function() {
  return sass(srcStylesheets + '*.scss', {
    style: 'compressed',
    loadPath: [
      bowerDir + 'font-awesome/scss',
      bowerDir + 'bourbon/app/assets/stylesheets',
      bowerDir + 'neat/app/assets/stylesheets'
    ]
  })
  .on('error', sass.logError)
  .pipe(debug())
  .pipe(options.production ? minifyCSS({keepBreaks: false, keepSpecialComments:true}) : utils.noop())
  .pipe(concat('main.css'))
  .pipe(gulp.dest(distStylesheets));
});

// -->
// Concatenate & JS build
// <--
// gulp.task('js-modernizr',function(){
//   return gulp.src([bowerDir + 'modernizr/dist/modernizr-build.js'])
//     .pipe(concat('modernizr.js'))
//     .pipe(gulp.dest(distJavascripts))
//     .pipe(rename('modernizr.min.js'))
//     .pipe(options.production ? uglify() : utils.noop())
//     .pipe(gulp.dest(distJavascripts));
// });

// gulp.task('js',['js-modernizr'],function () {
gulp.task('js',function () {
  return gulp.src(srcJavascripts + '**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distJavascripts))
    .pipe(rename('main.min.js'))
    .pipe(options.production ? uglify() : utils.noop())
    .pipe(gulp.dest(distJavascripts));
});

// -->
// Icons task
// <--
gulp.task('icons', function() {
  return gulp.src(bowerDir + 'font-awesome/fonts/**.*')
    .pipe(gulp.dest(distFonts));
});

// -->
// Images task
// <--
gulp.task('images', function() {
  return gulp.src(srcImages + '**')
    .pipe(options.production ? imagemin({
      progressive: true,
      optimizationLevel : 3
    }) : utils.noop())
    .pipe(gulp.dest(distImages));
});

// -->
// JEKYLL task
// <--
gulp.task('jekyll', function (gulpCallBack){
  var jekyll = spawn("jekyll", ['build'], {stdio: 'inherit'});

  jekyll.on('exit', function(code) {
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    gulp.start('generateAssets');
  });
});

gulp.task('generateAssets',['compass', 'js', 'icons', 'images'], function() { gulp.start('bs-reload'); });
gulp.task('generateSCSS',['compass'], function() { gulp.start('bs-reload'); });
gulp.task('generateJS',['js'], function() { gulp.start('bs-reload'); });

// -->
// Watch task
// <--
gulp.task('watch', function() {
  // --> CSS
  gulp.watch(srcStylesheets + "**", ['generateSCSS']);

  // --> JS
  gulp.watch([srcJavascripts + "**/*.js"], ['generateJS']);

  // --> Ruby
  gulp.watch(path.join(dist, '*/*.rb'), ['html']);

  // --> HTML/MD
  gulp.watch([
    srcIncludes + '*.html',
    srcLayouts + '*.html',
    srcPosts + '**',
    src + '*.{md,html}'
  ], ['html']);
});

// -->
// Default task
// <--
gulp.task('default', ['html'], function (event) {
  gulp.start('generateAssets', 'watch', 'browser-sync');
});
