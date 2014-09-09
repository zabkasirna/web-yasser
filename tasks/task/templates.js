/** ------------------------------------------------------------------------- *\
 * Templates
 ** ------------------------------------------------------------------------- */

var gulp          = require('gulp')
,   errors        = require('../util/error-handler')
,   jade          = require('gulp-jade')
// ,   livereload    = require('gulp-livereload')
,   templateCache = require('gulp-angular-templatecache')
,   util          = require('gulp-util')
,   browserSync = require('browser-sync')
,   reload = browserSync.reload()
,   gulpif = require('gulp-if')
;

gulp.task('templates', ['env'], function() {
    var c = global.configs || {};

    return gulp.src(c.indir + c.scriptdir + 'modules/**/*.html')
        .on('error', errors)
        .pipe(templateCache({
            module: 'templates',
            standalone: true
        }))
        .pipe(gulp.dest(c.builddir))
        // .pipe(gulpif(c.isDev, reload))
        ;
});
