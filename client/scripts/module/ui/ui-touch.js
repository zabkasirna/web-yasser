module.exports = {
    init: function() {
        var $xxxTemplate =  '<div id="xxx">' +
                            '<div class="xxx-inner">' +
                            '<p>Currently,</p>' +
                            '<p>this site does not support mobile/touch devices.</p>' +
                            '<p>View on desktop computers for better experience.</p>' +
                            '</div>' +
                            '</div>'
        ;

        if (Modernizr.touch) $('body').append($xxxTemplate);
    }
};
