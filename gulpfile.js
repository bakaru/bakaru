const gulp = require('gulp');
const unzip = require('gulp-unzip');
const download = require('gulp-download');

const libmpvLink = 'https://github.com/bakaru/bakaru-thirdparty/releases/download/reference/vendor.zip';

const dest = gulp.dest('./vendor/');

gulp.task(
  'vendor-win',
  () => download(libmpvLink).pipe(unzip()).pipe(dest)
);

gulp.task('default', ['vendor-win']);
