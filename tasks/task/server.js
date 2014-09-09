/** ------------------------------------------------------------------------- *\
 * Server
 ** ------------------------------------------------------------------------- */

var gulp    = require('gulp')
,   nodemon = require('gulp-nodemon')
;

gulp.task('server', ['env'], function() {
    var c = global.configs || {};

    return nodemon({
        script : 'server/server.js',
        ext    : 'js html',
        env    : {
            'NODE_ENV' : c.isDev ? 'development' : 'production'
        }
    })
    .on('start', [])
    .on('change', [])
    .on('restart', function() {
        console.log('Restarted!');
    })
    ;
});
