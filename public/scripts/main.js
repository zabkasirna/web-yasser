(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    ,   uiThumb      = require('./module/ui/ui-thumb')
    ;

    // Dynamic color
    setTimeout(function() {
        uiColor.init();
    }, 100);

    // Background
    if ($('.background').length) uiBackground.init($('.background'));

    // Navigations
    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    if ($('.page-navigations').length) {
        uiNavigation.initPageNavigation($('page-navigations.has-infos').length);
    }

    // Home
    uiHome.init($('#home-heros'));

    // Thumbnails
    if ($('.thumbs').length) uiThumb.init($('.thumbs'));

    $(window).on('resize', function() {
        if ($('.background').length) uiBackground.rescaleImage();
    });
})(jQuery);

},{"./module/helper/debounce":2,"./module/ui/ui-background":3,"./module/ui/ui-color":4,"./module/ui/ui-home":5,"./module/ui/ui-navigation":6,"./module/ui/ui-thumb":7}],2:[function(require,module,exports){
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
    naturalH: 0,
    naturalW: 0,
    init: function(el) {
        var self = this
        ,   imgLoaded   = imagesLoaded( document.querySelector('body') )
        ,   $preloader  = $('#preloaders')
        ;

        self.element = el;

        imgLoaded.on('always', function() {

            self.naturalH = self.element.height();
            self.naturalW = self.element.width();

            self.rescaleImage();
            
            if (!self.element.data('video')) $preloader.addClass('page-loaded');

            setTimeout(function() {
                if (!self.element.data('video')) $preloader.css('z-index', '-9000');
                else self.loadVideo(self.element.data('video'));
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
            
            setTimeout(function() {
                $('#preloaders').css('z-index', '-9000');
            }, 1000);
        });
    },
    rescaleImage: function() {
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
    }
};


/*
    w / h  =  2 / 3 * 3 / 2 = w / w
*/

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
        ;

        $infoBtnTogglers.on('click', function() {
            $(this).toggleClass('is-active');
            $pageInfos.toggleClass('is-active');
            console.log($pageInfos);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1jb2xvci5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdGh1bWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUJhY2tncm91bmQgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1iYWNrZ3JvdW5kJylcbiAgICAsICAgdWlDb2xvciAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktY29sb3InKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktaG9tZScpXG4gICAgLCAgIHVpVGh1bWIgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXRodW1iJylcbiAgICA7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdWlDb2xvci5pbml0KCk7XG4gICAgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQmFja2dyb3VuZC5pbml0KCQoJy5iYWNrZ3JvdW5kJykpO1xuXG4gICAgLy8gTmF2aWdhdGlvbnNcbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIGlmICgkKCcucGFnZS1uYXZpZ2F0aW9ucycpLmxlbmd0aCkge1xuICAgICAgICB1aU5hdmlnYXRpb24uaW5pdFBhZ2VOYXZpZ2F0aW9uKCQoJ3BhZ2UtbmF2aWdhdGlvbnMuaGFzLWluZm9zJykubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBIb21lXG4gICAgdWlIb21lLmluaXQoJCgnI2hvbWUtaGVyb3MnKSk7XG5cbiAgICAvLyBUaHVtYm5haWxzXG4gICAgaWYgKCQoJy50aHVtYnMnKS5sZW5ndGgpIHVpVGh1bWIuaW5pdCgkKCcudGh1bWJzJykpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUJhY2tncm91bmQucmVzY2FsZUltYWdlKCk7XG4gICAgfSk7XG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgbmF0dXJhbEg6IDAsXG4gICAgbmF0dXJhbFc6IDAsXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBpbWdMb2FkZWQgICA9IGltYWdlc0xvYWRlZCggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpIClcbiAgICAgICAgLCAgICRwcmVsb2FkZXIgID0gJCgnI3ByZWxvYWRlcnMnKVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5lbGVtZW50ID0gZWw7XG5cbiAgICAgICAgaW1nTG9hZGVkLm9uKCdhbHdheXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc2VsZi5uYXR1cmFsSCA9IHNlbGYuZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHNlbGYubmF0dXJhbFcgPSBzZWxmLmVsZW1lbnQud2lkdGgoKTtcblxuICAgICAgICAgICAgc2VsZi5yZXNjYWxlSW1hZ2UoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFzZWxmLmVsZW1lbnQuZGF0YSgndmlkZW8nKSkgJHByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKSAkcHJlbG9hZGVyLmNzcygnei1pbmRleCcsICctOTAwMCcpO1xuICAgICAgICAgICAgICAgIGVsc2Ugc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbygpO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICAgICAgJCgnI3ByZWxvYWRlcnMnKS5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcjcHJlbG9hZGVycycpLmNzcygnei1pbmRleCcsICctOTAwMCcpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzY2FsZUltYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGltYWdlUmF0aW8gPSB0aGlzLm5hdHVyYWxXIC8gdGhpcy5uYXR1cmFsSFxuICAgICAgICAsICAgdmlld3BvcnRSYXRpbyA9ICQod2luZG93KS53aWR0aCgpIC8gJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgICAgICwgICBwdXNoTGVmdFxuICAgICAgICAsICAgcHVzaFRvcFxuICAgICAgICA7XG5cbiAgICAgICAgaWYgKHZpZXdwb3J0UmF0aW8gPCBpbWFnZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtd2lkdGgnKS5hZGRDbGFzcygnZnVsbC1oZWlnaHQnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gKCBpbWFnZVJhdGlvICogJCh3aW5kb3cpLmhlaWdodCgpIC0gJCh3aW5kb3cpLndpZHRoKCkgKSAvIC0yO1xuICAgICAgICAgICAgcHVzaFRvcCA9IDA7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gMDtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAodGhpcy5lbGVtZW50LmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpKSAvIC0yO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLypcbiAgICB3IC8gaCAgPSAgMiAvIDMgKiAzIC8gMiA9IHcgLyB3XG4qL1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgnLnJlY29sb3InKS5sZW5ndGggfHwgISQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwYXJlbnQsIGVsKSB7XG4gICAgICAgIHZhciAkbGlzdHMgPSBwYXJlbnQuZmluZCgnLm5hdicpLm5vdChlbC5wYXJlbnQoKSk7XG4gICAgICAgICRsaXN0cy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWwuY2xvc2VzdCgnbGknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG4gICAgaW5pdFBhZ2VOYXZpZ2F0aW9uOiAgZnVuY3Rpb24oaGFzSW5mbykge1xuICAgICAgICB2YXIgJGluZm9CdG5Ub2dnbGVycyA9ICQoJy5pbmZvLWJ0bi10b2dnbGVycycpXG4gICAgICAgICwgICAkcGFnZUluZm9zID0gJCgnLnBhZ2UtaW5mb3MnKVxuICAgICAgICA7XG5cbiAgICAgICAgJGluZm9CdG5Ub2dnbGVycy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJHBhZ2VJbmZvcy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkcGFnZUluZm9zKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgdmFyIHNlbGYgICAgICAgICAgID0gdGhpc1xuICAgICAgICAsICAgJHRodW1iR3JvdXBzICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iLWdyb3VwcycpXG4gICAgICAgICwgICAkdGh1bWJzICAgICAgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWInKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvcnMgPSAkKCcucGFnZS1uYXZpZ2F0aW9ucy5oYXMtdGh1bWJzIC5wYWdlLXNlbGVjdG9ycycpXG4gICAgICAgICwgICBpc1N3YXAgICAgICAgICA9IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICB2YXIgX3RodW1iTiA9ICR0aHVtYnMubGVuZ3RoXG4gICAgICAgICwgICBfdGh1bWJHcm91cHNMaW1pdCA9IDZcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTiA9IChfdGh1bWJOID4gX3RodW1iR3JvdXBzTGltaXQpID8gTWF0aC5jZWlsKF90aHVtYk4gLyBfdGh1bWJHcm91cHNMaW1pdCkgOiAxXG4gICAgICAgICwgICBfdGh1bWJTdGFydCA9IDBcbiAgICAgICAgLCAgIF90aHVtYkVuZCA9IF90aHVtYkdyb3VwTlxuICAgICAgICAsICAgX3RodW1iR3JvdXBUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwidGh1bWItZ3JvdXBcIiAvPidcbiAgICAgICAgLCAgIF9lbFdpZHRoID0gdGhpcy5lbGVtZW50LndpZHRoKClcbiAgICAgICAgLCAgIF90aHVtYkdyb3VwTGVmdCA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IHNldCAudGh1bWItZ3JvdXBzIHdpZHRoXG4gICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoJ3dpZHRoJywgMTAwICogX3RodW1iR3JvdXBOICsgXCIlXCIpO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGdyb3VwIC50aHVtYiwgYW5kIGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RodW1iR3JvdXBOOyBpICsrKSB7XG4gICAgICAgICAgICAvLyBiZWdpbiBncm91cGluZyB0aHVtYlxuICAgICAgICAgICAgX3RodW1iU3RhcnQgPSAoKF90aHVtYkdyb3Vwc0xpbWl0ICsgMCkgKiBpKTtcbiAgICAgICAgICAgIF90aHVtYkVuZCA9IF90aHVtYlN0YXJ0ICsgX3RodW1iR3JvdXBzTGltaXQ7XG4gICAgICAgICAgICAkdGh1bWJzXG4gICAgICAgICAgICAgICAgLnNsaWNlKCBfdGh1bWJTdGFydCwgX3RodW1iRW5kIClcbiAgICAgICAgICAgICAgICAud3JhcEFsbChfdGh1bWJHcm91cFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSB0aHVtYiBpbWFnZS90ZXh0IHBvc2l0aW9uXG4gICAgICAgICR0aHVtYnMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgICAgICBpc1N3YXAgPSBNYXRoLnJhbmRvbSgpID49IDAuNSA/IGlzU3dhcCA6ICFpc1N3YXA7XG4gICAgICAgICAgICBpZiAoaXNTd2FwKSAkKHRoaXMpLmFkZENsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciBfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgcHJldlwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmx0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSAgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvclwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmsgcmVjb2xvclwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgbmV4dFwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmd0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICgkcGFnZVNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIEZpcnN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBwcmV2XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAvLyBOZXh0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBudW1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgX3RodW1iR3JvdXBOOyBqICsrKSB7XG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExhc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG5leHRcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISRwYWdlU2VsZWN0b3JzLmZpbmQoJ2xpJykubGVuZ3RoKSAkcGFnZVNlbGVjdG9ycy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIERlZmluZSBzZWxlY3RvciBoZWxwZXJzXG4gICAgICAgIHZhciAkcGFnZVNlbGVjdG9yID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3InKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvclByZXYgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5wcmV2JylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JOZXh0ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IubmV4dCcpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgcHJldlxuICAgICAgICAkcGFnZVNlbGVjdG9yUHJldi5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICdwcmV2Jyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgYW5kIHRleHQgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICAkcGFnZVNlbGVjdG9yXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JQcmV2KVxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yTmV4dClcbiAgICAgICAgICAgIC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC50ZXh0KChpbmRleCArIDEpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWRlJywgaW5kZXgpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZhdWx0IHN0eWxlIGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBlbHNlICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgbmV4dFxuICAgICAgICAkcGFnZVNlbGVjdG9yTmV4dC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICduZXh0Jyk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IHRvIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyICRzZWxlY3RvciA9ICQoKVxuICAgICAgICAsICAgX2RhdGFTbGlkZSA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgICRwYWdlU2VsZWN0b3IuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICQodGhpcykuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpO1xuICAgICAgICAgICAgJHNlbGVjdG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAncHJldicpIF9kYXRhU2xpZGUgLS07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAnbmV4dCcpIF9kYXRhU2xpZGUgKys7XG4gICAgICAgICAgICAgICAgZWxzZSBfZGF0YVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhU2xpZGUgPCAwKSBfZGF0YVNsaWRlID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfZGF0YVNsaWRlID4gKF90aHVtYkdyb3VwTiAtIDEpKSBfZGF0YVNsaWRlID0gKF90aHVtYkdyb3VwTiAtIDEpO1xuXG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnLCBfZGF0YVNsaWRlKTtcbiAgICAgICAgICAgICAgICBfdGh1bWJHcm91cExlZnQgPSAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScpICogX2VsV2lkdGg7XG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmNzcyggJ2xlZnQnLCAnLScgKyBfdGh1bWJHcm91cExlZnQgKyAncHgnICk7XG5cbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9yLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdmFyIF9saW5rU2VsZWN0b3JTdHJpbmcgPSAnLnBhZ2Utc2VsZWN0b3ItbGlua1tkYXRhLXNsaWRlPVwiJyArIF9kYXRhU2xpZGUgKyAnXCJdJztcbiAgICAgICAgICAgICAgICAkKF9saW5rU2VsZWN0b3JTdHJpbmcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIl19
