/** ------------------------------------------------------------------------- *\
 * Main script.
 * client/main.js
 ** ------------------------------------------------------------------------- */

'use strict';

;( function( $ ) {
    var debounce = require('./module/helper/debounce');

    var uiAsset      = require('./module/ui/ui-asset')
    ,   uiColor      = require('./module/ui/ui-color')
    ,   uiNavigation = require('./module/ui/ui-navigation')
    ,   uiHome       = require('./module/ui/ui-home')
    ,   uiThumb      = require('./module/ui/ui-thumb')
    ,   uiRelated    = require('./module/ui/ui-related')
    ,   uiTouch      = require('./module/ui/ui-touch')
    ;

    // Dynamic color
    setTimeout(function() { uiColor.init(); }, 100);

    // Background
    if ($('.background').length) uiAsset.init($('.background'));
    $(window).on('resize', function() { uiAsset.rescaleImage(); });

    // Main navigation
    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    // Page navigation
    if ($('.page-navigations').length)
        uiNavigation.initPageNavigation($('page-navigations.has-infos').length);

    // Home
    uiHome.init($('#home-heros'));

    // Thumbnails
    if ($('.thumbs').length) uiThumb.init($('.thumbs'));

    // Relates
    if ($('.relateds').length) uiRelated.init($('.relateds'));

    // Shame
    // Move to it's own module
    $('body').on('click', '.viewer-close', function(e) {
        e.preventDefault();
        $('#viewers').remove();
    });

    var createViewer = function() {
        var $backgroundEl = $('.background')
        ,   imgSrc = $backgroundEl.attr('src')
        ,   viewersTemplate =
                '<div id="viewers" class="pre">'
                    +'<div class="viewer-preloader"><p>loading image...</p></div>'
                    +'<div class="cropit-image-preview"></div>'
                    +'<input type="range" class="cropit-image-zoom-input">'
                    +'<input type="file" class="cropit-image-input">'
                    +'<a href="#" class="viewer-close">x</a>'
                +'</div>'
        ;

        function removePre() {
            setTimeout(function() {
                $('#viewers').removeClass('pre');
            }, 1000);
        }

        if ($('a[data-tool="image"')) {
            $('body').append(viewersTemplate);

            if($('#viewers').length) {
                $('#viewers').cropit({
                    imageState: { src: imgSrc },
                    onImageLoaded: removePre
                });
            }
        }
    };

    $('.page-tool-btn[data-tool="image"]')
        .on('click', function(e) { createViewer(); });

    // Shame
    var isOpen = false;
    function updateInfoCredit() {
        isOpen = !isOpen;
        if (!isOpen)  $('.contact-credits').removeClass('is-open');
        else $('.contact-credits').addClass('is-open');
    }

    $('.contact-credit-toggler').on('click', function(e) {
        e.preventDefault();
        updateInfoCredit();
    });

    uiTouch.init();

})(jQuery);
