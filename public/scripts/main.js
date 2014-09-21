(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

})(jQuery);

},{"./module/helper/debounce":2,"./module/ui/ui-asset":3,"./module/ui/ui-color":4,"./module/ui/ui-home":5,"./module/ui/ui-navigation":6,"./module/ui/ui-related":7,"./module/ui/ui-thumb":8}],2:[function(require,module,exports){
module.exports = function(fn, threshold, immediate) {
    var timeout;

    return function debounced() {
        var obj = this.debounce
        ,   args = arguments;

        function delayed () {
            if (!immediate) fn.apply(obj, args);
            timeout = null; 
        }
 
        if (timeout) clearTimeout(timeout);
        else if (immediate) fn.apply(obj, args);
 
        timeout = setTimeout(delayed, threshold || 100); 
    };
};

},{}],3:[function(require,module,exports){
module.exports = {
    element: $(),
    preloader: $('#preloaders'),
    naturalH: 0,
    naturalW: 0,
    imgLoaded: {},
    init: function(el) {
        var self = this
        ,   hasVideo    = el.data('video') ? true : false

        ,   $parallaxes = $('#parallaxes')
        ,   hasParallax = $parallaxes.length ? true : false
        ;

        self.imgLoaded = imagesLoaded( document.querySelector('body') );
        self.element = el;

        self.imgLoaded.on('always', function() {

            self.naturalH = self.element.height();
            self.naturalW = self.element.width();

            self.rescaleImage();

            setTimeout(function() {
                if (!hasVideo && !hasParallax) self.preloader.addClass('page-loaded');
                else if (hasVideo && !hasParallax) self.loadVideo(self.element.data('video'));
                else if (hasParallax) self.initParallax();
            }, 1000);
        });
    },
    loadVideo: function(url) {
        var self = this;
        var isTouch = Modernizr.touch;
        if (isTouch) return;

        var BVSources = []
        ,   BVSourcesType = ['mp4', 'webm', 'ogv']
        ;

        for (var i = 0; i < BVSourcesType.length; i ++) {
            BVSources.push({
                type: 'video/' + BVSourcesType[i],
                src: url + '.' + BVSourcesType[i]
            });
        }

        var BV = new $.BigVideo();
        BV.init();
        BV.show(BVSources, {
            ambient: true
        });

        BV.getPlayer().on('loadeddata', function() {
            self.element.addClass('video-loaded');
            $('#preloaders').addClass('page-loaded');
            setTimeout(function() { $('#preloaders').css('z-index', '-9000'); }, 1000);
        });
    },
    rescaleImage: function() {
        var self = this;

        if (!self.element.length) console.warning('no background image');

        var imageRatio = this.naturalW / this.naturalH
        ,   viewportRatio = $(window).width() / $(window).height()
        ,   pushLeft
        ,   pushTop
        ;

        if (viewportRatio < imageRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( imageRatio * $(window).height() - $(window).width() ) / -2;
            pushTop = 0;
            this.element.css({
                'top':  pushTop,
                'left': pushLeft
            });
        }
        else {
            this.element.removeClass('full-height').addClass('full-width');
            pushLeft = 0;
            pushTop = (this.element.height() - $(window).height()) / -2;
            this.element.css({
                'top':  pushTop + 'px',
                'left': pushLeft
            });
        }
    },
    initParallax: function() {
        var self = this
        ,   $parallax = $('#parallaxes')
        ,   $imgs = $('.parallax-image')
        ,   _ph = $parallax.height()
        ;

        // Center image vertically by margin
        $imgs.each(function(index) {
            $(this).css({ 'margin-top': (_ph - $(this).height())/2 });
        });

        $.parallaxify({
            positionProperty: 'transform',
            responsive: true
        });

        self.preloader.addClass('page-loaded');
    }
};

},{}],4:[function(require,module,exports){
module.exports = {
    init: function() {
        if (!$('.recolor').length || !$('.background').length) return;
        BackgroundCheck.init({
            targets: '.recolor'
        });
    }
};

},{}],5:[function(require,module,exports){
module.exports = {
    init: function(el) {
        if (el.length) {
            var $toggler = el.find('.home-hero-toggler'),
                $heroBody = el.find('.home-hero-body')
            ;

            $toggler.on('click', function() {
                $heroBody.toggleClass('open');
            });
        }
    }
};

},{}],6:[function(require,module,exports){
module.exports = {
    init: function(el) {
        var _scope = this;
        el.find('.nav-1').each(function(i) {

            var $el = $(this);

            var _svgObj = $(this).find('.nav-1-object')[0]
            ,   _svgDoc
            ,   _navEl
            ;

            _svgObj.addEventListener('load', function() {
                _svgDoc = _svgObj.contentDocument;
                _navEl  = _svgDoc.querySelector('.navigation-svg');

                $el.hover(
                    function() {
                        $(this).toggleClass('hovered');
                        _navEl.setAttribute('class', 'navigation-svg hovered');
                    },
                    function() {
                        $(this).toggleClass('hovered');
                        _navEl.setAttribute('class', 'navigation-svg');
                    }
                );
            });

            $(this).on('click', function(e) {
                e.preventDefault();
                _scope.toggle(el, $(this).closest('.nav'));
            });
        });
    },

    toggle: function(parent, el) {
        el.each(function(index) {
            if($(this).hasClass('open')) $(this).removeClass('open');
            else $(this).addClass('open');
        });

        // el.toggleClass('open');
    },
    initPageNavigation:  function(hasInfo) {
        var $infoBtnTogglers = $('.info-btn-togglers')
        ,   $pageInfos = $('.page-infos')
        ,   $pageSubNavs = $('#page-subnavigations')
        ,   $pageSubNavLink = $('#page-subnavigation-link')
        ;

        $infoBtnTogglers.on('click', function() {
            $(this).toggleClass('is-active');
            if($pageInfos.length) $pageInfos.toggleClass('is-active');
            if($pageSubNavs.length) $pageSubNavs.toggleClass('is-active');
        });

        $pageSubNavs.find('.page-subnavigation-link').each(function() {
            $(this).on('mouseenter', function(e) {
                $infoBtnTogglers
                    .find('.info-btn-toggler[data-project]')
                    .attr('data-project', $(this).data('project'))
                    .text($(this).data('project'))
                    ;
            });
        });
    }
};

},{}],7:[function(require,module,exports){
module.exports = {
    $toggler: $(),
    $relatedElement: $(),
    init: function(el) {
        var self = this;

        self.$relatedElement = el;
        self.toggler = el.find('.related-toggler');

        self.toggler.on('click', function(e) {
            e.preventDefault();
            el.toggleClass('active');
        });
    }
};

},{}],8:[function(require,module,exports){
module.exports = {
    element: $(),
    init: function(el) {
        this.element = el;
        var self           = this
        ,   $thumbGroups   = self.element.find('.thumb-groups')
        ,   $thumbs        = self.element.find('.thumb')
        ,   $pageSelectors = $('.page-navigations.has-thumbs .page-selectors')
        ,   isSwap         = false
        ;

        var hasNeu = el.hasClass('has-neu'); console.log('hasNeu' ,hasNeu);

        var _thumbN = $thumbs.length
        ,   _thumbGroupsLimit = hasNeu ? 4 : 6
        ,   _thumbGroupN = (_thumbN > _thumbGroupsLimit) ? Math.ceil(_thumbN / _thumbGroupsLimit) : 1
        ,   _thumbStart = 0
        ,   _thumbEnd = _thumbGroupN
        ,   _thumbGroupTemplate = '<div class="thumb-group" />'
        ,   _elWidth = this.element.width()
        ,   _thumbGroupLeft = 0
        ;

        // dynamically set .thumb-groups width
        $thumbGroups.css('width', 100 * _thumbGroupN + "%");

        // dynamically group .thumb, and create page-selector
        for (var i = 0; i < _thumbGroupN; i ++) {
            // begin grouping thumb
            _thumbStart = ((_thumbGroupsLimit + 0) * i);
            _thumbEnd = _thumbStart + _thumbGroupsLimit;
            $thumbs
                .slice( _thumbStart, _thumbEnd )
                .wrapAll(_thumbGroupTemplate)
                ;
        }

        // Randomize thumb image/text position
        $thumbs.each(function(i) {
            $(this).removeClass('is-swap');
            isSwap = Math.random() >= 0.5 ? isSwap : !isSwap;
            if (isSwap && !hasNeu) $(this).addClass('is-swap');
        });

        // dynamically create page-selector
        var _pageSelectorPrevTemplate = '<li class="page-selector prev"><a data-slide class="page-selector-link" href="javascript:void(0)"><object data="assets/images/icon/arrow-black.svg" type="image/svg+xml" class="icon">&lt;</object></a></li>'
        ,   _pageSelectorNumTemplate  = '<li class="page-selector"><a data-slide class="page-selector-link recolor" href="javascript:void(0)"></a></li>'
        ,   _pageSelectorNextTemplate = '<li class="page-selector next"><a data-slide class="page-selector-link" href="javascript:void(0)"><object data="assets/images/icon/arrow-black.svg" type="image/svg+xml" class="icon">&gt;</object></a></li>'
        ;

        if ($pageSelectors.length) {
            // First: create page-selector prev
            if (_thumbGroupN > 1) $pageSelectors.append(_pageSelectorPrevTemplate);

            // Next: create page-selector num
            for (var j = 0; j < _thumbGroupN; j ++) {
                $pageSelectors.append(_pageSelectorNumTemplate);
            }

            // Last: create page-selector next
            if (_thumbGroupN > 1) $pageSelectors.append(_pageSelectorNextTemplate);
        }

        if (!$pageSelectors.find('li').length) $pageSelectors.css('display', 'none');

        // Define selector helpers
        var $pageSelector = $pageSelectors.find('.page-selector')
        ,   $pageSelectorPrev = $pageSelectors.find('.page-selector.prev')
        ,   $pageSelectorNext = $pageSelectors.find('.page-selector.next')
        ;

        // Set data-slide for selector prev
        $pageSelectorPrev.find('.page-selector-link').attr('data-slide', 'prev');

        // Set data-slide and text for selector num
        $pageSelector
            .not($pageSelectorPrev)
            .not($pageSelectorNext)
            .find('.page-selector-link').each(function(index) {
            $(this)
                .text((index + 1))
                .attr('data-slide', index)
                ;
        });

        // Default style for selector num
        if (_thumbGroupN > 1) $pageSelector.not($pageSelectorPrev).eq(0).find('.page-selector-link').addClass('active');
        else $pageSelector.not($pageSelectorPrev).eq(0).find('.page-selector-link').css('display', 'none');

        // Set data-slide for selector next
        $pageSelectorNext.find('.page-selector-link').attr('data-slide', 'next');

        // Add event to page-selector
        var $selector = $()
        ,   _dataSlide = 0
        ;

        $pageSelector.each(function() {
            $selector = $(this).find('.page-selector-link');
            $selector.on('click', function(e) {
                e.preventDefault();

                if ($(this).data('slide') === 'prev') _dataSlide --;
                else if ($(this).data('slide') === 'next') _dataSlide ++;
                else _dataSlide = $(this).data('slide');

                if (_dataSlide < 0) _dataSlide = 0;
                else if (_dataSlide > (_thumbGroupN - 1)) _dataSlide = (_thumbGroupN - 1);

                $thumbGroups.attr('data-slide', _dataSlide);
                _thumbGroupLeft = $thumbGroups.attr('data-slide') * _elWidth;
                $thumbGroups.css( 'left', '-' + _thumbGroupLeft + 'px' );

                $pageSelector.find('.page-selector-link').removeClass('active');
                var _linkSelectorString = '.page-selector-link[data-slide="' + _dataSlide + '"]';
                $(_linkSelectorString).addClass('active');
            });
        });
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1ob21lLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXJlbGF0ZWQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10aHVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXFxcbiAqIE1haW4gc2NyaXB0LlxuICogY2xpZW50L21haW4uanNcbiAqKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuOyggZnVuY3Rpb24oICQgKSB7XG4gICAgdmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9tb2R1bGUvaGVscGVyL2RlYm91bmNlJyk7XG5cbiAgICB2YXIgdWlBc3NldCAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktYXNzZXQnKVxuICAgICwgICB1aUNvbG9yICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1jb2xvcicpXG4gICAgLCAgIHVpTmF2aWdhdGlvbiA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLW5hdmlnYXRpb24nKVxuICAgICwgICB1aUhvbWUgICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1ob21lJylcbiAgICAsICAgdWlUaHVtYiAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktdGh1bWInKVxuICAgICwgICB1aVJlbGF0ZWQgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1yZWxhdGVkJylcbiAgICA7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdWlDb2xvci5pbml0KCk7IH0sIDEwMCk7XG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUFzc2V0LmluaXQoJCgnLmJhY2tncm91bmQnKSk7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHsgdWlBc3NldC5yZXNjYWxlSW1hZ2UoKTsgfSk7XG5cbiAgICAvLyBNYWluIG5hdmlnYXRpb25cbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIC8vIFBhZ2UgbmF2aWdhdGlvblxuICAgIGlmICgkKCcucGFnZS1uYXZpZ2F0aW9ucycpLmxlbmd0aClcbiAgICAgICAgdWlOYXZpZ2F0aW9uLmluaXRQYWdlTmF2aWdhdGlvbigkKCdwYWdlLW5hdmlnYXRpb25zLmhhcy1pbmZvcycpLmxlbmd0aCk7XG5cbiAgICAvLyBIb21lXG4gICAgdWlIb21lLmluaXQoJCgnI2hvbWUtaGVyb3MnKSk7XG5cbiAgICAvLyBUaHVtYm5haWxzXG4gICAgaWYgKCQoJy50aHVtYnMnKS5sZW5ndGgpIHVpVGh1bWIuaW5pdCgkKCcudGh1bWJzJykpO1xuXG4gICAgLy8gUmVsYXRlc1xuICAgIGlmICgkKCcucmVsYXRlZHMnKS5sZW5ndGgpIHVpUmVsYXRlZC5pbml0KCQoJy5yZWxhdGVkcycpKTtcblxuICAgIC8vIFNoYW1lXG4gICAgLy8gTW92ZSB0byBpdCdzIG93biBtb2R1bGVcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy52aWV3ZXItY2xvc2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnI3ZpZXdlcnMnKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIHZhciBjcmVhdGVWaWV3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRiYWNrZ3JvdW5kRWwgPSAkKCcuYmFja2dyb3VuZCcpXG4gICAgICAgICwgICBpbWdTcmMgPSAkYmFja2dyb3VuZEVsLmF0dHIoJ3NyYycpXG4gICAgICAgICwgICB2aWV3ZXJzVGVtcGxhdGUgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwidmlld2Vyc1wiIGNsYXNzPVwicHJlXCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxkaXYgY2xhc3M9XCJ2aWV3ZXItcHJlbG9hZGVyXCI+PHA+bG9hZGluZyBpbWFnZS4uLjwvcD48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGRpdiBjbGFzcz1cImNyb3BpdC1pbWFnZS1wcmV2aWV3XCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICArJzxpbnB1dCB0eXBlPVwicmFuZ2VcIiBjbGFzcz1cImNyb3BpdC1pbWFnZS16b29tLWlucHV0XCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzPVwiY3JvcGl0LWltYWdlLWlucHV0XCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJ2aWV3ZXItY2xvc2VcIj54PC9hPidcbiAgICAgICAgICAgICAgICArJzwvZGl2PidcbiAgICAgICAgO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVByZSgpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnI3ZpZXdlcnMnKS5yZW1vdmVDbGFzcygncHJlJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCdhW2RhdGEtdG9vbD1cImltYWdlXCInKSkge1xuICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCh2aWV3ZXJzVGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBpZigkKCcjdmlld2VycycpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJyN2aWV3ZXJzJykuY3JvcGl0KHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTdGF0ZTogeyBzcmM6IGltZ1NyYyB9LFxuICAgICAgICAgICAgICAgICAgICBvbkltYWdlTG9hZGVkOiByZW1vdmVQcmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkKCcucGFnZS10b29sLWJ0bltkYXRhLXRvb2w9XCJpbWFnZVwiXScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IGNyZWF0ZVZpZXdlcigpOyB9KTtcblxuICAgIC8vIFNoYW1lXG4gICAgdmFyIGlzT3BlbiA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUluZm9DcmVkaXQoKSB7XG4gICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG4gICAgICAgIGlmICghaXNPcGVuKSAgJCgnLmNvbnRhY3QtY3JlZGl0cycpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgICAgIGVsc2UgJCgnLmNvbnRhY3QtY3JlZGl0cycpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICAgfVxuXG4gICAgJCgnLmNvbnRhY3QtY3JlZGl0LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdXBkYXRlSW5mb0NyZWRpdCgpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgcHJlbG9hZGVyOiAkKCcjcHJlbG9hZGVycycpLFxuICAgIG5hdHVyYWxIOiAwLFxuICAgIG5hdHVyYWxXOiAwLFxuICAgIGltZ0xvYWRlZDoge30sXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBoYXNWaWRlbyAgICA9IGVsLmRhdGEoJ3ZpZGVvJykgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICAsICAgJHBhcmFsbGF4ZXMgPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICBoYXNQYXJhbGxheCA9ICRwYXJhbGxheGVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQgPSBpbWFnZXNMb2FkZWQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSApO1xuICAgICAgICBzZWxmLmVsZW1lbnQgPSBlbDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZC5vbignYWx3YXlzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHNlbGYubmF0dXJhbEggPSBzZWxmLmVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxXID0gc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cbiAgICAgICAgICAgIHNlbGYucmVzY2FsZUltYWdlKCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1BhcmFsbGF4KSBzZWxmLmluaXRQYXJhbGxheCgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbygpO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICAgICAgJCgnI3ByZWxvYWRlcnMnKS5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQoJyNwcmVsb2FkZXJzJykuY3NzKCd6LWluZGV4JywgJy05MDAwJyk7IH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuZWxlbWVudC5sZW5ndGgpIGNvbnNvbGUud2FybmluZygnbm8gYmFja2dyb3VuZCBpbWFnZScpO1xuXG4gICAgICAgIHZhciBpbWFnZVJhdGlvID0gdGhpcy5uYXR1cmFsVyAvIHRoaXMubmF0dXJhbEhcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICAsICAgcHVzaExlZnRcbiAgICAgICAgLCAgIHB1c2hUb3BcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAwO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLWhlaWdodCcpLmFkZENsYXNzKCdmdWxsLXdpZHRoJyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9IDA7XG4gICAgICAgICAgICBwdXNoVG9wID0gKHRoaXMuZWxlbWVudC5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCArICdweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXRQYXJhbGxheDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgJHBhcmFsbGF4ID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgJGltZ3MgPSAkKCcucGFyYWxsYXgtaW1hZ2UnKVxuICAgICAgICAsICAgX3BoID0gJHBhcmFsbGF4LmhlaWdodCgpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBDZW50ZXIgaW1hZ2UgdmVydGljYWxseSBieSBtYXJnaW5cbiAgICAgICAgJGltZ3MuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKS5jc3MoeyAnbWFyZ2luLXRvcCc6IChfcGggLSAkKHRoaXMpLmhlaWdodCgpKS8yIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLnBhcmFsbGF4aWZ5KHtcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcGVydHk6ICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgnLnJlY29sb3InKS5sZW5ndGggfHwgISQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuXG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgdmFyIF9zdmdPYmogPSAkKHRoaXMpLmZpbmQoJy5uYXYtMS1vYmplY3QnKVswXVxuICAgICAgICAgICAgLCAgIF9zdmdEb2NcbiAgICAgICAgICAgICwgICBfbmF2RWxcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgX3N2Z09iai5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3N2Z0RvYyA9IF9zdmdPYmouY29udGVudERvY3VtZW50O1xuICAgICAgICAgICAgICAgIF9uYXZFbCAgPSBfc3ZnRG9jLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uLXN2ZycpO1xuXG4gICAgICAgICAgICAgICAgJGVsLmhvdmVyKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2hvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGhvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgX3Njb3BlLnRvZ2dsZShlbCwgJCh0aGlzKS5jbG9zZXN0KCcubmF2JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKHBhcmVudCwgZWwpIHtcbiAgICAgICAgZWwuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICBlbHNlICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZWwudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9LFxuICAgIGluaXRQYWdlTmF2aWdhdGlvbjogIGZ1bmN0aW9uKGhhc0luZm8pIHtcbiAgICAgICAgdmFyICRpbmZvQnRuVG9nZ2xlcnMgPSAkKCcuaW5mby1idG4tdG9nZ2xlcnMnKVxuICAgICAgICAsICAgJHBhZ2VJbmZvcyA9ICQoJy5wYWdlLWluZm9zJylcbiAgICAgICAgLCAgICRwYWdlU3ViTmF2cyA9ICQoJyNwYWdlLXN1Ym5hdmlnYXRpb25zJylcbiAgICAgICAgLCAgICRwYWdlU3ViTmF2TGluayA9ICQoJyNwYWdlLXN1Ym5hdmlnYXRpb24tbGluaycpXG4gICAgICAgIDtcblxuICAgICAgICAkaW5mb0J0blRvZ2dsZXJzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBpZigkcGFnZUluZm9zLmxlbmd0aCkgJHBhZ2VJbmZvcy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBpZigkcGFnZVN1Yk5hdnMubGVuZ3RoKSAkcGFnZVN1Yk5hdnMudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcGFnZVN1Yk5hdnMuZmluZCgnLnBhZ2Utc3VibmF2aWdhdGlvbi1saW5rJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJGluZm9CdG5Ub2dnbGVyc1xuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmluZm8tYnRuLXRvZ2dsZXJbZGF0YS1wcm9qZWN0XScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXByb2plY3QnLCAkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnRleHQoJCh0aGlzKS5kYXRhKCdwcm9qZWN0JykpXG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJHRvZ2dsZXI6ICQoKSxcbiAgICAkcmVsYXRlZEVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi4kcmVsYXRlZEVsZW1lbnQgPSBlbDtcbiAgICAgICAgc2VsZi50b2dnbGVyID0gZWwuZmluZCgnLnJlbGF0ZWQtdG9nZ2xlcicpO1xuXG4gICAgICAgIHNlbGYudG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgICAgIHZhciBzZWxmICAgICAgICAgICA9IHRoaXNcbiAgICAgICAgLCAgICR0aHVtYkdyb3VwcyAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYi1ncm91cHMnKVxuICAgICAgICAsICAgJHRodW1icyAgICAgICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JzID0gJCgnLnBhZ2UtbmF2aWdhdGlvbnMuaGFzLXRodW1icyAucGFnZS1zZWxlY3RvcnMnKVxuICAgICAgICAsICAgaXNTd2FwICAgICAgICAgPSBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgdmFyIGhhc05ldSA9IGVsLmhhc0NsYXNzKCdoYXMtbmV1Jyk7IGNvbnNvbGUubG9nKCdoYXNOZXUnICxoYXNOZXUpO1xuXG4gICAgICAgIHZhciBfdGh1bWJOID0gJHRodW1icy5sZW5ndGhcbiAgICAgICAgLCAgIF90aHVtYkdyb3Vwc0xpbWl0ID0gaGFzTmV1ID8gNCA6IDZcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTiA9IChfdGh1bWJOID4gX3RodW1iR3JvdXBzTGltaXQpID8gTWF0aC5jZWlsKF90aHVtYk4gLyBfdGh1bWJHcm91cHNMaW1pdCkgOiAxXG4gICAgICAgICwgICBfdGh1bWJTdGFydCA9IDBcbiAgICAgICAgLCAgIF90aHVtYkVuZCA9IF90aHVtYkdyb3VwTlxuICAgICAgICAsICAgX3RodW1iR3JvdXBUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwidGh1bWItZ3JvdXBcIiAvPidcbiAgICAgICAgLCAgIF9lbFdpZHRoID0gdGhpcy5lbGVtZW50LndpZHRoKClcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTGVmdCA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IHNldCAudGh1bWItZ3JvdXBzIHdpZHRoXG4gICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoJ3dpZHRoJywgMTAwICogX3RodW1iR3JvdXBOICsgXCIlXCIpO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGdyb3VwIC50aHVtYiwgYW5kIGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RodW1iR3JvdXBOOyBpICsrKSB7XG4gICAgICAgICAgICAvLyBiZWdpbiBncm91cGluZyB0aHVtYlxuICAgICAgICAgICAgX3RodW1iU3RhcnQgPSAoKF90aHVtYkdyb3Vwc0xpbWl0ICsgMCkgKiBpKTtcbiAgICAgICAgICAgIF90aHVtYkVuZCA9IF90aHVtYlN0YXJ0ICsgX3RodW1iR3JvdXBzTGltaXQ7XG4gICAgICAgICAgICAkdGh1bWJzXG4gICAgICAgICAgICAgICAgLnNsaWNlKCBfdGh1bWJTdGFydCwgX3RodW1iRW5kIClcbiAgICAgICAgICAgICAgICAud3JhcEFsbChfdGh1bWJHcm91cFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSB0aHVtYiBpbWFnZS90ZXh0IHBvc2l0aW9uXG4gICAgICAgICR0aHVtYnMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgICAgICBpc1N3YXAgPSBNYXRoLnJhbmRvbSgpID49IDAuNSA/IGlzU3dhcCA6ICFpc1N3YXA7XG4gICAgICAgICAgICBpZiAoaXNTd2FwICYmICFoYXNOZXUpICQodGhpcykuYWRkQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyIF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBwcmV2XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mbHQ7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlICA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yXCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGluayByZWNvbG9yXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBuZXh0XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mZ3Q7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICA7XG5cbiAgICAgICAgaWYgKCRwYWdlU2VsZWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gRmlyc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIHByZXZcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIE5leHQ6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG51bVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBfdGh1bWJHcm91cE47IGogKyspIHtcbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGFzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbmV4dFxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghJHBhZ2VTZWxlY3RvcnMuZmluZCgnbGknKS5sZW5ndGgpICRwYWdlU2VsZWN0b3JzLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHNlbGVjdG9yIGhlbHBlcnNcbiAgICAgICAgdmFyICRwYWdlU2VsZWN0b3IgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3RvcicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yUHJldiA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLnByZXYnKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3Rvck5leHQgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5uZXh0JylcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBwcmV2XG4gICAgICAgICRwYWdlU2VsZWN0b3JQcmV2LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ3ByZXYnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBhbmQgdGV4dCBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgICRwYWdlU2VsZWN0b3JcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3RvclByZXYpXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JOZXh0KVxuICAgICAgICAgICAgLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRleHQoKGluZGV4ICsgMSkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpZGUnLCBpbmRleClcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmF1bHQgc3R5bGUgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGVsc2UgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBuZXh0XG4gICAgICAgICRwYWdlU2VsZWN0b3JOZXh0LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ25leHQnKTtcblxuICAgICAgICAvLyBBZGQgZXZlbnQgdG8gcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgJHNlbGVjdG9yID0gJCgpXG4gICAgICAgICwgICBfZGF0YVNsaWRlID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgJHBhZ2VTZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNlbGVjdG9yID0gJCh0aGlzKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJyk7XG4gICAgICAgICAgICAkc2VsZWN0b3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICdwcmV2JykgX2RhdGFTbGlkZSAtLTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICduZXh0JykgX2RhdGFTbGlkZSArKztcbiAgICAgICAgICAgICAgICBlbHNlIF9kYXRhU2xpZGUgPSAkKHRoaXMpLmRhdGEoJ3NsaWRlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoX2RhdGFTbGlkZSA8IDApIF9kYXRhU2xpZGUgPSAwO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKF9kYXRhU2xpZGUgPiAoX3RodW1iR3JvdXBOIC0gMSkpIF9kYXRhU2xpZGUgPSAoX3RodW1iR3JvdXBOIC0gMSk7XG5cbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScsIF9kYXRhU2xpZGUpO1xuICAgICAgICAgICAgICAgIF90aHVtYkdyb3VwTGVmdCA9ICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJykgKiBfZWxXaWR0aDtcbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCAnbGVmdCcsICctJyArIF90aHVtYkdyb3VwTGVmdCArICdweCcgKTtcblxuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3IuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB2YXIgX2xpbmtTZWxlY3RvclN0cmluZyA9ICcucGFnZS1zZWxlY3Rvci1saW5rW2RhdGEtc2xpZGU9XCInICsgX2RhdGFTbGlkZSArICdcIl0nO1xuICAgICAgICAgICAgICAgICQoX2xpbmtTZWxlY3RvclN0cmluZykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXX0=
