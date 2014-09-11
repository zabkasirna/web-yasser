(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** ------------------------------------------------------------------------- *\
 * Main script.
 * client/main.js
 ** ------------------------------------------------------------------------- */

'use strict';

;( function( $ ) {
    var debounce = require('./module/helper/debounce');

    var uiBackground = require('./module/ui-background')
    ,   uiNavigation = require('./module/ui-navigation')
    ,   uiHome       = require('./module/ui-home')
    ;

    uiBackground.init($('#background'));

    console.log('background element:', uiBackground.element[0].nodeName);
    console.log('background element:', uiBackground.element.length);

    $(window).on('resize', function() {
        if (uiBackground.element.length && uiBackground.element[0].nodeName === "VIDEO") {
            debounce(uiBackground.rescaleVideo(), 250, true);
        }
        else if (uiBackground.element.length && uiBackground.element[0].nodeName === "IMG") {
            debounce(uiBackground.rescaleImage(), 250, true);
        }
    });

    var $navs = $('#navigation');
    if ($navs.length) uiNavigation.init($navs);

    uiHome.init($('#home-heros'));
})(jQuery);

},{"./module/helper/debounce":2,"./module/ui-background":3,"./module/ui-home":4,"./module/ui-navigation":5}],2:[function(require,module,exports){
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
        this.element = el || this.element;

        if (el[0].nodeName === "VIDEO") this.rescaleVideo();
        else if (el[0].nodeName === "IMG") this.rescaleImage();
    },
    rescaleVideo: function() {
        if (!this.element.length || this.element[0].nodeName !== "VIDEO") return;

        var videoRatio = 16 / 9
        ,   viewportRatio = $(window).width() / $(window).height()
        ,   pushLeft = 0
        ;

        if (viewportRatio < videoRatio) {
            this.element.removeClass().addClass('full-height');
            pushLeft = ( videoRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass().addClass('full-width');
    },
    rescaleImage: function() {
        if (!this.element.length || this.element[0].nodeName !== "IMG") return;

        var imageRatio = this.element.width() / this.element.height()
        ,   viewportRatio = $(window).width() / $(window).height()
        ;

        console.log('imageRatio:', imageRatio, 'viewportRatio:', viewportRatio);

        if (viewportRatio < imageRatio) {
            this.element.removeClass().addClass('full-height');
            pushLeft = ( imageRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass().addClass('full-width');
    }
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS1ob21lLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWktbmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKlxcXG4gKiBNYWluIHNjcmlwdC5cbiAqIGNsaWVudC9tYWluLmpzXG4gKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbjsoIGZ1bmN0aW9uKCAkICkge1xuICAgIHZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vbW9kdWxlL2hlbHBlci9kZWJvdW5jZScpO1xuXG4gICAgdmFyIHVpQmFja2dyb3VuZCA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpLWJhY2tncm91bmQnKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWktaG9tZScpXG4gICAgO1xuXG4gICAgdWlCYWNrZ3JvdW5kLmluaXQoJCgnI2JhY2tncm91bmQnKSk7XG5cbiAgICBjb25zb2xlLmxvZygnYmFja2dyb3VuZCBlbGVtZW50OicsIHVpQmFja2dyb3VuZC5lbGVtZW50WzBdLm5vZGVOYW1lKTtcbiAgICBjb25zb2xlLmxvZygnYmFja2dyb3VuZCBlbGVtZW50OicsIHVpQmFja2dyb3VuZC5lbGVtZW50Lmxlbmd0aCk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodWlCYWNrZ3JvdW5kLmVsZW1lbnQubGVuZ3RoICYmIHVpQmFja2dyb3VuZC5lbGVtZW50WzBdLm5vZGVOYW1lID09PSBcIlZJREVPXCIpIHtcbiAgICAgICAgICAgIGRlYm91bmNlKHVpQmFja2dyb3VuZC5yZXNjYWxlVmlkZW8oKSwgMjUwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1aUJhY2tncm91bmQuZWxlbWVudC5sZW5ndGggJiYgdWlCYWNrZ3JvdW5kLmVsZW1lbnRbMF0ubm9kZU5hbWUgPT09IFwiSU1HXCIpIHtcbiAgICAgICAgICAgIGRlYm91bmNlKHVpQmFja2dyb3VuZC5yZXNjYWxlSW1hZ2UoKSwgMjUwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyICRuYXZzID0gJCgnI25hdmlnYXRpb24nKTtcbiAgICBpZiAoJG5hdnMubGVuZ3RoKSB1aU5hdmlnYXRpb24uaW5pdCgkbmF2cyk7XG5cbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbCB8fCB0aGlzLmVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGVsWzBdLm5vZGVOYW1lID09PSBcIlZJREVPXCIpIHRoaXMucmVzY2FsZVZpZGVvKCk7XG4gICAgICAgIGVsc2UgaWYgKGVsWzBdLm5vZGVOYW1lID09PSBcIklNR1wiKSB0aGlzLnJlc2NhbGVJbWFnZSgpO1xuICAgIH0sXG4gICAgcmVzY2FsZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQubGVuZ3RoIHx8IHRoaXMuZWxlbWVudFswXS5ub2RlTmFtZSAhPT0gXCJWSURFT1wiKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHZpZGVvUmF0aW8gPSAxNiAvIDlcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICAsICAgcHVzaExlZnQgPSAwXG4gICAgICAgIDtcblxuICAgICAgICBpZiAodmlld3BvcnRSYXRpbyA8IHZpZGVvUmF0aW8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdmdWxsLWhlaWdodCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAoIHZpZGVvUmF0aW8gKiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKHdpbmRvdykud2lkdGgoKSApIC8gLTI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKCdsZWZ0JywgcHVzaExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50Lmxlbmd0aCB8fCB0aGlzLmVsZW1lbnRbMF0ubm9kZU5hbWUgIT09IFwiSU1HXCIpIHJldHVybjtcblxuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMuZWxlbWVudC53aWR0aCgpIC8gdGhpcy5lbGVtZW50LmhlaWdodCgpXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbWFnZVJhdGlvOicsIGltYWdlUmF0aW8sICd2aWV3cG9ydFJhdGlvOicsIHZpZXdwb3J0UmF0aW8pO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2xlZnQnLCBwdXNoTGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnZnVsbC13aWR0aCcpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2LTEnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICB2YXIgJGxpc3RzID0gcGFyZW50LmZpbmQoJy5uYXYnKS5ub3QoZWwucGFyZW50KCkpO1xuICAgICAgICAkbGlzdHMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsLmNsb3Nlc3QoJ2xpJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9XG59O1xuIl19
