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

    uiBackground.init($('#background'));

    console.log('background element:', uiBackground.element[0].nodeName);
    console.log('background element:', uiBackground.element.length);

    $(window).on('resize', function() {
        if (uiBackground.element.length && uiBackground.element[0].nodeName === "VIDEO") {
            debounce(uiBackground.rescaleVideo(), 250, true);
        }
        else if (uiBackground.element.length && uiBackground.element[0].nodeName === "IMG") {
            debounce(uiBackground.rescaleImage(), 250, true);
        }
    });

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);
