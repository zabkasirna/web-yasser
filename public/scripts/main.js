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
    ;

    setTimeout(function() {
        uiColor.init();
    }, 100);

    if ($('.background').length) uiBackground.init($('.background'));

    $(window).on('resize', function() {
        if ($('.background').length) uiBackground.rescaleImage();
    });

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);

},{"./module/helper/debounce":2,"./module/ui/ui-background":3,"./module/ui/ui-color":4,"./module/ui/ui-home":5,"./module/ui/ui-navigation":6}],2:[function(require,module,exports){
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

        console.log(BackgroundCheck.get('targets'));
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1jb2xvci5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXFxcbiAqIE1haW4gc2NyaXB0LlxuICogY2xpZW50L21haW4uanNcbiAqKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuOyggZnVuY3Rpb24oICQgKSB7XG4gICAgdmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9tb2R1bGUvaGVscGVyL2RlYm91bmNlJyk7XG5cbiAgICB2YXIgdWlCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktYmFja2dyb3VuZCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgIDtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHVpQ29sb3IuaW5pdCgpO1xuICAgIH0sIDEwMCk7XG5cbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQmFja2dyb3VuZC5pbml0KCQoJy5iYWNrZ3JvdW5kJykpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUJhY2tncm91bmQucmVzY2FsZUltYWdlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIHVpSG9tZS5pbml0KCQoJyNob21lLWhlcm9zJykpO1xufSkoalF1ZXJ5KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRocmVzaG9sZCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5kZWJvdW5jZVxuICAgICAgICAsICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7IFxuICAgICAgICB9XG4gXG4gICAgICAgIGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGVsc2UgaWYgKGltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiBcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7IFxuICAgIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgaW1nTG9hZGVkICAgPSBpbWFnZXNMb2FkZWQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSApXG4gICAgICAgICwgICAkcHJlbG9hZGVyICA9ICQoJyNwcmVsb2FkZXJzJylcbiAgICAgICAgO1xuXG4gICAgICAgIHNlbGYuZWxlbWVudCA9IGVsO1xuXG4gICAgICAgIGltZ0xvYWRlZC5vbignYWx3YXlzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlc2NhbGVJbWFnZSgpO1xuICAgICAgICAgICAgJHByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcHJlbG9hZGVyLmNzcygnei1pbmRleCcsICctOTAwMCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZFZpZGVvKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGxvYWRWaWRlbzogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGlzVG91Y2ggPSBNb2Rlcm5penIudG91Y2g7XG4gICAgICAgIGlmIChpc1RvdWNoKSByZXR1cm47XG5cbiAgICAgICAgdmFyIEJWU291cmNlcyA9IFtdXG4gICAgICAgICwgICBCVlNvdXJjZXNUeXBlID0gWydtcDQnLCAnd2VibScsICdvZ3YnXVxuICAgICAgICA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCVlNvdXJjZXNUeXBlLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgQlZTb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2aWRlby8nICsgQlZTb3VyY2VzVHlwZVtpXSxcbiAgICAgICAgICAgICAgICBzcmM6IHVybCArICcuJyArIEJWU291cmNlc1R5cGVbaV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEJWID0gbmV3ICQuQmlnVmlkZW8oKTtcbiAgICAgICAgQlYuaW5pdCgpO1xuICAgICAgICBCVi5zaG93KEJWU291cmNlcywge1xuICAgICAgICAgICAgYW1iaWVudDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBCVi5nZXRQbGF5ZXIoKS5vbignbG9hZGVkZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5lbGVtZW50LmFkZENsYXNzKCd2aWRlby1sb2FkZWQnKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNjYWxlSW1hZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMuZWxlbWVudC53aWR0aCgpIC8gdGhpcy5lbGVtZW50LmhlaWdodCgpXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2xlZnQnLCBwdXNoTGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2xlZnQnLCAwKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCcucmVjb2xvcicpLmxlbmd0aCB8fCAhJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgQmFja2dyb3VuZENoZWNrLmluaXQoe1xuICAgICAgICAgICAgdGFyZ2V0czogJy5yZWNvbG9yJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhCYWNrZ3JvdW5kQ2hlY2suZ2V0KCd0YXJnZXRzJykpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2LTEnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICB2YXIgJGxpc3RzID0gcGFyZW50LmZpbmQoJy5uYXYnKS5ub3QoZWwucGFyZW50KCkpO1xuICAgICAgICAkbGlzdHMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsLmNsb3Nlc3QoJ2xpJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9XG59O1xuIl19
