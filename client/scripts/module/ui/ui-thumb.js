module.exports = {
    element: $(),
    init: function(el) {
        this.element = el;
        var self = this
        ,   $thumbs = self.element.find('.thumb')
        ,   isSwap = false
        ;

        console.log('element:', $thumbs);

        $thumbs.each(function(i) {
            $(this).removeClass('is-swap');
            isSwap = Math.random() >= 0.5 ? isSwap : !isSwap;
            if (isSwap) $(this).addClass('is-swap');
        });
    }
};
