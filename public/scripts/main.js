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
    ;

    // Dynamic color
    setTimeout(function() {
        uiColor.init();
    }, 100);

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
})(jQuery);

},{"./module/helper/debounce":2,"./module/ui/ui-asset":3,"./module/ui/ui-color":4,"./module/ui/ui-home":5,"./module/ui/ui-navigation":6,"./module/ui/ui-thumb":7}],2:[function(require,module,exports){
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
            $(this).on('click', function(e) {
                e.preventDefault();
                _scope.toggle(el, $(this));
            });
        });
    },
    toggle: function(parent, el) {
        var $lists = parent.find('.nav').not(el.parent());
        $lists.each(function(index) {
            if($(this).hasClass('open')) $(this).removeClass('open');
        });

        el.closest('li').toggleClass('open');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL2NsaWVudC9zY3JpcHRzL21haW4iLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvaGVscGVyL2RlYm91bmNlLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWNvbG9yLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10aHVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKlxcXG4gKiBNYWluIHNjcmlwdC5cbiAqIGNsaWVudC9tYWluLmpzXG4gKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbjsoIGZ1bmN0aW9uKCAkICkge1xuICAgIHZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vbW9kdWxlL2hlbHBlci9kZWJvdW5jZScpO1xuXG4gICAgdmFyIHVpQXNzZXQgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWFzc2V0JylcbiAgICAsICAgdWlDb2xvciAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktY29sb3InKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktaG9tZScpXG4gICAgLCAgIHVpVGh1bWIgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXRodW1iJylcbiAgICA7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdWlDb2xvci5pbml0KCk7XG4gICAgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQXNzZXQuaW5pdCgkKCcuYmFja2dyb3VuZCcpKTtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkgeyB1aUFzc2V0LnJlc2NhbGVJbWFnZSgpOyB9KTtcblxuICAgIC8vIE1haW4gbmF2aWdhdGlvblxuICAgIHZhciAkbmF2cyA9ICQoJyNuYXZpZ2F0aW9uJyk7XG4gICAgaWYgKCRuYXZzLmxlbmd0aCkgdWlOYXZpZ2F0aW9uLmluaXQoJG5hdnMpO1xuXG4gICAgLy8gUGFnZSBuYXZpZ2F0aW9uXG4gICAgaWYgKCQoJy5wYWdlLW5hdmlnYXRpb25zJykubGVuZ3RoKVxuICAgICAgICB1aU5hdmlnYXRpb24uaW5pdFBhZ2VOYXZpZ2F0aW9uKCQoJ3BhZ2UtbmF2aWdhdGlvbnMuaGFzLWluZm9zJykubGVuZ3RoKTtcblxuICAgIC8vIEhvbWVcbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcblxuICAgIC8vIFRodW1ibmFpbHNcbiAgICBpZiAoJCgnLnRodW1icycpLmxlbmd0aCkgdWlUaHVtYi5pbml0KCQoJy50aHVtYnMnKSk7XG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgcHJlbG9hZGVyOiAkKCcjcHJlbG9hZGVycycpLFxuICAgIG5hdHVyYWxIOiAwLFxuICAgIG5hdHVyYWxXOiAwLFxuICAgIGltZ0xvYWRlZDoge30sXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBoYXNWaWRlbyAgICA9IGVsLmRhdGEoJ3ZpZGVvJykgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICAsICAgJHBhcmFsbGF4ZXMgPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICBoYXNQYXJhbGxheCA9ICRwYXJhbGxheGVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQgPSBpbWFnZXNMb2FkZWQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSApO1xuICAgICAgICBzZWxmLmVsZW1lbnQgPSBlbDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZC5vbignYWx3YXlzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHNlbGYubmF0dXJhbEggPSBzZWxmLmVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxXID0gc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cbiAgICAgICAgICAgIHNlbGYucmVzY2FsZUltYWdlKCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1BhcmFsbGF4KSBzZWxmLmluaXRQYXJhbGxheCgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbygpO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICAgICAgJCgnI3ByZWxvYWRlcnMnKS5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQoJyNwcmVsb2FkZXJzJykuY3NzKCd6LWluZGV4JywgJy05MDAwJyk7IH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuZWxlbWVudC5sZW5ndGgpIGNvbnNvbGUud2FybmluZygnbm8gYmFja2dyb3VuZCBpbWFnZScpO1xuXG4gICAgICAgIHZhciBpbWFnZVJhdGlvID0gdGhpcy5uYXR1cmFsVyAvIHRoaXMubmF0dXJhbEhcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICAsICAgcHVzaExlZnRcbiAgICAgICAgLCAgIHB1c2hUb3BcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAwO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLWhlaWdodCcpLmFkZENsYXNzKCdmdWxsLXdpZHRoJyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9IDA7XG4gICAgICAgICAgICBwdXNoVG9wID0gKHRoaXMuZWxlbWVudC5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCArICdweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXRQYXJhbGxheDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgJHBhcmFsbGF4ID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgJGltZ3MgPSAkKCcucGFyYWxsYXgtaW1hZ2UnKVxuICAgICAgICAsICAgX3BoID0gJHBhcmFsbGF4LmhlaWdodCgpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBDZW50ZXIgaW1hZ2UgdmVydGljYWxseSBieSBtYXJnaW5cbiAgICAgICAgJGltZ3MuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKS5jc3MoeyAnbWFyZ2luLXRvcCc6IChfcGggLSAkKHRoaXMpLmhlaWdodCgpKS8yIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLnBhcmFsbGF4aWZ5KHtcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcGVydHk6ICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygkaW1ncy5lcSgwKS5oZWlnaHQoKSwgJHBhcmFsbGF4LmhlaWdodCgpKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgnLnJlY29sb3InKS5sZW5ndGggfHwgISQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwYXJlbnQsIGVsKSB7XG4gICAgICAgIHZhciAkbGlzdHMgPSBwYXJlbnQuZmluZCgnLm5hdicpLm5vdChlbC5wYXJlbnQoKSk7XG4gICAgICAgICRsaXN0cy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWwuY2xvc2VzdCgnbGknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG4gICAgaW5pdFBhZ2VOYXZpZ2F0aW9uOiAgZnVuY3Rpb24oaGFzSW5mbykge1xuICAgICAgICB2YXIgJGluZm9CdG5Ub2dnbGVycyA9ICQoJy5pbmZvLWJ0bi10b2dnbGVycycpXG4gICAgICAgICwgICAkcGFnZUluZm9zID0gJCgnLnBhZ2UtaW5mb3MnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZzID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbnMnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZMaW5rID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbi1saW5rJylcbiAgICAgICAgO1xuXG4gICAgICAgICRpbmZvQnRuVG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlSW5mb3MubGVuZ3RoKSAkcGFnZUluZm9zLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlU3ViTmF2cy5sZW5ndGgpICRwYWdlU3ViTmF2cy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRwYWdlU3ViTmF2cy5maW5kKCcucGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkaW5mb0J0blRvZ2dsZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuaW5mby1idG4tdG9nZ2xlcltkYXRhLXByb2plY3RdJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcHJvamVjdCcsICQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCgkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgICAgIHZhciBzZWxmICAgICAgICAgICA9IHRoaXNcbiAgICAgICAgLCAgICR0aHVtYkdyb3VwcyAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYi1ncm91cHMnKVxuICAgICAgICAsICAgJHRodW1icyAgICAgICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JzID0gJCgnLnBhZ2UtbmF2aWdhdGlvbnMuaGFzLXRodW1icyAucGFnZS1zZWxlY3RvcnMnKVxuICAgICAgICAsICAgaXNTd2FwICAgICAgICAgPSBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgdmFyIF90aHVtYk4gPSAkdGh1bWJzLmxlbmd0aFxuICAgICAgICAsICAgX3RodW1iR3JvdXBzTGltaXQgPSA2XG4gICAgICAgICwgICBfdGh1bWJHcm91cE4gPSAoX3RodW1iTiA+IF90aHVtYkdyb3Vwc0xpbWl0KSA/IE1hdGguY2VpbChfdGh1bWJOIC8gX3RodW1iR3JvdXBzTGltaXQpIDogMVxuICAgICAgICAsICAgX3RodW1iU3RhcnQgPSAwXG4gICAgICAgICwgICBfdGh1bWJFbmQgPSBfdGh1bWJHcm91cE5cbiAgICAgICAgLCAgIF90aHVtYkdyb3VwVGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInRodW1iLWdyb3VwXCIgLz4nXG4gICAgICAgICwgICBfZWxXaWR0aCA9IHRoaXMuZWxlbWVudC53aWR0aCgpXG4gICAgICAgICwgICBfdGh1bWJHcm91cExlZnQgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBzZXQgLnRodW1iLWdyb3VwcyB3aWR0aFxuICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCd3aWR0aCcsIDEwMCAqIF90aHVtYkdyb3VwTiArIFwiJVwiKTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBncm91cCAudGh1bWIsIGFuZCBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aHVtYkdyb3VwTjsgaSArKykge1xuICAgICAgICAgICAgLy8gYmVnaW4gZ3JvdXBpbmcgdGh1bWJcbiAgICAgICAgICAgIF90aHVtYlN0YXJ0ID0gKChfdGh1bWJHcm91cHNMaW1pdCArIDApICogaSk7XG4gICAgICAgICAgICBfdGh1bWJFbmQgPSBfdGh1bWJTdGFydCArIF90aHVtYkdyb3Vwc0xpbWl0O1xuICAgICAgICAgICAgJHRodW1ic1xuICAgICAgICAgICAgICAgIC5zbGljZSggX3RodW1iU3RhcnQsIF90aHVtYkVuZCApXG4gICAgICAgICAgICAgICAgLndyYXBBbGwoX3RodW1iR3JvdXBUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSYW5kb21pemUgdGh1bWIgaW1hZ2UvdGV4dCBwb3NpdGlvblxuICAgICAgICAkdGh1bWJzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICAgICAgaXNTd2FwID0gTWF0aC5yYW5kb20oKSA+PSAwLjUgPyBpc1N3YXAgOiAhaXNTd2FwO1xuICAgICAgICAgICAgaWYgKGlzU3dhcCkgJCh0aGlzKS5hZGRDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIHByZXZcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZsdDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUgID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3JcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rIHJlY29sb3JcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIG5leHRcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZndDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoJHBhZ2VTZWxlY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBGaXJzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgcHJldlxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlKTtcblxuICAgICAgICAgICAgLy8gTmV4dDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbnVtXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF90aHVtYkdyb3VwTjsgaiArKykge1xuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMYXN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBuZXh0XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEkcGFnZVNlbGVjdG9ycy5maW5kKCdsaScpLmxlbmd0aCkgJHBhZ2VTZWxlY3RvcnMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBEZWZpbmUgc2VsZWN0b3IgaGVscGVyc1xuICAgICAgICB2YXIgJHBhZ2VTZWxlY3RvciA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JQcmV2ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IucHJldicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yTmV4dCA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLm5leHQnKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIHByZXZcbiAgICAgICAgJHBhZ2VTZWxlY3RvclByZXYuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAncHJldicpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGFuZCB0ZXh0IGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgJHBhZ2VTZWxlY3RvclxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yUHJldilcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3Rvck5leHQpXG4gICAgICAgICAgICAuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAudGV4dCgoaW5kZXggKyAxKSlcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGlkZScsIGluZGV4KVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCBzdHlsZSBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIG5leHRcbiAgICAgICAgJHBhZ2VTZWxlY3Rvck5leHQuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAnbmV4dCcpO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCB0byBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciAkc2VsZWN0b3IgPSAkKClcbiAgICAgICAgLCAgIF9kYXRhU2xpZGUgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAkcGFnZVNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2VsZWN0b3IgPSAkKHRoaXMpLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKTtcbiAgICAgICAgICAgICRzZWxlY3Rvci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ3ByZXYnKSBfZGF0YVNsaWRlIC0tO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ25leHQnKSBfZGF0YVNsaWRlICsrO1xuICAgICAgICAgICAgICAgIGVsc2UgX2RhdGFTbGlkZSA9ICQodGhpcykuZGF0YSgnc2xpZGUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChfZGF0YVNsaWRlIDwgMCkgX2RhdGFTbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2RhdGFTbGlkZSA+IChfdGh1bWJHcm91cE4gLSAxKSkgX2RhdGFTbGlkZSA9IChfdGh1bWJHcm91cE4gLSAxKTtcblxuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJywgX2RhdGFTbGlkZSk7XG4gICAgICAgICAgICAgICAgX3RodW1iR3JvdXBMZWZ0ID0gJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnKSAqIF9lbFdpZHRoO1xuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoICdsZWZ0JywgJy0nICsgX3RodW1iR3JvdXBMZWZ0ICsgJ3B4JyApO1xuXG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3Rvci5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciBfbGlua1NlbGVjdG9yU3RyaW5nID0gJy5wYWdlLXNlbGVjdG9yLWxpbmtbZGF0YS1zbGlkZT1cIicgKyBfZGF0YVNsaWRlICsgJ1wiXSc7XG4gICAgICAgICAgICAgICAgJChfbGlua1NlbGVjdG9yU3RyaW5nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
