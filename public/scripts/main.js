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

        var hasNeu = el.hasClass('has-neu'); console.log('hasNeu' ,hasNeu);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vY2xpZW50L3NjcmlwdHMvbWFpbiIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL2hlbHBlci9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL2pRdWVyeS1zbGltU2Nyb2xsLWJyb3dzZXJpZnkuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1hc3NldC5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWNvbG9yLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktaG9tZS5qcyIsIi9Vc2Vycy9iYW5nc2F3YW4vU2l0ZXMveWFzc2Vycml6a3ktYWxsL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLW5hdmlnYXRpb24uanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1yZWxhdGVkLmpzIiwiL1VzZXJzL2JhbmdzYXdhbi9TaXRlcy95YXNzZXJyaXpreS1hbGwvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdGh1bWIuanMiLCIvVXNlcnMvYmFuZ3Nhd2FuL1NpdGVzL3lhc3NlcnJpemt5LWFsbC93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS10b3VjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUFzc2V0ICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1hc3NldCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgICwgICB1aVRodW1iICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10aHVtYicpXG4gICAgLCAgIHVpUmVsYXRlZCAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXJlbGF0ZWQnKVxuICAgICwgICB1aVRvdWNoICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10b3VjaCcpXG4gICAgO1xuXG4gICAgdmFyIFNsaW1TY3JvbGwgPSByZXF1aXJlKCcuL21vZHVsZS91aS9qUXVlcnktc2xpbVNjcm9sbC1icm93c2VyaWZ5JykoKTtcblxuICAgIC8vIER5bmFtaWMgY29sb3JcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB1aUNvbG9yLmluaXQoKTsgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQXNzZXQuaW5pdCgkKCcuYmFja2dyb3VuZCcpKTtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkgeyB1aUFzc2V0LnJlc2NhbGVJbWFnZSgpOyB9KTtcblxuICAgIC8vIE1haW4gbmF2aWdhdGlvblxuICAgIHZhciAkbmF2cyA9ICQoJyNuYXZpZ2F0aW9uJyk7XG4gICAgaWYgKCRuYXZzLmxlbmd0aCkgdWlOYXZpZ2F0aW9uLmluaXQoJG5hdnMpO1xuXG4gICAgLy8gUGFnZSBuYXZpZ2F0aW9uXG4gICAgaWYgKCQoJy5wYWdlLW5hdmlnYXRpb25zJykubGVuZ3RoKVxuICAgICAgICB1aU5hdmlnYXRpb24uaW5pdFBhZ2VOYXZpZ2F0aW9uKCQoJ3BhZ2UtbmF2aWdhdGlvbnMuaGFzLWluZm9zJykubGVuZ3RoKTtcblxuICAgIC8vIEhvbWVcbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcblxuICAgIC8vIFRodW1ibmFpbHNcbiAgICBpZiAoJCgnLnRodW1icycpLmxlbmd0aCkgdWlUaHVtYi5pbml0KCQoJy50aHVtYnMnKSk7XG5cbiAgICAvLyBSZWxhdGVzXG4gICAgaWYgKCQoJy5yZWxhdGVkcycpLmxlbmd0aCkgdWlSZWxhdGVkLmluaXQoJCgnLnJlbGF0ZWRzJykpO1xuXG4gICAgLy8gU2hhbWVcbiAgICAvLyBNb3ZlIHRvIGl0J3Mgb3duIG1vZHVsZVxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnZpZXdlci1jbG9zZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCcjdmlld2VycycpLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGNyZWF0ZVZpZXdlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGJhY2tncm91bmRFbCA9ICQoJy5iYWNrZ3JvdW5kJylcbiAgICAgICAgLCAgIGltZ1NyYyA9ICRiYWNrZ3JvdW5kRWwuYXR0cignc3JjJylcbiAgICAgICAgLCAgIHZpZXdlcnNUZW1wbGF0ZSA9XG4gICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ2aWV3ZXJzXCIgY2xhc3M9XCJwcmVcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGRpdiBjbGFzcz1cInZpZXdlci1wcmVsb2FkZXJcIj48cD5sb2FkaW5nIGltYWdlLi4uPC9wPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwiY3JvcGl0LWltYWdlLXByZXZpZXdcIj48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGlucHV0IHR5cGU9XCJyYW5nZVwiIGNsYXNzPVwiY3JvcGl0LWltYWdlLXpvb20taW5wdXRcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGlucHV0IHR5cGU9XCJmaWxlXCIgY2xhc3M9XCJjcm9waXQtaW1hZ2UtaW5wdXRcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInZpZXdlci1jbG9zZVwiPng8L2E+J1xuICAgICAgICAgICAgICAgICsnPC9kaXY+J1xuICAgICAgICA7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlUHJlKCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcjdmlld2VycycpLnJlbW92ZUNsYXNzKCdwcmUnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJ2FbZGF0YS10b29sPVwiaW1hZ2VcIicpKSB7XG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKHZpZXdlcnNUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIGlmKCQoJyN2aWV3ZXJzJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJCgnI3ZpZXdlcnMnKS5jcm9waXQoe1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVN0YXRlOiB7IHNyYzogaW1nU3JjIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uSW1hZ2VMb2FkZWQ6IHJlbW92ZVByZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQoJy5wYWdlLXRvb2wtYnRuW2RhdGEtdG9vbD1cImltYWdlXCJdJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgY3JlYXRlVmlld2VyKCk7IH0pO1xuXG4gICAgLy8gU2hhbWVcbiAgICB2YXIgaXNPcGVuID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gdXBkYXRlSW5mb0NyZWRpdCgpIHtcbiAgICAgICAgaXNPcGVuID0gIWlzT3BlbjtcbiAgICAgICAgaWYgKCFpc09wZW4pICAkKCcuY29udGFjdC1jcmVkaXRzJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgICAgZWxzZSAkKCcuY29udGFjdC1jcmVkaXRzJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9XG5cbiAgICAkKCcuY29udGFjdC1jcmVkaXQtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB1cGRhdGVJbmZvQ3JlZGl0KCk7XG4gICAgfSk7XG5cbiAgICAkKCcucXVlc3Rpb24nKS5zbGltU2Nyb2xsKHtcbiAgICAgICAgaGVpZ2h0OiAnMjY0cHgnLFxuICAgICAgICBzaXplOiAnNHB4JyxcbiAgICAgICAgY29sb3I6ICcjMDAwJyxcbiAgICAgICAgb3BhY2l0eTogJzEnLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIGFsd2F5c1Zpc2libGU6IHRydWUsXG4gICAgICAgIGRpc3RhbmNlOiAwXG4gICAgfSk7XG5cbiAgICB1aVRvdWNoLmluaXQoKTtcblxufSkoalF1ZXJ5KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRocmVzaG9sZCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5kZWJvdW5jZVxuICAgICAgICAsICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7IFxuICAgICAgICB9XG4gXG4gICAgICAgIGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGVsc2UgaWYgKGltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiBcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7IFxuICAgIH07XG59O1xuIiwiZnVuY3Rpb24gU2xpbVNjcm9sbCgpIHtcbiAgJC5mbi5leHRlbmQoe1xuICAgIHNsaW1TY3JvbGw6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgdmFyIGRlZmF1bHRzID0ge1xuXG4gICAgICAgIC8vIHdpZHRoIGluIHBpeGVscyBvZiB0aGUgdmlzaWJsZSBzY3JvbGwgYXJlYVxuICAgICAgICB3aWR0aCA6ICdhdXRvJyxcblxuICAgICAgICAvLyBoZWlnaHQgaW4gcGl4ZWxzIG9mIHRoZSB2aXNpYmxlIHNjcm9sbCBhcmVhXG4gICAgICAgIGhlaWdodCA6ICcyNTBweCcsXG5cbiAgICAgICAgLy8gd2lkdGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxiYXIgYW5kIHJhaWxcbiAgICAgICAgc2l6ZSA6ICc3cHgnLFxuXG4gICAgICAgIC8vIHNjcm9sbGJhciBjb2xvciwgYWNjZXB0cyBhbnkgaGV4L2NvbG9yIHZhbHVlXG4gICAgICAgIGNvbG9yOiAnIzAwMCcsXG5cbiAgICAgICAgLy8gc2Nyb2xsYmFyIHBvc2l0aW9uIC0gbGVmdC9yaWdodFxuICAgICAgICBwb3NpdGlvbiA6ICdyaWdodCcsXG5cbiAgICAgICAgLy8gZGlzdGFuY2UgaW4gcGl4ZWxzIGJldHdlZW4gdGhlIHNpZGUgZWRnZSBhbmQgdGhlIHNjcm9sbGJhclxuICAgICAgICBkaXN0YW5jZSA6ICcxcHgnLFxuXG4gICAgICAgIC8vIGRlZmF1bHQgc2Nyb2xsIHBvc2l0aW9uIG9uIGxvYWQgLSB0b3AgLyBib3R0b20gLyAkKCdzZWxlY3RvcicpXG4gICAgICAgIHN0YXJ0IDogJ3RvcCcsXG5cbiAgICAgICAgLy8gc2V0cyBzY3JvbGxiYXIgb3BhY2l0eVxuICAgICAgICBvcGFjaXR5IDogMC40LFxuXG4gICAgICAgIC8vIGVuYWJsZXMgYWx3YXlzLW9uIG1vZGUgZm9yIHRoZSBzY3JvbGxiYXJcbiAgICAgICAgYWx3YXlzVmlzaWJsZSA6IGZhbHNlLFxuXG4gICAgICAgIC8vIGNoZWNrIGlmIHdlIHNob3VsZCBoaWRlIHRoZSBzY3JvbGxiYXIgd2hlbiB1c2VyIGlzIGhvdmVyaW5nIG92ZXJcbiAgICAgICAgZGlzYWJsZUZhZGVPdXQgOiBmYWxzZSxcblxuICAgICAgICAvLyBzZXRzIHZpc2liaWxpdHkgb2YgdGhlIHJhaWxcbiAgICAgICAgcmFpbFZpc2libGUgOiBmYWxzZSxcblxuICAgICAgICAvLyBzZXRzIHJhaWwgY29sb3JcbiAgICAgICAgcmFpbENvbG9yIDogJyMzMzMnLFxuXG4gICAgICAgIC8vIHNldHMgcmFpbCBvcGFjaXR5XG4gICAgICAgIHJhaWxPcGFjaXR5IDogMC4yLFxuXG4gICAgICAgIC8vIHdoZXRoZXIgIHdlIHNob3VsZCB1c2UgalF1ZXJ5IFVJIERyYWdnYWJsZSB0byBlbmFibGUgYmFyIGRyYWdnaW5nXG4gICAgICAgIHJhaWxEcmFnZ2FibGUgOiB0cnVlLFxuXG4gICAgICAgIC8vIGRlZmF1dGx0IENTUyBjbGFzcyBvZiB0aGUgc2xpbXNjcm9sbCByYWlsXG4gICAgICAgIHJhaWxDbGFzcyA6ICdzbGltU2Nyb2xsUmFpbCcsXG5cbiAgICAgICAgLy8gZGVmYXV0bHQgQ1NTIGNsYXNzIG9mIHRoZSBzbGltc2Nyb2xsIGJhclxuICAgICAgICBiYXJDbGFzcyA6ICdzbGltU2Nyb2xsQmFyJyxcblxuICAgICAgICAvLyBkZWZhdXRsdCBDU1MgY2xhc3Mgb2YgdGhlIHNsaW1zY3JvbGwgd3JhcHBlclxuICAgICAgICB3cmFwcGVyQ2xhc3MgOiAnc2xpbVNjcm9sbERpdicsXG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbW91c2V3aGVlbCBzaG91bGQgc2Nyb2xsIHRoZSB3aW5kb3cgaWYgd2UgcmVhY2ggdG9wL2JvdHRvbVxuICAgICAgICBhbGxvd1BhZ2VTY3JvbGwgOiBmYWxzZSxcblxuICAgICAgICAvLyBzY3JvbGwgYW1vdW50IGFwcGxpZWQgdG8gZWFjaCBtb3VzZSB3aGVlbCBzdGVwXG4gICAgICAgIHdoZWVsU3RlcCA6IDIwLFxuXG4gICAgICAgIC8vIHNjcm9sbCBhbW91bnQgYXBwbGllZCB3aGVuIHVzZXIgaXMgdXNpbmcgZ2VzdHVyZXNcbiAgICAgICAgdG91Y2hTY3JvbGxTdGVwIDogMjAwLFxuXG4gICAgICAgIC8vIHNldHMgYm9yZGVyIHJhZGl1c1xuICAgICAgICBib3JkZXJSYWRpdXM6ICc3cHgnLFxuXG4gICAgICAgIC8vIHNldHMgYm9yZGVyIHJhZGl1cyBvZiB0aGUgcmFpbFxuICAgICAgICByYWlsQm9yZGVyUmFkaXVzIDogJzdweCdcbiAgICAgIH07XG5cbiAgICAgIHZhciBvID0gJC5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAvLyBkbyBpdCBmb3IgZXZlcnkgZWxlbWVudCB0aGF0IG1hdGNoZXMgc2VsZWN0b3JcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICB2YXIgaXNPdmVyUGFuZWwsIGlzT3ZlckJhciwgaXNEcmFnZywgcXVldWVIaWRlLCB0b3VjaERpZixcbiAgICAgICAgYmFySGVpZ2h0LCBwZXJjZW50U2Nyb2xsLCBsYXN0U2Nyb2xsLFxuICAgICAgICBkaXZTID0gJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgbWluQmFySGVpZ2h0ID0gMzAsXG4gICAgICAgIHJlbGVhc2VTY3JvbGwgPSBmYWxzZTtcblxuICAgICAgICAvLyB1c2VkIGluIGV2ZW50IGhhbmRsZXJzIGFuZCBmb3IgYmV0dGVyIG1pbmlmaWNhdGlvblxuICAgICAgICB2YXIgbWUgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIGVuc3VyZSB3ZSBhcmUgbm90IGJpbmRpbmcgaXQgYWdhaW5cbiAgICAgICAgaWYgKG1lLnBhcmVudCgpLmhhc0NsYXNzKG8ud3JhcHBlckNsYXNzKSlcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gc3RhcnQgZnJvbSBsYXN0IGJhciBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IG1lLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICAvLyBmaW5kIGJhciBhbmQgcmFpbFxuICAgICAgICAgICAgYmFyID0gbWUucGFyZW50KCkuZmluZCgnLicgKyBvLmJhckNsYXNzKTtcbiAgICAgICAgICAgIHJhaWwgPSBtZS5wYXJlbnQoKS5maW5kKCcuJyArIG8ucmFpbENsYXNzKTtcblxuICAgICAgICAgICAgZ2V0QmFySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIHNob3VsZCBzY3JvbGwgZXhpc3RpbmcgaW5zdGFuY2VcbiAgICAgICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIFBhc3MgaGVpZ2h0OiBhdXRvIHRvIGFuIGV4aXN0aW5nIHNsaW1zY3JvbGwgb2JqZWN0IHRvIGZvcmNlIGEgcmVzaXplIGFmdGVyIGNvbnRlbnRzIGhhdmUgY2hhbmdlZFxuICAgICAgICAgICAgICBpZiAoICdoZWlnaHQnIGluIG9wdGlvbnMgJiYgb3B0aW9ucy5oZWlnaHQgPT0gJ2F1dG8nICkge1xuICAgICAgICAgICAgICAgIG1lLnBhcmVudCgpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgICAgICAgICAgICBtZS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IG1lLnBhcmVudCgpLnBhcmVudCgpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIG1lLnBhcmVudCgpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBtZS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoJ3Njcm9sbFRvJyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8ganVtcCB0byBhIHN0YXRpYyBwb2ludFxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHBhcnNlSW50KG8uc2Nyb2xsVG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKCdzY3JvbGxCeScgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGp1bXAgYnkgdmFsdWUgcGl4ZWxzXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IHBhcnNlSW50KG8uc2Nyb2xsQnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKCdkZXN0cm95JyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNsaW1zY3JvbGwgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBiYXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmFpbC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBtZS51bndyYXAoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBzY3JvbGwgY29udGVudCBieSB0aGUgZ2l2ZW4gb2Zmc2V0XG4gICAgICAgICAgICAgIHNjcm9sbENvbnRlbnQob2Zmc2V0LCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgnZGVzdHJveScgaW4gb3B0aW9ucylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvcHRpb25hbGx5IHNldCBoZWlnaHQgdG8gdGhlIHBhcmVudCdzIGhlaWdodFxuICAgICAgICBvLmhlaWdodCA9IChvLmhlaWdodCA9PSAnYXV0bycpID8gbWUucGFyZW50KCkuaGVpZ2h0KCkgOiBvLmhlaWdodDtcblxuICAgICAgICAvLyB3cmFwIGNvbnRlbnRcbiAgICAgICAgdmFyIHdyYXBwZXIgPSAkKGRpdlMpXG4gICAgICAgICAgLmFkZENsYXNzKG8ud3JhcHBlckNsYXNzKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICB3aWR0aDogby53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogby5oZWlnaHRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAvLyB1cGRhdGUgc3R5bGUgZm9yIHRoZSBkaXZcbiAgICAgICAgbWUuY3NzKHtcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgd2lkdGg6IG8ud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBvLmhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBjcmVhdGUgc2Nyb2xsYmFyIHJhaWxcbiAgICAgICAgdmFyIHJhaWwgPSAkKGRpdlMpXG4gICAgICAgICAgLmFkZENsYXNzKG8ucmFpbENsYXNzKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IG8uc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBkaXNwbGF5OiAoby5hbHdheXNWaXNpYmxlICYmIG8ucmFpbFZpc2libGUpID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgICAgICdib3JkZXItcmFkaXVzJzogby5yYWlsQm9yZGVyUmFkaXVzLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogby5yYWlsQ29sb3IsXG4gICAgICAgICAgICBvcGFjaXR5OiBvLnJhaWxPcGFjaXR5LFxuICAgICAgICAgICAgekluZGV4OiA5MFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBzY3JvbGxiYXJcbiAgICAgICAgdmFyIGJhciA9ICQoZGl2UylcbiAgICAgICAgICAuYWRkQ2xhc3Moby5iYXJDbGFzcylcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG8uY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogby5zaXplLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBvcGFjaXR5OiBvLm9wYWNpdHksXG4gICAgICAgICAgICBkaXNwbGF5OiBvLmFsd2F5c1Zpc2libGUgPyAnYmxvY2snIDogJ25vbmUnLFxuICAgICAgICAgICAgJ2JvcmRlci1yYWRpdXMnIDogby5ib3JkZXJSYWRpdXMsXG4gICAgICAgICAgICBCb3JkZXJSYWRpdXM6IG8uYm9yZGVyUmFkaXVzLFxuICAgICAgICAgICAgTW96Qm9yZGVyUmFkaXVzOiBvLmJvcmRlclJhZGl1cyxcbiAgICAgICAgICAgIFdlYmtpdEJvcmRlclJhZGl1czogby5ib3JkZXJSYWRpdXMsXG4gICAgICAgICAgICB6SW5kZXg6IDk5XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0IHBvc2l0aW9uXG4gICAgICAgIHZhciBwb3NDc3MgPSAoby5wb3NpdGlvbiA9PSAncmlnaHQnKSA/IHsgcmlnaHQ6IG8uZGlzdGFuY2UgfSA6IHsgbGVmdDogby5kaXN0YW5jZSB9O1xuICAgICAgICByYWlsLmNzcyhwb3NDc3MpO1xuICAgICAgICBiYXIuY3NzKHBvc0Nzcyk7XG5cbiAgICAgICAgLy8gd3JhcCBpdFxuICAgICAgICBtZS53cmFwKHdyYXBwZXIpO1xuXG4gICAgICAgIC8vIGFwcGVuZCB0byBwYXJlbnQgZGl2XG4gICAgICAgIG1lLnBhcmVudCgpLmFwcGVuZChiYXIpO1xuICAgICAgICBtZS5wYXJlbnQoKS5hcHBlbmQocmFpbCk7XG5cbiAgICAgICAgLy8gbWFrZSBpdCBkcmFnZ2FibGUgYW5kIG5vIGxvbmdlciBkZXBlbmRlbnQgb24gdGhlIGpxdWVyeVVJXG4gICAgICAgIGlmIChvLnJhaWxEcmFnZ2FibGUpe1xuICAgICAgICAgIGJhci5iaW5kKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciAkZG9jID0gJChkb2N1bWVudCk7XG4gICAgICAgICAgICBpc0RyYWdnID0gdHJ1ZTtcbiAgICAgICAgICAgIHQgPSBwYXJzZUZsb2F0KGJhci5jc3MoJ3RvcCcpKTtcbiAgICAgICAgICAgIHBhZ2VZID0gZS5wYWdlWTtcblxuICAgICAgICAgICAgJGRvYy5iaW5kKFwibW91c2Vtb3ZlLnNsaW1zY3JvbGxcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgIGN1cnJUb3AgPSB0ICsgZS5wYWdlWSAtIHBhZ2VZO1xuICAgICAgICAgICAgICBiYXIuY3NzKCd0b3AnLCBjdXJyVG9wKTtcbiAgICAgICAgICAgICAgc2Nyb2xsQ29udGVudCgwLCBiYXIucG9zaXRpb24oKS50b3AsIGZhbHNlKTsvLyBzY3JvbGwgY29udGVudFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRkb2MuYmluZChcIm1vdXNldXAuc2xpbXNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGlzRHJhZ2cgPSBmYWxzZTtoaWRlQmFyKCk7XG4gICAgICAgICAgICAgICRkb2MudW5iaW5kKCcuc2xpbXNjcm9sbCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSkuYmluZChcInNlbGVjdHN0YXJ0LnNsaW1zY3JvbGxcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb24gcmFpbCBvdmVyXG4gICAgICAgIHJhaWwuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICBzaG93QmFyKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaGlkZUJhcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBvbiBiYXIgb3ZlclxuICAgICAgICBiYXIuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICBpc092ZXJCYXIgPSB0cnVlO1xuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgIGlzT3ZlckJhciA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzaG93IG9uIHBhcmVudCBtb3VzZW92ZXJcbiAgICAgICAgbWUuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICBpc092ZXJQYW5lbCA9IHRydWU7XG4gICAgICAgICAgc2hvd0JhcigpO1xuICAgICAgICAgIGhpZGVCYXIoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBpc092ZXJQYW5lbCA9IGZhbHNlO1xuICAgICAgICAgIGhpZGVCYXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3VwcG9ydCBmb3IgbW9iaWxlXG4gICAgICAgIG1lLmJpbmQoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlLGIpe1xuICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGgpXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gcmVjb3JkIHdoZXJlIHRvdWNoIHN0YXJ0ZWRcbiAgICAgICAgICAgIHRvdWNoRGlmID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBtZS5iaW5kKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAvLyBwcmV2ZW50IHNjcm9sbGluZyB0aGUgcGFnZSBpZiBuZWNlc3NhcnlcbiAgICAgICAgICBpZighcmVsZWFzZVNjcm9sbClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGUub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBzZWUgaG93IGZhciB1c2VyIHN3aXBlZFxuICAgICAgICAgICAgdmFyIGRpZmYgPSAodG91Y2hEaWYgLSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5wYWdlWSkgLyBvLnRvdWNoU2Nyb2xsU3RlcDtcbiAgICAgICAgICAgIC8vIHNjcm9sbCBjb250ZW50XG4gICAgICAgICAgICBzY3JvbGxDb250ZW50KGRpZmYsIHRydWUpO1xuICAgICAgICAgICAgdG91Y2hEaWYgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNldCB1cCBpbml0aWFsIGhlaWdodFxuICAgICAgICBnZXRCYXJIZWlnaHQoKTtcblxuICAgICAgICAvLyBjaGVjayBzdGFydCBwb3NpdGlvblxuICAgICAgICBpZiAoby5zdGFydCA9PT0gJ2JvdHRvbScpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBzY3JvbGwgY29udGVudCB0byBib3R0b21cbiAgICAgICAgICBiYXIuY3NzKHsgdG9wOiBtZS5vdXRlckhlaWdodCgpIC0gYmFyLm91dGVySGVpZ2h0KCkgfSk7XG4gICAgICAgICAgc2Nyb2xsQ29udGVudCgwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvLnN0YXJ0ICE9PSAndG9wJylcbiAgICAgICAge1xuICAgICAgICAgIC8vIGFzc3VtZSBqUXVlcnkgc2VsZWN0b3JcbiAgICAgICAgICBzY3JvbGxDb250ZW50KCQoby5zdGFydCkucG9zaXRpb24oKS50b3AsIG51bGwsIHRydWUpO1xuXG4gICAgICAgICAgLy8gbWFrZSBzdXJlIGJhciBzdGF5cyBoaWRkZW5cbiAgICAgICAgICBpZiAoIW8uYWx3YXlzVmlzaWJsZSkgeyBiYXIuaGlkZSgpOyB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhdHRhY2ggc2Nyb2xsIGV2ZW50c1xuICAgICAgICBhdHRhY2hXaGVlbCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9vbldoZWVsKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyB1c2UgbW91c2Ugd2hlZWwgb25seSB3aGVuIG1vdXNlIGlzIG92ZXJcbiAgICAgICAgICBpZiAoIWlzT3ZlclBhbmVsKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgICAgdmFyIGRlbHRhID0gMDtcbiAgICAgICAgICBpZiAoZS53aGVlbERlbHRhKSB7IGRlbHRhID0gLWUud2hlZWxEZWx0YS8xMjA7IH1cbiAgICAgICAgICBpZiAoZS5kZXRhaWwpIHsgZGVsdGEgPSBlLmRldGFpbCAvIDM7IH1cblxuICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY1RhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG4gICAgICAgICAgaWYgKCQodGFyZ2V0KS5jbG9zZXN0KCcuJyArIG8ud3JhcHBlckNsYXNzKS5pcyhtZS5wYXJlbnQoKSkpIHtcbiAgICAgICAgICAgIC8vIHNjcm9sbCBjb250ZW50XG4gICAgICAgICAgICBzY3JvbGxDb250ZW50KGRlbHRhLCB0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzdG9wIHdpbmRvdyBzY3JvbGxcbiAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCAmJiAhcmVsZWFzZVNjcm9sbCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICAgICAgICBpZiAoIXJlbGVhc2VTY3JvbGwpIHsgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlOyB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxDb250ZW50KHksIGlzV2hlZWwsIGlzSnVtcClcbiAgICAgICAge1xuICAgICAgICAgIHJlbGVhc2VTY3JvbGwgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgZGVsdGEgPSB5O1xuICAgICAgICAgIHZhciBtYXhUb3AgPSBtZS5vdXRlckhlaWdodCgpIC0gYmFyLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICBpZiAoaXNXaGVlbClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBtb3ZlIGJhciB3aXRoIG1vdXNlIHdoZWVsXG4gICAgICAgICAgICBkZWx0YSA9IHBhcnNlSW50KGJhci5jc3MoJ3RvcCcpKSArIHkgKiBwYXJzZUludChvLndoZWVsU3RlcCkgLyAxMDAgKiBiYXIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgLy8gbW92ZSBiYXIsIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IGdvIG91dFxuICAgICAgICAgICAgZGVsdGEgPSBNYXRoLm1pbihNYXRoLm1heChkZWx0YSwgMCksIG1heFRvcCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHNjcm9sbGluZyBkb3duLCBtYWtlIHN1cmUgYSBmcmFjdGlvbmFsIGNoYW5nZSB0byB0aGVcbiAgICAgICAgICAgIC8vIHNjcm9sbCBwb3NpdGlvbiBpc24ndCByb3VuZGVkIGF3YXkgd2hlbiB0aGUgc2Nyb2xsYmFyJ3MgQ1NTIGlzIHNldFxuICAgICAgICAgICAgLy8gdGhpcyBmbG9vcmluZyBvZiBkZWx0YSB3b3VsZCBoYXBwZW5lZCBhdXRvbWF0aWNhbGx5IHdoZW5cbiAgICAgICAgICAgIC8vIGJhci5jc3MgaXMgc2V0IGJlbG93LCBidXQgd2UgZmxvb3IgaGVyZSBmb3IgY2xhcml0eVxuICAgICAgICAgICAgZGVsdGEgPSAoeSA+IDApID8gTWF0aC5jZWlsKGRlbHRhKSA6IE1hdGguZmxvb3IoZGVsdGEpO1xuXG4gICAgICAgICAgICAvLyBzY3JvbGwgdGhlIHNjcm9sbGJhclxuICAgICAgICAgICAgYmFyLmNzcyh7IHRvcDogZGVsdGEgKyAncHgnIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhY3R1YWwgc2Nyb2xsIGFtb3VudFxuICAgICAgICAgIHBlcmNlbnRTY3JvbGwgPSBwYXJzZUludChiYXIuY3NzKCd0b3AnKSkgLyAobWUub3V0ZXJIZWlnaHQoKSAtIGJhci5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICBkZWx0YSA9IHBlcmNlbnRTY3JvbGwgKiAobWVbMF0uc2Nyb2xsSGVpZ2h0IC0gbWUub3V0ZXJIZWlnaHQoKSk7XG5cbiAgICAgICAgICBpZiAoaXNKdW1wKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlbHRhID0geTtcbiAgICAgICAgICAgIHZhciBvZmZzZXRUb3AgPSBkZWx0YSAvIG1lWzBdLnNjcm9sbEhlaWdodCAqIG1lLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICBvZmZzZXRUb3AgPSBNYXRoLm1pbihNYXRoLm1heChvZmZzZXRUb3AsIDApLCBtYXhUb3ApO1xuICAgICAgICAgICAgYmFyLmNzcyh7IHRvcDogb2Zmc2V0VG9wICsgJ3B4JyB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzY3JvbGwgY29udGVudFxuICAgICAgICAgIG1lLnNjcm9sbFRvcChkZWx0YSk7XG5cbiAgICAgICAgICAvLyBmaXJlIHNjcm9sbGluZyBldmVudFxuICAgICAgICAgIG1lLnRyaWdnZXIoJ3NsaW1zY3JvbGxpbmcnLCB+fmRlbHRhKTtcblxuICAgICAgICAgIC8vIGVuc3VyZSBiYXIgaXMgdmlzaWJsZVxuICAgICAgICAgIHNob3dCYXIoKTtcblxuICAgICAgICAgIC8vIHRyaWdnZXIgaGlkZSB3aGVuIHNjcm9sbCBpcyBzdG9wcGVkXG4gICAgICAgICAgaGlkZUJhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoV2hlZWwoKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBfb25XaGVlbCwgZmFsc2UgKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIF9vbldoZWVsLCBmYWxzZSApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbm1vdXNld2hlZWxcIiwgX29uV2hlZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJhckhlaWdodCgpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgc2Nyb2xsYmFyIGhlaWdodCBhbmQgbWFrZSBzdXJlIGl0IGlzIG5vdCB0b28gc21hbGxcbiAgICAgICAgICBiYXJIZWlnaHQgPSBNYXRoLm1heCgobWUub3V0ZXJIZWlnaHQoKSAvIG1lWzBdLnNjcm9sbEhlaWdodCkgKiBtZS5vdXRlckhlaWdodCgpLCBtaW5CYXJIZWlnaHQpO1xuICAgICAgICAgIGJhci5jc3MoeyBoZWlnaHQ6IGJhckhlaWdodCArICdweCcgfSk7XG5cbiAgICAgICAgICAvLyBoaWRlIHNjcm9sbGJhciBpZiBjb250ZW50IGlzIG5vdCBsb25nIGVub3VnaFxuICAgICAgICAgIHZhciBkaXNwbGF5ID0gYmFySGVpZ2h0ID09IG1lLm91dGVySGVpZ2h0KCkgPyAnbm9uZScgOiAnYmxvY2snO1xuICAgICAgICAgIGJhci5jc3MoeyBkaXNwbGF5OiBkaXNwbGF5IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd0JhcigpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyByZWNhbGN1bGF0ZSBiYXIgaGVpZ2h0XG4gICAgICAgICAgZ2V0QmFySGVpZ2h0KCk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHF1ZXVlSGlkZSk7XG5cbiAgICAgICAgICAvLyB3aGVuIGJhciByZWFjaGVkIHRvcCBvciBib3R0b21cbiAgICAgICAgICBpZiAocGVyY2VudFNjcm9sbCA9PSB+fnBlcmNlbnRTY3JvbGwpXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy9yZWxlYXNlIHdoZWVsXG4gICAgICAgICAgICByZWxlYXNlU2Nyb2xsID0gby5hbGxvd1BhZ2VTY3JvbGw7XG5cbiAgICAgICAgICAgIC8vIHB1Ymxpc2ggYXBwcm9wb3JpYXRlIGV2ZW50XG4gICAgICAgICAgICBpZiAobGFzdFNjcm9sbCAhPSBwZXJjZW50U2Nyb2xsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBtc2cgPSAofn5wZXJjZW50U2Nyb2xsID09PSAwKSA/ICd0b3AnIDogJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgbWUudHJpZ2dlcignc2xpbXNjcm9sbCcsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICB7XG4gICAgICAgICAgICByZWxlYXNlU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RTY3JvbGwgPSBwZXJjZW50U2Nyb2xsO1xuXG4gICAgICAgICAgLy8gc2hvdyBvbmx5IHdoZW4gcmVxdWlyZWRcbiAgICAgICAgICBpZihiYXJIZWlnaHQgPj0gbWUub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgLy9hbGxvdyB3aW5kb3cgc2Nyb2xsXG4gICAgICAgICAgICByZWxlYXNlU2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFyLnN0b3AodHJ1ZSx0cnVlKS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICAgICAgICBpZiAoby5yYWlsVmlzaWJsZSkgeyByYWlsLnN0b3AodHJ1ZSx0cnVlKS5mYWRlSW4oJ2Zhc3QnKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGlkZUJhcigpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBvbmx5IGhpZGUgd2hlbiBvcHRpb25zIGFsbG93IGl0XG4gICAgICAgICAgaWYgKCFvLmFsd2F5c1Zpc2libGUpXG4gICAgICAgICAge1xuICAgICAgICAgICAgcXVldWVIaWRlID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBpZiAoIShvLmRpc2FibGVGYWRlT3V0ICYmIGlzT3ZlclBhbmVsKSAmJiAhaXNPdmVyQmFyICYmICFpc0RyYWdnKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmFyLmZhZGVPdXQoJ3Nsb3cnKTtcbiAgICAgICAgICAgICAgICByYWlsLmZhZGVPdXQoJ3Nsb3cnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgICAvLyBtYWludGFpbiBjaGFpbmFiaWxpdHlcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG5cbiAgJC5mbi5leHRlbmQoe1xuICAgIHNsaW1zY3JvbGw6ICQuZm4uc2xpbVNjcm9sbFxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTbGltU2Nyb2xsO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIHByZWxvYWRlcjogJCgnI3ByZWxvYWRlcnMnKSxcbiAgICBuYXR1cmFsSDogMCxcbiAgICBuYXR1cmFsVzogMCxcbiAgICBpbWdMb2FkZWQ6IHt9LFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgaGFzVmlkZW8gICAgPSBlbC5kYXRhKCd2aWRlbycpID8gdHJ1ZSA6IGZhbHNlXG5cbiAgICAgICAgLCAgICRwYXJhbGxheGVzID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgaGFzUGFyYWxsYXggPSAkcGFyYWxsYXhlcy5sZW5ndGggPyB0cnVlIDogZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHNlbGYuaW1nTG9hZGVkID0gaW1hZ2VzTG9hZGVkKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykgKTtcbiAgICAgICAgc2VsZi5lbGVtZW50ID0gZWw7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQub24oJ2Fsd2F5cycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxIID0gc2VsZi5lbGVtZW50LmhlaWdodCgpO1xuICAgICAgICAgICAgc2VsZi5uYXR1cmFsVyA9IHNlbGYuZWxlbWVudC53aWR0aCgpO1xuXG4gICAgICAgICAgICBzZWxmLnJlc2NhbGVJbWFnZSgpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzVmlkZW8gJiYgIWhhc1BhcmFsbGF4KSBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYubG9hZFZpZGVvKHNlbGYuZWxlbWVudC5kYXRhKCd2aWRlbycpKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNQYXJhbGxheCkgc2VsZi5pbml0UGFyYWxsYXgoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGxvYWRWaWRlbzogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGlzVG91Y2ggPSBNb2Rlcm5penIudG91Y2g7XG4gICAgICAgIGlmIChpc1RvdWNoKSByZXR1cm47XG5cbiAgICAgICAgdmFyIEJWU291cmNlcyA9IFtdXG4gICAgICAgICwgICBCVlNvdXJjZXNUeXBlID0gWydtcDQnLCAnd2VibScsICdvZ3YnXVxuICAgICAgICA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCVlNvdXJjZXNUeXBlLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgQlZTb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2aWRlby8nICsgQlZTb3VyY2VzVHlwZVtpXSxcbiAgICAgICAgICAgICAgICBzcmM6IHVybCArICcuJyArIEJWU291cmNlc1R5cGVbaV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coQlZTb3VyY2VzKTtcblxuICAgICAgICB2YXIgQlYgPSBuZXcgJC5CaWdWaWRlbyh7XG4gICAgICAgICAgICB1c2VGbGFzaEZvckZpcmVmb3g6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBCVi5pbml0KCk7XG4gICAgICAgIEJWLnNob3coQlZTb3VyY2VzLCB7XG4gICAgICAgICAgICBhbWJpZW50OiB0cnVlXG4gICAgICAgICAgICAsIGFsdFNvdXJjZTogJ2Fzc2V0cy92aWRlb3MvWS53ZWJtJ1xuICAgICAgICAgICAgLCB0ZWNoT3JkZXI6IFsnaHRtbDUnXVxuICAgICAgICB9KTtcblxuICAgICAgICBCVi5nZXRQbGF5ZXIoKS5vbignbG9hZGVkZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5lbGVtZW50LmFkZENsYXNzKCd2aWRlby1sb2FkZWQnKTtcbiAgICAgICAgICAgICQoJyNwcmVsb2FkZXJzJykuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkKCcjcHJlbG9hZGVycycpLmNzcygnei1pbmRleCcsICctOTAwMCcpOyB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNjYWxlSW1hZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmVsZW1lbnQubGVuZ3RoKSBjb25zb2xlLndhcm5pbmcoJ25vIGJhY2tncm91bmQgaW1hZ2UnKTtcblxuICAgICAgICB2YXIgaW1hZ2VSYXRpbyA9IHRoaXMubmF0dXJhbFcgLyB0aGlzLm5hdHVyYWxIXG4gICAgICAgICwgICB2aWV3cG9ydFJhdGlvID0gJCh3aW5kb3cpLndpZHRoKCkgLyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICAgICAgLCAgIHB1c2hMZWZ0XG4gICAgICAgICwgICBwdXNoVG9wXG4gICAgICAgIDtcblxuICAgICAgICBpZiAodmlld3BvcnRSYXRpbyA8IGltYWdlUmF0aW8pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC13aWR0aCcpLmFkZENsYXNzKCdmdWxsLWhlaWdodCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAoIGltYWdlUmF0aW8gKiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKHdpbmRvdykud2lkdGgoKSApIC8gLTI7XG4gICAgICAgICAgICBwdXNoVG9wID0gMDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZnVsbC1oZWlnaHQnKS5hZGRDbGFzcygnZnVsbC13aWR0aCcpO1xuICAgICAgICAgICAgcHVzaExlZnQgPSAwO1xuICAgICAgICAgICAgcHVzaFRvcCA9ICh0aGlzLmVsZW1lbnQuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpIC8gLTI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AgKyAncHgnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbml0UGFyYWxsYXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgICRwYXJhbGxheCA9ICQoJyNwYXJhbGxheGVzJylcbiAgICAgICAgLCAgICRpbWdzID0gJCgnLnBhcmFsbGF4LWltYWdlJylcbiAgICAgICAgLCAgIF9waCA9ICRwYXJhbGxheC5oZWlnaHQoKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gQ2VudGVyIGltYWdlIHZlcnRpY2FsbHkgYnkgbWFyZ2luXG4gICAgICAgICRpbWdzLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcykuY3NzKHsgJ21hcmdpbi10b3AnOiAoX3BoIC0gJCh0aGlzKS5oZWlnaHQoKSkvMiB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5wYXJhbGxheGlmeSh7XG4gICAgICAgICAgICBwb3NpdGlvblByb3BlcnR5OiAndHJhbnNmb3JtJyxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5wcmVsb2FkZXIuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoJy5yZWNvbG9yJykubGVuZ3RoIHx8ICEkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBCYWNrZ3JvdW5kQ2hlY2suaW5pdCh7XG4gICAgICAgICAgICB0YXJnZXRzOiAnLnJlY29sb3InXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvZ2dsZXIgPSBlbC5maW5kKCcuaG9tZS1oZXJvLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkgPSBlbC5maW5kKCcuaG9tZS1oZXJvLWJvZHknKVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkaGVyb0JvZHkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzO1xuICAgICAgICBlbC5maW5kKCcubmF2LTEnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcblxuICAgICAgICAgICAgdmFyICRlbCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBfc3ZnT2JqID0gJCh0aGlzKS5maW5kKCcubmF2LTEtb2JqZWN0JylbMF1cbiAgICAgICAgICAgICwgICBfc3ZnRG9jXG4gICAgICAgICAgICAsICAgX25hdkVsXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIF9zdmdPYmouYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF9zdmdEb2MgPSBfc3ZnT2JqLmNvbnRlbnREb2N1bWVudDtcbiAgICAgICAgICAgICAgICBfbmF2RWwgID0gX3N2Z0RvYy5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbi1zdmcnKTtcblxuICAgICAgICAgICAgICAgIGlmKCRlbC5oYXNDbGFzcygnYWN0aXZlJykpIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgJGVsLmhvdmVyKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2hvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbmF2RWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICduYXZpZ2F0aW9uLXN2ZyBob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoISQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfc2NvcGUudG9nZ2xlKGVsLCAkKHRoaXMpLmNsb3Nlc3QoJy5uYXYnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICBlbC5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIGVsc2UgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBlbC50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG4gICAgaW5pdFBhZ2VOYXZpZ2F0aW9uOiAgZnVuY3Rpb24oaGFzSW5mbykge1xuICAgICAgICB2YXIgJGluZm9CdG5Ub2dnbGVycyA9ICQoJy5pbmZvLWJ0bi10b2dnbGVycycpXG4gICAgICAgICwgICAkcGFnZUluZm9zID0gJCgnLnBhZ2UtaW5mb3MnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZzID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbnMnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZMaW5rID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbi1saW5rJylcbiAgICAgICAgO1xuXG4gICAgICAgICRpbmZvQnRuVG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlSW5mb3MubGVuZ3RoKSAkcGFnZUluZm9zLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlU3ViTmF2cy5sZW5ndGgpICRwYWdlU3ViTmF2cy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRwYWdlU3ViTmF2cy5maW5kKCcucGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkaW5mb0J0blRvZ2dsZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuaW5mby1idG4tdG9nZ2xlcltkYXRhLXByb2plY3RdJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcHJvamVjdCcsICQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCgkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAkdG9nZ2xlcjogJCgpLFxuICAgICRyZWxhdGVkRWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLiRyZWxhdGVkRWxlbWVudCA9IGVsO1xuICAgICAgICBzZWxmLnRvZ2dsZXIgPSBlbC5maW5kKCcucmVsYXRlZC10b2dnbGVyJyk7XG5cbiAgICAgICAgc2VsZi50b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGVsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgdmFyIHNlbGYgICAgICAgICAgID0gdGhpc1xuICAgICAgICAsICAgJHRodW1iR3JvdXBzICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iLWdyb3VwcycpXG4gICAgICAgICwgICAkdGh1bWJzICAgICAgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWInKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvcnMgPSAkKCcucGFnZS1uYXZpZ2F0aW9ucy5oYXMtdGh1bWJzIC5wYWdlLXNlbGVjdG9ycycpXG4gICAgICAgICwgICBpc1N3YXAgICAgICAgICA9IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICB2YXIgaGFzTmV1ID0gZWwuaGFzQ2xhc3MoJ2hhcy1uZXUnKTsgY29uc29sZS5sb2coJ2hhc05ldScgLGhhc05ldSk7XG5cbiAgICAgICAgdmFyIF90aHVtYk4gPSAkdGh1bWJzLmxlbmd0aFxuICAgICAgICAsICAgX3RodW1iR3JvdXBzTGltaXQgPSBoYXNOZXUgPyA0IDogNlxuICAgICAgICAsICAgX3RodW1iR3JvdXBOID0gKF90aHVtYk4gPiBfdGh1bWJHcm91cHNMaW1pdCkgPyBNYXRoLmNlaWwoX3RodW1iTiAvIF90aHVtYkdyb3Vwc0xpbWl0KSA6IDFcbiAgICAgICAgLCAgIF90aHVtYlN0YXJ0ID0gMFxuICAgICAgICAsICAgX3RodW1iRW5kID0gX3RodW1iR3JvdXBOXG4gICAgICAgICwgICBfdGh1bWJHcm91cFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ0aHVtYi1ncm91cFwiIC8+J1xuICAgICAgICAsICAgX2VsV2lkdGggPSB0aGlzLmVsZW1lbnQud2lkdGgoKVxuICAgICAgICAsICAgX3RodW1iR3JvdXBMZWZ0ID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgc2V0IC50aHVtYi1ncm91cHMgd2lkdGhcbiAgICAgICAgJHRodW1iR3JvdXBzLmNzcygnd2lkdGgnLCAxMDAgKiBfdGh1bWJHcm91cE4gKyBcIiVcIik7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgZ3JvdXAgLnRodW1iLCBhbmQgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGh1bWJHcm91cE47IGkgKyspIHtcbiAgICAgICAgICAgIC8vIGJlZ2luIGdyb3VwaW5nIHRodW1iXG4gICAgICAgICAgICBfdGh1bWJTdGFydCA9ICgoX3RodW1iR3JvdXBzTGltaXQgKyAwKSAqIGkpO1xuICAgICAgICAgICAgX3RodW1iRW5kID0gX3RodW1iU3RhcnQgKyBfdGh1bWJHcm91cHNMaW1pdDtcbiAgICAgICAgICAgICR0aHVtYnNcbiAgICAgICAgICAgICAgICAuc2xpY2UoIF90aHVtYlN0YXJ0LCBfdGh1bWJFbmQgKVxuICAgICAgICAgICAgICAgIC53cmFwQWxsKF90aHVtYkdyb3VwVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXAgJiYgIWhhc05ldSkgJCh0aGlzKS5hZGRDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIHByZXZcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZsdDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUgID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3JcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rIHJlY29sb3JcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIG5leHRcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZndDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoJHBhZ2VTZWxlY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBGaXJzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgcHJldlxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlKTtcblxuICAgICAgICAgICAgLy8gTmV4dDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbnVtXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF90aHVtYkdyb3VwTjsgaiArKykge1xuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMYXN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBuZXh0XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEkcGFnZVNlbGVjdG9ycy5maW5kKCdsaScpLmxlbmd0aCkgJHBhZ2VTZWxlY3RvcnMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBEZWZpbmUgc2VsZWN0b3IgaGVscGVyc1xuICAgICAgICB2YXIgJHBhZ2VTZWxlY3RvciA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JQcmV2ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IucHJldicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yTmV4dCA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLm5leHQnKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIHByZXZcbiAgICAgICAgJHBhZ2VTZWxlY3RvclByZXYuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAncHJldicpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGFuZCB0ZXh0IGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgJHBhZ2VTZWxlY3RvclxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yUHJldilcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3Rvck5leHQpXG4gICAgICAgICAgICAuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAudGV4dCgoaW5kZXggKyAxKSlcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGlkZScsIGluZGV4KVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCBzdHlsZSBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIG5leHRcbiAgICAgICAgJHBhZ2VTZWxlY3Rvck5leHQuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAnbmV4dCcpO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCB0byBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciAkc2VsZWN0b3IgPSAkKClcbiAgICAgICAgLCAgIF9kYXRhU2xpZGUgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAkcGFnZVNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2VsZWN0b3IgPSAkKHRoaXMpLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKTtcbiAgICAgICAgICAgICRzZWxlY3Rvci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ3ByZXYnKSBfZGF0YVNsaWRlIC0tO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ25leHQnKSBfZGF0YVNsaWRlICsrO1xuICAgICAgICAgICAgICAgIGVsc2UgX2RhdGFTbGlkZSA9ICQodGhpcykuZGF0YSgnc2xpZGUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChfZGF0YVNsaWRlIDwgMCkgX2RhdGFTbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2RhdGFTbGlkZSA+IChfdGh1bWJHcm91cE4gLSAxKSkgX2RhdGFTbGlkZSA9IChfdGh1bWJHcm91cE4gLSAxKTtcblxuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJywgX2RhdGFTbGlkZSk7XG4gICAgICAgICAgICAgICAgX3RodW1iR3JvdXBMZWZ0ID0gJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnKSAqIF9lbFdpZHRoO1xuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoICdsZWZ0JywgJy0nICsgX3RodW1iR3JvdXBMZWZ0ICsgJ3B4JyApO1xuXG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3Rvci5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciBfbGlua1NlbGVjdG9yU3RyaW5nID0gJy5wYWdlLXNlbGVjdG9yLWxpbmtbZGF0YS1zbGlkZT1cIicgKyBfZGF0YVNsaWRlICsgJ1wiXSc7XG4gICAgICAgICAgICAgICAgJChfbGlua1NlbGVjdG9yU3RyaW5nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHh4eFRlbXBsYXRlID0gICc8ZGl2IGlkPVwieHh4XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ4eHgtaW5uZXJcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHA+Q3VycmVudGx5LDwvcD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHA+dGhpcyBzaXRlIGRvZXMgbm90IHN1cHBvcnQgbW9iaWxlL3RvdWNoIGRldmljZXMuPC9wPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cD5WaWV3IG9uIGRlc2t0b3AgY29tcHV0ZXJzIGZvciBiZXR0ZXIgZXhwZXJpZW5jZS48L3A+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoTW9kZXJuaXpyLnRvdWNoKSAkKCdib2R5JykuYXBwZW5kKCR4eHhUZW1wbGF0ZSk7XG4gICAgfVxufTtcbiJdfQ==
