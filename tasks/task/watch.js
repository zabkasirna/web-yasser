/** ------------------------------------------------------------------------- *\
 * Watch
 ** ------------------------------------------------------------------------- */

var gulp        = require('gulp')
;

gulp.task('watch', ['env'], function() {
    var c = global.configs || {};

    gulp.watch(c.indir + c.imagedir + '**/*.{png,jpg,gif}',    ['images']);
    gulp.watch(c.indir + c.styledir + '**/*.scss',             ['styles']);
    gulp.watch(c.indir + c.scriptdir + '**/*.{js}',            ['scripts']);
    gulp.watch(c.indir + '*.html',                             ['views']);
});

gulp.task('watch:styleguide', ['env'], function() {
    var c = global.configs || {};

    gulp.watch(c.indir + c.styledir + '**/*.scss',             ['styles:quick']);
});
