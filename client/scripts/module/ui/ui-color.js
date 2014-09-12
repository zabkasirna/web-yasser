module.exports = {
    init: function() {
        BackgroundCheck.init({
            targets: '.recolor'
        });
        console.log(BackgroundCheck.get('targets'));
    }
};
