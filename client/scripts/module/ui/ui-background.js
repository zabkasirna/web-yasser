module.exports = {
    element: $(),
    init: function(el) {
        this.element = el || this.element;

        if (el[0].nodeName === "VIDEO") this.rescaleVideo();
        else if (el[0].nodeName === "IMG") this.rescaleImage();
    },
    rescaleVideo: function() {
        if (!this.element.length || this.element[0].nodeName !== "VIDEO") return;

        console.log('rescale:', this.element);

        var videoRatio = 16 / 9
        ,   viewportRatio = $(window).width() / $(window).height()
        ,   pushLeft = 0
        ;

        if (viewportRatio < videoRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( videoRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass('full-height').addClass('full-width');
    },
    rescaleImage: function() {
        if (!this.element.length || this.element[0].nodeName !== "IMG") return;

        var imageRatio = this.element.width() / this.element.height()
        ,   viewportRatio = $(window).width() / $(window).height()
        ;

        console.log('imageRatio:', imageRatio, 'viewportRatio:', viewportRatio);

        if (viewportRatio < imageRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( imageRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass('full-height').addClass('full-width');
    }
};
