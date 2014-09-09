/** ------------------------------------------------------------------------- *\
 * START HERE!
 ** ------------------------------------------------------------------------- */


var gulp     = require('gulp')
,   sequence = require('run-sequence')
,   tasks    = require('./tasks')
,   util     = require('gulp-util')
;

// gulp.task('default', function(done) {
//     sequence(
//         ['env', 'images', 'favicon', 'styles', 'scripts'],
//         ['watch'],
//         done
//     );
// });

gulp.task('default', function(done) {
    sequence(
        ['env', 'assets', 'styles', 'scripts'],
        ['views'],
        ['watch'],
        done
    );
});

gulp.task('styleguide', function(done) {
    sequence(
        ['env', 'styles:quick'],
        ['watch:styleguide'],
        done
    );
});
