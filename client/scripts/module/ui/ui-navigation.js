module.exports = {
    init: function(el) {
        var _scope = this;
        el.find('.nav-1').each(function(i) {

            var $el = $(this);

            var _svgObj = $(this).find('.nav-1-object')[0]
            ,   _svgDoc
            ,   _navEl
            ;

            // _svgObj.addEventListener('load', function() {
            //     _svgDoc = _svgObj.contentDocument;
                 _navEl  = $el.find('.navigation-svg');

                if($el.hasClass('active')) _navEl.setAttribute('class', 'navigation-svg active');

                $el.hover(
                    function() {
                        if(!$(this).hasClass('active')) {
                            $(this).toggleClass('hovered');
                            _navEl[0].setAttribute('class', 'navigation-svg hovered');
                        }
                    },
                    function() {
                        if(!$(this).hasClass('active')) {
                            $(this).toggleClass('hovered');
                            _navEl[0].setAttribute('class', 'navigation-svg');
                        }
                    }
                );
            // });

            $(this).on('click', function(e) {
                e.preventDefault();
                _scope.toggle(el, $(this).closest('.nav'));
            });
        });
    },

    toggle: function(parent, el) {
        el.each(function(index) {
            var $li = $(this).find('.nav-2-list');

            if($(this).hasClass('open')) {
                $li.each(function(i) { $(this).css('transition-delay', (($li.length - i) * 0.2) + 's'); });
                $(this).removeClass('open');
            }
            else {
                $li.each(function(i) { $(this).css('transition-delay', (i * 0.2) + 's'); });
                $(this).addClass('open');
            }
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
