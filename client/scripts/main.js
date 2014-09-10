/** ------------------------------------------------------------------------- *\
 * Main script.
 * client/main.js
 ** ------------------------------------------------------------------------- */

'use strict';

;( function( $ ) {
    var uiBackground = require('./module/ui-background')
    ,   uiNavigation = require('./module/ui-navigation')
    ,   uiHome       = require('./module/ui-home')
    ;

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);
