/** ------------------------------------------------------------------------- *\
 * Browserify Logger
 ** ------------------------------------------------------------------------- */

var util = require('gulp-util')
,   prettyHrtime = require('pretty-hrtime')
,   startTime
;

module.exports = {
    start: function() {
        startTime = process.hrtime();
        util.log('Running', util.colors.green("'bundle'") + '...');
    },
    end: function() {
        var taskTime = process.hrtime(startTime)
        ,   time = prettyHrtime(taskTime)
        ;

        util.log('Finished', util.colors.green("'bundle'"), 'in', util.colors.magenta(time));
    }
};
