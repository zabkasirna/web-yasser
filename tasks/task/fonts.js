/** ------------------------------------------------------------------------- *\
 * Fonts
 ** ------------------------------------------------------------------------- */

var gulp       = require('gulp')
,   errors     = require('../util/error-handler')
,   changed    = require('gulp-changed')
,   gulpif     = require('gulp-if')
;

gulp.task('fonts', ['env'], function() {
    var c = global.configs || {};

    return gulp.src(c.indir + c.fontdir + '**/*.{ttf,woff,eot,svg}')
        .on('error', errors)
        .pipe(changed(c.outdir + c.fontdir))
        .pipe(gulp.dest(c.outdir + c.fontdir))
    ;
});
