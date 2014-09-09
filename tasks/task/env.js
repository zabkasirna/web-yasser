var gulp = require('gulp')
,   util = require('gulp-util')
;

var configs = {
    appname   : 'yasserrizky',
    indir     : './client/',
    outdir    : './public/',
    builddir  : './build/',
    styledir  : 'styles/',
    scriptdir : 'scripts/',
    assetdir  : 'assets/',
    fontdir   : 'styles/fonts/',
    appdir    : 'app/',
    viewdir   : 'views/',
    url       : 'http://localhost',
    port      : ':8080',
    isDev     : false
};

/** ------------------------------------------------------------------------- *\
 * Environment
 ** ------------------------------------------------------------------------- */

gulp.task('env', function(done) {
    global.configs = configs;

    if (util.env.dev) {
        global.configs.isDev = util.env.dev;
        util.log("START WORKING ON " + util.colors.green("DEV") + " ENVIRONMENT");
    } else {
        util.log("START WORKING ON " + util.colors.red("PROD") + " ENVIRONMENT");
    }

    return done();
});
