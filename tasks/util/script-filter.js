var path = require('path');

// Filters out non .js and .coffee files
module.exports = function(name) {
    return /(\.(js|coffee)$)/i.test(path.extname(name));
};
