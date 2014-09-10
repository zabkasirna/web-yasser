/** ------------------------------------------------------------------------- *\
 * Styles
 ** ------------------------------------------------------------------------- */


var gulp          = require('gulp')
,   sass          = require('gulp-sass')
,   autoprefixer  = require('gulp-autoprefixer')
,   size          = require('gulp-size')
,   errors        = require('../util/error-handler')
,   gulpif        = require('gulp-if')
// ,   livereload = require('gulp-livereload')
// ,   sourcemaps = require('gulp-sourcemaps')
,   replace       = require('gulp-replace')
,   rename        = require('gulp-rename')
// ,   es         = require('event-stream')
,   util          = require('gulp-util')
,   sequence      = require('run-sequence')
,   browserSync   = require('browser-sync')
,   reload        = browserSync.reload()
;

gulp.task('styles:ie', ['env'], function() {
    var c = global.configs || {};

    var sassOptions = {};

    return gulp.src(c.indir + c.styledir + "main.scss")
        .pipe(replace(/\$old\:\s*false;/g, function(str) {
            return str.replace(/false/, "true");
        }))
        .pipe(sass(sassOptions))
        .on('error', errors)
        .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
        .pipe(rename("main.ie.css"))
        .pipe(gulp.dest(c.outdir + c.styledir))
        .pipe(size({ title: c.outdir + c.styledir + 'main.ie.css' }))
    ;
});

gulp.task('styles:modern', ['env'], function() {
    var c = global.configs || {};

    var sassOptions = {};

    return gulp.src(c.indir + c.styledir + "main.scss")
        .pipe(sass(sassOptions))
        .on('error', errors)
        .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
        .pipe(gulp.dest(c.outdir + c.styledir))
        .pipe(size({ title: c.outdir + c.styledir + 'main.css' }))
    ;
});

gulp.task('styles', function(done) {
    sequence(
        ['fonts'],
        ['styles:modern', 'styles:old'],
        done
    );
});

gulp.task('styles:quick', function(done) {
    sequence(
        ['fonts'],
        ['styles:modern'],
        done
    );
});
