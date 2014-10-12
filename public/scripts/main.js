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
    ,   uiTouch      = require('./module/ui/ui-touch')
    ;

    var SlimScroll = require('./module/ui/jQuery-slimScroll-browserify')();

    // Dynamic color
    /*setTimeout(function() { uiColor.init(); }, 100);*/

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

    // Shame
    var isOpen = false;
    function updateInfoCredit() {
        isOpen = !isOpen;
        if (!isOpen)  $('.contact-credits').removeClass('is-open');
        else $('.contact-credits').addClass('is-open');
    }

    $('.contact-credit-toggler').on('click', function(e) {
        e.preventDefault();
        updateInfoCredit();
    });

    $('.question').slimScroll({
        height: '264px',
        size: '4px',
        color: '#000',
        opacity: '1',
        borderRadius: 0,
        alwaysVisible: true,
        distance: 0
    });

    uiTouch.init();

})(jQuery);

},{"./module/helper/debounce":2,"./module/ui/jQuery-slimScroll-browserify":3,"./module/ui/ui-asset":4,"./module/ui/ui-color":5,"./module/ui/ui-home":6,"./module/ui/ui-navigation":7,"./module/ui/ui-related":8,"./module/ui/ui-thumb":9,"./module/ui/ui-touch":10}],2:[function(require,module,exports){
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
function SlimScroll() {
  $.fn.extend({
    slimScroll: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
        height : '250px',

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - left/right
        position : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : 0.4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : 0.2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : '7px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }
        else if ($.isPlainObject(options))
        {
            if ('destroy' in options)
            {
                return;
            }
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
              e.originalEvent.preventDefault();
              }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel);
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll === 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  $.fn.extend({
    slimscroll: $.fn.slimScroll
  });
}

module.exports = SlimScroll;

},{}],4:[function(require,module,exports){
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

        console.log(BVSources);

        var BV = new $.BigVideo({
            useFlashForFirefox: false
        });
        BV.init();
        BV.show(BVSources, {
            ambient: true
            , altSource: 'assets/videos/Y.webm'
            , techOrder: ['html5']
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
    }
};

},{}],5:[function(require,module,exports){
module.exports = {
    init: function() {
        if (!$('.recolor').length || !$('.background').length) return;
        BackgroundCheck.init({
            targets: '.recolor'
        });
    }
};

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = {
    init: function(el) {
        var _scope = this;
        el.find('.nav-1').each(function(i) {

            var $el = $(this);

            var _svgObj = $(this).find('.nav-1-object')[0]
            ,   _svgDoc
            ,   _navEl
            ;

            _svgObj.addEventListener('load', function() {
                _svgDoc = _svgObj.contentDocument;
                _navEl  = _svgDoc.querySelector('.navigation-svg');

                if($el.hasClass('active')) _navEl.setAttribute('class', 'navigation-svg active');

                $el.hover(
                    function() {
                        if(!$(this).hasClass('active')) {
                            $(this).toggleClass('hovered');
                            _navEl.setAttribute('class', 'navigation-svg hovered');
                        }
                    },
                    function() {
                        if(!$(this).hasClass('active')) {
                            $(this).toggleClass('hovered');
                            _navEl.setAttribute('class', 'navigation-svg');
                        }
                    }
                );
            });

            $(this).on('click', function(e) {
                e.preventDefault();
                _scope.toggle(el, $(this).closest('.nav'));
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

        var hasNeu = el.hasClass('has-neu'); /*console.log('hasNeu' ,hasNeu);*/

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

},{}],10:[function(require,module,exports){
module.exports = {
    init: function() {
        var $xxxTemplate =  '<div id="xxx">' +
                            '<div class="xxx-inner">' +
                            '<p>Currently,</p>' +
                            '<p>this site does not support mobile/touch devices.</p>' +
                            '<p>View on desktop computers for better experience.</p>' +
                            '</div>' +
                            '</div>'
        ;

        if (Modernizr.touch) $('body').append($xxxTemplate);
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL2pRdWVyeS1zbGltU2Nyb2xsLWJyb3dzZXJpZnkuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1hc3NldC5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWNvbG9yLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktaG9tZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLW5hdmlnYXRpb24uanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1yZWxhdGVkLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdGh1bWIuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10b3VjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUFzc2V0ICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1hc3NldCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgICwgICB1aVRodW1iICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10aHVtYicpXG4gICAgLCAgIHVpUmVsYXRlZCAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXJlbGF0ZWQnKVxuICAgICwgICB1aVRvdWNoICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10b3VjaCcpXG4gICAgO1xuXG4gICAgdmFyIFNsaW1TY3JvbGwgPSByZXF1aXJlKCcuL21vZHVsZS91aS9qUXVlcnktc2xpbVNjcm9sbC1icm93c2VyaWZ5JykoKTtcblxuICAgIC8vIER5bmFtaWMgY29sb3JcbiAgICAvKnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHVpQ29sb3IuaW5pdCgpOyB9LCAxMDApOyovXG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKCQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSB1aUFzc2V0LmluaXQoJCgnLmJhY2tncm91bmQnKSk7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHsgdWlBc3NldC5yZXNjYWxlSW1hZ2UoKTsgfSk7XG5cbiAgICAvLyBNYWluIG5hdmlnYXRpb25cbiAgICB2YXIgJG5hdnMgPSAkKCcjbmF2aWdhdGlvbicpO1xuICAgIGlmICgkbmF2cy5sZW5ndGgpIHVpTmF2aWdhdGlvbi5pbml0KCRuYXZzKTtcblxuICAgIC8vIFBhZ2UgbmF2aWdhdGlvblxuICAgIGlmICgkKCcucGFnZS1uYXZpZ2F0aW9ucycpLmxlbmd0aClcbiAgICAgICAgdWlOYXZpZ2F0aW9uLmluaXRQYWdlTmF2aWdhdGlvbigkKCdwYWdlLW5hdmlnYXRpb25zLmhhcy1pbmZvcycpLmxlbmd0aCk7XG5cbiAgICAvLyBIb21lXG4gICAgdWlIb21lLmluaXQoJCgnI2hvbWUtaGVyb3MnKSk7XG5cbiAgICAvLyBUaHVtYm5haWxzXG4gICAgaWYgKCQoJy50aHVtYnMnKS5sZW5ndGgpIHVpVGh1bWIuaW5pdCgkKCcudGh1bWJzJykpO1xuXG4gICAgLy8gUmVsYXRlc1xuICAgIGlmICgkKCcucmVsYXRlZHMnKS5sZW5ndGgpIHVpUmVsYXRlZC5pbml0KCQoJy5yZWxhdGVkcycpKTtcblxuICAgIC8vIFNoYW1lXG4gICAgLy8gTW92ZSB0byBpdCdzIG93biBtb2R1bGVcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy52aWV3ZXItY2xvc2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnI3ZpZXdlcnMnKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIHZhciBjcmVhdGVWaWV3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRiYWNrZ3JvdW5kRWwgPSAkKCcuYmFja2dyb3VuZCcpXG4gICAgICAgICwgICBpbWdTcmMgPSAkYmFja2dyb3VuZEVsLmF0dHIoJ3NyYycpXG4gICAgICAgICwgICB2aWV3ZXJzVGVtcGxhdGUgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwidmlld2Vyc1wiIGNsYXNzPVwicHJlXCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxkaXYgY2xhc3M9XCJ2aWV3ZXItcHJlbG9hZGVyXCI+PHA+bG9hZGluZyBpbWFnZS4uLjwvcD48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGRpdiBjbGFzcz1cImNyb3BpdC1pbWFnZS1wcmV2aWV3XCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICArJzxpbnB1dCB0eXBlPVwicmFuZ2VcIiBjbGFzcz1cImNyb3BpdC1pbWFnZS16b29tLWlucHV0XCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzPVwiY3JvcGl0LWltYWdlLWlucHV0XCI+J1xuICAgICAgICAgICAgICAgICAgICArJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJ2aWV3ZXItY2xvc2VcIj54PC9hPidcbiAgICAgICAgICAgICAgICArJzwvZGl2PidcbiAgICAgICAgO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVByZSgpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnI3ZpZXdlcnMnKS5yZW1vdmVDbGFzcygncHJlJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCdhW2RhdGEtdG9vbD1cImltYWdlXCInKSkge1xuICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCh2aWV3ZXJzVGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBpZigkKCcjdmlld2VycycpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJyN2aWV3ZXJzJykuY3JvcGl0KHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTdGF0ZTogeyBzcmM6IGltZ1NyYyB9LFxuICAgICAgICAgICAgICAgICAgICBvbkltYWdlTG9hZGVkOiByZW1vdmVQcmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkKCcucGFnZS10b29sLWJ0bltkYXRhLXRvb2w9XCJpbWFnZVwiXScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IGNyZWF0ZVZpZXdlcigpOyB9KTtcblxuICAgIC8vIFNoYW1lXG4gICAgdmFyIGlzT3BlbiA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUluZm9DcmVkaXQoKSB7XG4gICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG4gICAgICAgIGlmICghaXNPcGVuKSAgJCgnLmNvbnRhY3QtY3JlZGl0cycpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgICAgIGVsc2UgJCgnLmNvbnRhY3QtY3JlZGl0cycpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICAgfVxuXG4gICAgJCgnLmNvbnRhY3QtY3JlZGl0LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdXBkYXRlSW5mb0NyZWRpdCgpO1xuICAgIH0pO1xuXG4gICAgJCgnLnF1ZXN0aW9uJykuc2xpbVNjcm9sbCh7XG4gICAgICAgIGhlaWdodDogJzI2NHB4JyxcbiAgICAgICAgc2l6ZTogJzRweCcsXG4gICAgICAgIGNvbG9yOiAnIzAwMCcsXG4gICAgICAgIG9wYWNpdHk6ICcxJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICBhbHdheXNWaXNpYmxlOiB0cnVlLFxuICAgICAgICBkaXN0YW5jZTogMFxuICAgIH0pO1xuXG4gICAgdWlUb3VjaC5pbml0KCk7XG5cbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsImZ1bmN0aW9uIFNsaW1TY3JvbGwoKSB7XG4gICQuZm4uZXh0ZW5kKHtcbiAgICBzbGltU2Nyb2xsOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgIHZhciBkZWZhdWx0cyA9IHtcblxuICAgICAgICAvLyB3aWR0aCBpbiBwaXhlbHMgb2YgdGhlIHZpc2libGUgc2Nyb2xsIGFyZWFcbiAgICAgICAgd2lkdGggOiAnYXV0bycsXG5cbiAgICAgICAgLy8gaGVpZ2h0IGluIHBpeGVscyBvZiB0aGUgdmlzaWJsZSBzY3JvbGwgYXJlYVxuICAgICAgICBoZWlnaHQgOiAnMjUwcHgnLFxuXG4gICAgICAgIC8vIHdpZHRoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsYmFyIGFuZCByYWlsXG4gICAgICAgIHNpemUgOiAnN3B4JyxcblxuICAgICAgICAvLyBzY3JvbGxiYXIgY29sb3IsIGFjY2VwdHMgYW55IGhleC9jb2xvciB2YWx1ZVxuICAgICAgICBjb2xvcjogJyMwMDAnLFxuXG4gICAgICAgIC8vIHNjcm9sbGJhciBwb3NpdGlvbiAtIGxlZnQvcmlnaHRcbiAgICAgICAgcG9zaXRpb24gOiAncmlnaHQnLFxuXG4gICAgICAgIC8vIGRpc3RhbmNlIGluIHBpeGVscyBiZXR3ZWVuIHRoZSBzaWRlIGVkZ2UgYW5kIHRoZSBzY3JvbGxiYXJcbiAgICAgICAgZGlzdGFuY2UgOiAnMXB4JyxcblxuICAgICAgICAvLyBkZWZhdWx0IHNjcm9sbCBwb3NpdGlvbiBvbiBsb2FkIC0gdG9wIC8gYm90dG9tIC8gJCgnc2VsZWN0b3InKVxuICAgICAgICBzdGFydCA6ICd0b3AnLFxuXG4gICAgICAgIC8vIHNldHMgc2Nyb2xsYmFyIG9wYWNpdHlcbiAgICAgICAgb3BhY2l0eSA6IDAuNCxcblxuICAgICAgICAvLyBlbmFibGVzIGFsd2F5cy1vbiBtb2RlIGZvciB0aGUgc2Nyb2xsYmFyXG4gICAgICAgIGFsd2F5c1Zpc2libGUgOiBmYWxzZSxcblxuICAgICAgICAvLyBjaGVjayBpZiB3ZSBzaG91bGQgaGlkZSB0aGUgc2Nyb2xsYmFyIHdoZW4gdXNlciBpcyBob3ZlcmluZyBvdmVyXG4gICAgICAgIGRpc2FibGVGYWRlT3V0IDogZmFsc2UsXG5cbiAgICAgICAgLy8gc2V0cyB2aXNpYmlsaXR5IG9mIHRoZSByYWlsXG4gICAgICAgIHJhaWxWaXNpYmxlIDogZmFsc2UsXG5cbiAgICAgICAgLy8gc2V0cyByYWlsIGNvbG9yXG4gICAgICAgIHJhaWxDb2xvciA6ICcjMzMzJyxcblxuICAgICAgICAvLyBzZXRzIHJhaWwgb3BhY2l0eVxuICAgICAgICByYWlsT3BhY2l0eSA6IDAuMixcblxuICAgICAgICAvLyB3aGV0aGVyICB3ZSBzaG91bGQgdXNlIGpRdWVyeSBVSSBEcmFnZ2FibGUgdG8gZW5hYmxlIGJhciBkcmFnZ2luZ1xuICAgICAgICByYWlsRHJhZ2dhYmxlIDogdHJ1ZSxcblxuICAgICAgICAvLyBkZWZhdXRsdCBDU1MgY2xhc3Mgb2YgdGhlIHNsaW1zY3JvbGwgcmFpbFxuICAgICAgICByYWlsQ2xhc3MgOiAnc2xpbVNjcm9sbFJhaWwnLFxuXG4gICAgICAgIC8vIGRlZmF1dGx0IENTUyBjbGFzcyBvZiB0aGUgc2xpbXNjcm9sbCBiYXJcbiAgICAgICAgYmFyQ2xhc3MgOiAnc2xpbVNjcm9sbEJhcicsXG5cbiAgICAgICAgLy8gZGVmYXV0bHQgQ1NTIGNsYXNzIG9mIHRoZSBzbGltc2Nyb2xsIHdyYXBwZXJcbiAgICAgICAgd3JhcHBlckNsYXNzIDogJ3NsaW1TY3JvbGxEaXYnLFxuXG4gICAgICAgIC8vIGNoZWNrIGlmIG1vdXNld2hlZWwgc2hvdWxkIHNjcm9sbCB0aGUgd2luZG93IGlmIHdlIHJlYWNoIHRvcC9ib3R0b21cbiAgICAgICAgYWxsb3dQYWdlU2Nyb2xsIDogZmFsc2UsXG5cbiAgICAgICAgLy8gc2Nyb2xsIGFtb3VudCBhcHBsaWVkIHRvIGVhY2ggbW91c2Ugd2hlZWwgc3RlcFxuICAgICAgICB3aGVlbFN0ZXAgOiAyMCxcblxuICAgICAgICAvLyBzY3JvbGwgYW1vdW50IGFwcGxpZWQgd2hlbiB1c2VyIGlzIHVzaW5nIGdlc3R1cmVzXG4gICAgICAgIHRvdWNoU2Nyb2xsU3RlcCA6IDIwMCxcblxuICAgICAgICAvLyBzZXRzIGJvcmRlciByYWRpdXNcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnN3B4JyxcblxuICAgICAgICAvLyBzZXRzIGJvcmRlciByYWRpdXMgb2YgdGhlIHJhaWxcbiAgICAgICAgcmFpbEJvcmRlclJhZGl1cyA6ICc3cHgnXG4gICAgICB9O1xuXG4gICAgICB2YXIgbyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgLy8gZG8gaXQgZm9yIGV2ZXJ5IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHNlbGVjdG9yXG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgdmFyIGlzT3ZlclBhbmVsLCBpc092ZXJCYXIsIGlzRHJhZ2csIHF1ZXVlSGlkZSwgdG91Y2hEaWYsXG4gICAgICAgIGJhckhlaWdodCwgcGVyY2VudFNjcm9sbCwgbGFzdFNjcm9sbCxcbiAgICAgICAgZGl2UyA9ICc8ZGl2PjwvZGl2PicsXG4gICAgICAgIG1pbkJhckhlaWdodCA9IDMwLFxuICAgICAgICByZWxlYXNlU2Nyb2xsID0gZmFsc2U7XG5cbiAgICAgICAgLy8gdXNlZCBpbiBldmVudCBoYW5kbGVycyBhbmQgZm9yIGJldHRlciBtaW5pZmljYXRpb25cbiAgICAgICAgdmFyIG1lID0gJCh0aGlzKTtcblxuICAgICAgICAvLyBlbnN1cmUgd2UgYXJlIG5vdCBiaW5kaW5nIGl0IGFnYWluXG4gICAgICAgIGlmIChtZS5wYXJlbnQoKS5oYXNDbGFzcyhvLndyYXBwZXJDbGFzcykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGZyb20gbGFzdCBiYXIgcG9zaXRpb25cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBtZS5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICAgLy8gZmluZCBiYXIgYW5kIHJhaWxcbiAgICAgICAgICAgIGJhciA9IG1lLnBhcmVudCgpLmZpbmQoJy4nICsgby5iYXJDbGFzcyk7XG4gICAgICAgICAgICByYWlsID0gbWUucGFyZW50KCkuZmluZCgnLicgKyBvLnJhaWxDbGFzcyk7XG5cbiAgICAgICAgICAgIGdldEJhckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB3ZSBzaG91bGQgc2Nyb2xsIGV4aXN0aW5nIGluc3RhbmNlXG4gICAgICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBQYXNzIGhlaWdodDogYXV0byB0byBhbiBleGlzdGluZyBzbGltc2Nyb2xsIG9iamVjdCB0byBmb3JjZSBhIHJlc2l6ZSBhZnRlciBjb250ZW50cyBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgICAgaWYgKCAnaGVpZ2h0JyBpbiBvcHRpb25zICYmIG9wdGlvbnMuaGVpZ2h0ID09ICdhdXRvJyApIHtcbiAgICAgICAgICAgICAgICBtZS5wYXJlbnQoKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICAgICAgICAgICAgbWUuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBtZS5wYXJlbnQoKS5wYXJlbnQoKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICBtZS5wYXJlbnQoKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgbWUuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCdzY3JvbGxUbycgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGp1bXAgdG8gYSBzdGF0aWMgcG9pbnRcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBwYXJzZUludChvLnNjcm9sbFRvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIGlmICgnc2Nyb2xsQnknIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBqdW1wIGJ5IHZhbHVlIHBpeGVsc1xuICAgICAgICAgICAgICAgIG9mZnNldCArPSBwYXJzZUludChvLnNjcm9sbEJ5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIGlmICgnZGVzdHJveScgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzbGltc2Nyb2xsIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgYmFyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJhaWwucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgbWUudW53cmFwKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gc2Nyb2xsIGNvbnRlbnQgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgICAgICAgICAgICBzY3JvbGxDb250ZW50KG9mZnNldCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoJ2Rlc3Ryb3knIGluIG9wdGlvbnMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3B0aW9uYWxseSBzZXQgaGVpZ2h0IHRvIHRoZSBwYXJlbnQncyBoZWlnaHRcbiAgICAgICAgby5oZWlnaHQgPSAoby5oZWlnaHQgPT0gJ2F1dG8nKSA/IG1lLnBhcmVudCgpLmhlaWdodCgpIDogby5oZWlnaHQ7XG5cbiAgICAgICAgLy8gd3JhcCBjb250ZW50XG4gICAgICAgIHZhciB3cmFwcGVyID0gJChkaXZTKVxuICAgICAgICAgIC5hZGRDbGFzcyhvLndyYXBwZXJDbGFzcylcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgd2lkdGg6IG8ud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG8uaGVpZ2h0XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHN0eWxlIGZvciB0aGUgZGl2XG4gICAgICAgIG1lLmNzcyh7XG4gICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgIHdpZHRoOiBvLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogby5oZWlnaHRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHNjcm9sbGJhciByYWlsXG4gICAgICAgIHZhciByYWlsID0gJChkaXZTKVxuICAgICAgICAgIC5hZGRDbGFzcyhvLnJhaWxDbGFzcylcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBvLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgZGlzcGxheTogKG8uYWx3YXlzVmlzaWJsZSAmJiBvLnJhaWxWaXNpYmxlKSA/ICdibG9jaycgOiAnbm9uZScsXG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IG8ucmFpbEJvcmRlclJhZGl1cyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG8ucmFpbENvbG9yLFxuICAgICAgICAgICAgb3BhY2l0eTogby5yYWlsT3BhY2l0eSxcbiAgICAgICAgICAgIHpJbmRleDogOTBcbiAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBjcmVhdGUgc2Nyb2xsYmFyXG4gICAgICAgIHZhciBiYXIgPSAkKGRpdlMpXG4gICAgICAgICAgLmFkZENsYXNzKG8uYmFyQ2xhc3MpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBvLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IG8uc2l6ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgb3BhY2l0eTogby5vcGFjaXR5LFxuICAgICAgICAgICAgZGlzcGxheTogby5hbHdheXNWaXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgICAgICdib3JkZXItcmFkaXVzJyA6IG8uYm9yZGVyUmFkaXVzLFxuICAgICAgICAgICAgQm9yZGVyUmFkaXVzOiBvLmJvcmRlclJhZGl1cyxcbiAgICAgICAgICAgIE1vekJvcmRlclJhZGl1czogby5ib3JkZXJSYWRpdXMsXG4gICAgICAgICAgICBXZWJraXRCb3JkZXJSYWRpdXM6IG8uYm9yZGVyUmFkaXVzLFxuICAgICAgICAgICAgekluZGV4OiA5OVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNldCBwb3NpdGlvblxuICAgICAgICB2YXIgcG9zQ3NzID0gKG8ucG9zaXRpb24gPT0gJ3JpZ2h0JykgPyB7IHJpZ2h0OiBvLmRpc3RhbmNlIH0gOiB7IGxlZnQ6IG8uZGlzdGFuY2UgfTtcbiAgICAgICAgcmFpbC5jc3MocG9zQ3NzKTtcbiAgICAgICAgYmFyLmNzcyhwb3NDc3MpO1xuXG4gICAgICAgIC8vIHdyYXAgaXRcbiAgICAgICAgbWUud3JhcCh3cmFwcGVyKTtcblxuICAgICAgICAvLyBhcHBlbmQgdG8gcGFyZW50IGRpdlxuICAgICAgICBtZS5wYXJlbnQoKS5hcHBlbmQoYmFyKTtcbiAgICAgICAgbWUucGFyZW50KCkuYXBwZW5kKHJhaWwpO1xuXG4gICAgICAgIC8vIG1ha2UgaXQgZHJhZ2dhYmxlIGFuZCBubyBsb25nZXIgZGVwZW5kZW50IG9uIHRoZSBqcXVlcnlVSVxuICAgICAgICBpZiAoby5yYWlsRHJhZ2dhYmxlKXtcbiAgICAgICAgICBiYXIuYmluZChcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgJGRvYyA9ICQoZG9jdW1lbnQpO1xuICAgICAgICAgICAgaXNEcmFnZyA9IHRydWU7XG4gICAgICAgICAgICB0ID0gcGFyc2VGbG9hdChiYXIuY3NzKCd0b3AnKSk7XG4gICAgICAgICAgICBwYWdlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgICAgICRkb2MuYmluZChcIm1vdXNlbW92ZS5zbGltc2Nyb2xsXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICBjdXJyVG9wID0gdCArIGUucGFnZVkgLSBwYWdlWTtcbiAgICAgICAgICAgICAgYmFyLmNzcygndG9wJywgY3VyclRvcCk7XG4gICAgICAgICAgICAgIHNjcm9sbENvbnRlbnQoMCwgYmFyLnBvc2l0aW9uKCkudG9wLCBmYWxzZSk7Ly8gc2Nyb2xsIGNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkZG9jLmJpbmQoXCJtb3VzZXVwLnNsaW1zY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBpc0RyYWdnID0gZmFsc2U7aGlkZUJhcigpO1xuICAgICAgICAgICAgICAkZG9jLnVuYmluZCgnLnNsaW1zY3JvbGwnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pLmJpbmQoXCJzZWxlY3RzdGFydC5zbGltc2Nyb2xsXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9uIHJhaWwgb3ZlclxuICAgICAgICByYWlsLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc2hvd0JhcigpO1xuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgIGhpZGVCYXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gb24gYmFyIG92ZXJcbiAgICAgICAgYmFyLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaXNPdmVyQmFyID0gdHJ1ZTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBpc092ZXJCYXIgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBvbiBwYXJlbnQgbW91c2VvdmVyXG4gICAgICAgIG1lLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaXNPdmVyUGFuZWwgPSB0cnVlO1xuICAgICAgICAgIHNob3dCYXIoKTtcbiAgICAgICAgICBoaWRlQmFyKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaXNPdmVyUGFuZWwgPSBmYWxzZTtcbiAgICAgICAgICBoaWRlQmFyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIG1vYmlsZVxuICAgICAgICBtZS5iaW5kKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSxiKXtcbiAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIHJlY29yZCB3aGVyZSB0b3VjaCBzdGFydGVkXG4gICAgICAgICAgICB0b3VjaERpZiA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWUuYmluZCgndG91Y2htb3ZlJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgLy8gcHJldmVudCBzY3JvbGxpbmcgdGhlIHBhZ2UgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgaWYoIXJlbGVhc2VTY3JvbGwpXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGgpXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gc2VlIGhvdyBmYXIgdXNlciBzd2lwZWRcbiAgICAgICAgICAgIHZhciBkaWZmID0gKHRvdWNoRGlmIC0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVkpIC8gby50b3VjaFNjcm9sbFN0ZXA7XG4gICAgICAgICAgICAvLyBzY3JvbGwgY29udGVudFxuICAgICAgICAgICAgc2Nyb2xsQ29udGVudChkaWZmLCB0cnVlKTtcbiAgICAgICAgICAgIHRvdWNoRGlmID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgdXAgaW5pdGlhbCBoZWlnaHRcbiAgICAgICAgZ2V0QmFySGVpZ2h0KCk7XG5cbiAgICAgICAgLy8gY2hlY2sgc3RhcnQgcG9zaXRpb25cbiAgICAgICAgaWYgKG8uc3RhcnQgPT09ICdib3R0b20nKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gc2Nyb2xsIGNvbnRlbnQgdG8gYm90dG9tXG4gICAgICAgICAgYmFyLmNzcyh7IHRvcDogbWUub3V0ZXJIZWlnaHQoKSAtIGJhci5vdXRlckhlaWdodCgpIH0pO1xuICAgICAgICAgIHNjcm9sbENvbnRlbnQoMCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoby5zdGFydCAhPT0gJ3RvcCcpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBhc3N1bWUgalF1ZXJ5IHNlbGVjdG9yXG4gICAgICAgICAgc2Nyb2xsQ29udGVudCgkKG8uc3RhcnQpLnBvc2l0aW9uKCkudG9wLCBudWxsLCB0cnVlKTtcblxuICAgICAgICAgIC8vIG1ha2Ugc3VyZSBiYXIgc3RheXMgaGlkZGVuXG4gICAgICAgICAgaWYgKCFvLmFsd2F5c1Zpc2libGUpIHsgYmFyLmhpZGUoKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXR0YWNoIHNjcm9sbCBldmVudHNcbiAgICAgICAgYXR0YWNoV2hlZWwoKTtcblxuICAgICAgICBmdW5jdGlvbiBfb25XaGVlbChlKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gdXNlIG1vdXNlIHdoZWVsIG9ubHkgd2hlbiBtb3VzZSBpcyBvdmVyXG4gICAgICAgICAgaWYgKCFpc092ZXJQYW5lbCkgeyByZXR1cm47IH1cblxuICAgICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgICAgIHZhciBkZWx0YSA9IDA7XG4gICAgICAgICAgaWYgKGUud2hlZWxEZWx0YSkgeyBkZWx0YSA9IC1lLndoZWVsRGVsdGEvMTIwOyB9XG4gICAgICAgICAgaWYgKGUuZGV0YWlsKSB7IGRlbHRhID0gZS5kZXRhaWwgLyAzOyB9XG5cbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNUYXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgICAgICAgIGlmICgkKHRhcmdldCkuY2xvc2VzdCgnLicgKyBvLndyYXBwZXJDbGFzcykuaXMobWUucGFyZW50KCkpKSB7XG4gICAgICAgICAgICAvLyBzY3JvbGwgY29udGVudFxuICAgICAgICAgICAgc2Nyb2xsQ29udGVudChkZWx0YSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc3RvcCB3aW5kb3cgc2Nyb2xsXG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQgJiYgIXJlbGVhc2VTY3JvbGwpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgICAgICAgaWYgKCFyZWxlYXNlU2Nyb2xsKSB7IGUucmV0dXJuVmFsdWUgPSBmYWxzZTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2Nyb2xsQ29udGVudCh5LCBpc1doZWVsLCBpc0p1bXApXG4gICAgICAgIHtcbiAgICAgICAgICByZWxlYXNlU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgICAgdmFyIGRlbHRhID0geTtcbiAgICAgICAgICB2YXIgbWF4VG9wID0gbWUub3V0ZXJIZWlnaHQoKSAtIGJhci5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgaWYgKGlzV2hlZWwpXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gbW92ZSBiYXIgd2l0aCBtb3VzZSB3aGVlbFxuICAgICAgICAgICAgZGVsdGEgPSBwYXJzZUludChiYXIuY3NzKCd0b3AnKSkgKyB5ICogcGFyc2VJbnQoby53aGVlbFN0ZXApIC8gMTAwICogYmFyLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIG1vdmUgYmFyLCBtYWtlIHN1cmUgaXQgZG9lc24ndCBnbyBvdXRcbiAgICAgICAgICAgIGRlbHRhID0gTWF0aC5taW4oTWF0aC5tYXgoZGVsdGEsIDApLCBtYXhUb3ApO1xuXG4gICAgICAgICAgICAvLyBpZiBzY3JvbGxpbmcgZG93biwgbWFrZSBzdXJlIGEgZnJhY3Rpb25hbCBjaGFuZ2UgdG8gdGhlXG4gICAgICAgICAgICAvLyBzY3JvbGwgcG9zaXRpb24gaXNuJ3Qgcm91bmRlZCBhd2F5IHdoZW4gdGhlIHNjcm9sbGJhcidzIENTUyBpcyBzZXRcbiAgICAgICAgICAgIC8vIHRoaXMgZmxvb3Jpbmcgb2YgZGVsdGEgd291bGQgaGFwcGVuZWQgYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAgICAgICAvLyBiYXIuY3NzIGlzIHNldCBiZWxvdywgYnV0IHdlIGZsb29yIGhlcmUgZm9yIGNsYXJpdHlcbiAgICAgICAgICAgIGRlbHRhID0gKHkgPiAwKSA/IE1hdGguY2VpbChkZWx0YSkgOiBNYXRoLmZsb29yKGRlbHRhKTtcblxuICAgICAgICAgICAgLy8gc2Nyb2xsIHRoZSBzY3JvbGxiYXJcbiAgICAgICAgICAgIGJhci5jc3MoeyB0b3A6IGRlbHRhICsgJ3B4JyB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjYWxjdWxhdGUgYWN0dWFsIHNjcm9sbCBhbW91bnRcbiAgICAgICAgICBwZXJjZW50U2Nyb2xsID0gcGFyc2VJbnQoYmFyLmNzcygndG9wJykpIC8gKG1lLm91dGVySGVpZ2h0KCkgLSBiYXIub3V0ZXJIZWlnaHQoKSk7XG4gICAgICAgICAgZGVsdGEgPSBwZXJjZW50U2Nyb2xsICogKG1lWzBdLnNjcm9sbEhlaWdodCAtIG1lLm91dGVySGVpZ2h0KCkpO1xuXG4gICAgICAgICAgaWYgKGlzSnVtcClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWx0YSA9IHk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gZGVsdGEgLyBtZVswXS5zY3JvbGxIZWlnaHQgKiBtZS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgb2Zmc2V0VG9wID0gTWF0aC5taW4oTWF0aC5tYXgob2Zmc2V0VG9wLCAwKSwgbWF4VG9wKTtcbiAgICAgICAgICAgIGJhci5jc3MoeyB0b3A6IG9mZnNldFRvcCArICdweCcgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2Nyb2xsIGNvbnRlbnRcbiAgICAgICAgICBtZS5zY3JvbGxUb3AoZGVsdGEpO1xuXG4gICAgICAgICAgLy8gZmlyZSBzY3JvbGxpbmcgZXZlbnRcbiAgICAgICAgICBtZS50cmlnZ2VyKCdzbGltc2Nyb2xsaW5nJywgfn5kZWx0YSk7XG5cbiAgICAgICAgICAvLyBlbnN1cmUgYmFyIGlzIHZpc2libGVcbiAgICAgICAgICBzaG93QmFyKCk7XG5cbiAgICAgICAgICAvLyB0cmlnZ2VyIGhpZGUgd2hlbiBzY3JvbGwgaXMgc3RvcHBlZFxuICAgICAgICAgIGhpZGVCYXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFdoZWVsKClcbiAgICAgICAge1xuICAgICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgX29uV2hlZWwsIGZhbHNlICk7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBfb25XaGVlbCwgZmFsc2UgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25tb3VzZXdoZWVsXCIsIF9vbldoZWVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRCYXJIZWlnaHQoKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHNjcm9sbGJhciBoZWlnaHQgYW5kIG1ha2Ugc3VyZSBpdCBpcyBub3QgdG9vIHNtYWxsXG4gICAgICAgICAgYmFySGVpZ2h0ID0gTWF0aC5tYXgoKG1lLm91dGVySGVpZ2h0KCkgLyBtZVswXS5zY3JvbGxIZWlnaHQpICogbWUub3V0ZXJIZWlnaHQoKSwgbWluQmFySGVpZ2h0KTtcbiAgICAgICAgICBiYXIuY3NzKHsgaGVpZ2h0OiBiYXJIZWlnaHQgKyAncHgnIH0pO1xuXG4gICAgICAgICAgLy8gaGlkZSBzY3JvbGxiYXIgaWYgY29udGVudCBpcyBub3QgbG9uZyBlbm91Z2hcbiAgICAgICAgICB2YXIgZGlzcGxheSA9IGJhckhlaWdodCA9PSBtZS5vdXRlckhlaWdodCgpID8gJ25vbmUnIDogJ2Jsb2NrJztcbiAgICAgICAgICBiYXIuY3NzKHsgZGlzcGxheTogZGlzcGxheSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dCYXIoKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gcmVjYWxjdWxhdGUgYmFyIGhlaWdodFxuICAgICAgICAgIGdldEJhckhlaWdodCgpO1xuICAgICAgICAgIGNsZWFyVGltZW91dChxdWV1ZUhpZGUpO1xuXG4gICAgICAgICAgLy8gd2hlbiBiYXIgcmVhY2hlZCB0b3Agb3IgYm90dG9tXG4gICAgICAgICAgaWYgKHBlcmNlbnRTY3JvbGwgPT0gfn5wZXJjZW50U2Nyb2xsKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vcmVsZWFzZSB3aGVlbFxuICAgICAgICAgICAgcmVsZWFzZVNjcm9sbCA9IG8uYWxsb3dQYWdlU2Nyb2xsO1xuXG4gICAgICAgICAgICAvLyBwdWJsaXNoIGFwcHJvcG9yaWF0ZSBldmVudFxuICAgICAgICAgICAgaWYgKGxhc3RTY3JvbGwgIT0gcGVyY2VudFNjcm9sbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0gKH5+cGVyY2VudFNjcm9sbCA9PT0gMCkgPyAndG9wJyA6ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIG1lLnRyaWdnZXIoJ3NsaW1zY3JvbGwnLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAge1xuICAgICAgICAgICAgcmVsZWFzZVNjcm9sbCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0U2Nyb2xsID0gcGVyY2VudFNjcm9sbDtcblxuICAgICAgICAgIC8vIHNob3cgb25seSB3aGVuIHJlcXVpcmVkXG4gICAgICAgICAgaWYoYmFySGVpZ2h0ID49IG1lLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgIC8vYWxsb3cgd2luZG93IHNjcm9sbFxuICAgICAgICAgICAgcmVsZWFzZVNjcm9sbCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGJhci5zdG9wKHRydWUsdHJ1ZSkuZmFkZUluKCdmYXN0Jyk7XG4gICAgICAgICAgaWYgKG8ucmFpbFZpc2libGUpIHsgcmFpbC5zdG9wKHRydWUsdHJ1ZSkuZmFkZUluKCdmYXN0Jyk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpZGVCYXIoKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gb25seSBoaWRlIHdoZW4gb3B0aW9ucyBhbGxvdyBpdFxuICAgICAgICAgIGlmICghby5hbHdheXNWaXNpYmxlKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXVlSGlkZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgaWYgKCEoby5kaXNhYmxlRmFkZU91dCAmJiBpc092ZXJQYW5lbCkgJiYgIWlzT3ZlckJhciAmJiAhaXNEcmFnZylcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJhci5mYWRlT3V0KCdzbG93Jyk7XG4gICAgICAgICAgICAgICAgcmFpbC5mYWRlT3V0KCdzbG93Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgLy8gbWFpbnRhaW4gY2hhaW5hYmlsaXR5XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xuXG4gICQuZm4uZXh0ZW5kKHtcbiAgICBzbGltc2Nyb2xsOiAkLmZuLnNsaW1TY3JvbGxcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2xpbVNjcm9sbDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBwcmVsb2FkZXI6ICQoJyNwcmVsb2FkZXJzJyksXG4gICAgbmF0dXJhbEg6IDAsXG4gICAgbmF0dXJhbFc6IDAsXG4gICAgaW1nTG9hZGVkOiB7fSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgIGhhc1ZpZGVvICAgID0gZWwuZGF0YSgndmlkZW8nKSA/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgICwgICAkcGFyYWxsYXhlcyA9ICQoJyNwYXJhbGxheGVzJylcbiAgICAgICAgLCAgIGhhc1BhcmFsbGF4ID0gJHBhcmFsbGF4ZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZCA9IGltYWdlc0xvYWRlZCggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpICk7XG4gICAgICAgIHNlbGYuZWxlbWVudCA9IGVsO1xuXG4gICAgICAgIHNlbGYuaW1nTG9hZGVkLm9uKCdhbHdheXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc2VsZi5uYXR1cmFsSCA9IHNlbGYuZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHNlbGYubmF0dXJhbFcgPSBzZWxmLmVsZW1lbnQud2lkdGgoKTtcblxuICAgICAgICAgICAgc2VsZi5yZXNjYWxlSW1hZ2UoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5wcmVsb2FkZXIuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzVmlkZW8gJiYgIWhhc1BhcmFsbGF4KSBzZWxmLmxvYWRWaWRlbyhzZWxmLmVsZW1lbnQuZGF0YSgndmlkZW8nKSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzUGFyYWxsYXgpIHNlbGYuaW5pdFBhcmFsbGF4KCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBsb2FkVmlkZW86IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBpc1RvdWNoID0gTW9kZXJuaXpyLnRvdWNoO1xuICAgICAgICBpZiAoaXNUb3VjaCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBCVlNvdXJjZXMgPSBbXVxuICAgICAgICAsICAgQlZTb3VyY2VzVHlwZSA9IFsnbXA0JywgJ3dlYm0nLCAnb2d2J11cbiAgICAgICAgO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQlZTb3VyY2VzVHlwZS5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIEJWU291cmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmlkZW8vJyArIEJWU291cmNlc1R5cGVbaV0sXG4gICAgICAgICAgICAgICAgc3JjOiB1cmwgKyAnLicgKyBCVlNvdXJjZXNUeXBlW2ldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKEJWU291cmNlcyk7XG5cbiAgICAgICAgdmFyIEJWID0gbmV3ICQuQmlnVmlkZW8oe1xuICAgICAgICAgICAgdXNlRmxhc2hGb3JGaXJlZm94OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgQlYuaW5pdCgpO1xuICAgICAgICBCVi5zaG93KEJWU291cmNlcywge1xuICAgICAgICAgICAgYW1iaWVudDogdHJ1ZVxuICAgICAgICAgICAgLCBhbHRTb3VyY2U6ICdhc3NldHMvdmlkZW9zL1kud2VibSdcbiAgICAgICAgICAgICwgdGVjaE9yZGVyOiBbJ2h0bWw1J11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgQlYuZ2V0UGxheWVyKCkub24oJ2xvYWRlZGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuZWxlbWVudC5hZGRDbGFzcygndmlkZW8tbG9hZGVkJyk7XG4gICAgICAgICAgICAkKCcjcHJlbG9hZGVycycpLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgJCgnI3ByZWxvYWRlcnMnKS5jc3MoJ3otaW5kZXgnLCAnLTkwMDAnKTsgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzY2FsZUltYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5lbGVtZW50Lmxlbmd0aCkgY29uc29sZS53YXJuaW5nKCdubyBiYWNrZ3JvdW5kIGltYWdlJyk7XG5cbiAgICAgICAgdmFyIGltYWdlUmF0aW8gPSB0aGlzLm5hdHVyYWxXIC8gdGhpcy5uYXR1cmFsSFxuICAgICAgICAsICAgdmlld3BvcnRSYXRpbyA9ICQod2luZG93KS53aWR0aCgpIC8gJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgICAgICwgICBwdXNoTGVmdFxuICAgICAgICAsICAgcHVzaFRvcFxuICAgICAgICA7XG5cbiAgICAgICAgaWYgKHZpZXdwb3J0UmF0aW8gPCBpbWFnZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtd2lkdGgnKS5hZGRDbGFzcygnZnVsbC1oZWlnaHQnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gKCBpbWFnZVJhdGlvICogJCh3aW5kb3cpLmhlaWdodCgpIC0gJCh3aW5kb3cpLndpZHRoKCkgKSAvIC0yO1xuICAgICAgICAgICAgcHVzaFRvcCA9IDA7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gMDtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAodGhpcy5lbGVtZW50LmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpKSAvIC0yO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdFBhcmFsbGF4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICAkcGFyYWxsYXggPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICAkaW1ncyA9ICQoJy5wYXJhbGxheC1pbWFnZScpXG4gICAgICAgICwgICBfcGggPSAkcGFyYWxsYXguaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIENlbnRlciBpbWFnZSB2ZXJ0aWNhbGx5IGJ5IG1hcmdpblxuICAgICAgICAkaW1ncy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7ICdtYXJnaW4tdG9wJzogKF9waCAtICQodGhpcykuaGVpZ2h0KCkpLzIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQucGFyYWxsYXhpZnkoe1xuICAgICAgICAgICAgcG9zaXRpb25Qcm9wZXJ0eTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCcucmVjb2xvcicpLmxlbmd0aCB8fCAhJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgQmFja2dyb3VuZENoZWNrLmluaXQoe1xuICAgICAgICAgICAgdGFyZ2V0czogJy5yZWNvbG9yJ1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyICR0b2dnbGVyID0gZWwuZmluZCgnLmhvbWUtaGVyby10b2dnbGVyJyksXG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5ID0gZWwuZmluZCgnLmhvbWUtaGVyby1ib2R5JylcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgJHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5LnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgX3Njb3BlID0gdGhpcztcbiAgICAgICAgZWwuZmluZCgnLm5hdi0xJykuZWFjaChmdW5jdGlvbihpKSB7XG5cbiAgICAgICAgICAgIHZhciAkZWwgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgX3N2Z09iaiA9ICQodGhpcykuZmluZCgnLm5hdi0xLW9iamVjdCcpWzBdXG4gICAgICAgICAgICAsICAgX3N2Z0RvY1xuICAgICAgICAgICAgLCAgIF9uYXZFbFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBfc3ZnT2JqLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfc3ZnRG9jID0gX3N2Z09iai5jb250ZW50RG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgX25hdkVsICA9IF9zdmdEb2MucXVlcnlTZWxlY3RvcignLm5hdmlnYXRpb24tc3ZnJyk7XG5cbiAgICAgICAgICAgICAgICBpZigkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZyBhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgICRlbC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX25hdkVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbmF2aWdhdGlvbi1zdmcgaG92ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2hvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgX3Njb3BlLnRvZ2dsZShlbCwgJCh0aGlzKS5jbG9zZXN0KCcubmF2JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKHBhcmVudCwgZWwpIHtcbiAgICAgICAgZWwuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICBlbHNlICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZWwudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICB9LFxuICAgIGluaXRQYWdlTmF2aWdhdGlvbjogIGZ1bmN0aW9uKGhhc0luZm8pIHtcbiAgICAgICAgdmFyICRpbmZvQnRuVG9nZ2xlcnMgPSAkKCcuaW5mby1idG4tdG9nZ2xlcnMnKVxuICAgICAgICAsICAgJHBhZ2VJbmZvcyA9ICQoJy5wYWdlLWluZm9zJylcbiAgICAgICAgLCAgICRwYWdlU3ViTmF2cyA9ICQoJyNwYWdlLXN1Ym5hdmlnYXRpb25zJylcbiAgICAgICAgLCAgICRwYWdlU3ViTmF2TGluayA9ICQoJyNwYWdlLXN1Ym5hdmlnYXRpb24tbGluaycpXG4gICAgICAgIDtcblxuICAgICAgICAkaW5mb0J0blRvZ2dsZXJzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBpZigkcGFnZUluZm9zLmxlbmd0aCkgJHBhZ2VJbmZvcy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBpZigkcGFnZVN1Yk5hdnMubGVuZ3RoKSAkcGFnZVN1Yk5hdnMudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcGFnZVN1Yk5hdnMuZmluZCgnLnBhZ2Utc3VibmF2aWdhdGlvbi1saW5rJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJGluZm9CdG5Ub2dnbGVyc1xuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmluZm8tYnRuLXRvZ2dsZXJbZGF0YS1wcm9qZWN0XScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXByb2plY3QnLCAkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnRleHQoJCh0aGlzKS5kYXRhKCdwcm9qZWN0JykpXG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJHRvZ2dsZXI6ICQoKSxcbiAgICAkcmVsYXRlZEVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi4kcmVsYXRlZEVsZW1lbnQgPSBlbDtcbiAgICAgICAgc2VsZi50b2dnbGVyID0gZWwuZmluZCgnLnJlbGF0ZWQtdG9nZ2xlcicpO1xuXG4gICAgICAgIHNlbGYudG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgICAgIHZhciBzZWxmICAgICAgICAgICA9IHRoaXNcbiAgICAgICAgLCAgICR0aHVtYkdyb3VwcyAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYi1ncm91cHMnKVxuICAgICAgICAsICAgJHRodW1icyAgICAgICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JzID0gJCgnLnBhZ2UtbmF2aWdhdGlvbnMuaGFzLXRodW1icyAucGFnZS1zZWxlY3RvcnMnKVxuICAgICAgICAsICAgaXNTd2FwICAgICAgICAgPSBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgdmFyIGhhc05ldSA9IGVsLmhhc0NsYXNzKCdoYXMtbmV1Jyk7IC8qY29uc29sZS5sb2coJ2hhc05ldScgLGhhc05ldSk7Ki9cblxuICAgICAgICB2YXIgX3RodW1iTiA9ICR0aHVtYnMubGVuZ3RoXG4gICAgICAgICwgICBfdGh1bWJHcm91cHNMaW1pdCA9IGhhc05ldSA/IDQgOiA2XG4gICAgICAgICwgICBfdGh1bWJHcm91cE4gPSAoX3RodW1iTiA+IF90aHVtYkdyb3Vwc0xpbWl0KSA/IE1hdGguY2VpbChfdGh1bWJOIC8gX3RodW1iR3JvdXBzTGltaXQpIDogMVxuICAgICAgICAsICAgX3RodW1iU3RhcnQgPSAwXG4gICAgICAgICwgICBfdGh1bWJFbmQgPSBfdGh1bWJHcm91cE5cbiAgICAgICAgLCAgIF90aHVtYkdyb3VwVGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInRodW1iLWdyb3VwXCIgLz4nXG4gICAgICAgICwgICBfZWxXaWR0aCA9IHRoaXMuZWxlbWVudC53aWR0aCgpXG4gICAgICAgICwgICBfdGh1bWJHcm91cExlZnQgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBzZXQgLnRodW1iLWdyb3VwcyB3aWR0aFxuICAgICAgICAkdGh1bWJHcm91cHMuY3NzKCd3aWR0aCcsIDEwMCAqIF90aHVtYkdyb3VwTiArIFwiJVwiKTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBncm91cCAudGh1bWIsIGFuZCBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aHVtYkdyb3VwTjsgaSArKykge1xuICAgICAgICAgICAgLy8gYmVnaW4gZ3JvdXBpbmcgdGh1bWJcbiAgICAgICAgICAgIF90aHVtYlN0YXJ0ID0gKChfdGh1bWJHcm91cHNMaW1pdCArIDApICogaSk7XG4gICAgICAgICAgICBfdGh1bWJFbmQgPSBfdGh1bWJTdGFydCArIF90aHVtYkdyb3Vwc0xpbWl0O1xuICAgICAgICAgICAgJHRodW1ic1xuICAgICAgICAgICAgICAgIC5zbGljZSggX3RodW1iU3RhcnQsIF90aHVtYkVuZCApXG4gICAgICAgICAgICAgICAgLndyYXBBbGwoX3RodW1iR3JvdXBUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSYW5kb21pemUgdGh1bWIgaW1hZ2UvdGV4dCBwb3NpdGlvblxuICAgICAgICAkdGh1bWJzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICAgICAgaXNTd2FwID0gTWF0aC5yYW5kb20oKSA+PSAwLjUgPyBpc1N3YXAgOiAhaXNTd2FwO1xuICAgICAgICAgICAgaWYgKGlzU3dhcCAmJiAhaGFzTmV1KSAkKHRoaXMpLmFkZENsYXNzKCdpcy1zd2FwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGR5bmFtaWNhbGx5IGNyZWF0ZSBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciBfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgcHJldlwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmx0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgLCAgIF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSAgPSAnPGxpIGNsYXNzPVwicGFnZS1zZWxlY3RvclwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmsgcmVjb2xvclwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTmV4dFRlbXBsYXRlID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3IgbmV4dFwiPjxhIGRhdGEtc2xpZGUgY2xhc3M9XCJwYWdlLXNlbGVjdG9yLWxpbmtcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PG9iamVjdCBkYXRhPVwiYXNzZXRzL2ltYWdlcy9pY29uL2Fycm93LWJsYWNrLnN2Z1wiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgY2xhc3M9XCJpY29uXCI+Jmd0Ozwvb2JqZWN0PjwvYT48L2xpPidcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICgkcGFnZVNlbGVjdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIEZpcnN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBwcmV2XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JQcmV2VGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAvLyBOZXh0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBudW1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgX3RodW1iR3JvdXBOOyBqICsrKSB7XG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOdW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExhc3Q6IGNyZWF0ZSBwYWdlLXNlbGVjdG9yIG5leHRcbiAgICAgICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9ycy5hcHBlbmQoX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISRwYWdlU2VsZWN0b3JzLmZpbmQoJ2xpJykubGVuZ3RoKSAkcGFnZVNlbGVjdG9ycy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIERlZmluZSBzZWxlY3RvciBoZWxwZXJzXG4gICAgICAgIHZhciAkcGFnZVNlbGVjdG9yID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3InKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvclByZXYgPSAkcGFnZVNlbGVjdG9ycy5maW5kKCcucGFnZS1zZWxlY3Rvci5wcmV2JylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JOZXh0ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IubmV4dCcpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgcHJldlxuICAgICAgICAkcGFnZVNlbGVjdG9yUHJldi5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICdwcmV2Jyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgYW5kIHRleHQgZm9yIHNlbGVjdG9yIG51bVxuICAgICAgICAkcGFnZVNlbGVjdG9yXG4gICAgICAgICAgICAubm90KCRwYWdlU2VsZWN0b3JQcmV2KVxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yTmV4dClcbiAgICAgICAgICAgIC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC50ZXh0KChpbmRleCArIDEpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWRlJywgaW5kZXgpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZhdWx0IHN0eWxlIGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBlbHNlICRwYWdlU2VsZWN0b3Iubm90KCRwYWdlU2VsZWN0b3JQcmV2KS5lcSgwKS5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBTZXQgZGF0YS1zbGlkZSBmb3Igc2VsZWN0b3IgbmV4dFxuICAgICAgICAkcGFnZVNlbGVjdG9yTmV4dC5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykuYXR0cignZGF0YS1zbGlkZScsICduZXh0Jyk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IHRvIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgdmFyICRzZWxlY3RvciA9ICQoKVxuICAgICAgICAsICAgX2RhdGFTbGlkZSA9IDBcbiAgICAgICAgO1xuXG4gICAgICAgICRwYWdlU2VsZWN0b3IuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICQodGhpcykuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpO1xuICAgICAgICAgICAgJHNlbGVjdG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAncHJldicpIF9kYXRhU2xpZGUgLS07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoJCh0aGlzKS5kYXRhKCdzbGlkZScpID09PSAnbmV4dCcpIF9kYXRhU2xpZGUgKys7XG4gICAgICAgICAgICAgICAgZWxzZSBfZGF0YVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9kYXRhU2xpZGUgPCAwKSBfZGF0YVNsaWRlID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChfZGF0YVNsaWRlID4gKF90aHVtYkdyb3VwTiAtIDEpKSBfZGF0YVNsaWRlID0gKF90aHVtYkdyb3VwTiAtIDEpO1xuXG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnLCBfZGF0YVNsaWRlKTtcbiAgICAgICAgICAgICAgICBfdGh1bWJHcm91cExlZnQgPSAkdGh1bWJHcm91cHMuYXR0cignZGF0YS1zbGlkZScpICogX2VsV2lkdGg7XG4gICAgICAgICAgICAgICAgJHRodW1iR3JvdXBzLmNzcyggJ2xlZnQnLCAnLScgKyBfdGh1bWJHcm91cExlZnQgKyAncHgnICk7XG5cbiAgICAgICAgICAgICAgICAkcGFnZVNlbGVjdG9yLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdmFyIF9saW5rU2VsZWN0b3JTdHJpbmcgPSAnLnBhZ2Utc2VsZWN0b3ItbGlua1tkYXRhLXNsaWRlPVwiJyArIF9kYXRhU2xpZGUgKyAnXCJdJztcbiAgICAgICAgICAgICAgICAkKF9saW5rU2VsZWN0b3JTdHJpbmcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkeHh4VGVtcGxhdGUgPSAgJzxkaXYgaWQ9XCJ4eHhcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInh4eC1pbm5lclwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cD5DdXJyZW50bHksPC9wPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cD50aGlzIHNpdGUgZG9lcyBub3Qgc3VwcG9ydCBtb2JpbGUvdG91Y2ggZGV2aWNlcy48L3A+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwPlZpZXcgb24gZGVza3RvcCBjb21wdXRlcnMgZm9yIGJldHRlciBleHBlcmllbmNlLjwvcD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgO1xuXG4gICAgICAgIGlmIChNb2Rlcm5penIudG91Y2gpICQoJ2JvZHknKS5hcHBlbmQoJHh4eFRlbXBsYXRlKTtcbiAgICB9XG59O1xuIl19
