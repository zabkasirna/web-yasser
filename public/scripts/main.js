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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1ob21lLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXJlbGF0ZWQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10aHVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUFzc2V0ICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1hc3NldCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgICwgICB1aVRodW1iICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10aHVtYicpXG4gICAgLCAgIHVpUmVsYXRlZCAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXJlbGF0ZWQnKVxuICAgIDtcblxuICAgIC8vIER5bmFtaWMgY29sb3JcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB1aUNvbG9yLmluaXQoKTsgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQXNzZXQuaW5pdCgkKCcuYmFja2dyb3VuZCcpKTtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkgeyB1aUFzc2V0LnJlc2NhbGVJbWFnZSgpOyB9KTtcblxuICAgIC8vIE1haW4gbmF2aWdhdGlvblxuICAgIHZhciAkbmF2cyA9ICQoJyNuYXZpZ2F0aW9uJyk7XG4gICAgaWYgKCRuYXZzLmxlbmd0aCkgdWlOYXZpZ2F0aW9uLmluaXQoJG5hdnMpO1xuXG4gICAgLy8gUGFnZSBuYXZpZ2F0aW9uXG4gICAgaWYgKCQoJy5wYWdlLW5hdmlnYXRpb25zJykubGVuZ3RoKVxuICAgICAgICB1aU5hdmlnYXRpb24uaW5pdFBhZ2VOYXZpZ2F0aW9uKCQoJ3BhZ2UtbmF2aWdhdGlvbnMuaGFzLWluZm9zJykubGVuZ3RoKTtcblxuICAgIC8vIEhvbWVcbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcblxuICAgIC8vIFRodW1ibmFpbHNcbiAgICBpZiAoJCgnLnRodW1icycpLmxlbmd0aCkgdWlUaHVtYi5pbml0KCQoJy50aHVtYnMnKSk7XG5cbiAgICAvLyBSZWxhdGVzXG4gICAgaWYgKCQoJy5yZWxhdGVkcycpLmxlbmd0aCkgdWlSZWxhdGVkLmluaXQoJCgnLnJlbGF0ZWRzJykpO1xuXG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgcHJlbG9hZGVyOiAkKCcjcHJlbG9hZGVycycpLFxuICAgIG5hdHVyYWxIOiAwLFxuICAgIG5hdHVyYWxXOiAwLFxuICAgIGltZ0xvYWRlZDoge30sXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBoYXNWaWRlbyAgICA9IGVsLmRhdGEoJ3ZpZGVvJykgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICAsICAgJHBhcmFsbGF4ZXMgPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICBoYXNQYXJhbGxheCA9ICRwYXJhbGxheGVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQgPSBpbWFnZXNMb2FkZWQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSApO1xuICAgICAgICBzZWxmLmVsZW1lbnQgPSBlbDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZC5vbignYWx3YXlzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHNlbGYubmF0dXJhbEggPSBzZWxmLmVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxXID0gc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cbiAgICAgICAgICAgIHNlbGYucmVzY2FsZUltYWdlKCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1BhcmFsbGF4KSBzZWxmLmluaXRQYXJhbGxheCgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbygpO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICAgICAgJCgnI3ByZWxvYWRlcnMnKS5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQoJyNwcmVsb2FkZXJzJykuY3NzKCd6LWluZGV4JywgJy05MDAwJyk7IH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuZWxlbWVudC5sZW5ndGgpIGNvbnNvbGUud2FybmluZygnbm8gYmFja2dyb3VuZCBpbWFnZScpO1xuXG4gICAgICAgIHZhciBpbWFnZVJhdGlvID0gdGhpcy5uYXR1cmFsVyAvIHRoaXMubmF0dXJhbEhcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICAsICAgcHVzaExlZnRcbiAgICAgICAgLCAgIHB1c2hUb3BcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAwO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLWhlaWdodCcpLmFkZENsYXNzKCdmdWxsLXdpZHRoJyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9IDA7XG4gICAgICAgICAgICBwdXNoVG9wID0gKHRoaXMuZWxlbWVudC5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCArICdweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXRQYXJhbGxheDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgJHBhcmFsbGF4ID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgJGltZ3MgPSAkKCcucGFyYWxsYXgtaW1hZ2UnKVxuICAgICAgICAsICAgX3BoID0gJHBhcmFsbGF4LmhlaWdodCgpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBDZW50ZXIgaW1hZ2UgdmVydGljYWxseSBieSBtYXJnaW5cbiAgICAgICAgJGltZ3MuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKS5jc3MoeyAnbWFyZ2luLXRvcCc6IChfcGggLSAkKHRoaXMpLmhlaWdodCgpKS8yIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLnBhcmFsbGF4aWZ5KHtcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcGVydHk6ICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygkaW1ncy5lcSgwKS5oZWlnaHQoKSwgJHBhcmFsbGF4LmhlaWdodCgpKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgnLnJlY29sb3InKS5sZW5ndGggfHwgISQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuXG4gICAgICAgICAgICB2YXIgX3N2Z09iaiA9ICQodGhpcykuZmluZCgnLm5hdi0xLW9iamVjdCcpWzBdXG4gICAgICAgICAgICAsICAgX3N2Z0RvY1xuICAgICAgICAgICAgLCAgIF9uYXZFbFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBfc3ZnT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfc3ZnRG9jID0gX3N2Z09iai5jb250ZW50RG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgX25hdkVsICA9IF9zdmdEb2MucXVlcnlTZWxlY3RvcignLm5hdmlnYXRpb24tc3ZnJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCh0aGlzKS5ob3ZlcihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZyBob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpLmNsb3Nlc3QoJy5uYXYnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB0b2dnbGU6IGZ1bmN0aW9uKHBhcmVudCwgZWwpIHtcbiAgICAgICAgZWwuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJCh0aGlzKSk7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIGVsc2UgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBlbC50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG4gICAgaW5pdFBhZ2VOYXZpZ2F0aW9uOiAgZnVuY3Rpb24oaGFzSW5mbykge1xuICAgICAgICB2YXIgJGluZm9CdG5Ub2dnbGVycyA9ICQoJy5pbmZvLWJ0bi10b2dnbGVycycpXG4gICAgICAgICwgICAkcGFnZUluZm9zID0gJCgnLnBhZ2UtaW5mb3MnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZzID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbnMnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZMaW5rID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbi1saW5rJylcbiAgICAgICAgO1xuXG4gICAgICAgICRpbmZvQnRuVG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlSW5mb3MubGVuZ3RoKSAkcGFnZUluZm9zLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlU3ViTmF2cy5sZW5ndGgpICRwYWdlU3ViTmF2cy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRwYWdlU3ViTmF2cy5maW5kKCcucGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkaW5mb0J0blRvZ2dsZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuaW5mby1idG4tdG9nZ2xlcltkYXRhLXByb2plY3RdJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcHJvamVjdCcsICQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCgkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAkdG9nZ2xlcjogJCgpLFxuICAgICRyZWxhdGVkRWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLiRyZWxhdGVkRWxlbWVudCA9IGVsO1xuICAgICAgICBzZWxmLnRvZ2dsZXIgPSBlbC5maW5kKCcucmVsYXRlZC10b2dnbGVyJyk7XG5cbiAgICAgICAgc2VsZi50b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGVsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgdmFyIHNlbGYgICAgICAgICAgID0gdGhpc1xuICAgICAgICAsICAgJHRodW1iR3JvdXBzICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iLWdyb3VwcycpXG4gICAgICAgICwgICAkdGh1bWJzICAgICAgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWInKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvcnMgPSAkKCcucGFnZS1uYXZpZ2F0aW9ucy5oYXMtdGh1bWJzIC5wYWdlLXNlbGVjdG9ycycpXG4gICAgICAgICwgICBpc1N3YXAgICAgICAgICA9IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICB2YXIgX3RodW1iTiA9ICR0aHVtYnMubGVuZ3RoXG4gICAgICAgICwgICBfdGh1bWJHcm91cHNMaW1pdCA9IDZcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTiA9IChfdGh1bWJOID4gX3RodW1iR3JvdXBzTGltaXQpID8gTWF0aC5jZWlsKF90aHVtYk4gLyBfdGh1bWJHcm91cHNMaW1pdCkgOiAxXG4gICAgICAgICwgICBfdGh1bWJTdGFydCA9IDBcbiAgICAgICAgLCAgIF90aHVtYkVuZCA9IF90aHVtYkdyb3VwTlxuICAgICAgICAsICAgX3RodW1iR3JvdXBUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwidGh1bWItZ3JvdXBcIiAvPidcbiAgICAgICAgLCAgIF9lbFdpZHRoID0gdGhpcy5lbGVtZW50LndpZHRoKClcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTGVmdCA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IHNldCAudGh1bWItZ3JvdXBzIHdpZHRoXG4gICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoJ3dpZHRoJywgMTAwICogX3RodW1iR3JvdXBOICsgXCIlXCIpO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGdyb3VwIC50aHVtYiwgYW5kIGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RodW1iR3JvdXBOOyBpICsrKSB7XG4gICAgICAgICAgICAvLyBiZWdpbiBncm91cGluZyB0aHVtYlxuICAgICAgICAgICAgX3RodW1iU3RhcnQgPSAoKF90aHVtYkdyb3Vwc0xpbWl0ICsgMCkgKiBpKTtcbiAgICAgICAgICAgIF90aHVtYkVuZCA9IF90aHVtYlN0YXJ0ICsgX3RodW1iR3JvdXBzTGltaXQ7XG4gICAgICAgICAgICAkdGh1bWJzXG4gICAgICAgICAgICAgICAgLnNsaWNlKCBfdGh1bWJTdGFydCwgX3RodW1iRW5kIClcbiAgICAgICAgICAgICAgICAud3JhcEFsbChfdGh1bWJHcm91cFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSB0aHVtYiBpbWFnZS90ZXh0IHBvc2l0aW9uXG4gICAgICAgICR0aHVtYnMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgICAgICBpc1N3YXAgPSBNYXRoLnJhbmRvbSgpID49IDAuNSA/IGlzU3dhcCA6ICFpc1N3YXA7XG4gICAgICAgICAgICBpZiAoaXNTd2FwKSAkKHRoaXMpLmFkZENsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciBfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgcHJldlwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmx0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSAgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvclwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmsgcmVjb2xvclwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgbmV4dFwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmd0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICgkcGFnZVNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIEZpcnN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBwcmV2XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAvLyBOZXh0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBudW1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgX3RodW1iR3JvdXBOOyBqICsrKSB7XG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExhc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG5leHRcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISRwYWdlU2VsZWN0b3JzLmZpbmQoJ2xpJykubGVuZ3RoKSAkcGFnZVNlbGVjdG9ycy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIERlZmluZSBzZWxlY3RvciBoZWxwZXJzXG4gICAgICAgIHZhciAkcGFnZVNlbGVjdG9yID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3InKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvclByZXYgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5wcmV2JylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JOZXh0ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IubmV4dCcpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgcHJldlxuICAgICAgICAkcGFnZVNlbGVjdG9yUHJldi5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICdwcmV2Jyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgYW5kIHRleHQgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICAkcGFnZVNlbGVjdG9yXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JQcmV2KVxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yTmV4dClcbiAgICAgICAgICAgIC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC50ZXh0KChpbmRleCArIDEpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWRlJywgaW5kZXgpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZhdWx0IHN0eWxlIGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBlbHNlICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgbmV4dFxuICAgICAgICAkcGFnZVNlbGVjdG9yTmV4dC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICduZXh0Jyk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IHRvIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyICRzZWxlY3RvciA9ICQoKVxuICAgICAgICAsICAgX2RhdGFTbGlkZSA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgICRwYWdlU2VsZWN0b3IuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICQodGhpcykuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpO1xuICAgICAgICAgICAgJHNlbGVjdG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAncHJldicpIF9kYXRhU2xpZGUgLS07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAnbmV4dCcpIF9kYXRhU2xpZGUgKys7XG4gICAgICAgICAgICAgICAgZWxzZSBfZGF0YVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhU2xpZGUgPCAwKSBfZGF0YVNsaWRlID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfZGF0YVNsaWRlID4gKF90aHVtYkdyb3VwTiAtIDEpKSBfZGF0YVNsaWRlID0gKF90aHVtYkdyb3VwTiAtIDEpO1xuXG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnLCBfZGF0YVNsaWRlKTtcbiAgICAgICAgICAgICAgICBfdGh1bWJHcm91cExlZnQgPSAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScpICogX2VsV2lkdGg7XG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmNzcyggJ2xlZnQnLCAnLScgKyBfdGh1bWJHcm91cExlZnQgKyAncHgnICk7XG5cbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9yLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdmFyIF9saW5rU2VsZWN0b3JTdHJpbmcgPSAnLnBhZ2Utc2VsZWN0b3ItbGlua1tkYXRhLXNsaWRlPVwiJyArIF9kYXRhU2xpZGUgKyAnXCJdJztcbiAgICAgICAgICAgICAgICAkKF9saW5rU2VsZWN0b3JTdHJpbmcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIl19
