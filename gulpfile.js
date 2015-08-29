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
		message: "Error: <%= error.message %>"
	})
};

// paths
var paths = {
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
		'bower_components/scrollreveal/dist/scrollReveal.js'
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
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.assets + 'js/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(paths.assets + 'js/'));
});

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
    del([
    	paths.assets + 'css',
    	paths.assets + 'js',
    	paths.assets + 'fonts'
    ], cb)
});

// copy fonts
gulp.task('copyFonts', function() {
	return gulp.src('bower_components/font-awesome/fonts/*')
		.pipe(plumber(plumberErrorHandler))
		.pipe(gulp.dest(paths.assets + 'fonts/'));
});

// watch
gulp.task('watch', function() {
	gulp.watch(paths.styles + '**/*.scss', ['styles']);
	gulp.watch(paths.stylesIncludes + '**/*.scss', ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.scriptsPlugins, ['scriptsPlugins']);
});

// default
gulp.task('default', ['clean'], function(){
	gulp.start('styles', 'scripts', 'scriptsPlugins', 'copyFonts', 'watch');
});
