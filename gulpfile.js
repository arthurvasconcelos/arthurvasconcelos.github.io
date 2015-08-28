// load plugins
var gulp            = require('gulp');
var less            = require('gulp-less');
var autoPrefixer    = require('gulp-autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var concat          = require('gulp-concat');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
var path            = require('path');

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
	styles: 'builder_files/less/**/*.less',
	stylesIncludes: [
		path.join(__dirname, 'less', 'includes')
	],
	scripts: 'builder_files/js/**/*.js',
	scriptsPlugins: [
		'bower_components/jquery/dist/jquery.js',
		'bower_components/scrollreveal/dist/scrollReveal.js'
	]
};

// styles
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(plumber(plumberErrorHandler))
		.pipe(less({
	      paths: paths.stylesIncludes
	    }))
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

// watch
gulp.task('watch', function() {
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.stylesIncludes, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.scriptsPlugins, ['scriptsPlugins']);
});

// default
gulp.task('default', ['styles', 'scripts', 'scriptsPlugins', 'watch']);
