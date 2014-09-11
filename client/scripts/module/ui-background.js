module.exports = {
    element: $(),
    init: function(el) {
        this.element = el || this.element;
        this.rescaleVideo();
    },
    rescaleVideo: function() {
        if (!this.element.length) return;

        var scale = 1
        ,   videoRatio = 16 / 9
        ,   viewportRatio = $(window).width() / $(window).height()
        ,   pushLeft = 0
        ;

        if (viewportRatio < videoRatio) {
            this.element.removeClass().addClass('full-height');
            pushLeft = ( videoRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
            console.log('pushLeft:', scale);
        }
        else this.element.removeClass().addClass('full-width');

        console.log(scale);
    }
};
