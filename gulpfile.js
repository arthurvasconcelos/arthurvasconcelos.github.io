// load plugins
var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var concat     = require('gulp-concat');
var notify     = require('gulp-notify');
var plumber    = require('gulp-plumber');
var path       = require('path');

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
	scripts: 'builder_files/js/**/*.js',
	scriptsPlugins: [
		'bower_components/jquery/dist/jquery.js',
		'bower_components/scrollreveal/dist/scrollReveal.js'
	]
};

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
	//watch .js files
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.scriptsPlugins, ['scriptsPlugins']);
});

// default
gulp.task('default', ['scripts', 'scriptsPlugins', 'watch']);
