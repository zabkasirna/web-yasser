/** ------------------------------------------------------------------------- *\
 * SCRIPTS
 ** ------------------------------------------------------------------------- */

var browserify    = require('browserify')
,   errors        = require('../util/error-handler')
,   logger        = require('../util/bundle-logger')
,   gulp          = require('gulp')
,   gulpif        = require('gulp-if')
// ,   livereload = require('gulp-livereload')
,   source        = require('vinyl-source-stream')
,   streamify     = require('gulp-streamify')
,   stringify     = require('stringify')
,   uglify        = require('gulp-uglify')
,   size          = require('gulp-size')
,   browserSync   = require('browser-sync')
,   reload        = browserSync.reload()
;

// gulp.task('scripts', ['env', 'templates', 'lint'], function() {
gulp.task('scripts', ['env', 'lint'], function() {
    var c = global.configs || {};

    var browserifyOptions = {
            entries    : [ c.indir + "scripts/main" ],
            extensions : [ ".js" ],
            debug      : true
        };

    var uglifyOptions = {
            mangle: false,
            compress: {
                pure_funcs: [ 'console.log' ]
            }
        };

    var bundleStream = browserify(browserifyOptions);

    var bundle = function() {
        logger.start();

        return bundleStream
            .bundle()
            .on('error', errors)
            .pipe(source('main.js'))
            .pipe(gulpif(!c.isDev, streamify(uglify(uglifyOptions))))
            .pipe(gulp.dest(c.outdir + "scripts/"))
            .on('update', bundle)
            .on('end', logger.end)
        ;
    };

    return bundle();
});
