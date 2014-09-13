/** ------------------------------------------------------------------------- *\
 * Main script.
 * client/main.js
 ** ------------------------------------------------------------------------- */

'use strict';

;( function( $ ) {
    var debounce = require('./module/helper/debounce');

    var uiBackground = require('./module/ui/ui-background')
    ,   uiColor      = require('./module/ui/ui-color')
    ,   uiNavigation = require('./module/ui/ui-navigation')
    ,   uiHome       = require('./module/ui/ui-home')
    ;

    setTimeout(function() {
        console.log('colorized');
        uiColor.init();
    }, 100);

    uiBackground.init($('.background'));

    $(window).on('resize', function() {
        if (uiBackground.element.length) {
            if (uiBackground.element[0].nodeName === "VIDEO") {
                debounce(uiBackground.rescaleVideo(), 250, true);
            }
            else if (uiBackground.element[0].nodeName === "IMG") {
                debounce(uiBackground.rescaleImage(), 250, true);
            }
        }
    });

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);
