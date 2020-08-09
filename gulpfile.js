const gulp = require('gulp');
const sass = require('gulp-sass');
const bowserSync = require('browser-sync').create();
const prefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const gulpif = require('gulp-if');
const useref = require('gulp-useref');
const imgmin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

gulp.task('sass', function () {
  return gulp
    .src('src/sass/main.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(prefixer())
    .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', gulp.series('sass', 'reload'));
  gulp.watch('src/**/*.{html,css,js}', gulp.series('reload'));
});

gulp.task('serve', function () {
  bowserSync.init({
    server: './src',
    port: '4000',
    watchOptions: {
      awaitWriteFinish: true,
    },
  });
});

gulp.task('reload', function (done) {
  bowserSync.reload();
  done();
});

gulp.task('default', gulp.parallel('serve', 'sass', 'watch'));

gulp.task('asset-minify', function () {
  return gulp
    .src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.css', csso()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('imgSquash', function () {
  return gulp.src('src/images/*').pipe(imgmin()).pipe(gulp.dest('dist/images'));
});

gulp.task('cpyFonts', function () {
  return gulp.src('src/fonts/*').pipe(gulp.dest('dist'));
});

gulp.task(
  'build',
  gulp.series('sass', 'asset-minify', 'imgSquash', 'cpyFonts')
);
