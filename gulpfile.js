// load plugins
var gulp            = require('gulp');
var sass            = require('gulp-ruby-sass');
var autoPrefixer    = require('gulp-autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var concat          = require('gulp-concat');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
var path            = require('path');
var del             = require('del');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var harp            = require('harp');
var cp              = require('child_process');

// the title and icon that will be used for the Gulp notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

// error notification settings for plumber
var plumberErrorHandler = {
	errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: 'Error: <%= error.message %>'
	})
};

// paths
var paths = {
  builderFiles: 'builder_files/',
	public: 'public/',
	assets: 'public/assets/',
	styles: 'builder_files/sass/',
	stylesIncludes: [
		'bower_components/bourbon/app/assets/stylesheets/',
		'bower_components/neat/app/assets/stylesheets/',
		'bower_components/normalize-scss/',
		'bower_components/font-awesome/scss/'
	],
	scripts: 'builder_files/js/**/*.js',
	scriptsPlugins: [
		'bower_components/jquery/dist/jquery.js',
		'bower_components/scrollreveal/dist/scrollreveal.js',
    'bower_components/velocity/velocity.js'
	]
};

// styles
gulp.task('styles', function() {
	return sass(paths.styles + 'main.scss', {
			style: 'expanded',
			loadPath: paths.stylesIncludes
		})
		.pipe(plumber(plumberErrorHandler))
		.pipe(autoPrefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(paths.assets + 'css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifyCSS())
		.pipe(gulp.dest(paths.assets + 'css'));
});

// scripts
// gulp.task('scripts', function() {
// 	return gulp.src(paths.scripts)
// 		.pipe(plumber(plumberErrorHandler))
// 		.pipe(concat('main.js'))
// 		.pipe(gulp.dest(paths.assets + 'js/'))
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(paths.assets + 'js/'));
// });

// scripts plugins
gulp.task('scriptsPlugins', function() {
	return gulp.src(paths.scriptsPlugins)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest(paths.assets + 'js/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(paths.assets + 'js/'));
});

// clean
gulp.task('clean', function(cb) {
  return  del([
    	paths.assets + 'css',
    	// paths.assets + 'js',
    	paths.assets + 'fonts'
    ], cb);
});

// copy fonts
gulp.task('copyFonts', function() {
	return gulp.src('bower_components/font-awesome/fonts/*')
		.pipe(plumber(plumberErrorHandler))
		.pipe(gulp.dest(paths.assets + 'fonts/'));
});

// copy images
gulp.task('copyImages', function() {
  return gulp.src('builder_files/images/**/*')
    .pipe(plumber(plumberErrorHandler))
    .pipe(gulp.dest(paths.assets + 'images/'));
});

// preset
gulp.task('preset', ['clean'], function(){
  // gulp.start('styles', 'scripts', 'scriptsPlugins', 'copyFonts', 'copyImages');
  gulp.start('styles', 'scriptsPlugins', 'copyFonts', 'copyImages');
});

// serve
gulp.task('serve', ['preset'], function(){
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: 'localhost:9000',
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });

    gulp.watch([paths.styles + '**/*.scss', paths.stylesIncludes + '**/*.scss'], function(){
      gulp.start('styles', function(){
        reload('main.css', {stream: true});
      });
    });

    gulp.watch('./public/assets/js/main.{js, map}', function(){
        reload('main.js', {stream: true});
    });

    gulp.watch(paths.builderFiles + 'images', function(){
      gulp.start('copyImages', function(){
        reload();
      });
    });

    gulp.watch([
      paths.public + '**/*.ejs',
      paths.public + '**/*.jade',
      paths.public + '**/*.json',
      paths.public + '**/*.html',
      paths.public + '**/*.md'
    ], function () {
      reload();
    });
  });
});

// default
gulp.task('default', ['serve']);
