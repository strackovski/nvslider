/*global $:false, jQuery:false */
/*global console:false */
/*jshint unused:false*/

;(function ($, window, document, undefined) {
    'use strict';

    $.nvslider = function (el, options) {
        var base = this;
        base.el = el;
        base.$el = $(el).addClass('nvs-ul').wrap('<div class="nvs-wrap"></div>');

        base.init = function () {

            //extend options
            base.options = $.extend({}, $.fn.nvslider.defaults, options);

            //add class to wrapper based on 'orientation' option
            base.$wrap = base.$el.parent().closest('div.nvs-wrap').addClass('nvs-wrapper-' + base.options.orientation);

            //cache existing DOM elements
            base.$children = base.$el.children('li').addClass('nvs-li-landscape');
            base.$grandchildren = base.$wrap.find('.nvs-li-landscape > *');

            //height for future reference
            base.pureHeight = parseInt(base.options.height, 10);

            //call setup
            base.setup();
        };

        base.setup = function () {

            //get number of rows if orientation == portrait
            //else there can only be 1 row
            if (base.options.orientation === 'landscape') {
                base.options.rows = 1;
            }

            //how many items to slide for
            //in portrait orientation, max number of slideFor is number of rows
            if (base.options.orientation === 'portrait') {
                if (base.options.slideFor > base.options.rows) {
                    base.options.slideFor = base.options.rows;
                }
            }
            //handling 'themes'
            if (base.$grandchildren.length > 0) {
                if (base.options.theme === 'default') {
                    base.$grandchildren.addClass('nvs-span-default');
                } else if (base.options.theme === 'gallery') {
                    base.$grandchildren.addClass('nvs-span-gallery');
                }
            }
            if (base.options.theme === 'gallery') {
                base.$wrap.addClass('nvs-wrapper-gallery');
            }

            //add navigation
            if (base.options.orientation === 'landscape') {
                base.$wrap.prepend('<div class="nvs-nav-left nvs-nav"><i class="fa fa-angle-left"></i></div>');
                base.$wrap.prepend('<div class="nvs-nav-right nvs-nav"><i class="fa fa-angle-right"></i></div>');
            } else if (base.options.orientation === 'portrait') {
                base.$wrap.prepend('<div class="nvs-nav-up nvs-nav"><i class="fa fa-angle-up"></i></div>');
                base.$wrap.prepend('<div class="nvs-nav-down nvs-nav"><i class="fa fa-angle-down"></i></div>');
            }

            base.$nav = base.$wrap.find('.nvs-nav');
            base.$navLeft = base.$wrap.find('.nvs-nav-left');
            base.$navRight = base.$wrap.find('.nvs-nav-right');
            base.$navUp = base.$wrap.find('.nvs-nav-up');
            base.$navDown = base.$wrap.find('.nvs-nav-down');

            //call nav
            base.nav();
        };

        base.nav = function () {

            base.$navLeft.addClass(base.options.leftArrowClass);
            base.$navRight.addClass(base.options.rightArrowClass);
            base.$navUp.addClass(base.options.topArrowClass);
            base.$navDown.addClass(base.options.bottomArrowClass);

            var marginTop = (base.pureHeight / 2 - (base.$navLeft.height() / 2)),
                marginLeft = (base.$wrap.width() / 2 - (base.$navUp.width() / 2));

            if (base.options.theme === 'gallery') {
                base.$nav.css({background: '#000', opacity: 0.8, color: '#fff'});
            }

            base.$wrap.css(base.options.height);

            if (base.options.orientation === 'portrait') {
                base.$nav.css({marginLeft: marginLeft});
            } else {
                base.$nav.css({marginTop: marginTop});
            }

            base.css();
        };

        base.css = function () {

            var width_in_percents = 100 / base.options.showItems + '%';
            base.$children.css({height: base.options.height});
            base.$wrap.css({height: base.pureHeight * base.options.rows});
            base.$wrap.css(base.options.containerCss);
            base.$grandchildren.css({display: 'inline-block'});
            base.$children.width(width_in_percents);

            base.clicks();
        };

        base.clicks = function () {

            //make sure the slider stops when there are no more items to show
            var totalChildren = base.$children.length,
                safeLimit = -(totalChildren - base.options.showItems) * (100 / base.options.showItems),
                control;

            //the bigger number defines control - when the slider should stop sliding
            if (base.options.rows >= base.options.slideFor) {
                control = base.options.rows;
            } else {
                control = base.options.slideFor;
            }

            var safeLimitPortrait = -((Math.ceil(totalChildren / base.options.showItems) - control) * base.pureHeight),
                leftOffset = 0,
                topOffset = 0;

            //click handlers
            base.$navDown.on('click', function () {
                topOffset -= base.pureHeight * base.options.slideFor;
                if (topOffset < safeLimitPortrait) {
                    topOffset = safeLimitPortrait;
                }
                base.$el.animate({top: topOffset});

            });
            base.$navUp.on('click', function () {
                if (topOffset < 0) {
                    topOffset += base.pureHeight * base.options.slideFor;
                    if (topOffset > 0) {
                        topOffset = 0;
                    }
                }
                base.$el.animate({top: topOffset});
            });
            base.$navLeft.on('click', function () {
                if (leftOffset < 0) {
                    leftOffset += (100 / base.options.showItems) * base.options.slideFor;
                    if (leftOffset > 0) {
                        leftOffset = 0;
                    }
                }
                base.$el.animate({left: leftOffset + '%'});
            });
            base.$navRight.on('click', function () {
                leftOffset -= (100 / base.options.showItems) * base.options.slideFor;
                if (leftOffset < safeLimit) {
                    leftOffset = safeLimit;
                }
                base.$el.animate({left: leftOffset + '%'});
            });

            base.resize();

        };

        base.resize = function () {

            $(window).resize(function () {
                var navMarginTop = (base.pureHeight / 2 - (base.$nav.height() / 2)),
                    navMarginLeft = (base.$wrap.width() / 2 - (base.$nav.width() / 2));

                if (base.options.orientation === 'landscape') {
                    base.$nav.css({marginTop: navMarginTop});
                }

                if (base.options.orientation === 'portrait') {
                    base.$nav.css({marginLeft: navMarginLeft});
                }
            });
        };

        //call init, get everything rolling
        base.init();
    };

    $.fn.nvslider = function (options) {
        var $this = $(this);

        return $this.each(function () {
            var obj = new $.nvslider($this, options);
            return obj;
        });
    };

    $.fn.nvslider.defaults = {
        showItems: 3,
        orientation: 'landscape',
        rows: 1,
        slideFor: 1,
        containerCss: {background: '#d2d2d2'},
        theme: 'default',
        leftArrowClass: 'nvs-horizontal-navigation-arrow',
        rightArrowClass: 'nvs-horizontal-navigation-arrow',
        topArrowClass: 'nvs-vertical-navigation-arrow',
        bottomArrowClass: 'nvs-vertical-navigation-arrow',
        height: '100px'
    };


}(jQuery, window, document));