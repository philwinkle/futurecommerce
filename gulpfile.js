var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: "./src"
  });

  gulp.watch("src/scss/*.scss", ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('src/scss/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      failAfterError: false,
    }));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', ['lint-css'], function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ 
      autoprefixer({ browsers: ['last 2 versions'] }),
      csswring(),
      require('postcss-browser-reporter'),
    ]))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task('build', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }), csswring() ]))
    .pipe(gulp.dest("src/css"))
});

gulp.task('default', ['serve']);
