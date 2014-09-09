/** ------------------------------------------------------------------------- *\
 * JS LINT
 ** ------------------------------------------------------------------------- */


var gulp = require('gulp')
,   jshint = require('gulp-jshint')
,   stylish = require('jshint-stylish')
;

gulp.task('lint', ['env'], function() {
    var c = global.configs || {};

    return gulp.src([ c.indir + c.scriptdir + '**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
    ;
});
