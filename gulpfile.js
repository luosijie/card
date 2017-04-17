var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('default', function(){
	gulp.src('public/stylesheets/all.css')
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'Android >= 4.0'],
			cascade: true,
			remove: true
		}))
		.pipe(gulp.dest('dist/css'));
});
gulp.task('cssMin', function(){
	gulp.src('public/stylesheets/all.css')
		.pipe(cssmin({
			advanced: false,
			compatibility: 'ie7',
			keeoBreak: true,
			keepSpecialComments: '*'
		}))
		.pipe(gulp.dest('dist/css'));
})

gulp.task('minjs', function(){
	gulp.src('public/javascripts/**/*.js')
		.pipe(babel({
			presets:['es2015']
		}))
		.pipe(uglify().on('error', function(e){
			console.log(e);
		}))
		.pipe(gulp.dest('dist/js'));
})