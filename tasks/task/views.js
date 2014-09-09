/** ------------------------------------------------------------------------- *\
 * Views
 ** ------------------------------------------------------------------------- */


var gulp = require('gulp')
// ,   livereload = require('gulp-livereload')
,   browserSync = require('browser-sync')
,   reload = browserSync.reload()
;

gulp.task('views', ['env'], function() {
    var c = global.configs || {};

    return gulp.src(c.indir + '*.html')
        .pipe(gulp.dest(c.outdir))
    ;
});
