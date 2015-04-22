/* ===================================================
 * nv/Slider JavaScript Library
 * Version 1.2.0
 * http://github.com/strackovski/nvslider
 * http://www.nv3.org/nvslider
 * ===================================================
 * Copyright 2015 Vladimir Stračkovski <vlado@nv3.org>
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://choosealicense.com/licenses/mit/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*global $:false, jQuery:false */
/*global console:false */
/*jshint unused:false*/

;(function($, window, document, undefined) {
    if (typeof  Object.create !== 'function') {
        Object.create = function (o) {
            var F = function () {};
            F.prototype = o;
            return new F();
        };
    }

    var main_self;
    var methods = {

        destroy: function (elem) {
            var self = this;

            if (self.data('plugin_nvslider')) {
                NvSlider.destroy(self, elem);
            } else {
                console.log('Error: Trying to destroy a non-existent slider. No data.');
            }
        }
    };

    var NvSlider = {
        init: function (options, elem) {
            main_self = this;
            var self = this;
            self.elem = elem;
            self.$elem = $(elem)
                .addClass('nvs-inner-wrap')
                .wrap('<div class="nvs-wrap"></div>');

            self.options = $.extend({}, $.fn.nvslider.options, options);
            self.options.orientation = 'landscape';
            self.options.rows = 1;

            self.$wrap = self.$elem.closest('.nvs-wrap')
                .addClass('nvs-wrapper-' + self.options.orientation);

            if (self.options.slideFor > self.options.showItems) {
                self.options.slideFor = self.options.showItems;
            }

            var slider = self.$wrap.find('.nvs-inner-wrap'),
                items = slider.find('> *'),
                len = items.length,
                first = items.filter(':first').addClass('first-nvs-elem'),
                last = items.filter(':last');

            if (len <= self.options.showItems) {
                self.options.showNav = false;
                self.options.slideshow = false;
            }

            var slideFor = self.options.slideFor;

            var lastClone, firstClone;

            firstClone = items.slice(-slideFor).clone(true);
            first.before(firstClone);
            lastClone = items.slice(0, len-slideFor).clone(true);
            last.after(lastClone);

            self.$children = self.$wrap.find('.nvs-inner-wrap > *')
                .addClass('nvs-elem');

            self.$grandchildren = self.$wrap.find('.nvs-elem > *');

            self.setup();
        },

        setup: function () {

            var self = this;
            self.options.rows = 1;

            // add class based on theme
            self.$wrap.addClass('nvs-theme-' + self.options.theme);

            self.$outerwrap = self.$wrap.parent();
            self.$outerwrap.prepend('<div class="nvs-nav nvs-nav-left"><i class="fa fa-angle-left"></i></div>');
            self.$outerwrap.prepend('<div class="nvs-nav nvs-nav-right"><i class="fa fa-angle-right"></i></div>');

            self.handlers();
            self.setStyle();
        },

        setStyle: function () {
            var self = this;


            if (!self.options.showNav ) {
                self.$nav.css({opacity: 0, visibility: 'hidden'});
            }
            self.$innerWrap = self.$wrap.find('.nvs-inner-wrap');
            var width_in_percents = 100 / self.options.showItems + '%';

            self.$children.css({width: width_in_percents});

            var pure_percents = 100/self.options.showItems;
            var left = '-' + (pure_percents * self.options.slideFor) + '%';
            self.$innerWrap.css('left', left);

        },

        handlers: function () {
            var self = this;
            self.$nav = self.$outerwrap.find('.nvs-nav');
            self.$navLeft = self.$outerwrap.find('.nvs-nav-left');
            self.$navRight = self.$outerwrap.find('.nvs-nav-right');

            self.$navLeft.on('click', function () {
                if (self.$innerWrap.is(':not(:animated)')) {

                    var pure_percents = 100/self.options.showItems;
                    var items = self.$wrap.find('.nvs-inner-wrap > *'),
                        first = items.filter(':first');

                    var lastItems = items.slice(-self.options.slideFor);
                    first.before(lastItems);

                    var left_style = self.$innerWrap[0].style.left,
                        left_num = parseInt(left_style, 10),
                        left_new = (left_num - (self.options.slideFor * pure_percents)),
                        left_new_percent = left_new + '%';

                    self.$innerWrap.removeAttr('style');
                    self.$innerWrap.css({left: left_new_percent});

                    self.$innerWrap.animate({left: left_style}, {}, function () {
                        self.$innerWrap.css('left', left_style);
                    });
                }
            });

            self.$navRight.on('click', function () {

                if (self.$innerWrap.is(':not(:animated)')) {

                    var pure_percents = 100/self.options.showItems;
                    var items = self.$wrap.find('.nvs-inner-wrap > *'),
                        last = items.filter(':last');

                    var firstItems = items.slice(0, self.options.slideFor);
                    last.after(firstItems);

                    var left_style = self.$innerWrap[0].style.left,
                        left_num = parseInt(left_style, 10),
                        left_new = (left_num + (self.options.slideFor * pure_percents)),
                        left_new_percent = left_new + '%';

                    self.$innerWrap.removeAttr('style');
                    self.$innerWrap.css({left: left_new_percent});

                    self.$innerWrap.animate({left: left_style}, {}, function () {
                        self.$innerWrap.css('left', left_style);
                    });
                }
            });

            if (self.options.slideshow) {
                self.slideshow();
            }
        },

        slideshow: function () {
            var self = this;

            setInterval(function () {
                self.$navRight.click();
            }, self.options.timer);

        },

        destroy: function (obj, elem) {
            var self = obj;

            self.elem = elem;
            self.$elem = $(elem);

            // remove wrap
            self.$wrap = self.$elem.parents('.nvs-wrap');
            self.$wrap.find('.nvs-inner-wrap > *')
                .removeClass('nvs-elem').removeAttr('style');

            self.$elem.removeClass('nvs-inner-wrap').removeAttr('style');

            var $contents = $(self.$wrap.html());

            var gt = obj.data('elements') + main_self.options.slideFor;

            // remove duplicated elements
            $contents.find(' > *:gt(' + (gt-1) + ')').remove();
            $contents.find(' > *:lt(' + main_self.options.slideFor + ')').remove();

            var firstElem = $contents.find('.first-nvs-elem');

            if (firstElem.prevAll().length) {

                var elemsBefore = Array.prototype.reverse.call(firstElem.prevAll());
                firstElem.prevAll().remove();
                $contents.append(elemsBefore);
            }

            var $parent = self.$wrap.parent();
            $parent.html($contents[0]);
            obj.removeData();
        }
    };

    // plugin wrapper
    $.fn.nvslider = function (options) {
        var $this = this;

        if (methods[options]) {
            return methods[options].apply($this, this);
        } else {
            if ($this.data('plugin_nvslider')) {
                return;
            }

            return this.each(function () {
                var nvslider = Object.create(NvSlider);
                var num = $this.find(' > *').length;

                nvslider.init(options, this);

                $this.data('plugin_nvslider', true);
                $this.data('elements', num);
            });
        }
    };

    // plugin options
    $.fn.nvslider.options = {
        showItems: 2,
        slideFor: 3,
        theme: 'default',
        showNav: true,
        slideshow: false,
        timer: 5000
    };

}(jQuery, window, document));