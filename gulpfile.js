const gulp = require('gulp');
const unzip = require('gulp-unzip');
const download = require('gulp-download');

const vendorsLink = 'https://github.com/bakaru/bakaru-thirdparty/releases/download/reference/win.zip';

gulp.task(
  'init-vendors',
  () => download(vendorsLink).pipe(unzip()).pipe(gulp.dest('./vendor/'))
);

gulp.task('default', ['init-vendors']);
