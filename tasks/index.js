var fs = require('fs')
,   onlyScripts = require('./util/script-filter')
,   tasks = fs.readdirSync('./tasks/task/').filter(onlyScripts)
;

tasks.forEach(function(task) {
    require('./task/' + task);
});
