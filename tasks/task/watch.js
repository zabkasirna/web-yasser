/** ------------------------------------------------------------------------- *\
 * Watch
 ** ------------------------------------------------------------------------- */

var gulp        = require('gulp')
;

gulp.task('watch', ['env'], function() {
    var c = global.configs || {};

    gulp.watch(c.indir + c.assetdir + '**/*.{png,jpg,gif}',    ['assets']);
    gulp.watch(c.indir + c.styledir + '**/*.scss',             ['styles:quick']);
    gulp.watch(c.indir + c.scriptdir + '**/*.js',              ['scripts']);
    gulp.watch(c.indir + '*.html',                             ['views']);
});
