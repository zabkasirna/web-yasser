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

        console.log($imgs.eq(0).height(), $parallax.height());
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

            var _svgObj = $(this).find('.nav-1-object')[0]
            ,   _svgDoc
            ,   _navEl
            ;

            _svgObj.addEventListener('load', function() {
                _svgDoc = _svgObj.contentDocument;
                _navEl  = _svgDoc.querySelector('.navigation-svg');
            });

            $(this).hover(
                function() {
                    $(this).toggleClass('hovered');
                    _navEl.setAttribute('class', 'navigation-svg hovered');
                },
                function() {
                    $(this).toggleClass('hovered');
                    _navEl.setAttribute('class', 'navigation-svg');
                }
            );

            $(this).on('click', function(e) {
                e.preventDefault();
                _scope.toggle(el, $(this).closest('.nav'));
            });
        });
    },
    toggle: function(parent, el) {
        el.each(function(index) {
            console.log($(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1ob21lLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXJlbGF0ZWQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10aHVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKlxcXG4gKiBNYWluIHNjcmlwdC5cbiAqIGNsaWVudC9tYWluLmpzXG4gKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbjsoIGZ1bmN0aW9uKCAkICkge1xuICAgIHZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vbW9kdWxlL2hlbHBlci9kZWJvdW5jZScpO1xuXG4gICAgdmFyIHVpQXNzZXQgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWFzc2V0JylcbiAgICAsICAgdWlDb2xvciAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktY29sb3InKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktaG9tZScpXG4gICAgLCAgIHVpVGh1bWIgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXRodW1iJylcbiAgICAsICAgdWlSZWxhdGVkICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktcmVsYXRlZCcpXG4gICAgO1xuXG4gICAgLy8gRHluYW1pYyBjb2xvclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHVpQ29sb3IuaW5pdCgpOyB9LCAxMDApO1xuXG4gICAgLy8gQmFja2dyb3VuZFxuICAgIGlmICgkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgdWlBc3NldC5pbml0KCQoJy5iYWNrZ3JvdW5kJykpO1xuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7IHVpQXNzZXQucmVzY2FsZUltYWdlKCk7IH0pO1xuXG4gICAgLy8gTWFpbiBuYXZpZ2F0aW9uXG4gICAgdmFyICRuYXZzID0gJCgnI25hdmlnYXRpb24nKTtcbiAgICBpZiAoJG5hdnMubGVuZ3RoKSB1aU5hdmlnYXRpb24uaW5pdCgkbmF2cyk7XG5cbiAgICAvLyBQYWdlIG5hdmlnYXRpb25cbiAgICBpZiAoJCgnLnBhZ2UtbmF2aWdhdGlvbnMnKS5sZW5ndGgpXG4gICAgICAgIHVpTmF2aWdhdGlvbi5pbml0UGFnZU5hdmlnYXRpb24oJCgncGFnZS1uYXZpZ2F0aW9ucy5oYXMtaW5mb3MnKS5sZW5ndGgpO1xuXG4gICAgLy8gSG9tZVxuICAgIHVpSG9tZS5pbml0KCQoJyNob21lLWhlcm9zJykpO1xuXG4gICAgLy8gVGh1bWJuYWlsc1xuICAgIGlmICgkKCcudGh1bWJzJykubGVuZ3RoKSB1aVRodW1iLmluaXQoJCgnLnRodW1icycpKTtcblxuICAgIC8vIFJlbGF0ZXNcbiAgICBpZiAoJCgnLnJlbGF0ZWRzJykubGVuZ3RoKSB1aVJlbGF0ZWQuaW5pdCgkKCcucmVsYXRlZHMnKSk7XG5cbiAgICAvLyBTaGFtZVxuICAgIC8vIE1vdmUgdG8gaXQncyBvd24gbW9kdWxlXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcudmlld2VyLWNsb3NlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJyN2aWV3ZXJzJykucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgY3JlYXRlVmlld2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkYmFja2dyb3VuZEVsID0gJCgnLmJhY2tncm91bmQnKVxuICAgICAgICAsICAgaW1nU3JjID0gJGJhY2tncm91bmRFbC5hdHRyKCdzcmMnKVxuICAgICAgICAsICAgdmlld2Vyc1RlbXBsYXRlID1cbiAgICAgICAgICAgICAgICAnPGRpdiBpZD1cInZpZXdlcnNcIiBjbGFzcz1cInByZVwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwidmlld2VyLXByZWxvYWRlclwiPjxwPmxvYWRpbmcgaW1hZ2UuLi48L3A+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICArJzxkaXYgY2xhc3M9XCJjcm9waXQtaW1hZ2UtcHJldmlld1wiPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKyc8aW5wdXQgdHlwZT1cInJhbmdlXCIgY2xhc3M9XCJjcm9waXQtaW1hZ2Utem9vbS1pbnB1dFwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzcz1cImNyb3BpdC1pbWFnZS1pbnB1dFwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8YSBocmVmPVwiI1wiIGNsYXNzPVwidmlld2VyLWNsb3NlXCI+eDwvYT4nXG4gICAgICAgICAgICAgICAgKyc8L2Rpdj4nXG4gICAgICAgIDtcblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVQcmUoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJyN2aWV3ZXJzJykucmVtb3ZlQ2xhc3MoJ3ByZScpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnYVtkYXRhLXRvb2w9XCJpbWFnZVwiJykpIHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQodmlld2Vyc1RlbXBsYXRlKTtcblxuICAgICAgICAgICAgaWYoJCgnI3ZpZXdlcnMnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcjdmlld2VycycpLmNyb3BpdCh7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3RhdGU6IHsgc3JjOiBpbWdTcmMgfSxcbiAgICAgICAgICAgICAgICAgICAgb25JbWFnZUxvYWRlZDogcmVtb3ZlUHJlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJCgnLnBhZ2UtdG9vbC1idG5bZGF0YS10b29sPVwiaW1hZ2VcIl0nKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBjcmVhdGVWaWV3ZXIoKTsgfSk7XG5cbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBwcmVsb2FkZXI6ICQoJyNwcmVsb2FkZXJzJyksXG4gICAgbmF0dXJhbEg6IDAsXG4gICAgbmF0dXJhbFc6IDAsXG4gICAgaW1nTG9hZGVkOiB7fSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgIGhhc1ZpZGVvICAgID0gZWwuZGF0YSgndmlkZW8nKSA/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgICwgICAkcGFyYWxsYXhlcyA9ICQoJyNwYXJhbGxheGVzJylcbiAgICAgICAgLCAgIGhhc1BhcmFsbGF4ID0gJHBhcmFsbGF4ZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZCA9IGltYWdlc0xvYWRlZCggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpICk7XG4gICAgICAgIHNlbGYuZWxlbWVudCA9IGVsO1xuXG4gICAgICAgIHNlbGYuaW1nTG9hZGVkLm9uKCdhbHdheXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc2VsZi5uYXR1cmFsSCA9IHNlbGYuZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHNlbGYubmF0dXJhbFcgPSBzZWxmLmVsZW1lbnQud2lkdGgoKTtcblxuICAgICAgICAgICAgc2VsZi5yZXNjYWxlSW1hZ2UoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5wcmVsb2FkZXIuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzVmlkZW8gJiYgIWhhc1BhcmFsbGF4KSBzZWxmLmxvYWRWaWRlbyhzZWxmLmVsZW1lbnQuZGF0YSgndmlkZW8nKSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzUGFyYWxsYXgpIHNlbGYuaW5pdFBhcmFsbGF4KCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBsb2FkVmlkZW86IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBpc1RvdWNoID0gTW9kZXJuaXpyLnRvdWNoO1xuICAgICAgICBpZiAoaXNUb3VjaCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBCVlNvdXJjZXMgPSBbXVxuICAgICAgICAsICAgQlZTb3VyY2VzVHlwZSA9IFsnbXA0JywgJ3dlYm0nLCAnb2d2J11cbiAgICAgICAgO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQlZTb3VyY2VzVHlwZS5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIEJWU291cmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmlkZW8vJyArIEJWU291cmNlc1R5cGVbaV0sXG4gICAgICAgICAgICAgICAgc3JjOiB1cmwgKyAnLicgKyBCVlNvdXJjZXNUeXBlW2ldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBCViA9IG5ldyAkLkJpZ1ZpZGVvKCk7XG4gICAgICAgIEJWLmluaXQoKTtcbiAgICAgICAgQlYuc2hvdyhCVlNvdXJjZXMsIHtcbiAgICAgICAgICAgIGFtYmllbnQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgQlYuZ2V0UGxheWVyKCkub24oJ2xvYWRlZGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuZWxlbWVudC5hZGRDbGFzcygndmlkZW8tbG9hZGVkJyk7XG4gICAgICAgICAgICAkKCcjcHJlbG9hZGVycycpLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgJCgnI3ByZWxvYWRlcnMnKS5jc3MoJ3otaW5kZXgnLCAnLTkwMDAnKTsgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzY2FsZUltYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5lbGVtZW50Lmxlbmd0aCkgY29uc29sZS53YXJuaW5nKCdubyBiYWNrZ3JvdW5kIGltYWdlJyk7XG5cbiAgICAgICAgdmFyIGltYWdlUmF0aW8gPSB0aGlzLm5hdHVyYWxXIC8gdGhpcy5uYXR1cmFsSFxuICAgICAgICAsICAgdmlld3BvcnRSYXRpbyA9ICQod2luZG93KS53aWR0aCgpIC8gJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgICAgICwgICBwdXNoTGVmdFxuICAgICAgICAsICAgcHVzaFRvcFxuICAgICAgICA7XG5cbiAgICAgICAgaWYgKHZpZXdwb3J0UmF0aW8gPCBpbWFnZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtd2lkdGgnKS5hZGRDbGFzcygnZnVsbC1oZWlnaHQnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gKCBpbWFnZVJhdGlvICogJCh3aW5kb3cpLmhlaWdodCgpIC0gJCh3aW5kb3cpLndpZHRoKCkgKSAvIC0yO1xuICAgICAgICAgICAgcHVzaFRvcCA9IDA7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gMDtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAodGhpcy5lbGVtZW50LmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpKSAvIC0yO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdFBhcmFsbGF4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICAkcGFyYWxsYXggPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICAkaW1ncyA9ICQoJy5wYXJhbGxheC1pbWFnZScpXG4gICAgICAgICwgICBfcGggPSAkcGFyYWxsYXguaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIENlbnRlciBpbWFnZSB2ZXJ0aWNhbGx5IGJ5IG1hcmdpblxuICAgICAgICAkaW1ncy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7ICdtYXJnaW4tdG9wJzogKF9waCAtICQodGhpcykuaGVpZ2h0KCkpLzIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQucGFyYWxsYXhpZnkoe1xuICAgICAgICAgICAgcG9zaXRpb25Qcm9wZXJ0eTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCRpbWdzLmVxKDApLmhlaWdodCgpLCAkcGFyYWxsYXguaGVpZ2h0KCkpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCcucmVjb2xvcicpLmxlbmd0aCB8fCAhJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgQmFja2dyb3VuZENoZWNrLmluaXQoe1xuICAgICAgICAgICAgdGFyZ2V0czogJy5yZWNvbG9yJ1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyICR0b2dnbGVyID0gZWwuZmluZCgnLmhvbWUtaGVyby10b2dnbGVyJyksXG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5ID0gZWwuZmluZCgnLmhvbWUtaGVyby1ib2R5JylcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgJHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5LnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgX3Njb3BlID0gdGhpcztcbiAgICAgICAgZWwuZmluZCgnLm5hdi0xJykuZWFjaChmdW5jdGlvbihpKSB7XG5cbiAgICAgICAgICAgIHZhciBfc3ZnT2JqID0gJCh0aGlzKS5maW5kKCcubmF2LTEtb2JqZWN0JylbMF1cbiAgICAgICAgICAgICwgICBfc3ZnRG9jXG4gICAgICAgICAgICAsICAgX25hdkVsXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIF9zdmdPYmouYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF9zdmdEb2MgPSBfc3ZnT2JqLmNvbnRlbnREb2N1bWVudDtcbiAgICAgICAgICAgICAgICBfbmF2RWwgID0gX3N2Z0RvYy5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbi1zdmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmhvdmVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGhvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykuY2xvc2VzdCgnLm5hdicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICBlbC5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpKTtcbiAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgZWxzZSAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGVsLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgfSxcbiAgICBpbml0UGFnZU5hdmlnYXRpb246ICBmdW5jdGlvbihoYXNJbmZvKSB7XG4gICAgICAgIHZhciAkaW5mb0J0blRvZ2dsZXJzID0gJCgnLmluZm8tYnRuLXRvZ2dsZXJzJylcbiAgICAgICAgLCAgICRwYWdlSW5mb3MgPSAkKCcucGFnZS1pbmZvcycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdnMgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9ucycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdkxpbmsgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKVxuICAgICAgICA7XG5cbiAgICAgICAgJGluZm9CdG5Ub2dnbGVycy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VJbmZvcy5sZW5ndGgpICRwYWdlSW5mb3MudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VTdWJOYXZzLmxlbmd0aCkgJHBhZ2VTdWJOYXZzLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHBhZ2VTdWJOYXZzLmZpbmQoJy5wYWdlLXN1Ym5hdmlnYXRpb24tbGluaycpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICRpbmZvQnRuVG9nZ2xlcnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5pbmZvLWJ0bi10b2dnbGVyW2RhdGEtcHJvamVjdF0nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1wcm9qZWN0JywgJCh0aGlzKS5kYXRhKCdwcm9qZWN0JykpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KCQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICR0b2dnbGVyOiAkKCksXG4gICAgJHJlbGF0ZWRFbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuJHJlbGF0ZWRFbGVtZW50ID0gZWw7XG4gICAgICAgIHNlbGYudG9nZ2xlciA9IGVsLmZpbmQoJy5yZWxhdGVkLXRvZ2dsZXInKTtcblxuICAgICAgICBzZWxmLnRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgICB2YXIgc2VsZiAgICAgICAgICAgPSB0aGlzXG4gICAgICAgICwgICAkdGh1bWJHcm91cHMgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWItZ3JvdXBzJylcbiAgICAgICAgLCAgICR0aHVtYnMgICAgICAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9ycyA9ICQoJy5wYWdlLW5hdmlnYXRpb25zLmhhcy10aHVtYnMgLnBhZ2Utc2VsZWN0b3JzJylcbiAgICAgICAgLCAgIGlzU3dhcCAgICAgICAgID0gZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHZhciBoYXNOZXUgPSBlbC5oYXNDbGFzcygnaGFzLW5ldScpOyBjb25zb2xlLmxvZygnaGFzTmV1JyAsaGFzTmV1KTtcblxuICAgICAgICB2YXIgX3RodW1iTiA9ICR0aHVtYnMubGVuZ3RoXG4gICAgICAgICwgICBfdGh1bWJHcm91cHNMaW1pdCA9IGhhc05ldSA/IDQgOiA2XG4gICAgICAgICwgICBfdGh1bWJHcm91cE4gPSAoX3RodW1iTiA+IF90aHVtYkdyb3Vwc0xpbWl0KSA/IE1hdGguY2VpbChfdGh1bWJOIC8gX3RodW1iR3JvdXBzTGltaXQpIDogMVxuICAgICAgICAsICAgX3RodW1iU3RhcnQgPSAwXG4gICAgICAgICwgICBfdGh1bWJFbmQgPSBfdGh1bWJHcm91cE5cbiAgICAgICAgLCAgIF90aHVtYkdyb3VwVGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInRodW1iLWdyb3VwXCIgLz4nXG4gICAgICAgICwgICBfZWxXaWR0aCA9IHRoaXMuZWxlbWVudC53aWR0aCgpXG4gICAgICAgICwgICBfdGh1bWJHcm91cExlZnQgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBzZXQgLnRodW1iLWdyb3VwcyB3aWR0aFxuICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCd3aWR0aCcsIDEwMCAqIF90aHVtYkdyb3VwTiArIFwiJVwiKTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBncm91cCAudGh1bWIsIGFuZCBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aHVtYkdyb3VwTjsgaSArKykge1xuICAgICAgICAgICAgLy8gYmVnaW4gZ3JvdXBpbmcgdGh1bWJcbiAgICAgICAgICAgIF90aHVtYlN0YXJ0ID0gKChfdGh1bWJHcm91cHNMaW1pdCArIDApICogaSk7XG4gICAgICAgICAgICBfdGh1bWJFbmQgPSBfdGh1bWJTdGFydCArIF90aHVtYkdyb3Vwc0xpbWl0O1xuICAgICAgICAgICAgJHRodW1ic1xuICAgICAgICAgICAgICAgIC5zbGljZSggX3RodW1iU3RhcnQsIF90aHVtYkVuZCApXG4gICAgICAgICAgICAgICAgLndyYXBBbGwoX3RodW1iR3JvdXBUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSYW5kb21pemUgdGh1bWIgaW1hZ2UvdGV4dCBwb3NpdGlvblxuICAgICAgICAkdGh1bWJzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICAgICAgaXNTd2FwID0gTWF0aC5yYW5kb20oKSA+PSAwLjUgPyBpc1N3YXAgOiAhaXNTd2FwO1xuICAgICAgICAgICAgaWYgKGlzU3dhcCAmJiAhaGFzTmV1KSAkKHRoaXMpLmFkZENsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciBfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgcHJldlwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmx0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSAgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvclwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmsgcmVjb2xvclwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgbmV4dFwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmd0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICgkcGFnZVNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIEZpcnN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBwcmV2XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAvLyBOZXh0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBudW1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgX3RodW1iR3JvdXBOOyBqICsrKSB7XG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExhc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG5leHRcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISRwYWdlU2VsZWN0b3JzLmZpbmQoJ2xpJykubGVuZ3RoKSAkcGFnZVNlbGVjdG9ycy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIERlZmluZSBzZWxlY3RvciBoZWxwZXJzXG4gICAgICAgIHZhciAkcGFnZVNlbGVjdG9yID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3InKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvclByZXYgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5wcmV2JylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JOZXh0ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IubmV4dCcpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgcHJldlxuICAgICAgICAkcGFnZVNlbGVjdG9yUHJldi5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICdwcmV2Jyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgYW5kIHRleHQgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICAkcGFnZVNlbGVjdG9yXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JQcmV2KVxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yTmV4dClcbiAgICAgICAgICAgIC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC50ZXh0KChpbmRleCArIDEpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWRlJywgaW5kZXgpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZhdWx0IHN0eWxlIGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBlbHNlICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgbmV4dFxuICAgICAgICAkcGFnZVNlbGVjdG9yTmV4dC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICduZXh0Jyk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IHRvIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyICRzZWxlY3RvciA9ICQoKVxuICAgICAgICAsICAgX2RhdGFTbGlkZSA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgICRwYWdlU2VsZWN0b3IuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICQodGhpcykuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpO1xuICAgICAgICAgICAgJHNlbGVjdG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAncHJldicpIF9kYXRhU2xpZGUgLS07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAnbmV4dCcpIF9kYXRhU2xpZGUgKys7XG4gICAgICAgICAgICAgICAgZWxzZSBfZGF0YVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhU2xpZGUgPCAwKSBfZGF0YVNsaWRlID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfZGF0YVNsaWRlID4gKF90aHVtYkdyb3VwTiAtIDEpKSBfZGF0YVNsaWRlID0gKF90aHVtYkdyb3VwTiAtIDEpO1xuXG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnLCBfZGF0YVNsaWRlKTtcbiAgICAgICAgICAgICAgICBfdGh1bWJHcm91cExlZnQgPSAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScpICogX2VsV2lkdGg7XG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmNzcyggJ2xlZnQnLCAnLScgKyBfdGh1bWJHcm91cExlZnQgKyAncHgnICk7XG5cbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9yLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdmFyIF9saW5rU2VsZWN0b3JTdHJpbmcgPSAnLnBhZ2Utc2VsZWN0b3ItbGlua1tkYXRhLXNsaWRlPVwiJyArIF9kYXRhU2xpZGUgKyAnXCJdJztcbiAgICAgICAgICAgICAgICAkKF9saW5rU2VsZWN0b3JTdHJpbmcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIl19
