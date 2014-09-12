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

    uiBackground.init($('.background'));

    setTimeout(function() {
        console.log('colorized');
        uiColor.init();
    }, 100);

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
        this.element = el || this.element;

        if (el[0].nodeName === "VIDEO") this.rescaleVideo();
        else if (el[0].nodeName === "IMG") this.rescaleImage();
    },
    rescaleVideo: function() {
        if (!this.element.length || this.element[0].nodeName !== "VIDEO") return;

        console.log('rescale:', this.element);

        var videoRatio = 16 / 9
        ,   viewportRatio = $(window).width() / $(window).height()
        ,   pushLeft = 0
        ;

        if (viewportRatio < videoRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( videoRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass('full-height').addClass('full-width');
    },
    rescaleImage: function() {
        if (!this.element.length || this.element[0].nodeName !== "IMG") return;

        var imageRatio = this.element.width() / this.element.height()
        ,   viewportRatio = $(window).width() / $(window).height()
        ;

        console.log('imageRatio:', imageRatio, 'viewportRatio:', viewportRatio);

        if (viewportRatio < imageRatio) {
            this.element.removeClass('full-width').addClass('full-height');
            pushLeft = ( imageRatio * $(window).height() - $(window).width() ) / -2;
            this.element.css('left', pushLeft);
        }
        else this.element.removeClass('full-height').addClass('full-width');
    }
};

},{}],4:[function(require,module,exports){
module.exports = {
    init: function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWJhY2tncm91bmQuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1jb2xvci5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUJhY2tncm91bmQgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1iYWNrZ3JvdW5kJylcbiAgICAsICAgdWlDb2xvciAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktY29sb3InKVxuICAgICwgICB1aU5hdmlnYXRpb24gPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uJylcbiAgICAsICAgdWlIb21lICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktaG9tZScpXG4gICAgO1xuXG4gICAgdWlCYWNrZ3JvdW5kLmluaXQoJCgnLmJhY2tncm91bmQnKSk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY29sb3JpemVkJyk7XG4gICAgICAgIHVpQ29sb3IuaW5pdCgpO1xuICAgIH0sIDEwMCk7XG5cbiAgICBjb25zb2xlLmxvZygnYmFja2dyb3VuZCBlbGVtZW50OicsIHVpQmFja2dyb3VuZC5lbGVtZW50WzBdLm5vZGVOYW1lKTtcbiAgICBjb25zb2xlLmxvZygnYmFja2dyb3VuZCBlbGVtZW50OicsIHVpQmFja2dyb3VuZC5lbGVtZW50Lmxlbmd0aCk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodWlCYWNrZ3JvdW5kLmVsZW1lbnQubGVuZ3RoICYmIHVpQmFja2dyb3VuZC5lbGVtZW50WzBdLm5vZGVOYW1lID09PSBcIlZJREVPXCIpIHtcbiAgICAgICAgICAgIGRlYm91bmNlKHVpQmFja2dyb3VuZC5yZXNjYWxlVmlkZW8oKSwgMjUwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1aUJhY2tncm91bmQuZWxlbWVudC5sZW5ndGggJiYgdWlCYWNrZ3JvdW5kLmVsZW1lbnRbMF0ubm9kZU5hbWUgPT09IFwiSU1HXCIpIHtcbiAgICAgICAgICAgIGRlYm91bmNlKHVpQmFja2dyb3VuZC5yZXNjYWxlSW1hZ2UoKSwgMjUwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyICRuYXZzID0gJCgnI25hdmlnYXRpb24nKTtcbiAgICBpZiAoJG5hdnMubGVuZ3RoKSB1aU5hdmlnYXRpb24uaW5pdCgkbmF2cyk7XG5cbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbCB8fCB0aGlzLmVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGVsWzBdLm5vZGVOYW1lID09PSBcIlZJREVPXCIpIHRoaXMucmVzY2FsZVZpZGVvKCk7XG4gICAgICAgIGVsc2UgaWYgKGVsWzBdLm5vZGVOYW1lID09PSBcIklNR1wiKSB0aGlzLnJlc2NhbGVJbWFnZSgpO1xuICAgIH0sXG4gICAgcmVzY2FsZVZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQubGVuZ3RoIHx8IHRoaXMuZWxlbWVudFswXS5ub2RlTmFtZSAhPT0gXCJWSURFT1wiKSByZXR1cm47XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc2NhbGU6JywgdGhpcy5lbGVtZW50KTtcblxuICAgICAgICB2YXIgdmlkZW9SYXRpbyA9IDE2IC8gOVxuICAgICAgICAsICAgdmlld3BvcnRSYXRpbyA9ICQod2luZG93KS53aWR0aCgpIC8gJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgICAgICwgICBwdXNoTGVmdCA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgdmlkZW9SYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggdmlkZW9SYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2xlZnQnLCBwdXNoTGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50Lmxlbmd0aCB8fCB0aGlzLmVsZW1lbnRbMF0ubm9kZU5hbWUgIT09IFwiSU1HXCIpIHJldHVybjtcblxuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMuZWxlbWVudC53aWR0aCgpIC8gdGhpcy5lbGVtZW50LmhlaWdodCgpXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbWFnZVJhdGlvOicsIGltYWdlUmF0aW8sICd2aWV3cG9ydFJhdGlvOicsIHZpZXdwb3J0UmF0aW8pO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2xlZnQnLCBwdXNoTGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKEJhY2tncm91bmRDaGVjay5nZXQoJ3RhcmdldHMnKSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwYXJlbnQsIGVsKSB7XG4gICAgICAgIHZhciAkbGlzdHMgPSBwYXJlbnQuZmluZCgnLm5hdicpLm5vdChlbC5wYXJlbnQoKSk7XG4gICAgICAgICRsaXN0cy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWwuY2xvc2VzdCgnbGknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH1cbn07XG4iXX0=
