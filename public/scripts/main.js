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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL2NsaWVudC9zY3JpcHRzL21haW4iLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvaGVscGVyL2RlYm91bmNlLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL2pRdWVyeS1zbGltU2Nyb2xsLWJyb3dzZXJpZnkuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktYXNzZXQuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktY29sb3IuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktaG9tZS5qcyIsIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1uYXZpZ2F0aW9uLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXJlbGF0ZWQuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdGh1bWIuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktdG91Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXFxcbiAqIE1haW4gc2NyaXB0LlxuICogY2xpZW50L21haW4uanNcbiAqKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuOyggZnVuY3Rpb24oICQgKSB7XG4gICAgdmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9tb2R1bGUvaGVscGVyL2RlYm91bmNlJyk7XG5cbiAgICB2YXIgdWlBc3NldCAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktYXNzZXQnKVxuICAgICwgICB1aUNvbG9yICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1jb2xvcicpXG4gICAgLCAgIHVpTmF2aWdhdGlvbiA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLW5hdmlnYXRpb24nKVxuICAgICwgICB1aUhvbWUgICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1ob21lJylcbiAgICAsICAgdWlUaHVtYiAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktdGh1bWInKVxuICAgICwgICB1aVJlbGF0ZWQgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1yZWxhdGVkJylcbiAgICAsICAgdWlUb3VjaCAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktdG91Y2gnKVxuICAgIDtcblxuICAgIHZhciBTbGltU2Nyb2xsID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvalF1ZXJ5LXNsaW1TY3JvbGwtYnJvd3NlcmlmeScpKCk7XG5cbiAgICAvLyBEeW5hbWljIGNvbG9yXG4gICAgLypzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB1aUNvbG9yLmluaXQoKTsgfSwgMTAwKTsqL1xuXG4gICAgLy8gQmFja2dyb3VuZFxuICAgIGlmICgkKCcuYmFja2dyb3VuZCcpLmxlbmd0aCkgdWlBc3NldC5pbml0KCQoJy5iYWNrZ3JvdW5kJykpO1xuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7IHVpQXNzZXQucmVzY2FsZUltYWdlKCk7IH0pO1xuXG4gICAgLy8gTWFpbiBuYXZpZ2F0aW9uXG4gICAgdmFyICRuYXZzID0gJCgnI25hdmlnYXRpb24nKTtcbiAgICBpZiAoJG5hdnMubGVuZ3RoKSB1aU5hdmlnYXRpb24uaW5pdCgkbmF2cyk7XG5cbiAgICAvLyBQYWdlIG5hdmlnYXRpb25cbiAgICBpZiAoJCgnLnBhZ2UtbmF2aWdhdGlvbnMnKS5sZW5ndGgpXG4gICAgICAgIHVpTmF2aWdhdGlvbi5pbml0UGFnZU5hdmlnYXRpb24oJCgncGFnZS1uYXZpZ2F0aW9ucy5oYXMtaW5mb3MnKS5sZW5ndGgpO1xuXG4gICAgLy8gSG9tZVxuICAgIHVpSG9tZS5pbml0KCQoJyNob21lLWhlcm9zJykpO1xuXG4gICAgLy8gVGh1bWJuYWlsc1xuICAgIGlmICgkKCcudGh1bWJzJykubGVuZ3RoKSB1aVRodW1iLmluaXQoJCgnLnRodW1icycpKTtcblxuICAgIC8vIFJlbGF0ZXNcbiAgICBpZiAoJCgnLnJlbGF0ZWRzJykubGVuZ3RoKSB1aVJlbGF0ZWQuaW5pdCgkKCcucmVsYXRlZHMnKSk7XG5cbiAgICAvLyBTaGFtZVxuICAgIC8vIE1vdmUgdG8gaXQncyBvd24gbW9kdWxlXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcudmlld2VyLWNsb3NlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJyN2aWV3ZXJzJykucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgY3JlYXRlVmlld2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkYmFja2dyb3VuZEVsID0gJCgnLmJhY2tncm91bmQnKVxuICAgICAgICAsICAgaW1nU3JjID0gJGJhY2tncm91bmRFbC5hdHRyKCdzcmMnKVxuICAgICAgICAsICAgdmlld2Vyc1RlbXBsYXRlID1cbiAgICAgICAgICAgICAgICAnPGRpdiBpZD1cInZpZXdlcnNcIiBjbGFzcz1cInByZVwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwidmlld2VyLXByZWxvYWRlclwiPjxwPmxvYWRpbmcgaW1hZ2UuLi48L3A+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICArJzxkaXYgY2xhc3M9XCJjcm9waXQtaW1hZ2UtcHJldmlld1wiPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKyc8aW5wdXQgdHlwZT1cInJhbmdlXCIgY2xhc3M9XCJjcm9waXQtaW1hZ2Utem9vbS1pbnB1dFwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzcz1cImNyb3BpdC1pbWFnZS1pbnB1dFwiPidcbiAgICAgICAgICAgICAgICAgICAgKyc8YSBocmVmPVwiI1wiIGNsYXNzPVwidmlld2VyLWNsb3NlXCI+eDwvYT4nXG4gICAgICAgICAgICAgICAgKyc8L2Rpdj4nXG4gICAgICAgIDtcblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVQcmUoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJyN2aWV3ZXJzJykucmVtb3ZlQ2xhc3MoJ3ByZScpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnYVtkYXRhLXRvb2w9XCJpbWFnZVwiJykpIHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQodmlld2Vyc1RlbXBsYXRlKTtcblxuICAgICAgICAgICAgaWYoJCgnI3ZpZXdlcnMnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcjdmlld2VycycpLmNyb3BpdCh7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3RhdGU6IHsgc3JjOiBpbWdTcmMgfSxcbiAgICAgICAgICAgICAgICAgICAgb25JbWFnZUxvYWRlZDogcmVtb3ZlUHJlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJCgnLnBhZ2UtdG9vbC1idG5bZGF0YS10b29sPVwiaW1hZ2VcIl0nKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBjcmVhdGVWaWV3ZXIoKTsgfSk7XG5cbiAgICAvLyBTaGFtZVxuICAgIHZhciBpc09wZW4gPSBmYWxzZTtcbiAgICBmdW5jdGlvbiB1cGRhdGVJbmZvQ3JlZGl0KCkge1xuICAgICAgICBpc09wZW4gPSAhaXNPcGVuO1xuICAgICAgICBpZiAoIWlzT3BlbikgICQoJy5jb250YWN0LWNyZWRpdHMnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgICAgICBlbHNlICQoJy5jb250YWN0LWNyZWRpdHMnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAgIH1cblxuICAgICQoJy5jb250YWN0LWNyZWRpdC10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHVwZGF0ZUluZm9DcmVkaXQoKTtcbiAgICB9KTtcblxuICAgICQoJy5xdWVzdGlvbicpLnNsaW1TY3JvbGwoe1xuICAgICAgICBoZWlnaHQ6ICcyNjRweCcsXG4gICAgICAgIHNpemU6ICc0cHgnLFxuICAgICAgICBjb2xvcjogJyMwMDAnLFxuICAgICAgICBvcGFjaXR5OiAnMScsXG4gICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgYWx3YXlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgZGlzdGFuY2U6IDBcbiAgICB9KTtcblxuICAgIHVpVG91Y2guaW5pdCgpO1xuXG59KShqUXVlcnkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhyZXNob2xkLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmRlYm91bmNlXG4gICAgICAgICwgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDsgXG4gICAgICAgIH1cbiBcbiAgICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgZWxzZSBpZiAoaW1tZWRpYXRlKSBmbi5hcHBseShvYmosIGFyZ3MpO1xuIFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTsgXG4gICAgfTtcbn07XG4iLCJmdW5jdGlvbiBTbGltU2Nyb2xsKCkge1xuICAkLmZuLmV4dGVuZCh7XG4gICAgc2xpbVNjcm9sbDogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICB2YXIgZGVmYXVsdHMgPSB7XG5cbiAgICAgICAgLy8gd2lkdGggaW4gcGl4ZWxzIG9mIHRoZSB2aXNpYmxlIHNjcm9sbCBhcmVhXG4gICAgICAgIHdpZHRoIDogJ2F1dG8nLFxuXG4gICAgICAgIC8vIGhlaWdodCBpbiBwaXhlbHMgb2YgdGhlIHZpc2libGUgc2Nyb2xsIGFyZWFcbiAgICAgICAgaGVpZ2h0IDogJzI1MHB4JyxcblxuICAgICAgICAvLyB3aWR0aCBpbiBwaXhlbHMgb2YgdGhlIHNjcm9sbGJhciBhbmQgcmFpbFxuICAgICAgICBzaXplIDogJzdweCcsXG5cbiAgICAgICAgLy8gc2Nyb2xsYmFyIGNvbG9yLCBhY2NlcHRzIGFueSBoZXgvY29sb3IgdmFsdWVcbiAgICAgICAgY29sb3I6ICcjMDAwJyxcblxuICAgICAgICAvLyBzY3JvbGxiYXIgcG9zaXRpb24gLSBsZWZ0L3JpZ2h0XG4gICAgICAgIHBvc2l0aW9uIDogJ3JpZ2h0JyxcblxuICAgICAgICAvLyBkaXN0YW5jZSBpbiBwaXhlbHMgYmV0d2VlbiB0aGUgc2lkZSBlZGdlIGFuZCB0aGUgc2Nyb2xsYmFyXG4gICAgICAgIGRpc3RhbmNlIDogJzFweCcsXG5cbiAgICAgICAgLy8gZGVmYXVsdCBzY3JvbGwgcG9zaXRpb24gb24gbG9hZCAtIHRvcCAvIGJvdHRvbSAvICQoJ3NlbGVjdG9yJylcbiAgICAgICAgc3RhcnQgOiAndG9wJyxcblxuICAgICAgICAvLyBzZXRzIHNjcm9sbGJhciBvcGFjaXR5XG4gICAgICAgIG9wYWNpdHkgOiAwLjQsXG5cbiAgICAgICAgLy8gZW5hYmxlcyBhbHdheXMtb24gbW9kZSBmb3IgdGhlIHNjcm9sbGJhclxuICAgICAgICBhbHdheXNWaXNpYmxlIDogZmFsc2UsXG5cbiAgICAgICAgLy8gY2hlY2sgaWYgd2Ugc2hvdWxkIGhpZGUgdGhlIHNjcm9sbGJhciB3aGVuIHVzZXIgaXMgaG92ZXJpbmcgb3ZlclxuICAgICAgICBkaXNhYmxlRmFkZU91dCA6IGZhbHNlLFxuXG4gICAgICAgIC8vIHNldHMgdmlzaWJpbGl0eSBvZiB0aGUgcmFpbFxuICAgICAgICByYWlsVmlzaWJsZSA6IGZhbHNlLFxuXG4gICAgICAgIC8vIHNldHMgcmFpbCBjb2xvclxuICAgICAgICByYWlsQ29sb3IgOiAnIzMzMycsXG5cbiAgICAgICAgLy8gc2V0cyByYWlsIG9wYWNpdHlcbiAgICAgICAgcmFpbE9wYWNpdHkgOiAwLjIsXG5cbiAgICAgICAgLy8gd2hldGhlciAgd2Ugc2hvdWxkIHVzZSBqUXVlcnkgVUkgRHJhZ2dhYmxlIHRvIGVuYWJsZSBiYXIgZHJhZ2dpbmdcbiAgICAgICAgcmFpbERyYWdnYWJsZSA6IHRydWUsXG5cbiAgICAgICAgLy8gZGVmYXV0bHQgQ1NTIGNsYXNzIG9mIHRoZSBzbGltc2Nyb2xsIHJhaWxcbiAgICAgICAgcmFpbENsYXNzIDogJ3NsaW1TY3JvbGxSYWlsJyxcblxuICAgICAgICAvLyBkZWZhdXRsdCBDU1MgY2xhc3Mgb2YgdGhlIHNsaW1zY3JvbGwgYmFyXG4gICAgICAgIGJhckNsYXNzIDogJ3NsaW1TY3JvbGxCYXInLFxuXG4gICAgICAgIC8vIGRlZmF1dGx0IENTUyBjbGFzcyBvZiB0aGUgc2xpbXNjcm9sbCB3cmFwcGVyXG4gICAgICAgIHdyYXBwZXJDbGFzcyA6ICdzbGltU2Nyb2xsRGl2JyxcblxuICAgICAgICAvLyBjaGVjayBpZiBtb3VzZXdoZWVsIHNob3VsZCBzY3JvbGwgdGhlIHdpbmRvdyBpZiB3ZSByZWFjaCB0b3AvYm90dG9tXG4gICAgICAgIGFsbG93UGFnZVNjcm9sbCA6IGZhbHNlLFxuXG4gICAgICAgIC8vIHNjcm9sbCBhbW91bnQgYXBwbGllZCB0byBlYWNoIG1vdXNlIHdoZWVsIHN0ZXBcbiAgICAgICAgd2hlZWxTdGVwIDogMjAsXG5cbiAgICAgICAgLy8gc2Nyb2xsIGFtb3VudCBhcHBsaWVkIHdoZW4gdXNlciBpcyB1c2luZyBnZXN0dXJlc1xuICAgICAgICB0b3VjaFNjcm9sbFN0ZXAgOiAyMDAsXG5cbiAgICAgICAgLy8gc2V0cyBib3JkZXIgcmFkaXVzXG4gICAgICAgIGJvcmRlclJhZGl1czogJzdweCcsXG5cbiAgICAgICAgLy8gc2V0cyBib3JkZXIgcmFkaXVzIG9mIHRoZSByYWlsXG4gICAgICAgIHJhaWxCb3JkZXJSYWRpdXMgOiAnN3B4J1xuICAgICAgfTtcblxuICAgICAgdmFyIG8gPSAkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgIC8vIGRvIGl0IGZvciBldmVyeSBlbGVtZW50IHRoYXQgbWF0Y2hlcyBzZWxlY3RvclxuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgIHZhciBpc092ZXJQYW5lbCwgaXNPdmVyQmFyLCBpc0RyYWdnLCBxdWV1ZUhpZGUsIHRvdWNoRGlmLFxuICAgICAgICBiYXJIZWlnaHQsIHBlcmNlbnRTY3JvbGwsIGxhc3RTY3JvbGwsXG4gICAgICAgIGRpdlMgPSAnPGRpdj48L2Rpdj4nLFxuICAgICAgICBtaW5CYXJIZWlnaHQgPSAzMCxcbiAgICAgICAgcmVsZWFzZVNjcm9sbCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHVzZWQgaW4gZXZlbnQgaGFuZGxlcnMgYW5kIGZvciBiZXR0ZXIgbWluaWZpY2F0aW9uXG4gICAgICAgIHZhciBtZSA9ICQodGhpcyk7XG5cbiAgICAgICAgLy8gZW5zdXJlIHdlIGFyZSBub3QgYmluZGluZyBpdCBhZ2FpblxuICAgICAgICBpZiAobWUucGFyZW50KCkuaGFzQ2xhc3Moby53cmFwcGVyQ2xhc3MpKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBzdGFydCBmcm9tIGxhc3QgYmFyIHBvc2l0aW9uXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gbWUuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgYmFyIGFuZCByYWlsXG4gICAgICAgICAgICBiYXIgPSBtZS5wYXJlbnQoKS5maW5kKCcuJyArIG8uYmFyQ2xhc3MpO1xuICAgICAgICAgICAgcmFpbCA9IG1lLnBhcmVudCgpLmZpbmQoJy4nICsgby5yYWlsQ2xhc3MpO1xuXG4gICAgICAgICAgICBnZXRCYXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgd2Ugc2hvdWxkIHNjcm9sbCBleGlzdGluZyBpbnN0YW5jZVxuICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChvcHRpb25zKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gUGFzcyBoZWlnaHQ6IGF1dG8gdG8gYW4gZXhpc3Rpbmcgc2xpbXNjcm9sbCBvYmplY3QgdG8gZm9yY2UgYSByZXNpemUgYWZ0ZXIgY29udGVudHMgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICAgIGlmICggJ2hlaWdodCcgaW4gb3B0aW9ucyAmJiBvcHRpb25zLmhlaWdodCA9PSAnYXV0bycgKSB7XG4gICAgICAgICAgICAgICAgbWUucGFyZW50KCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgICAgICAgIG1lLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gbWUucGFyZW50KCkucGFyZW50KCkuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgbWUucGFyZW50KCkuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIG1lLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICgnc2Nyb2xsVG8nIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBqdW1wIHRvIGEgc3RhdGljIHBvaW50XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gcGFyc2VJbnQoby5zY3JvbGxUbyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoJ3Njcm9sbEJ5JyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8ganVtcCBieSB2YWx1ZSBwaXhlbHNcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gcGFyc2VJbnQoby5zY3JvbGxCeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoJ2Rlc3Ryb3knIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgc2xpbXNjcm9sbCBlbGVtZW50c1xuICAgICAgICAgICAgICAgIGJhci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByYWlsLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIG1lLnVud3JhcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIHNjcm9sbCBjb250ZW50IGJ5IHRoZSBnaXZlbiBvZmZzZXRcbiAgICAgICAgICAgICAgc2Nyb2xsQ29udGVudChvZmZzZXQsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChvcHRpb25zKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCdkZXN0cm95JyBpbiBvcHRpb25zKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9wdGlvbmFsbHkgc2V0IGhlaWdodCB0byB0aGUgcGFyZW50J3MgaGVpZ2h0XG4gICAgICAgIG8uaGVpZ2h0ID0gKG8uaGVpZ2h0ID09ICdhdXRvJykgPyBtZS5wYXJlbnQoKS5oZWlnaHQoKSA6IG8uaGVpZ2h0O1xuXG4gICAgICAgIC8vIHdyYXAgY29udGVudFxuICAgICAgICB2YXIgd3JhcHBlciA9ICQoZGl2UylcbiAgICAgICAgICAuYWRkQ2xhc3Moby53cmFwcGVyQ2xhc3MpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHdpZHRoOiBvLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBvLmhlaWdodFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBzdHlsZSBmb3IgdGhlIGRpdlxuICAgICAgICBtZS5jc3Moe1xuICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICB3aWR0aDogby53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IG8uaGVpZ2h0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBzY3JvbGxiYXIgcmFpbFxuICAgICAgICB2YXIgcmFpbCA9ICQoZGl2UylcbiAgICAgICAgICAuYWRkQ2xhc3Moby5yYWlsQ2xhc3MpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogby5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGRpc3BsYXk6IChvLmFsd2F5c1Zpc2libGUgJiYgby5yYWlsVmlzaWJsZSkgPyAnYmxvY2snIDogJ25vbmUnLFxuICAgICAgICAgICAgJ2JvcmRlci1yYWRpdXMnOiBvLnJhaWxCb3JkZXJSYWRpdXMsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBvLnJhaWxDb2xvcixcbiAgICAgICAgICAgIG9wYWNpdHk6IG8ucmFpbE9wYWNpdHksXG4gICAgICAgICAgICB6SW5kZXg6IDkwXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHNjcm9sbGJhclxuICAgICAgICB2YXIgYmFyID0gJChkaXZTKVxuICAgICAgICAgIC5hZGRDbGFzcyhvLmJhckNsYXNzKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgYmFja2dyb3VuZDogby5jb2xvcixcbiAgICAgICAgICAgIHdpZHRoOiBvLnNpemUsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIG9wYWNpdHk6IG8ub3BhY2l0eSxcbiAgICAgICAgICAgIGRpc3BsYXk6IG8uYWx3YXlzVmlzaWJsZSA/ICdibG9jaycgOiAnbm9uZScsXG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cycgOiBvLmJvcmRlclJhZGl1cyxcbiAgICAgICAgICAgIEJvcmRlclJhZGl1czogby5ib3JkZXJSYWRpdXMsXG4gICAgICAgICAgICBNb3pCb3JkZXJSYWRpdXM6IG8uYm9yZGVyUmFkaXVzLFxuICAgICAgICAgICAgV2Via2l0Qm9yZGVyUmFkaXVzOiBvLmJvcmRlclJhZGl1cyxcbiAgICAgICAgICAgIHpJbmRleDogOTlcbiAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgcG9zaXRpb25cbiAgICAgICAgdmFyIHBvc0NzcyA9IChvLnBvc2l0aW9uID09ICdyaWdodCcpID8geyByaWdodDogby5kaXN0YW5jZSB9IDogeyBsZWZ0OiBvLmRpc3RhbmNlIH07XG4gICAgICAgIHJhaWwuY3NzKHBvc0Nzcyk7XG4gICAgICAgIGJhci5jc3MocG9zQ3NzKTtcblxuICAgICAgICAvLyB3cmFwIGl0XG4gICAgICAgIG1lLndyYXAod3JhcHBlcik7XG5cbiAgICAgICAgLy8gYXBwZW5kIHRvIHBhcmVudCBkaXZcbiAgICAgICAgbWUucGFyZW50KCkuYXBwZW5kKGJhcik7XG4gICAgICAgIG1lLnBhcmVudCgpLmFwcGVuZChyYWlsKTtcblxuICAgICAgICAvLyBtYWtlIGl0IGRyYWdnYWJsZSBhbmQgbm8gbG9uZ2VyIGRlcGVuZGVudCBvbiB0aGUganF1ZXJ5VUlcbiAgICAgICAgaWYgKG8ucmFpbERyYWdnYWJsZSl7XG4gICAgICAgICAgYmFyLmJpbmQoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyICRkb2MgPSAkKGRvY3VtZW50KTtcbiAgICAgICAgICAgIGlzRHJhZ2cgPSB0cnVlO1xuICAgICAgICAgICAgdCA9IHBhcnNlRmxvYXQoYmFyLmNzcygndG9wJykpO1xuICAgICAgICAgICAgcGFnZVkgPSBlLnBhZ2VZO1xuXG4gICAgICAgICAgICAkZG9jLmJpbmQoXCJtb3VzZW1vdmUuc2xpbXNjcm9sbFwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgY3VyclRvcCA9IHQgKyBlLnBhZ2VZIC0gcGFnZVk7XG4gICAgICAgICAgICAgIGJhci5jc3MoJ3RvcCcsIGN1cnJUb3ApO1xuICAgICAgICAgICAgICBzY3JvbGxDb250ZW50KDAsIGJhci5wb3NpdGlvbigpLnRvcCwgZmFsc2UpOy8vIHNjcm9sbCBjb250ZW50XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGRvYy5iaW5kKFwibW91c2V1cC5zbGltc2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgaXNEcmFnZyA9IGZhbHNlO2hpZGVCYXIoKTtcbiAgICAgICAgICAgICAgJGRvYy51bmJpbmQoJy5zbGltc2Nyb2xsJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KS5iaW5kKFwic2VsZWN0c3RhcnQuc2xpbXNjcm9sbFwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvbiByYWlsIG92ZXJcbiAgICAgICAgcmFpbC5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgIHNob3dCYXIoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBoaWRlQmFyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG9uIGJhciBvdmVyXG4gICAgICAgIGJhci5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgIGlzT3ZlckJhciA9IHRydWU7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaXNPdmVyQmFyID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNob3cgb24gcGFyZW50IG1vdXNlb3ZlclxuICAgICAgICBtZS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgIGlzT3ZlclBhbmVsID0gdHJ1ZTtcbiAgICAgICAgICBzaG93QmFyKCk7XG4gICAgICAgICAgaGlkZUJhcigpO1xuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgIGlzT3ZlclBhbmVsID0gZmFsc2U7XG4gICAgICAgICAgaGlkZUJhcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBtb2JpbGVcbiAgICAgICAgbWUuYmluZCgndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUsYil7XG4gICAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyByZWNvcmQgd2hlcmUgdG91Y2ggc3RhcnRlZFxuICAgICAgICAgICAgdG91Y2hEaWYgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lLmJpbmQoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIC8vIHByZXZlbnQgc2Nyb2xsaW5nIHRoZSBwYWdlIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmKCFyZWxlYXNlU2Nyb2xsKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIHNlZSBob3cgZmFyIHVzZXIgc3dpcGVkXG4gICAgICAgICAgICB2YXIgZGlmZiA9ICh0b3VjaERpZiAtIGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VZKSAvIG8udG91Y2hTY3JvbGxTdGVwO1xuICAgICAgICAgICAgLy8gc2Nyb2xsIGNvbnRlbnRcbiAgICAgICAgICAgIHNjcm9sbENvbnRlbnQoZGlmZiwgdHJ1ZSk7XG4gICAgICAgICAgICB0b3VjaERpZiA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0IHVwIGluaXRpYWwgaGVpZ2h0XG4gICAgICAgIGdldEJhckhlaWdodCgpO1xuXG4gICAgICAgIC8vIGNoZWNrIHN0YXJ0IHBvc2l0aW9uXG4gICAgICAgIGlmIChvLnN0YXJ0ID09PSAnYm90dG9tJylcbiAgICAgICAge1xuICAgICAgICAgIC8vIHNjcm9sbCBjb250ZW50IHRvIGJvdHRvbVxuICAgICAgICAgIGJhci5jc3MoeyB0b3A6IG1lLm91dGVySGVpZ2h0KCkgLSBiYXIub3V0ZXJIZWlnaHQoKSB9KTtcbiAgICAgICAgICBzY3JvbGxDb250ZW50KDAsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG8uc3RhcnQgIT09ICd0b3AnKVxuICAgICAgICB7XG4gICAgICAgICAgLy8gYXNzdW1lIGpRdWVyeSBzZWxlY3RvclxuICAgICAgICAgIHNjcm9sbENvbnRlbnQoJChvLnN0YXJ0KS5wb3NpdGlvbigpLnRvcCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBtYWtlIHN1cmUgYmFyIHN0YXlzIGhpZGRlblxuICAgICAgICAgIGlmICghby5hbHdheXNWaXNpYmxlKSB7IGJhci5oaWRlKCk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGF0dGFjaCBzY3JvbGwgZXZlbnRzXG4gICAgICAgIGF0dGFjaFdoZWVsKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gX29uV2hlZWwoZSlcbiAgICAgICAge1xuICAgICAgICAgIC8vIHVzZSBtb3VzZSB3aGVlbCBvbmx5IHdoZW4gbW91c2UgaXMgb3ZlclxuICAgICAgICAgIGlmICghaXNPdmVyUGFuZWwpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgICB2YXIgZGVsdGEgPSAwO1xuICAgICAgICAgIGlmIChlLndoZWVsRGVsdGEpIHsgZGVsdGEgPSAtZS53aGVlbERlbHRhLzEyMDsgfVxuICAgICAgICAgIGlmIChlLmRldGFpbCkgeyBkZWx0YSA9IGUuZGV0YWlsIC8gMzsgfVxuXG4gICAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjVGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgICAgICAgICBpZiAoJCh0YXJnZXQpLmNsb3Nlc3QoJy4nICsgby53cmFwcGVyQ2xhc3MpLmlzKG1lLnBhcmVudCgpKSkge1xuICAgICAgICAgICAgLy8gc2Nyb2xsIGNvbnRlbnRcbiAgICAgICAgICAgIHNjcm9sbENvbnRlbnQoZGVsdGEsIHRydWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHN0b3Agd2luZG93IHNjcm9sbFxuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0ICYmICFyZWxlYXNlU2Nyb2xsKSB7IGUucHJldmVudERlZmF1bHQoKTsgfVxuICAgICAgICAgIGlmICghcmVsZWFzZVNjcm9sbCkgeyBlLnJldHVyblZhbHVlID0gZmFsc2U7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNjcm9sbENvbnRlbnQoeSwgaXNXaGVlbCwgaXNKdW1wKVxuICAgICAgICB7XG4gICAgICAgICAgcmVsZWFzZVNjcm9sbCA9IGZhbHNlO1xuICAgICAgICAgIHZhciBkZWx0YSA9IHk7XG4gICAgICAgICAgdmFyIG1heFRvcCA9IG1lLm91dGVySGVpZ2h0KCkgLSBiYXIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgIGlmIChpc1doZWVsKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIG1vdmUgYmFyIHdpdGggbW91c2Ugd2hlZWxcbiAgICAgICAgICAgIGRlbHRhID0gcGFyc2VJbnQoYmFyLmNzcygndG9wJykpICsgeSAqIHBhcnNlSW50KG8ud2hlZWxTdGVwKSAvIDEwMCAqIGJhci5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyBtb3ZlIGJhciwgbWFrZSBzdXJlIGl0IGRvZXNuJ3QgZ28gb3V0XG4gICAgICAgICAgICBkZWx0YSA9IE1hdGgubWluKE1hdGgubWF4KGRlbHRhLCAwKSwgbWF4VG9wKTtcblxuICAgICAgICAgICAgLy8gaWYgc2Nyb2xsaW5nIGRvd24sIG1ha2Ugc3VyZSBhIGZyYWN0aW9uYWwgY2hhbmdlIHRvIHRoZVxuICAgICAgICAgICAgLy8gc2Nyb2xsIHBvc2l0aW9uIGlzbid0IHJvdW5kZWQgYXdheSB3aGVuIHRoZSBzY3JvbGxiYXIncyBDU1MgaXMgc2V0XG4gICAgICAgICAgICAvLyB0aGlzIGZsb29yaW5nIG9mIGRlbHRhIHdvdWxkIGhhcHBlbmVkIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgICAgICAgICAgLy8gYmFyLmNzcyBpcyBzZXQgYmVsb3csIGJ1dCB3ZSBmbG9vciBoZXJlIGZvciBjbGFyaXR5XG4gICAgICAgICAgICBkZWx0YSA9ICh5ID4gMCkgPyBNYXRoLmNlaWwoZGVsdGEpIDogTWF0aC5mbG9vcihkZWx0YSk7XG5cbiAgICAgICAgICAgIC8vIHNjcm9sbCB0aGUgc2Nyb2xsYmFyXG4gICAgICAgICAgICBiYXIuY3NzKHsgdG9wOiBkZWx0YSArICdweCcgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIGFjdHVhbCBzY3JvbGwgYW1vdW50XG4gICAgICAgICAgcGVyY2VudFNjcm9sbCA9IHBhcnNlSW50KGJhci5jc3MoJ3RvcCcpKSAvIChtZS5vdXRlckhlaWdodCgpIC0gYmFyLm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAgIGRlbHRhID0gcGVyY2VudFNjcm9sbCAqIChtZVswXS5zY3JvbGxIZWlnaHQgLSBtZS5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICAgIGlmIChpc0p1bXApXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVsdGEgPSB5O1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGRlbHRhIC8gbWVbMF0uc2Nyb2xsSGVpZ2h0ICogbWUub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgIG9mZnNldFRvcCA9IE1hdGgubWluKE1hdGgubWF4KG9mZnNldFRvcCwgMCksIG1heFRvcCk7XG4gICAgICAgICAgICBiYXIuY3NzKHsgdG9wOiBvZmZzZXRUb3AgKyAncHgnIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNjcm9sbCBjb250ZW50XG4gICAgICAgICAgbWUuc2Nyb2xsVG9wKGRlbHRhKTtcblxuICAgICAgICAgIC8vIGZpcmUgc2Nyb2xsaW5nIGV2ZW50XG4gICAgICAgICAgbWUudHJpZ2dlcignc2xpbXNjcm9sbGluZycsIH5+ZGVsdGEpO1xuXG4gICAgICAgICAgLy8gZW5zdXJlIGJhciBpcyB2aXNpYmxlXG4gICAgICAgICAgc2hvd0JhcigpO1xuXG4gICAgICAgICAgLy8gdHJpZ2dlciBoaWRlIHdoZW4gc2Nyb2xsIGlzIHN0b3BwZWRcbiAgICAgICAgICBoaWRlQmFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdHRhY2hXaGVlbCgpXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIF9vbldoZWVsLCBmYWxzZSApO1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgX29uV2hlZWwsIGZhbHNlICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ubW91c2V3aGVlbFwiLCBfb25XaGVlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QmFySGVpZ2h0KClcbiAgICAgICAge1xuICAgICAgICAgIC8vIGNhbGN1bGF0ZSBzY3JvbGxiYXIgaGVpZ2h0IGFuZCBtYWtlIHN1cmUgaXQgaXMgbm90IHRvbyBzbWFsbFxuICAgICAgICAgIGJhckhlaWdodCA9IE1hdGgubWF4KChtZS5vdXRlckhlaWdodCgpIC8gbWVbMF0uc2Nyb2xsSGVpZ2h0KSAqIG1lLm91dGVySGVpZ2h0KCksIG1pbkJhckhlaWdodCk7XG4gICAgICAgICAgYmFyLmNzcyh7IGhlaWdodDogYmFySGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICAgIC8vIGhpZGUgc2Nyb2xsYmFyIGlmIGNvbnRlbnQgaXMgbm90IGxvbmcgZW5vdWdoXG4gICAgICAgICAgdmFyIGRpc3BsYXkgPSBiYXJIZWlnaHQgPT0gbWUub3V0ZXJIZWlnaHQoKSA/ICdub25lJyA6ICdibG9jayc7XG4gICAgICAgICAgYmFyLmNzcyh7IGRpc3BsYXk6IGRpc3BsYXkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaG93QmFyKClcbiAgICAgICAge1xuICAgICAgICAgIC8vIHJlY2FsY3VsYXRlIGJhciBoZWlnaHRcbiAgICAgICAgICBnZXRCYXJIZWlnaHQoKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQocXVldWVIaWRlKTtcblxuICAgICAgICAgIC8vIHdoZW4gYmFyIHJlYWNoZWQgdG9wIG9yIGJvdHRvbVxuICAgICAgICAgIGlmIChwZXJjZW50U2Nyb2xsID09IH5+cGVyY2VudFNjcm9sbClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvL3JlbGVhc2Ugd2hlZWxcbiAgICAgICAgICAgIHJlbGVhc2VTY3JvbGwgPSBvLmFsbG93UGFnZVNjcm9sbDtcblxuICAgICAgICAgICAgLy8gcHVibGlzaCBhcHByb3BvcmlhdGUgZXZlbnRcbiAgICAgICAgICAgIGlmIChsYXN0U2Nyb2xsICE9IHBlcmNlbnRTY3JvbGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9ICh+fnBlcmNlbnRTY3JvbGwgPT09IDApID8gJ3RvcCcgOiAnYm90dG9tJztcbiAgICAgICAgICAgICAgICBtZS50cmlnZ2VyKCdzbGltc2Nyb2xsJywgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJlbGVhc2VTY3JvbGwgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdFNjcm9sbCA9IHBlcmNlbnRTY3JvbGw7XG5cbiAgICAgICAgICAvLyBzaG93IG9ubHkgd2hlbiByZXF1aXJlZFxuICAgICAgICAgIGlmKGJhckhlaWdodCA+PSBtZS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAvL2FsbG93IHdpbmRvdyBzY3JvbGxcbiAgICAgICAgICAgIHJlbGVhc2VTY3JvbGwgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBiYXIuc3RvcCh0cnVlLHRydWUpLmZhZGVJbignZmFzdCcpO1xuICAgICAgICAgIGlmIChvLnJhaWxWaXNpYmxlKSB7IHJhaWwuc3RvcCh0cnVlLHRydWUpLmZhZGVJbignZmFzdCcpOyB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWRlQmFyKClcbiAgICAgICAge1xuICAgICAgICAgIC8vIG9ubHkgaGlkZSB3aGVuIG9wdGlvbnMgYWxsb3cgaXRcbiAgICAgICAgICBpZiAoIW8uYWx3YXlzVmlzaWJsZSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBxdWV1ZUhpZGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGlmICghKG8uZGlzYWJsZUZhZGVPdXQgJiYgaXNPdmVyUGFuZWwpICYmICFpc092ZXJCYXIgJiYgIWlzRHJhZ2cpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiYXIuZmFkZU91dCgnc2xvdycpO1xuICAgICAgICAgICAgICAgIHJhaWwuZmFkZU91dCgnc2xvdycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICAgIC8vIG1haW50YWluIGNoYWluYWJpbGl0eVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxuICAkLmZuLmV4dGVuZCh7XG4gICAgc2xpbXNjcm9sbDogJC5mbi5zbGltU2Nyb2xsXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNsaW1TY3JvbGw7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbGVtZW50OiAkKCksXG4gICAgcHJlbG9hZGVyOiAkKCcjcHJlbG9hZGVycycpLFxuICAgIG5hdHVyYWxIOiAwLFxuICAgIG5hdHVyYWxXOiAwLFxuICAgIGltZ0xvYWRlZDoge30sXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICBoYXNWaWRlbyAgICA9IGVsLmRhdGEoJ3ZpZGVvJykgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICAsICAgJHBhcmFsbGF4ZXMgPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICBoYXNQYXJhbGxheCA9ICRwYXJhbGxheGVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZVxuICAgICAgICA7XG5cbiAgICAgICAgc2VsZi5pbWdMb2FkZWQgPSBpbWFnZXNMb2FkZWQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSApO1xuICAgICAgICBzZWxmLmVsZW1lbnQgPSBlbDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZC5vbignYWx3YXlzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHNlbGYubmF0dXJhbEggPSBzZWxmLmVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgICBzZWxmLm5hdHVyYWxXID0gc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cbiAgICAgICAgICAgIHNlbGYucmVzY2FsZUltYWdlKCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNWaWRlbyAmJiAhaGFzUGFyYWxsYXgpIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5sb2FkVmlkZW8oc2VsZi5lbGVtZW50LmRhdGEoJ3ZpZGVvJykpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc1BhcmFsbGF4KSBzZWxmLmluaXRQYXJhbGxheCgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9hZFZpZGVvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNUb3VjaCA9IE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgaWYgKGlzVG91Y2gpIHJldHVybjtcblxuICAgICAgICB2YXIgQlZTb3VyY2VzID0gW11cbiAgICAgICAgLCAgIEJWU291cmNlc1R5cGUgPSBbJ21wNCcsICd3ZWJtJywgJ29ndiddXG4gICAgICAgIDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEJWU291cmNlc1R5cGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICBCVlNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZpZGVvLycgKyBCVlNvdXJjZXNUeXBlW2ldLFxuICAgICAgICAgICAgICAgIHNyYzogdXJsICsgJy4nICsgQlZTb3VyY2VzVHlwZVtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhCVlNvdXJjZXMpO1xuXG4gICAgICAgIHZhciBCViA9IG5ldyAkLkJpZ1ZpZGVvKHtcbiAgICAgICAgICAgIHVzZUZsYXNoRm9yRmlyZWZveDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIEJWLmluaXQoKTtcbiAgICAgICAgQlYuc2hvdyhCVlNvdXJjZXMsIHtcbiAgICAgICAgICAgIGFtYmllbnQ6IHRydWVcbiAgICAgICAgICAgICwgYWx0U291cmNlOiAnYXNzZXRzL3ZpZGVvcy9ZLndlYm0nXG4gICAgICAgICAgICAsIHRlY2hPcmRlcjogWydodG1sNSddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJWLmdldFBsYXllcigpLm9uKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnQuYWRkQ2xhc3MoJ3ZpZGVvLWxvYWRlZCcpO1xuICAgICAgICAgICAgJCgnI3ByZWxvYWRlcnMnKS5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQoJyNwcmVsb2FkZXJzJykuY3NzKCd6LWluZGV4JywgJy05MDAwJyk7IH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlc2NhbGVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuZWxlbWVudC5sZW5ndGgpIGNvbnNvbGUud2FybmluZygnbm8gYmFja2dyb3VuZCBpbWFnZScpO1xuXG4gICAgICAgIHZhciBpbWFnZVJhdGlvID0gdGhpcy5uYXR1cmFsVyAvIHRoaXMubmF0dXJhbEhcbiAgICAgICAgLCAgIHZpZXdwb3J0UmF0aW8gPSAkKHdpbmRvdykud2lkdGgoKSAvICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgICAsICAgcHVzaExlZnRcbiAgICAgICAgLCAgIHB1c2hUb3BcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh2aWV3cG9ydFJhdGlvIDwgaW1hZ2VSYXRpbykge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLXdpZHRoJykuYWRkQ2xhc3MoJ2Z1bGwtaGVpZ2h0Jyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9ICggaW1hZ2VSYXRpbyAqICQod2luZG93KS5oZWlnaHQoKSAtICQod2luZG93KS53aWR0aCgpICkgLyAtMjtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAwO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcHVzaExlZnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmdWxsLWhlaWdodCcpLmFkZENsYXNzKCdmdWxsLXdpZHRoJyk7XG4gICAgICAgICAgICBwdXNoTGVmdCA9IDA7XG4gICAgICAgICAgICBwdXNoVG9wID0gKHRoaXMuZWxlbWVudC5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgLyAtMjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAgcHVzaFRvcCArICdweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXRQYXJhbGxheDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsICAgJHBhcmFsbGF4ID0gJCgnI3BhcmFsbGF4ZXMnKVxuICAgICAgICAsICAgJGltZ3MgPSAkKCcucGFyYWxsYXgtaW1hZ2UnKVxuICAgICAgICAsICAgX3BoID0gJHBhcmFsbGF4LmhlaWdodCgpXG4gICAgICAgIDtcblxuICAgICAgICAvLyBDZW50ZXIgaW1hZ2UgdmVydGljYWxseSBieSBtYXJnaW5cbiAgICAgICAgJGltZ3MuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJCh0aGlzKS5jc3MoeyAnbWFyZ2luLXRvcCc6IChfcGggLSAkKHRoaXMpLmhlaWdodCgpKS8yIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLnBhcmFsbGF4aWZ5KHtcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcGVydHk6ICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnByZWxvYWRlci5hZGRDbGFzcygncGFnZS1sb2FkZWQnKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgnLnJlY29sb3InKS5sZW5ndGggfHwgISQoJy5iYWNrZ3JvdW5kJykubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIEJhY2tncm91bmRDaGVjay5pbml0KHtcbiAgICAgICAgICAgIHRhcmdldHM6ICcucmVjb2xvcidcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9IGVsLmZpbmQoJy5ob21lLWhlcm8tdG9nZ2xlcicpLFxuICAgICAgICAgICAgICAgICRoZXJvQm9keSA9IGVsLmZpbmQoJy5ob21lLWhlcm8tYm9keScpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRoZXJvQm9keS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIF9zY29wZSA9IHRoaXM7XG4gICAgICAgIGVsLmZpbmQoJy5uYXYtMScpLmVhY2goZnVuY3Rpb24oaSkge1xuXG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgdmFyIF9zdmdPYmogPSAkKHRoaXMpLmZpbmQoJy5uYXYtMS1vYmplY3QnKVswXVxuICAgICAgICAgICAgLCAgIF9zdmdEb2NcbiAgICAgICAgICAgICwgICBfbmF2RWxcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgX3N2Z09iai5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3N2Z0RvYyA9IF9zdmdPYmouY29udGVudERvY3VtZW50O1xuICAgICAgICAgICAgICAgIF9uYXZFbCAgPSBfc3ZnRG9jLnF1ZXJ5U2VsZWN0b3IoJy5uYXZpZ2F0aW9uLXN2ZycpO1xuXG4gICAgICAgICAgICAgICAgaWYoJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSkgX25hdkVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbmF2aWdhdGlvbi1zdmcgYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAkZWwuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoISQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaG92ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGhvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX25hdkVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbmF2aWdhdGlvbi1zdmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykuY2xvc2VzdCgnLm5hdicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwYXJlbnQsIGVsKSB7XG4gICAgICAgIGVsLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgZWxzZSAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGVsLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgfSxcbiAgICBpbml0UGFnZU5hdmlnYXRpb246ICBmdW5jdGlvbihoYXNJbmZvKSB7XG4gICAgICAgIHZhciAkaW5mb0J0blRvZ2dsZXJzID0gJCgnLmluZm8tYnRuLXRvZ2dsZXJzJylcbiAgICAgICAgLCAgICRwYWdlSW5mb3MgPSAkKCcucGFnZS1pbmZvcycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdnMgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9ucycpXG4gICAgICAgICwgICAkcGFnZVN1Yk5hdkxpbmsgPSAkKCcjcGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKVxuICAgICAgICA7XG5cbiAgICAgICAgJGluZm9CdG5Ub2dnbGVycy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VJbmZvcy5sZW5ndGgpICRwYWdlSW5mb3MudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaWYoJHBhZ2VTdWJOYXZzLmxlbmd0aCkgJHBhZ2VTdWJOYXZzLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHBhZ2VTdWJOYXZzLmZpbmQoJy5wYWdlLXN1Ym5hdmlnYXRpb24tbGluaycpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICRpbmZvQnRuVG9nZ2xlcnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5pbmZvLWJ0bi10b2dnbGVyW2RhdGEtcHJvamVjdF0nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1wcm9qZWN0JywgJCh0aGlzKS5kYXRhKCdwcm9qZWN0JykpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KCQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICR0b2dnbGVyOiAkKCksXG4gICAgJHJlbGF0ZWRFbGVtZW50OiAkKCksXG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuJHJlbGF0ZWRFbGVtZW50ID0gZWw7XG4gICAgICAgIHNlbGYudG9nZ2xlciA9IGVsLmZpbmQoJy5yZWxhdGVkLXRvZ2dsZXInKTtcblxuICAgICAgICBzZWxmLnRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgICAgICB2YXIgc2VsZiAgICAgICAgICAgPSB0aGlzXG4gICAgICAgICwgICAkdGh1bWJHcm91cHMgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWItZ3JvdXBzJylcbiAgICAgICAgLCAgICR0aHVtYnMgICAgICAgID0gc2VsZi5lbGVtZW50LmZpbmQoJy50aHVtYicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9ycyA9ICQoJy5wYWdlLW5hdmlnYXRpb25zLmhhcy10aHVtYnMgLnBhZ2Utc2VsZWN0b3JzJylcbiAgICAgICAgLCAgIGlzU3dhcCAgICAgICAgID0gZmFsc2VcbiAgICAgICAgO1xuXG4gICAgICAgIHZhciBoYXNOZXUgPSBlbC5oYXNDbGFzcygnaGFzLW5ldScpOyAvKmNvbnNvbGUubG9nKCdoYXNOZXUnICxoYXNOZXUpOyovXG5cbiAgICAgICAgdmFyIF90aHVtYk4gPSAkdGh1bWJzLmxlbmd0aFxuICAgICAgICAsICAgX3RodW1iR3JvdXBzTGltaXQgPSBoYXNOZXUgPyA0IDogNlxuICAgICAgICAsICAgX3RodW1iR3JvdXBOID0gKF90aHVtYk4gPiBfdGh1bWJHcm91cHNMaW1pdCkgPyBNYXRoLmNlaWwoX3RodW1iTiAvIF90aHVtYkdyb3Vwc0xpbWl0KSA6IDFcbiAgICAgICAgLCAgIF90aHVtYlN0YXJ0ID0gMFxuICAgICAgICAsICAgX3RodW1iRW5kID0gX3RodW1iR3JvdXBOXG4gICAgICAgICwgICBfdGh1bWJHcm91cFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ0aHVtYi1ncm91cFwiIC8+J1xuICAgICAgICAsICAgX2VsV2lkdGggPSB0aGlzLmVsZW1lbnQud2lkdGgoKVxuICAgICAgICAsICAgX3RodW1iR3JvdXBMZWZ0ID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgc2V0IC50aHVtYi1ncm91cHMgd2lkdGhcbiAgICAgICAgJHRodW1iR3JvdXBzLmNzcygnd2lkdGgnLCAxMDAgKiBfdGh1bWJHcm91cE4gKyBcIiVcIik7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgZ3JvdXAgLnRodW1iLCBhbmQgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGh1bWJHcm91cE47IGkgKyspIHtcbiAgICAgICAgICAgIC8vIGJlZ2luIGdyb3VwaW5nIHRodW1iXG4gICAgICAgICAgICBfdGh1bWJTdGFydCA9ICgoX3RodW1iR3JvdXBzTGltaXQgKyAwKSAqIGkpO1xuICAgICAgICAgICAgX3RodW1iRW5kID0gX3RodW1iU3RhcnQgKyBfdGh1bWJHcm91cHNMaW1pdDtcbiAgICAgICAgICAgICR0aHVtYnNcbiAgICAgICAgICAgICAgICAuc2xpY2UoIF90aHVtYlN0YXJ0LCBfdGh1bWJFbmQgKVxuICAgICAgICAgICAgICAgIC53cmFwQWxsKF90aHVtYkdyb3VwVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXAgJiYgIWhhc05ldSkgJCh0aGlzKS5hZGRDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIHByZXZcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZsdDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUgID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3JcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rIHJlY29sb3JcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIG5leHRcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZndDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoJHBhZ2VTZWxlY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBGaXJzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgcHJldlxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlKTtcblxuICAgICAgICAgICAgLy8gTmV4dDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbnVtXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF90aHVtYkdyb3VwTjsgaiArKykge1xuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMYXN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBuZXh0XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEkcGFnZVNlbGVjdG9ycy5maW5kKCdsaScpLmxlbmd0aCkgJHBhZ2VTZWxlY3RvcnMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBEZWZpbmUgc2VsZWN0b3IgaGVscGVyc1xuICAgICAgICB2YXIgJHBhZ2VTZWxlY3RvciA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JQcmV2ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IucHJldicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yTmV4dCA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLm5leHQnKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIHByZXZcbiAgICAgICAgJHBhZ2VTZWxlY3RvclByZXYuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAncHJldicpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGFuZCB0ZXh0IGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgJHBhZ2VTZWxlY3RvclxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yUHJldilcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3Rvck5leHQpXG4gICAgICAgICAgICAuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAudGV4dCgoaW5kZXggKyAxKSlcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGlkZScsIGluZGV4KVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCBzdHlsZSBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIG5leHRcbiAgICAgICAgJHBhZ2VTZWxlY3Rvck5leHQuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAnbmV4dCcpO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCB0byBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciAkc2VsZWN0b3IgPSAkKClcbiAgICAgICAgLCAgIF9kYXRhU2xpZGUgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAkcGFnZVNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2VsZWN0b3IgPSAkKHRoaXMpLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKTtcbiAgICAgICAgICAgICRzZWxlY3Rvci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ3ByZXYnKSBfZGF0YVNsaWRlIC0tO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ25leHQnKSBfZGF0YVNsaWRlICsrO1xuICAgICAgICAgICAgICAgIGVsc2UgX2RhdGFTbGlkZSA9ICQodGhpcykuZGF0YSgnc2xpZGUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChfZGF0YVNsaWRlIDwgMCkgX2RhdGFTbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2RhdGFTbGlkZSA+IChfdGh1bWJHcm91cE4gLSAxKSkgX2RhdGFTbGlkZSA9IChfdGh1bWJHcm91cE4gLSAxKTtcblxuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJywgX2RhdGFTbGlkZSk7XG4gICAgICAgICAgICAgICAgX3RodW1iR3JvdXBMZWZ0ID0gJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnKSAqIF9lbFdpZHRoO1xuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoICdsZWZ0JywgJy0nICsgX3RodW1iR3JvdXBMZWZ0ICsgJ3B4JyApO1xuXG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3Rvci5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciBfbGlua1NlbGVjdG9yU3RyaW5nID0gJy5wYWdlLXNlbGVjdG9yLWxpbmtbZGF0YS1zbGlkZT1cIicgKyBfZGF0YVNsaWRlICsgJ1wiXSc7XG4gICAgICAgICAgICAgICAgJChfbGlua1NlbGVjdG9yU3RyaW5nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHh4eFRlbXBsYXRlID0gICc8ZGl2IGlkPVwieHh4XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ4eHgtaW5uZXJcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHA+Q3VycmVudGx5LDwvcD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHA+dGhpcyBzaXRlIGRvZXMgbm90IHN1cHBvcnQgbW9iaWxlL3RvdWNoIGRldmljZXMuPC9wPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cD5WaWV3IG9uIGRlc2t0b3AgY29tcHV0ZXJzIGZvciBiZXR0ZXIgZXhwZXJpZW5jZS48L3A+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoTW9kZXJuaXpyLnRvdWNoKSAkKCdib2R5JykuYXBwZW5kKCR4eHhUZW1wbGF0ZSk7XG4gICAgfVxufTtcbiJdfQ==
