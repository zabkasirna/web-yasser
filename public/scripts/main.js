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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL2NsaWVudC9zY3JpcHRzL21haW4iLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvaGVscGVyL2RlYm91bmNlLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWFzc2V0LmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWNvbG9yLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLWhvbWUuanMiLCIvVXNlcnMvRU0vU2l0ZXMvd2ViLXlhc3Nlci9jbGllbnQvc2NyaXB0cy9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbi5qcyIsIi9Vc2Vycy9FTS9TaXRlcy93ZWIteWFzc2VyL2NsaWVudC9zY3JpcHRzL21vZHVsZS91aS91aS1yZWxhdGVkLmpzIiwiL1VzZXJzL0VNL1NpdGVzL3dlYi15YXNzZXIvY2xpZW50L3NjcmlwdHMvbW9kdWxlL3VpL3VpLXRodW1iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcXFxuICogTWFpbiBzY3JpcHQuXG4gKiBjbGllbnQvbWFpbi5qc1xuICoqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG47KCBmdW5jdGlvbiggJCApIHtcbiAgICB2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZS9oZWxwZXIvZGVib3VuY2UnKTtcblxuICAgIHZhciB1aUFzc2V0ICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS1hc3NldCcpXG4gICAgLCAgIHVpQ29sb3IgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWNvbG9yJylcbiAgICAsICAgdWlOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9tb2R1bGUvdWkvdWktbmF2aWdhdGlvbicpXG4gICAgLCAgIHVpSG9tZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLWhvbWUnKVxuICAgICwgICB1aVRodW1iICAgICAgPSByZXF1aXJlKCcuL21vZHVsZS91aS91aS10aHVtYicpXG4gICAgLCAgIHVpUmVsYXRlZCAgICA9IHJlcXVpcmUoJy4vbW9kdWxlL3VpL3VpLXJlbGF0ZWQnKVxuICAgIDtcblxuICAgIC8vIER5bmFtaWMgY29sb3JcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB1aUNvbG9yLmluaXQoKTsgfSwgMTAwKTtcblxuICAgIC8vIEJhY2tncm91bmRcbiAgICBpZiAoJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHVpQXNzZXQuaW5pdCgkKCcuYmFja2dyb3VuZCcpKTtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkgeyB1aUFzc2V0LnJlc2NhbGVJbWFnZSgpOyB9KTtcblxuICAgIC8vIE1haW4gbmF2aWdhdGlvblxuICAgIHZhciAkbmF2cyA9ICQoJyNuYXZpZ2F0aW9uJyk7XG4gICAgaWYgKCRuYXZzLmxlbmd0aCkgdWlOYXZpZ2F0aW9uLmluaXQoJG5hdnMpO1xuXG4gICAgLy8gUGFnZSBuYXZpZ2F0aW9uXG4gICAgaWYgKCQoJy5wYWdlLW5hdmlnYXRpb25zJykubGVuZ3RoKVxuICAgICAgICB1aU5hdmlnYXRpb24uaW5pdFBhZ2VOYXZpZ2F0aW9uKCQoJ3BhZ2UtbmF2aWdhdGlvbnMuaGFzLWluZm9zJykubGVuZ3RoKTtcblxuICAgIC8vIEhvbWVcbiAgICB1aUhvbWUuaW5pdCgkKCcjaG9tZS1oZXJvcycpKTtcblxuICAgIC8vIFRodW1ibmFpbHNcbiAgICBpZiAoJCgnLnRodW1icycpLmxlbmd0aCkgdWlUaHVtYi5pbml0KCQoJy50aHVtYnMnKSk7XG5cbiAgICAvLyBSZWxhdGVzXG4gICAgaWYgKCQoJy5yZWxhdGVkcycpLmxlbmd0aCkgdWlSZWxhdGVkLmluaXQoJCgnLnJlbGF0ZWRzJykpO1xuXG4gICAgLy8gU2hhbWVcbiAgICAvLyBNb3ZlIHRvIGl0J3Mgb3duIG1vZHVsZVxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnZpZXdlci1jbG9zZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCcjdmlld2VycycpLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGNyZWF0ZVZpZXdlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGJhY2tncm91bmRFbCA9ICQoJy5iYWNrZ3JvdW5kJylcbiAgICAgICAgLCAgIGltZ1NyYyA9ICRiYWNrZ3JvdW5kRWwuYXR0cignc3JjJylcbiAgICAgICAgLCAgIHZpZXdlcnNUZW1wbGF0ZSA9XG4gICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJ2aWV3ZXJzXCIgY2xhc3M9XCJwcmVcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGRpdiBjbGFzcz1cInZpZXdlci1wcmVsb2FkZXJcIj48cD5sb2FkaW5nIGltYWdlLi4uPC9wPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwiY3JvcGl0LWltYWdlLXByZXZpZXdcIj48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGlucHV0IHR5cGU9XCJyYW5nZVwiIGNsYXNzPVwiY3JvcGl0LWltYWdlLXpvb20taW5wdXRcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGlucHV0IHR5cGU9XCJmaWxlXCIgY2xhc3M9XCJjcm9waXQtaW1hZ2UtaW5wdXRcIj4nXG4gICAgICAgICAgICAgICAgICAgICsnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInZpZXdlci1jbG9zZVwiPng8L2E+J1xuICAgICAgICAgICAgICAgICsnPC9kaXY+J1xuICAgICAgICA7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlUHJlKCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcjdmlld2VycycpLnJlbW92ZUNsYXNzKCdwcmUnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJ2FbZGF0YS10b29sPVwiaW1hZ2VcIicpKSB7XG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKHZpZXdlcnNUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIGlmKCQoJyN2aWV3ZXJzJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJCgnI3ZpZXdlcnMnKS5jcm9waXQoe1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVN0YXRlOiB7IHNyYzogaW1nU3JjIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uSW1hZ2VMb2FkZWQ6IHJlbW92ZVByZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQoJy5wYWdlLXRvb2wtYnRuW2RhdGEtdG9vbD1cImltYWdlXCJdJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgY3JlYXRlVmlld2VyKCk7IH0pO1xuXG4gICAgLy8gU2hhbWVcbiAgICB2YXIgaXNPcGVuID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gdXBkYXRlSW5mb0NyZWRpdCgpIHtcbiAgICAgICAgaXNPcGVuID0gIWlzT3BlbjtcbiAgICAgICAgaWYgKCFpc09wZW4pICAkKCcuY29udGFjdC1jcmVkaXRzJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgICAgZWxzZSAkKCcuY29udGFjdC1jcmVkaXRzJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9XG5cbiAgICAkKCcuY29udGFjdC1jcmVkaXQtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB1cGRhdGVJbmZvQ3JlZGl0KCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGVib3VuY2VcbiAgICAgICAgLCAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZm4uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsOyBcbiAgICAgICAgfVxuIFxuICAgICAgICBpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICBlbHNlIGlmIChpbW1lZGlhdGUpIGZuLmFwcGx5KG9iaiwgYXJncyk7XG4gXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApOyBcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBwcmVsb2FkZXI6ICQoJyNwcmVsb2FkZXJzJyksXG4gICAgbmF0dXJhbEg6IDAsXG4gICAgbmF0dXJhbFc6IDAsXG4gICAgaW1nTG9hZGVkOiB7fSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCAgIGhhc1ZpZGVvICAgID0gZWwuZGF0YSgndmlkZW8nKSA/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgICwgICAkcGFyYWxsYXhlcyA9ICQoJyNwYXJhbGxheGVzJylcbiAgICAgICAgLCAgIGhhc1BhcmFsbGF4ID0gJHBhcmFsbGF4ZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICBzZWxmLmltZ0xvYWRlZCA9IGltYWdlc0xvYWRlZCggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpICk7XG4gICAgICAgIHNlbGYuZWxlbWVudCA9IGVsO1xuXG4gICAgICAgIHNlbGYuaW1nTG9hZGVkLm9uKCdhbHdheXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc2VsZi5uYXR1cmFsSCA9IHNlbGYuZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHNlbGYubmF0dXJhbFcgPSBzZWxmLmVsZW1lbnQud2lkdGgoKTtcblxuICAgICAgICAgICAgc2VsZi5yZXNjYWxlSW1hZ2UoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1ZpZGVvICYmICFoYXNQYXJhbGxheCkgc2VsZi5wcmVsb2FkZXIuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzVmlkZW8gJiYgIWhhc1BhcmFsbGF4KSBzZWxmLmxvYWRWaWRlbyhzZWxmLmVsZW1lbnQuZGF0YSgndmlkZW8nKSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzUGFyYWxsYXgpIHNlbGYuaW5pdFBhcmFsbGF4KCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBsb2FkVmlkZW86IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBpc1RvdWNoID0gTW9kZXJuaXpyLnRvdWNoO1xuICAgICAgICBpZiAoaXNUb3VjaCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBCVlNvdXJjZXMgPSBbXVxuICAgICAgICAsICAgQlZTb3VyY2VzVHlwZSA9IFsnbXA0JywgJ3dlYm0nLCAnb2d2J11cbiAgICAgICAgO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQlZTb3VyY2VzVHlwZS5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIEJWU291cmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmlkZW8vJyArIEJWU291cmNlc1R5cGVbaV0sXG4gICAgICAgICAgICAgICAgc3JjOiB1cmwgKyAnLicgKyBCVlNvdXJjZXNUeXBlW2ldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBCViA9IG5ldyAkLkJpZ1ZpZGVvKCk7XG4gICAgICAgIEJWLmluaXQoKTtcbiAgICAgICAgQlYuc2hvdyhCVlNvdXJjZXMsIHtcbiAgICAgICAgICAgIGFtYmllbnQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgQlYuZ2V0UGxheWVyKCkub24oJ2xvYWRlZGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuZWxlbWVudC5hZGRDbGFzcygndmlkZW8tbG9hZGVkJyk7XG4gICAgICAgICAgICAkKCcjcHJlbG9hZGVycycpLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgJCgnI3ByZWxvYWRlcnMnKS5jc3MoJ3otaW5kZXgnLCAnLTkwMDAnKTsgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzY2FsZUltYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5lbGVtZW50Lmxlbmd0aCkgY29uc29sZS53YXJuaW5nKCdubyBiYWNrZ3JvdW5kIGltYWdlJyk7XG5cbiAgICAgICAgdmFyIGltYWdlUmF0aW8gPSB0aGlzLm5hdHVyYWxXIC8gdGhpcy5uYXR1cmFsSFxuICAgICAgICAsICAgdmlld3BvcnRSYXRpbyA9ICQod2luZG93KS53aWR0aCgpIC8gJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgICAgICwgICBwdXNoTGVmdFxuICAgICAgICAsICAgcHVzaFRvcFxuICAgICAgICA7XG5cbiAgICAgICAgaWYgKHZpZXdwb3J0UmF0aW8gPCBpbWFnZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtd2lkdGgnKS5hZGRDbGFzcygnZnVsbC1oZWlnaHQnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gKCBpbWFnZVJhdGlvICogJCh3aW5kb3cpLmhlaWdodCgpIC0gJCh3aW5kb3cpLndpZHRoKCkgKSAvIC0yO1xuICAgICAgICAgICAgcHVzaFRvcCA9IDA7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogIHB1c2hUb3AsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBwdXNoTGVmdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Z1bGwtaGVpZ2h0JykuYWRkQ2xhc3MoJ2Z1bGwtd2lkdGgnKTtcbiAgICAgICAgICAgIHB1c2hMZWZ0ID0gMDtcbiAgICAgICAgICAgIHB1c2hUb3AgPSAodGhpcy5lbGVtZW50LmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpKSAvIC0yO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcCc6ICBwdXNoVG9wICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHB1c2hMZWZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdFBhcmFsbGF4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgICAkcGFyYWxsYXggPSAkKCcjcGFyYWxsYXhlcycpXG4gICAgICAgICwgICAkaW1ncyA9ICQoJy5wYXJhbGxheC1pbWFnZScpXG4gICAgICAgICwgICBfcGggPSAkcGFyYWxsYXguaGVpZ2h0KClcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIENlbnRlciBpbWFnZSB2ZXJ0aWNhbGx5IGJ5IG1hcmdpblxuICAgICAgICAkaW1ncy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7ICdtYXJnaW4tdG9wJzogKF9waCAtICQodGhpcykuaGVpZ2h0KCkpLzIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQucGFyYWxsYXhpZnkoe1xuICAgICAgICAgICAgcG9zaXRpb25Qcm9wZXJ0eTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYucHJlbG9hZGVyLmFkZENsYXNzKCdwYWdlLWxvYWRlZCcpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCcucmVjb2xvcicpLmxlbmd0aCB8fCAhJCgnLmJhY2tncm91bmQnKS5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgQmFja2dyb3VuZENoZWNrLmluaXQoe1xuICAgICAgICAgICAgdGFyZ2V0czogJy5yZWNvbG9yJ1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyICR0b2dnbGVyID0gZWwuZmluZCgnLmhvbWUtaGVyby10b2dnbGVyJyksXG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5ID0gZWwuZmluZCgnLmhvbWUtaGVyby1ib2R5JylcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgJHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJGhlcm9Cb2R5LnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgX3Njb3BlID0gdGhpcztcbiAgICAgICAgZWwuZmluZCgnLm5hdi0xJykuZWFjaChmdW5jdGlvbihpKSB7XG5cbiAgICAgICAgICAgIHZhciBfc3ZnT2JqID0gJCh0aGlzKS5maW5kKCcubmF2LTEtb2JqZWN0JylbMF1cbiAgICAgICAgICAgICwgICBfc3ZnRG9jXG4gICAgICAgICAgICAsICAgX25hdkVsXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIF9zdmdPYmouYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF9zdmdEb2MgPSBfc3ZnT2JqLmNvbnRlbnREb2N1bWVudDtcbiAgICAgICAgICAgICAgICBfbmF2RWwgID0gX3N2Z0RvYy5xdWVyeVNlbGVjdG9yKCcubmF2aWdhdGlvbi1zdmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmhvdmVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnIGhvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9uYXZFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25hdmlnYXRpb24tc3ZnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9zY29wZS50b2dnbGUoZWwsICQodGhpcykuY2xvc2VzdCgnLm5hdicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24ocGFyZW50LCBlbCkge1xuICAgICAgICBlbC5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIGVsc2UgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBlbC50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0sXG4gICAgaW5pdFBhZ2VOYXZpZ2F0aW9uOiAgZnVuY3Rpb24oaGFzSW5mbykge1xuICAgICAgICB2YXIgJGluZm9CdG5Ub2dnbGVycyA9ICQoJy5pbmZvLWJ0bi10b2dnbGVycycpXG4gICAgICAgICwgICAkcGFnZUluZm9zID0gJCgnLnBhZ2UtaW5mb3MnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZzID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbnMnKVxuICAgICAgICAsICAgJHBhZ2VTdWJOYXZMaW5rID0gJCgnI3BhZ2Utc3VibmF2aWdhdGlvbi1saW5rJylcbiAgICAgICAgO1xuXG4gICAgICAgICRpbmZvQnRuVG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlSW5mb3MubGVuZ3RoKSAkcGFnZUluZm9zLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGlmKCRwYWdlU3ViTmF2cy5sZW5ndGgpICRwYWdlU3ViTmF2cy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRwYWdlU3ViTmF2cy5maW5kKCcucGFnZS1zdWJuYXZpZ2F0aW9uLWxpbmsnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkaW5mb0J0blRvZ2dsZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuaW5mby1idG4tdG9nZ2xlcltkYXRhLXByb2plY3RdJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcHJvamVjdCcsICQodGhpcykuZGF0YSgncHJvamVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCgkKHRoaXMpLmRhdGEoJ3Byb2plY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAkdG9nZ2xlcjogJCgpLFxuICAgICRyZWxhdGVkRWxlbWVudDogJCgpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLiRyZWxhdGVkRWxlbWVudCA9IGVsO1xuICAgICAgICBzZWxmLnRvZ2dsZXIgPSBlbC5maW5kKCcucmVsYXRlZC10b2dnbGVyJyk7XG5cbiAgICAgICAgc2VsZi50b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGVsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVsZW1lbnQ6ICQoKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgdmFyIHNlbGYgICAgICAgICAgID0gdGhpc1xuICAgICAgICAsICAgJHRodW1iR3JvdXBzICAgPSBzZWxmLmVsZW1lbnQuZmluZCgnLnRodW1iLWdyb3VwcycpXG4gICAgICAgICwgICAkdGh1bWJzICAgICAgICA9IHNlbGYuZWxlbWVudC5maW5kKCcudGh1bWInKVxuICAgICAgICAsICAgJHBhZ2VTZWxlY3RvcnMgPSAkKCcucGFnZS1uYXZpZ2F0aW9ucy5oYXMtdGh1bWJzIC5wYWdlLXNlbGVjdG9ycycpXG4gICAgICAgICwgICBpc1N3YXAgICAgICAgICA9IGZhbHNlXG4gICAgICAgIDtcblxuICAgICAgICB2YXIgaGFzTmV1ID0gZWwuaGFzQ2xhc3MoJ2hhcy1uZXUnKTsgY29uc29sZS5sb2coJ2hhc05ldScgLGhhc05ldSk7XG5cbiAgICAgICAgdmFyIF90aHVtYk4gPSAkdGh1bWJzLmxlbmd0aFxuICAgICAgICAsICAgX3RodW1iR3JvdXBzTGltaXQgPSBoYXNOZXUgPyA0IDogNlxuICAgICAgICAsICAgX3RodW1iR3JvdXBOID0gKF90aHVtYk4gPiBfdGh1bWJHcm91cHNMaW1pdCkgPyBNYXRoLmNlaWwoX3RodW1iTiAvIF90aHVtYkdyb3Vwc0xpbWl0KSA6IDFcbiAgICAgICAgLCAgIF90aHVtYlN0YXJ0ID0gMFxuICAgICAgICAsICAgX3RodW1iRW5kID0gX3RodW1iR3JvdXBOXG4gICAgICAgICwgICBfdGh1bWJHcm91cFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ0aHVtYi1ncm91cFwiIC8+J1xuICAgICAgICAsICAgX2VsV2lkdGggPSB0aGlzLmVsZW1lbnQud2lkdGgoKVxuICAgICAgICAsICAgX3RodW1iR3JvdXBMZWZ0ID0gMFxuICAgICAgICA7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgc2V0IC50aHVtYi1ncm91cHMgd2lkdGhcbiAgICAgICAgJHRodW1iR3JvdXBzLmNzcygnd2lkdGgnLCAxMDAgKiBfdGh1bWJHcm91cE4gKyBcIiVcIik7XG5cbiAgICAgICAgLy8gZHluYW1pY2FsbHkgZ3JvdXAgLnRodW1iLCBhbmQgY3JlYXRlIHBhZ2Utc2VsZWN0b3JcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGh1bWJHcm91cE47IGkgKyspIHtcbiAgICAgICAgICAgIC8vIGJlZ2luIGdyb3VwaW5nIHRodW1iXG4gICAgICAgICAgICBfdGh1bWJTdGFydCA9ICgoX3RodW1iR3JvdXBzTGltaXQgKyAwKSAqIGkpO1xuICAgICAgICAgICAgX3RodW1iRW5kID0gX3RodW1iU3RhcnQgKyBfdGh1bWJHcm91cHNMaW1pdDtcbiAgICAgICAgICAgICR0aHVtYnNcbiAgICAgICAgICAgICAgICAuc2xpY2UoIF90aHVtYlN0YXJ0LCBfdGh1bWJFbmQgKVxuICAgICAgICAgICAgICAgIC53cmFwQWxsKF90aHVtYkdyb3VwVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuZG9taXplIHRodW1iIGltYWdlL3RleHQgcG9zaXRpb25cbiAgICAgICAgJHRodW1icy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLXN3YXAnKTtcbiAgICAgICAgICAgIGlzU3dhcCA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gaXNTd2FwIDogIWlzU3dhcDtcbiAgICAgICAgICAgIGlmIChpc1N3YXAgJiYgIWhhc05ldSkgJCh0aGlzKS5hZGRDbGFzcygnaXMtc3dhcCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkeW5hbWljYWxseSBjcmVhdGUgcGFnZS1zZWxlY3RvclxuICAgICAgICB2YXIgX3BhZ2VTZWxlY3RvclByZXZUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIHByZXZcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZsdDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgICwgICBfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUgID0gJzxsaSBjbGFzcz1cInBhZ2Utc2VsZWN0b3JcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rIHJlY29sb3JcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PC9hPjwvbGk+J1xuICAgICAgICAsICAgX3BhZ2VTZWxlY3Rvck5leHRUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJwYWdlLXNlbGVjdG9yIG5leHRcIj48YSBkYXRhLXNsaWRlIGNsYXNzPVwicGFnZS1zZWxlY3Rvci1saW5rXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxvYmplY3QgZGF0YT1cImFzc2V0cy9pbWFnZXMvaWNvbi9hcnJvdy1ibGFjay5zdmdcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGNsYXNzPVwiaWNvblwiPiZndDs8L29iamVjdD48L2E+PC9saT4nXG4gICAgICAgIDtcblxuICAgICAgICBpZiAoJHBhZ2VTZWxlY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBGaXJzdDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgcHJldlxuICAgICAgICAgICAgaWYgKF90aHVtYkdyb3VwTiA+IDEpICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yUHJldlRlbXBsYXRlKTtcblxuICAgICAgICAgICAgLy8gTmV4dDogY3JlYXRlIHBhZ2Utc2VsZWN0b3IgbnVtXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF90aHVtYkdyb3VwTjsgaiArKykge1xuICAgICAgICAgICAgICAgICRwYWdlU2VsZWN0b3JzLmFwcGVuZChfcGFnZVNlbGVjdG9yTnVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMYXN0OiBjcmVhdGUgcGFnZS1zZWxlY3RvciBuZXh0XG4gICAgICAgICAgICBpZiAoX3RodW1iR3JvdXBOID4gMSkgJHBhZ2VTZWxlY3RvcnMuYXBwZW5kKF9wYWdlU2VsZWN0b3JOZXh0VGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEkcGFnZVNlbGVjdG9ycy5maW5kKCdsaScpLmxlbmd0aCkgJHBhZ2VTZWxlY3RvcnMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBEZWZpbmUgc2VsZWN0b3IgaGVscGVyc1xuICAgICAgICB2YXIgJHBhZ2VTZWxlY3RvciA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yJylcbiAgICAgICAgLCAgICRwYWdlU2VsZWN0b3JQcmV2ID0gJHBhZ2VTZWxlY3RvcnMuZmluZCgnLnBhZ2Utc2VsZWN0b3IucHJldicpXG4gICAgICAgICwgICAkcGFnZVNlbGVjdG9yTmV4dCA9ICRwYWdlU2VsZWN0b3JzLmZpbmQoJy5wYWdlLXNlbGVjdG9yLm5leHQnKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIHByZXZcbiAgICAgICAgJHBhZ2VTZWxlY3RvclByZXYuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAncHJldicpO1xuXG4gICAgICAgIC8vIFNldCBkYXRhLXNsaWRlIGFuZCB0ZXh0IGZvciBzZWxlY3RvciBudW1cbiAgICAgICAgJHBhZ2VTZWxlY3RvclxuICAgICAgICAgICAgLm5vdCgkcGFnZVNlbGVjdG9yUHJldilcbiAgICAgICAgICAgIC5ub3QoJHBhZ2VTZWxlY3Rvck5leHQpXG4gICAgICAgICAgICAuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAudGV4dCgoaW5kZXggKyAxKSlcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGlkZScsIGluZGV4KVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCBzdHlsZSBmb3Igc2VsZWN0b3IgbnVtXG4gICAgICAgIGlmIChfdGh1bWJHcm91cE4gPiAxKSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZSAkcGFnZVNlbGVjdG9yLm5vdCgkcGFnZVNlbGVjdG9yUHJldikuZXEoMCkuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgLy8gU2V0IGRhdGEtc2xpZGUgZm9yIHNlbGVjdG9yIG5leHRcbiAgICAgICAgJHBhZ2VTZWxlY3Rvck5leHQuZmluZCgnLnBhZ2Utc2VsZWN0b3ItbGluaycpLmF0dHIoJ2RhdGEtc2xpZGUnLCAnbmV4dCcpO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCB0byBwYWdlLXNlbGVjdG9yXG4gICAgICAgIHZhciAkc2VsZWN0b3IgPSAkKClcbiAgICAgICAgLCAgIF9kYXRhU2xpZGUgPSAwXG4gICAgICAgIDtcblxuICAgICAgICAkcGFnZVNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2VsZWN0b3IgPSAkKHRoaXMpLmZpbmQoJy5wYWdlLXNlbGVjdG9yLWxpbmsnKTtcbiAgICAgICAgICAgICRzZWxlY3Rvci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ3ByZXYnKSBfZGF0YVNsaWRlIC0tO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCQodGhpcykuZGF0YSgnc2xpZGUnKSA9PT0gJ25leHQnKSBfZGF0YVNsaWRlICsrO1xuICAgICAgICAgICAgICAgIGVsc2UgX2RhdGFTbGlkZSA9ICQodGhpcykuZGF0YSgnc2xpZGUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChfZGF0YVNsaWRlIDwgMCkgX2RhdGFTbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoX2RhdGFTbGlkZSA+IChfdGh1bWJHcm91cE4gLSAxKSkgX2RhdGFTbGlkZSA9IChfdGh1bWJHcm91cE4gLSAxKTtcblxuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5hdHRyKCdkYXRhLXNsaWRlJywgX2RhdGFTbGlkZSk7XG4gICAgICAgICAgICAgICAgX3RodW1iR3JvdXBMZWZ0ID0gJHRodW1iR3JvdXBzLmF0dHIoJ2RhdGEtc2xpZGUnKSAqIF9lbFdpZHRoO1xuICAgICAgICAgICAgICAgICR0aHVtYkdyb3Vwcy5jc3MoICdsZWZ0JywgJy0nICsgX3RodW1iR3JvdXBMZWZ0ICsgJ3B4JyApO1xuXG4gICAgICAgICAgICAgICAgJHBhZ2VTZWxlY3Rvci5maW5kKCcucGFnZS1zZWxlY3Rvci1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciBfbGlua1NlbGVjdG9yU3RyaW5nID0gJy5wYWdlLXNlbGVjdG9yLWxpbmtbZGF0YS1zbGlkZT1cIicgKyBfZGF0YVNsaWRlICsgJ1wiXSc7XG4gICAgICAgICAgICAgICAgJChfbGlua1NlbGVjdG9yU3RyaW5nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
