var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');

var onError = function (err) {
	console.error('Error in plugin ' + err.plugin + "\n" +
		"Message: " + err.message);
};

var paths = {
	scripts: ['dist/js/*.js'],
	sass: ['dist/scss/*.scss'],
	templates: ['dist/templates/*.hbs']
};


// Compile Sass
gulp.task('sass', function() {
	gulp.src(paths.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass({
			includePaths: ['scss', 'www/js/vendor/foundation/scss'],
			outputStyle: 'compressed'
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('www/css'))
	;
});


// Uglify js
gulp.task('js', function() {
	gulp.src(paths.scripts, {base: 'dist/js'})
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(uglify({
			outSourceMap: false
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('www/js'))
	;

	gulp.src(['www/js/vendor/requirejs/require.js'], { base: process.cwd() })
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(uglify({
			outSourceMap: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('.'))
	;
});

// Compile templates
gulp.task('templates', function(){
 	gulp.src(paths.templates)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(handlebars())
		.pipe(plumber.stop())
		.pipe(defineModule('amd'))
		.pipe(uglify({
			outSourceMap: false
		}))
		.pipe(gulp.dest('www/js/templates/'));
});

// Watch
gulp.task('watch', ['sass', 'js', 'templates'], function(event) {
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.scripts, ['js']);
	gulp.watch(paths.templates, ['templates']);
});

// Run
gulp.task('default', ['watch']);
