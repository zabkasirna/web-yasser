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
        el.find('.nav').each(function(i) {

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
                _scope.toggle(el, $(this));
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

        var _thumbN = $thumbs.length
        ,   _thumbGroupsLimit = 6
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
            if (isSwap) $(this).addClass('is-swap');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1ob21lLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXJlbGF0ZWQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10aHVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXFxcbiAqIE1haW4gc2NyaXB0LlxuICogY2xpZW50L21haW4uanNcbiAqKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuOyggZnVuY3Rpb24oICQgKSB7XG4gICAgdmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9tb2R1bGUvaGVscGVyL2RlYm91bmNlJyk7XG5cbiAgICB2YXIgdWlBc3NldCAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktYXNzZXQnKVxuICAgICwgICB1aUNvbG9yICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1jb2xvcicpXG4gICAgLCAgIHVpTmF2aWdhdGlvbiA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLW5hdmlnYXRpb24nKVxuICAgICwgICB1aUhvbWUgICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1ob21lJylcbiAgICAsICAgdWlUaHVtYiAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktdGh1bWInKVxuICAgICwgICB1aVJlbGF0ZWQgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1yZWxhdGVkJylcbiAgICA7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdWlDb2xvci5pbml0KCk7IH0sIDEwMCk7XG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUFzc2V0LmluaXQoJCgnLmJhY2tncm91bmQnKSk7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHsgdWlBc3NldC5yZXNjYWxlSW1hZ2UoKTsgfSk7XG5cbiAgICAvLyBNYWluIG5hdmlnYXRpb25cbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIC8vIFBhZ2UgbmF2aWdhdGlvblxuICAgIGlmICgkKCcucGFnZS1uYXZpZ2F0aW9ucycpLmxlbmd0aClcbiAgICAgICAgdWlOYXZpZ2F0aW9uLmluaXRQYWdlTmF2aWdhdGlvbigkKCdwYWdlLW5hdmlnYXRpb25zLmhhcy1pbmZvcycpLmxlbmd0aCk7XG5cbiAgICAvLyBIb21lXG4gICAgdWlIb21lLmluaXQoJCgnI2hvbWUtaGVyb3MnKSk7XG5cbiAgICAvLyBUaHVtYm5haWxzXG4gICAgaWYgKCQoJy50aHVtYnMnKS5sZW5ndGgpIHVpVGh1bWIuaW5pdCgkKCcudGh1bWJzJykpO1xuXG4gICAgLy8gUmVsYXRlc1xuICAgIGlmICgkKCcucmVsYXRlZHMnKS5sZW5ndGgpIHVpUmVsYXRlZC5pbml0KCQoJy5yZWxhdGVkcycpKTtcblxufSkoalF1ZXJ5KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRocmVzaG9sZCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5kZWJvdW5jZVxuICAgICAgICAsICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7IFxuICAgICAgICB9XG4gXG4gICAgICAgIGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGVsc2UgaWYgKGltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiBcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7IFxuICAgIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIHByZWxvYWRlcjogJCgnI3ByZWxvYWRlcnMnKSxcbiAgICBuYXR1cmFsSDogMCxcbiAgICBuYXR1cmFsVzogMCxcbiAgICBpbWdMb2FkZWQ6IHt9LFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgaGFzVmlkZW8gICAgPSBlbC5kYXRhKCd2aWRlbycpID8gdHJ1ZSA6IGZhbHNlXG5cbiAgICAgICAgLCAgICRwYXJhbGxheGVzID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgaGFzUGFyYWxsYXggPSAkcGFyYWxsYXhlcy5sZW5ndGggPyB0cnVlIDogZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHNlbGYuaW1nTG9hZGVkID0gaW1hZ2VzTG9hZGVkKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykgKTtcbiAgICAgICAgc2VsZi5lbGVtZW50ID0gZWw7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQub24oJ2Fsd2F5cycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxIID0gc2VsZi5lbGVtZW50LmhlaWdodCgpO1xuICAgICAgICAgICAgc2VsZi5uYXR1cmFsVyA9IHNlbGYuZWxlbWVudC53aWR0aCgpO1xuXG4gICAgICAgICAgICBzZWxmLnJlc2NhbGVJbWFnZSgpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzVmlkZW8gJiYgIWhhc1BhcmFsbGF4KSBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYubG9hZFZpZGVvKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNQYXJhbGxheCkgc2VsZi5pbml0UGFyYWxsYXgoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGxvYWRWaWRlbzogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGlzVG91Y2ggPSBNb2Rlcm5penIudG91Y2g7XG4gICAgICAgIGlmIChpc1RvdWNoKSByZXR1cm47XG5cbiAgICAgICAgdmFyIEJWU291cmNlcyA9IFtdXG4gICAgICAgICwgICBCVlNvdXJjZXNUeXBlID0gWydtcDQnLCAnd2VibScsICdvZ3YnXVxuICAgICAgICA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCVlNvdXJjZXNUeXBlLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgQlZTb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2aWRlby8nICsgQlZTb3VyY2VzVHlwZVtpXSxcbiAgICAgICAgICAgICAgICBzcmM6IHVybCArICcuJyArIEJWU291cmNlc1R5cGVbaV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEJWID0gbmV3ICQuQmlnVmlkZW8oKTtcbiAgICAgICAgQlYuaW5pdCgpO1xuICAgICAgICBCVi5zaG93KEJWU291cmNlcywge1xuICAgICAgICAgICAgYW1iaWVudDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBCVi5nZXRQbGF5ZXIoKS5vbignbG9hZGVkZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5lbGVtZW50LmFkZENsYXNzKCd2aWRlby1sb2FkZWQnKTtcbiAgICAgICAgICAgICQoJyNwcmVsb2FkZXJzJykuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkKCcjcHJlbG9hZGVycycpLmNzcygnei1pbmRleCcsICctOTAwMCcpOyB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNjYWxlSW1hZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmVsZW1lbnQubGVuZ3RoKSBjb25zb2xlLndhcm5pbmcoJ25vIGJhY2tncm91bmQgaW1hZ2UnKTtcblxuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMubmF0dXJhbFcgLyB0aGlzLm5hdHVyYWxIXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgLCAgIHB1c2hMZWZ0XG4gICAgICAgICwgICBwdXNoVG9wXG4gICAgICAgIDtcblxuICAgICAgICBpZiAodmlld3BvcnRSYXRpbyA8IGltYWdlUmF0aW8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC13aWR0aCcpLmFkZENsYXNzKCdmdWxsLWhlaWdodCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAoIGltYWdlUmF0aW8gKiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKHdpbmRvdykud2lkdGgoKSApIC8gLTI7XG4gICAgICAgICAgICBwdXNoVG9wID0gMDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC1oZWlnaHQnKS5hZGRDbGFzcygnZnVsbC13aWR0aCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAwO1xuICAgICAgICAgICAgcHVzaFRvcCA9ICh0aGlzLmVsZW1lbnQuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpIC8gLTI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AgKyAncHgnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbml0UGFyYWxsYXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgICRwYXJhbGxheCA9ICQoJyNwYXJhbGxheGVzJylcbiAgICAgICAgLCAgICRpbWdzID0gJCgnLnBhcmFsbGF4LWltYWdlJylcbiAgICAgICAgLCAgIF9waCA9ICRwYXJhbGxheC5oZWlnaHQoKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gQ2VudGVyIGltYWdlIHZlcnRpY2FsbHkgYnkgbWFyZ2luXG4gICAgICAgICRpbWdzLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcykuY3NzKHsgJ21hcmdpbi10b3AnOiAoX3BoIC0gJCh0aGlzKS5oZWlnaHQoKSkvMiB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5wYXJhbGxheGlmeSh7XG4gICAgICAgICAgICBwb3NpdGlvblByb3BlcnR5OiAndHJhbnNmb3JtJyxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5wcmVsb2FkZXIuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJGltZ3MuZXEoMCkuaGVpZ2h0KCksICRwYXJhbGxheC5oZWlnaHQoKSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoJy5yZWNvbG9yJykubGVuZ3RoIHx8ICEkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBCYWNrZ3JvdW5kQ2hlY2suaW5pdCh7XG4gICAgICAgICAgICB0YXJnZXRzOiAnLnJlY29sb3InXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2JykuZWFjaChmdW5jdGlvbihpKSB7XG5cbiAgICAgICAgICAgIHZhciBfc3ZnT2JqID0gJCh0aGlzKS5maW5kKCcubmF2LTEtb2JqZWN0JylbMF1cbiAgICAgICAgICAgICwgICBfc3ZnRG9jXG4gICAgICAgICAgICAsICAgX25hdkVsXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIF9zdmdPYmouYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF9zdmdEb2MgPSBfc3ZnT2JqLmNvbnRlbnREb2N1bWVudDtcbiAgICAgICAgICAgICAgICBfbmF2RWwgID0gX3N2Z0RvYy5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbi1zdmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmhvdmVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGhvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwYXJlbnQsIGVsKSB7XG4gICAgICAgIGVsLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgZWxzZSAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGVsLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgfSxcbiAgICBpbml0UGFnZU5hdmlnYXRpb246ICBmdW5jdGlvbihoYXNJbmZvKSB7XG4gICAgICAgIHZhciAkaW5mb0J0blRvZ2dsZXJzID0gJCgnLmluZm8tYnRuLXRvZ2dsZXJzJylcbiAgICAgICAgLCAgICRwYWdlSW5mb3MgPSAkKCcucGFnZS1pbmZvcycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdnMgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9ucycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdkxpbmsgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKVxuICAgICAgICA7XG5cbiAgICAgICAgJGluZm9CdG5Ub2dnbGVycy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VJbmZvcy5sZW5ndGgpICRwYWdlSW5mb3MudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VTdWJOYXZzLmxlbmd0aCkgJHBhZ2VTdWJOYXZzLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHBhZ2VTdWJOYXZzLmZpbmQoJy5wYWdlLXN1Ym5hdmlnYXRpb24tbGluaycpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICRpbmZvQnRuVG9nZ2xlcnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5pbmZvLWJ0bi10b2dnbGVyW2RhdGEtcHJvamVjdF0nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1wcm9qZWN0JywgJCh0aGlzKS5kYXRhKCdwcm9qZWN0JykpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KCQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICR0b2dnbGVyOiAkKCksXG4gICAgJHJlbGF0ZWRFbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuJHJlbGF0ZWRFbGVtZW50ID0gZWw7XG4gICAgICAgIHNlbGYudG9nZ2xlciA9IGVsLmZpbmQoJy5yZWxhdGVkLXRvZ2dsZXInKTtcblxuICAgICAgICBzZWxmLnRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgICB2YXIgc2VsZiAgICAgICAgICAgPSB0aGlzXG4gICAgICAgICwgICAkdGh1bWJHcm91cHMgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWItZ3JvdXBzJylcbiAgICAgICAgLCAgICR0aHVtYnMgICAgICAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9ycyA9ICQoJy5wYWdlLW5hdmlnYXRpb25zLmhhcy10aHVtYnMgLnBhZ2Utc2VsZWN0b3JzJylcbiAgICAgICAgLCAgIGlzU3dhcCAgICAgICAgID0gZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHZhciBfdGh1bWJOID0gJHRodW1icy5sZW5ndGhcbiAgICAgICAgLCAgIF90aHVtYkdyb3Vwc0xpbWl0ID0gNlxuICAgICAgICAsICAgX3RodW1iR3JvdXBOID0gKF90aHVtYk4gPiBfdGh1bWJHcm91cHNMaW1pdCkgPyBNYXRoLmNlaWwoX3RodW1iTiAvIF90aHVtYkdyb3Vwc0xpbWl0KSA6IDFcbiAgICAgICAgLCAgIF90aHVtYlN0YXJ0ID0gMFxuICAgICAgICAsICAgX3RodW1iRW5kID0gX3RodW1iR3JvdXBOXG4gICAgICAgICwgICBfdGh1bWJHcm91cFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ0aHVtYi1ncm91cFwiIC8+J1xuICAgICAgICAsICAgX2VsV2lkdGggPSB0aGlzLmVsZW1lbnQud2lkdGgoKVxuICAgICAgICAsICAgX3RodW1iR3JvdXBMZWZ0ID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgc2V0IC50aHVtYi1ncm91cHMgd2lkdGhcbiAgICAgICAgJHRodW1iR3JvdXBzLmNzcygnd2lkdGgnLCAxMDAgKiBfdGh1bWJHcm91cE4gKyBcIiVcIik7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgZ3JvdXAgLnRodW1iLCBhbmQgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGh1bWJHcm91cE47IGkgKyspIHtcbiAgICAgICAgICAgIC8vIGJlZ2luIGdyb3VwaW5nIHRodW1iXG4gICAgICAgICAgICBfdGh1bWJTdGFydCA9ICgoX3RodW1iR3JvdXBzTGltaXQgKyAwKSAqIGkpO1xuICAgICAgICAgICAgX3RodW1iRW5kID0gX3RodW1iU3RhcnQgKyBfdGh1bWJHcm91cHNMaW1pdDtcbiAgICAgICAgICAgICR0aHVtYnNcbiAgICAgICAgICAgICAgICAuc2xpY2UoIF90aHVtYlN0YXJ0LCBfdGh1bWJFbmQgKVxuICAgICAgICAgICAgICAgIC53cmFwQWxsKF90aHVtYkdyb3VwVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXApICQodGhpcykuYWRkQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyIF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBwcmV2XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mbHQ7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlICA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yXCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGluayByZWNvbG9yXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBuZXh0XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mZ3Q7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICA7XG5cbiAgICAgICAgaWYgKCRwYWdlU2VsZWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gRmlyc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIHByZXZcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIE5leHQ6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG51bVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBfdGh1bWJHcm91cE47IGogKyspIHtcbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGFzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbmV4dFxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghJHBhZ2VTZWxlY3RvcnMuZmluZCgnbGknKS5sZW5ndGgpICRwYWdlU2VsZWN0b3JzLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHNlbGVjdG9yIGhlbHBlcnNcbiAgICAgICAgdmFyICRwYWdlU2VsZWN0b3IgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3RvcicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yUHJldiA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLnByZXYnKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3Rvck5leHQgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5uZXh0JylcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBwcmV2XG4gICAgICAgICRwYWdlU2VsZWN0b3JQcmV2LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ3ByZXYnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBhbmQgdGV4dCBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgICRwYWdlU2VsZWN0b3JcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3RvclByZXYpXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JOZXh0KVxuICAgICAgICAgICAgLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRleHQoKGluZGV4ICsgMSkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpZGUnLCBpbmRleClcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmF1bHQgc3R5bGUgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGVsc2UgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBuZXh0XG4gICAgICAgICRwYWdlU2VsZWN0b3JOZXh0LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ25leHQnKTtcblxuICAgICAgICAvLyBBZGQgZXZlbnQgdG8gcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgJHNlbGVjdG9yID0gJCgpXG4gICAgICAgICwgICBfZGF0YVNsaWRlID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgJHBhZ2VTZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNlbGVjdG9yID0gJCh0aGlzKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJyk7XG4gICAgICAgICAgICAkc2VsZWN0b3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICdwcmV2JykgX2RhdGFTbGlkZSAtLTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICduZXh0JykgX2RhdGFTbGlkZSArKztcbiAgICAgICAgICAgICAgICBlbHNlIF9kYXRhU2xpZGUgPSAkKHRoaXMpLmRhdGEoJ3NsaWRlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoX2RhdGFTbGlkZSA8IDApIF9kYXRhU2xpZGUgPSAwO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKF9kYXRhU2xpZGUgPiAoX3RodW1iR3JvdXBOIC0gMSkpIF9kYXRhU2xpZGUgPSAoX3RodW1iR3JvdXBOIC0gMSk7XG5cbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScsIF9kYXRhU2xpZGUpO1xuICAgICAgICAgICAgICAgIF90aHVtYkdyb3VwTGVmdCA9ICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJykgKiBfZWxXaWR0aDtcbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCAnbGVmdCcsICctJyArIF90aHVtYkdyb3VwTGVmdCArICdweCcgKTtcblxuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3IuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB2YXIgX2xpbmtTZWxlY3RvclN0cmluZyA9ICcucGFnZS1zZWxlY3Rvci1saW5rW2RhdGEtc2xpZGU9XCInICsgX2RhdGFTbGlkZSArICdcIl0nO1xuICAgICAgICAgICAgICAgICQoX2xpbmtTZWxlY3RvclN0cmluZykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXX0=
