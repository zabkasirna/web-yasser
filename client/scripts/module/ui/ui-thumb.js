module.exports = {
    element: $(),
    init: function(el) {
        this.element = el;
        var self         = this
        ,   $thumbGroups = self.element.find('.thumb-groups')
        // ,   $thumbGroup  = self.element.find('.thumb-group')
        // ,   $thumbGroupN = $thumbGroup.length
        ,   $thumbs      = self.element.find('.thumb')
        // ,   $selectors   = $('.page-selector-link')
        ,   isSwap       = false
        ;

        $thumbs.each(function(i) {
            $(this).removeClass('is-swap');
            isSwap = Math.random() >= 0.5 ? isSwap : !isSwap;
            if (isSwap) $(this).addClass('is-swap');
        });

        var $thumbN = $thumbs.length
        ,   $thumbGroupsLimit = 6
        ,   $thumbGroupN = ($thumbN - ($thumbN % $thumbGroupsLimit)) / $thumbGroupsLimit;
        ;

        console.log('thumbGroupN:', $thumbGroupN);
    }
};
