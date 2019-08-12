/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function (a) {
    function b(b) {
        var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
        if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
            if (1 === g.deltaMode) {
                var q = a.data(this, "mousewheel-line-height");
                j *= q, m *= q, l *= q
            } else if (2 === g.deltaMode) {
                var r = a.data(this, "mousewheel-page-height");
                j *= r, m *= r, l *= r
            }
            if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
                var s = this.getBoundingClientRect();
                o = b.clientX - s.left, p = b.clientY - s.top
            }
            return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
        }
    }

    function c() {
        f = null
    }

    function d(a, b) {
        return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
    }

    var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        i = Array.prototype.slice;
    if (a.event.fixHooks) for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
    var k = a.event.special.mousewheel = {
        version: "3.1.12", setup: function () {
            if (this.addEventListener) for (var c = h.length; c;) this.addEventListener(h[--c], b, !1); else this.onmousewheel = b;
            a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
        }, teardown: function () {
            if (this.removeEventListener) for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null;
            a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
        }, getLineHeight: function (b) {
            var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
            return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
        }, getPageHeight: function (b) {
            return a(b).height()
        }, settings: {adjustOldDeltas: !0, normalizeOffset: !0}
    };
    a.fn.extend({
        mousewheel: function (a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        }, unmousewheel: function (a) {
            return this.unbind("mousewheel", a)
        }
    })
});

// noScroll
jQuery(function () {
    jQuery(window).on('touchmove.noScroll', function (e) {
        e.preventDefault();
    });
});

;(function ($, window, document, undefined) {

    main();

    function main() {
        $(init);
    }

    function init() {
        new IndexSlider();
    }

    function IndexSlider() {
        var ANIM_TIME = 600; // msec
        var BUFF_TIME = 800; // msec
        var TOUCH_BUFF = 50; // px
        var SP_MAX_WIDTH = 768; // px
        var CURRENT_CLASS = 'current';
        var ACTIVE_CLASS = 'active';
        var MENU_VISIBLE_CLASS = 'menu-visible';

        var $win = $(window);
        var $doc = $(document);
        var $body = $(document.body);
        var $slider = $('#slider');
        var $sects = $slider.children();
        var $current;
        var $next;
        var $nav = $('.slider-nav');
        var $nav_links;
        var $videos = $('video');

        var current = 0;
        var touchstart = {x: 0, y: 0};
        var touchmove = {x: 0, y: 0};
        var max = $sects.length - 1;
        var first = true;
        var lock;
        var retry_timer;

        _init();

        function _init() {
            $videos.on('canplay', _onVideoCanPlay);

            _createNav();
            _update();

            $win.on('mousewheel', _onMouseWheel);
            $doc.on('touchstart', _onTouchStart);
        }

        function _createNav() {
            var $link;
            var i;

            for (i = 0; i <= max; i++) {
                $link = $(document.createElement('span')).appendTo($nav);
                $link.on('click', {'page': i}, _onClickNav);
            }
            $nav_links = $nav.children();
        }

        function _update() {
            $next = $sects.eq(current);

            $nav_links.removeClass(CURRENT_CLASS);
            $nav_links.eq(current).addClass(CURRENT_CLASS);

            if ($current) {
                $current.fadeOut(ANIM_TIME);
            }

            var video = $next.find('video').get(0);
            if (!_isSp()) {
                _playVideo(video);
            }

            if (first) {
                first = false;
                $next.show();
                $('.color-white').css({'height': '100%'}).show();
                $('.color-black').css({'height': '100%'}).hide();
                _onAnimComplete();
            } else {
                $next.fadeIn(ANIM_TIME, _onAnimComplete);

                // 白黒入れ替え
                switch (current) {
                    // white
                    case 0:
                    case 1:
                    case 3:
                        $('.color-white').fadeIn();
                        $('.color-black').fadeOut();
                        $nav.removeClass('nav-black');
                        break;
                    // black
                    case 2:
                        $('.color-white').fadeOut();
                        $('.color-black').fadeIn();
                        $nav.addClass('nav-black');
                        break;
                }
            }
        }

        function _onVideoCanPlay(e) {
            var $video = $(e.currentTarget);
            $video.data('canplay', true);
        }

        function _onAnimComplete() {
            if ($current) {
                $current.removeClass(ACTIVE_CLASS);
            }
            $next.addClass(ACTIVE_CLASS);

            // video停止
            // $sects.each(function (i) {
            //     if (i != current) {
            //         $sects.eq(i).find('video').get(0).pause();
            //     }
            // });

            $current = $next;

            setTimeout(function () {
                lock = false;
            }, BUFF_TIME);
        }

        function _onClickNav(e) {
            e.stopPropagation();
            e.preventDefault();

            var page = e.data.page;

            if (lock || page == current) {
                return;
            }
            lock = true;

            current = page;

            _update();
        }

        function _onMouseWheel(e) {
            e.stopPropagation();
            e.preventDefault();

            if (lock || $body.hasClass(MENU_VISIBLE_CLASS)) {
                return;
            }

            if (e.deltaY < 0) {
                _goNext();
            } else {
                _goPrev();
            }
        }

        function _onTouchStart(e) {
            if (lock) {
                return false;
            }
            $doc.off('touchmove', _onTouchMove).on('touchmove', _onTouchMove);
            $doc.off('touchend', _onTouchEnd).one('touchend', _onTouchEnd);

            touchstart = {
                x: (e.originalEvent.touches) ? e.originalEvent.touches[0].clientX : e.clientX,
                y: (e.originalEvent.touches) ? e.originalEvent.touches[0].clientY : e.clientY
            };
            touchmove = {
                x: 0,
                y: 0
            };
        }

        function _onTouchMove(e) {
            e.preventDefault();

            var touchtemp = {
                x: (e.originalEvent.touches) ? e.originalEvent.touches[0].clientX : e.clientX,
                y: (e.originalEvent.touches) ? e.originalEvent.touches[0].clientY : e.clientY
            };
            touchmove = {
                x: touchtemp.x - touchstart.x,
                y: touchtemp.y - touchstart.y
            };
        }

        function _onTouchEnd(e) {
            $doc.off('touchmove', _onTouchMove);

            if (Math.abs(touchmove.x) > Math.abs(touchmove.y)) {
                if (Math.abs(touchmove.x) > TOUCH_BUFF) {
                    if (touchmove.x < 0) {
                        _goNext();
                    } else {
                        _goPrev();
                    }
                }
            } else {
                if (Math.abs(touchmove.y) > TOUCH_BUFF) {
                    if (touchmove.y < 0) {
                        _goNext();
                    } else {
                        _goPrev();
                    }
                }
            }
        }

        function _goNext() {
            lock = true;
            current = (current < max) ? current + 1 : 0;
            _update();
        }

        function _goPrev() {
            lock = true;
            current = (current > 0) ? current - 1 : max;
            _update();
        }

        function _playVideo(video) {
            clearTimeout(retry_timer);

            if ($(video).data('canplay')) {
                video.currentTime = 0;
                video.play();
            } else {
                retry_timer = setTimeout(function () {
                    _playVideo(video);
                }, 100);
            }
        }

        function _isSp() {
            if ($win.innerWidth() <= SP_MAX_WIDTH) {
                return true;
            }

            return false;
        }
    }

})(jQuery, window, document);