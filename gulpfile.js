/** ------------------------------------------------------------------------- *\
 * START HERE!
 ** ------------------------------------------------------------------------- */


var gulp     = require('gulp')
,   sequence = require('run-sequence')
,   tasks    = require('./tasks')
,   util     = require('gulp-util')
;

gulp.task('default', function(done) {
    sequence(
        ['env', 'assets', 'styles:quick', 'scripts', 'views'],
        ['watch'],
        done
    );
});
