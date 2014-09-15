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
    init: function(el) {
        var self = this
        ,   imgLoaded   = imagesLoaded( document.querySelector('body') )
        ,   $preloader  = $('#preloaders')
        ;

        self.element = el;

        imgLoaded.on('always', function() {
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
        var imageRatio = this.element.width() / this.element.height()
        ,   viewportRatio = $(window).width() / $(window).height()
        ;

        if (viewportRatio < imageRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( imageRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else {
            this.element.removeClass('full-height').addClass('full-width');
            this.element.css('left', 0);
        }
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
    }
};

},{}],7:[function(require,module,exports){
module.exports = {
    element: $(),
    init: function(el) {
        this.element = el;
        var self         = this
        ,   $thumbGroups = self.element.find('.thumb-groups')
        ,   $thumbs      = self.element.find('.thumb')
        ,   isSwap       = false
        ;

        var _thumbN = $thumbs.length
        ,   _thumbGroupsLimit = 6
        ,   _thumbGroupN = (_thumbN > _thumbGroupsLimit) ? Math.ceil(_thumbN / _thumbGroupsLimit) : 1
        ,   _thumbStart = 0
        ,   _thumbEnd = _thumbGroupN
        ,   _thumbGroupTemplate = '<div class="thumb-group" />'
        ;

        // dynamically set .thumb-groups width
        $thumbGroups.css('width', 100 * _thumbGroupN + "%");

        for (var i = 0; i < _thumbGroupN; i ++) {
            _thumbStart = ((_thumbGroupsLimit + 0) * i);
            _thumbEnd = _thumbStart + _thumbGroupsLimit;
            $thumbs
                .slice( _thumbStart, _thumbEnd )
                .wrapAll(_thumbGroupTemplate)
                ;

            console.log('_thumbGroupN:', _thumbGroupN, '_thumbStart:', _thumbStart, '_thumbEnd:', _thumbEnd);
        }

        // Randomize thumb image/text position
        $thumbs.each(function(i) {
            $(this).removeClass('is-swap');
            isSwap = Math.random() >= 0.5 ? isSwap : !isSwap;
            if (isSwap) $(this).addClass('is-swap');
        });
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL2NsaWVudC9zY3JpcHRzL21haW4iLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvaGVscGVyL2RlYm91bmNlLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktaG9tZS5qcyIsIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXRodW1iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXFxcbiAqIE1haW4gc2NyaXB0LlxuICogY2xpZW50L21haW4uanNcbiAqKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuOyggZnVuY3Rpb24oICQgKSB7XG4gICAgdmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9tb2R1bGUvaGVscGVyL2RlYm91bmNlJyk7XG5cbiAgICB2YXIgdWlCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktYmFja2dyb3VuZCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgICwgICB1aVRodW1iICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10aHVtYicpXG4gICAgO1xuXG4gICAgLy8gRHluYW1pYyBjb2xvclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHVpQ29sb3IuaW5pdCgpO1xuICAgIH0sIDEwMCk7XG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUJhY2tncm91bmQuaW5pdCgkKCcuYmFja2dyb3VuZCcpKTtcblxuICAgIC8vIE5hdmlnYXRpb25zXG4gICAgdmFyICRuYXZzID0gJCgnI25hdmlnYXRpb24nKTtcbiAgICBpZiAoJG5hdnMubGVuZ3RoKSB1aU5hdmlnYXRpb24uaW5pdCgkbmF2cyk7XG5cbiAgICAvLyBIb21lXG4gICAgdWlIb21lLmluaXQoJCgnI2hvbWUtaGVyb3MnKSk7XG5cbiAgICAvLyBUaHVtYm5haWxzXG4gICAgaWYgKCQoJy50aHVtYnMnKS5sZW5ndGgpIHVpVGh1bWIuaW5pdCgkKCcudGh1bWJzJykpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUJhY2tncm91bmQucmVzY2FsZUltYWdlKCk7XG4gICAgfSk7XG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBpbWdMb2FkZWQgICA9IGltYWdlc0xvYWRlZCggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpIClcbiAgICAgICAgLCAgICRwcmVsb2FkZXIgID0gJCgnI3ByZWxvYWRlcnMnKVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5lbGVtZW50ID0gZWw7XG5cbiAgICAgICAgaW1nTG9hZGVkLm9uKCdhbHdheXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYucmVzY2FsZUltYWdlKCk7XG4gICAgICAgICAgICAkcHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRwcmVsb2FkZXIuY3NzKCd6LWluZGV4JywgJy05MDAwJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbygpO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbWFnZVJhdGlvID0gdGhpcy5lbGVtZW50LndpZHRoKCkgLyB0aGlzLmVsZW1lbnQuaGVpZ2h0KClcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICA7XG5cbiAgICAgICAgaWYgKHZpZXdwb3J0UmF0aW8gPCBpbWFnZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtd2lkdGgnKS5hZGRDbGFzcygnZnVsbC1oZWlnaHQnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gKCBpbWFnZVJhdGlvICogJCh3aW5kb3cpLmhlaWdodCgpIC0gJCh3aW5kb3cpLndpZHRoKCkgKSAvIC0yO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnbGVmdCcsIHB1c2hMZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC1oZWlnaHQnKS5hZGRDbGFzcygnZnVsbC13aWR0aCcpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnbGVmdCcsIDApO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoJy5yZWNvbG9yJykubGVuZ3RoIHx8ICEkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBCYWNrZ3JvdW5kQ2hlY2suaW5pdCh7XG4gICAgICAgICAgICB0YXJnZXRzOiAnLnJlY29sb3InXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2LTEnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICB2YXIgJGxpc3RzID0gcGFyZW50LmZpbmQoJy5uYXYnKS5ub3QoZWwucGFyZW50KCkpO1xuICAgICAgICAkbGlzdHMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsLmNsb3Nlc3QoJ2xpJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgICB2YXIgc2VsZiAgICAgICAgID0gdGhpc1xuICAgICAgICAsICAgJHRodW1iR3JvdXBzID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYi1ncm91cHMnKVxuICAgICAgICAsICAgJHRodW1icyAgICAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYicpXG4gICAgICAgICwgICBpc1N3YXAgICAgICAgPSBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgdmFyIF90aHVtYk4gPSAkdGh1bWJzLmxlbmd0aFxuICAgICAgICAsICAgX3RodW1iR3JvdXBzTGltaXQgPSA2XG4gICAgICAgICwgICBfdGh1bWJHcm91cE4gPSAoX3RodW1iTiA+IF90aHVtYkdyb3Vwc0xpbWl0KSA/IE1hdGguY2VpbChfdGh1bWJOIC8gX3RodW1iR3JvdXBzTGltaXQpIDogMVxuICAgICAgICAsICAgX3RodW1iU3RhcnQgPSAwXG4gICAgICAgICwgICBfdGh1bWJFbmQgPSBfdGh1bWJHcm91cE5cbiAgICAgICAgLCAgIF90aHVtYkdyb3VwVGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInRodW1iLWdyb3VwXCIgLz4nXG4gICAgICAgIDtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBzZXQgLnRodW1iLWdyb3VwcyB3aWR0aFxuICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCd3aWR0aCcsIDEwMCAqIF90aHVtYkdyb3VwTiArIFwiJVwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aHVtYkdyb3VwTjsgaSArKykge1xuICAgICAgICAgICAgX3RodW1iU3RhcnQgPSAoKF90aHVtYkdyb3Vwc0xpbWl0ICsgMCkgKiBpKTtcbiAgICAgICAgICAgIF90aHVtYkVuZCA9IF90aHVtYlN0YXJ0ICsgX3RodW1iR3JvdXBzTGltaXQ7XG4gICAgICAgICAgICAkdGh1bWJzXG4gICAgICAgICAgICAgICAgLnNsaWNlKCBfdGh1bWJTdGFydCwgX3RodW1iRW5kIClcbiAgICAgICAgICAgICAgICAud3JhcEFsbChfdGh1bWJHcm91cFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ190aHVtYkdyb3VwTjonLCBfdGh1bWJHcm91cE4sICdfdGh1bWJTdGFydDonLCBfdGh1bWJTdGFydCwgJ190aHVtYkVuZDonLCBfdGh1bWJFbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXApICQodGhpcykuYWRkQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
