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
            $preloader.addClass('page-loaded');

            setTimeout(function() {
                $preloader.css('z-index', '-9000');

                if (self.element.data('video')) {
                    self.loadVideo(self.element.data('video'));
                }

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

        console.log('pushTop', pushTop);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1jb2xvci5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdGh1bWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUJhY2tncm91bmQgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1iYWNrZ3JvdW5kJylcbiAgICAsICAgdWlDb2xvciAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktY29sb3InKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktaG9tZScpXG4gICAgLCAgIHVpVGh1bWIgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXRodW1iJylcbiAgICA7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdWlDb2xvci5pbml0KCk7XG4gICAgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQmFja2dyb3VuZC5pbml0KCQoJy5iYWNrZ3JvdW5kJykpO1xuXG4gICAgLy8gTmF2aWdhdGlvbnNcbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIC8vIEhvbWVcbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcblxuICAgIC8vIFRodW1ibmFpbHNcbiAgICBpZiAoJCgnLnRodW1icycpLmxlbmd0aCkgdWlUaHVtYi5pbml0KCQoJy50aHVtYnMnKSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQmFja2dyb3VuZC5yZXNjYWxlSW1hZ2UoKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBuYXR1cmFsSDogMCxcbiAgICBuYXR1cmFsVzogMCxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgIGltZ0xvYWRlZCAgID0gaW1hZ2VzTG9hZGVkKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykgKVxuICAgICAgICAsICAgJHByZWxvYWRlciAgPSAkKCcjcHJlbG9hZGVycycpXG4gICAgICAgIDtcblxuICAgICAgICBzZWxmLmVsZW1lbnQgPSBlbDtcblxuICAgICAgICBpbWdMb2FkZWQub24oJ2Fsd2F5cycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxIID0gc2VsZi5lbGVtZW50LmhlaWdodCgpO1xuICAgICAgICAgICAgc2VsZi5uYXR1cmFsVyA9IHNlbGYuZWxlbWVudC53aWR0aCgpO1xuXG4gICAgICAgICAgICBzZWxmLnJlc2NhbGVJbWFnZSgpO1xuICAgICAgICAgICAgJHByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcHJlbG9hZGVyLmNzcygnei1pbmRleCcsICctOTAwMCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZFZpZGVvKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGxvYWRWaWRlbzogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGlzVG91Y2ggPSBNb2Rlcm5penIudG91Y2g7XG4gICAgICAgIGlmIChpc1RvdWNoKSByZXR1cm47XG5cbiAgICAgICAgdmFyIEJWU291cmNlcyA9IFtdXG4gICAgICAgICwgICBCVlNvdXJjZXNUeXBlID0gWydtcDQnLCAnd2VibScsICdvZ3YnXVxuICAgICAgICA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCVlNvdXJjZXNUeXBlLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgQlZTb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2aWRlby8nICsgQlZTb3VyY2VzVHlwZVtpXSxcbiAgICAgICAgICAgICAgICBzcmM6IHVybCArICcuJyArIEJWU291cmNlc1R5cGVbaV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEJWID0gbmV3ICQuQmlnVmlkZW8oKTtcbiAgICAgICAgQlYuaW5pdCgpO1xuICAgICAgICBCVi5zaG93KEJWU291cmNlcywge1xuICAgICAgICAgICAgYW1iaWVudDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBCVi5nZXRQbGF5ZXIoKS5vbignbG9hZGVkZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5lbGVtZW50LmFkZENsYXNzKCd2aWRlby1sb2FkZWQnKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNjYWxlSW1hZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMubmF0dXJhbFcgLyB0aGlzLm5hdHVyYWxIXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgLCAgIHB1c2hMZWZ0XG4gICAgICAgICwgICBwdXNoVG9wXG4gICAgICAgIDtcblxuICAgICAgICBpZiAodmlld3BvcnRSYXRpbyA8IGltYWdlUmF0aW8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC13aWR0aCcpLmFkZENsYXNzKCdmdWxsLWhlaWdodCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAoIGltYWdlUmF0aW8gKiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKHdpbmRvdykud2lkdGgoKSApIC8gLTI7XG4gICAgICAgICAgICBwdXNoVG9wID0gMDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC1oZWlnaHQnKS5hZGRDbGFzcygnZnVsbC13aWR0aCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAwO1xuICAgICAgICAgICAgcHVzaFRvcCA9ICh0aGlzLmVsZW1lbnQuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpIC8gLTI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AgKyAncHgnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3B1c2hUb3AnLCBwdXNoVG9wKTtcbiAgICB9XG59O1xuXG5cbi8qXG4gICAgdyAvIGggID0gIDIgLyAzICogMyAvIDIgPSB3IC8gd1xuKi9cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoJy5yZWNvbG9yJykubGVuZ3RoIHx8ICEkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBCYWNrZ3JvdW5kQ2hlY2suaW5pdCh7XG4gICAgICAgICAgICB0YXJnZXRzOiAnLnJlY29sb3InXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2LTEnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICB2YXIgJGxpc3RzID0gcGFyZW50LmZpbmQoJy5uYXYnKS5ub3QoZWwucGFyZW50KCkpO1xuICAgICAgICAkbGlzdHMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsLmNsb3Nlc3QoJ2xpJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgICB2YXIgc2VsZiAgICAgICAgICAgPSB0aGlzXG4gICAgICAgICwgICAkdGh1bWJHcm91cHMgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWItZ3JvdXBzJylcbiAgICAgICAgLCAgICR0aHVtYnMgICAgICAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9ycyA9ICQoJy5wYWdlLW5hdmlnYXRpb25zLmhhcy10aHVtYnMgLnBhZ2Utc2VsZWN0b3JzJylcbiAgICAgICAgLCAgIGlzU3dhcCAgICAgICAgID0gZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHZhciBfdGh1bWJOID0gJHRodW1icy5sZW5ndGhcbiAgICAgICAgLCAgIF90aHVtYkdyb3Vwc0xpbWl0ID0gNlxuICAgICAgICAsICAgX3RodW1iR3JvdXBOID0gKF90aHVtYk4gPiBfdGh1bWJHcm91cHNMaW1pdCkgPyBNYXRoLmNlaWwoX3RodW1iTiAvIF90aHVtYkdyb3Vwc0xpbWl0KSA6IDFcbiAgICAgICAgLCAgIF90aHVtYlN0YXJ0ID0gMFxuICAgICAgICAsICAgX3RodW1iRW5kID0gX3RodW1iR3JvdXBOXG4gICAgICAgICwgICBfdGh1bWJHcm91cFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ0aHVtYi1ncm91cFwiIC8+J1xuICAgICAgICAsICAgX2VsV2lkdGggPSB0aGlzLmVsZW1lbnQud2lkdGgoKVxuICAgICAgICAsICAgX3RodW1iR3JvdXBMZWZ0ID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgc2V0IC50aHVtYi1ncm91cHMgd2lkdGhcbiAgICAgICAgJHRodW1iR3JvdXBzLmNzcygnd2lkdGgnLCAxMDAgKiBfdGh1bWJHcm91cE4gKyBcIiVcIik7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgZ3JvdXAgLnRodW1iLCBhbmQgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGh1bWJHcm91cE47IGkgKyspIHtcbiAgICAgICAgICAgIC8vIGJlZ2luIGdyb3VwaW5nIHRodW1iXG4gICAgICAgICAgICBfdGh1bWJTdGFydCA9ICgoX3RodW1iR3JvdXBzTGltaXQgKyAwKSAqIGkpO1xuICAgICAgICAgICAgX3RodW1iRW5kID0gX3RodW1iU3RhcnQgKyBfdGh1bWJHcm91cHNMaW1pdDtcbiAgICAgICAgICAgICR0aHVtYnNcbiAgICAgICAgICAgICAgICAuc2xpY2UoIF90aHVtYlN0YXJ0LCBfdGh1bWJFbmQgKVxuICAgICAgICAgICAgICAgIC53cmFwQWxsKF90aHVtYkdyb3VwVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXApICQodGhpcykuYWRkQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyIF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBwcmV2XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mbHQ7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlICA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yXCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGluayByZWNvbG9yXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvciBuZXh0XCI+PGEgZGF0YS1zbGlkZSBjbGFzcz1cInBhZ2Utc2VsZWN0b3ItbGlua1wiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48b2JqZWN0IGRhdGE9XCJhc3NldHMvaW1hZ2VzL2ljb24vYXJyb3ctYmxhY2suc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBjbGFzcz1cImljb25cIj4mZ3Q7PC9vYmplY3Q+PC9hPjwvbGk+J1xuICAgICAgICA7XG5cbiAgICAgICAgaWYgKCRwYWdlU2VsZWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gRmlyc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIHByZXZcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIE5leHQ6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG51bVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBfdGh1bWJHcm91cE47IGogKyspIHtcbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck51bVRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGFzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbmV4dFxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghJHBhZ2VTZWxlY3RvcnMuZmluZCgnbGknKS5sZW5ndGgpICRwYWdlU2VsZWN0b3JzLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHNlbGVjdG9yIGhlbHBlcnNcbiAgICAgICAgdmFyICRwYWdlU2VsZWN0b3IgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3RvcicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yUHJldiA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLnByZXYnKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3Rvck5leHQgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5uZXh0JylcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBwcmV2XG4gICAgICAgICRwYWdlU2VsZWN0b3JQcmV2LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ3ByZXYnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBhbmQgdGV4dCBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgICRwYWdlU2VsZWN0b3JcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3RvclByZXYpXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JOZXh0KVxuICAgICAgICAgICAgLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnRleHQoKGluZGV4ICsgMSkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpZGUnLCBpbmRleClcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmF1bHQgc3R5bGUgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGVsc2UgJHBhZ2VTZWxlY3Rvci5ub3QoJHBhZ2VTZWxlY3RvclByZXYpLmVxKDApLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGZvciBzZWxlY3RvciBuZXh0XG4gICAgICAgICRwYWdlU2VsZWN0b3JOZXh0LmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5hdHRyKCdkYXRhLXNsaWRlJywgJ25leHQnKTtcblxuICAgICAgICAvLyBBZGQgZXZlbnQgdG8gcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgJHNlbGVjdG9yID0gJCgpXG4gICAgICAgICwgICBfZGF0YVNsaWRlID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgJHBhZ2VTZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNlbGVjdG9yID0gJCh0aGlzKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJyk7XG4gICAgICAgICAgICAkc2VsZWN0b3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICdwcmV2JykgX2RhdGFTbGlkZSAtLTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgkKHRoaXMpLmRhdGEoJ3NsaWRlJykgPT09ICduZXh0JykgX2RhdGFTbGlkZSArKztcbiAgICAgICAgICAgICAgICBlbHNlIF9kYXRhU2xpZGUgPSAkKHRoaXMpLmRhdGEoJ3NsaWRlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoX2RhdGFTbGlkZSA8IDApIF9kYXRhU2xpZGUgPSAwO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKF9kYXRhU2xpZGUgPiAoX3RodW1iR3JvdXBOIC0gMSkpIF9kYXRhU2xpZGUgPSAoX3RodW1iR3JvdXBOIC0gMSk7XG5cbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScsIF9kYXRhU2xpZGUpO1xuICAgICAgICAgICAgICAgIF90aHVtYkdyb3VwTGVmdCA9ICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJykgKiBfZWxXaWR0aDtcbiAgICAgICAgICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCAnbGVmdCcsICctJyArIF90aHVtYkdyb3VwTGVmdCArICdweCcgKTtcblxuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3IuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB2YXIgX2xpbmtTZWxlY3RvclN0cmluZyA9ICcucGFnZS1zZWxlY3Rvci1saW5rW2RhdGEtc2xpZGU9XCInICsgX2RhdGFTbGlkZSArICdcIl0nO1xuICAgICAgICAgICAgICAgICQoX2xpbmtTZWxlY3RvclN0cmluZykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXX0=
