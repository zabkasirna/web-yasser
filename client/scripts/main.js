/** ------------------------------------------------------------------------- *\
 * Main script.
 * client/main.js
 ** ------------------------------------------------------------------------- */

'use strict';

;( function( $ ) {
    var debounce = require('./module/helper/debounce');

    var uiBackground = require('./module/ui-background')
    ,   uiNavigation = require('./module/ui-navigation')
    ,   uiHome       = require('./module/ui-home')
    ;

    uiBackground.init($('video#background'));

    $(window).on('resize', function() {
        if ($('video#background').length) {
            debounce(uiBackground.rescaleVideo(), 250, true);
        }
    });

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);
