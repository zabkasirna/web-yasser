/** ------------------------------------------------------------------------- *\
 * Images & Favicon
 ** ------------------------------------------------------------------------- */


var gulp = require('gulp')
,   imagemin = require('gulp-imagemin')
,   changed    = require('gulp-changed')
,   gulpif = require('gulp-if')
,   errors = require('../util/error-handler')
;

gulp.task('assets', ['env'], function() {
    var c = global.configs || {};

    return gulp.src([c.indir + c.assetdir + "**/*{png,jpg,gif,svg,mp4,ogv,webm}"])
        .on('error', errors)
        .pipe(changed(c.outdir + c.assetdir))
        .pipe(gulp.dest(c.outdir + c.assetdir))
    ;
});

gulp.task('favicon', ['env'], function() {
    var c = global.configs || {};

    return gulp.src([c.indir + "favicon.ico"])
        .pipe(imagemin(c.indir))
        .pipe(gulp.dest(c.outdir))
    ;
});
