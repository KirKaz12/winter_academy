/*
 * (c) Supercoders
 * http://supercoders.ru
 * info@supercoders.ru
 */

// @codekit-prepend 'plugins/sup-metrics.js'
// @codekit-prepend 'plugins/sup-svgsprite.js'
// @codekit-prepend 'plugins/sup-lazyload.js'
// @codekit-prepend 'plugins/sup-expand.js'
// @codekit-prepend 'plugins/sup-forms.js'
// @codekit-prepend 'plugins/sup-slider.js'
// @codekit-prepend 'plugins/sup-tabs.js'

(function(window, document) {
  $(document).ready(function() {
    sup.module('scroller', function() {
      this.init = function() {
        $('.js-scroller').on('click.sup', function(event) {
          event.preventDefault();

          var target = $(this).data('target');
          var gap = !!$(this).data('gap') ? $(this).data('gap') : 0;

          if (gap == 'none') {
            gap = 0;
          }

          if (!!target) {
            target = $(target);

            if (target.length) {
              target = target.offset();

              if (target.top - gap !== sup.offset.data.top) {
                $('html, body').stop().animate({
                  scrollTop: target.top - gap
                }, 600);
              }
            }
          }
        });
      };
    });

    sup.module('prices', function() {
      var component = this;

      this.init = function() {
        component.types = {
          current: 'full',
          disabled: [
            'full',
            'invest',
            'analize',
            'trade'
          ],
          full: {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true,
            9: true,
            10: true,
            11: true,
            12: true,
            13: true,
            14: true,
            15: true,
            16: true,
            17: true
          },
          invest: {
            1: false,
            2: false,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: false,
            9: false,
            10: true,
            11: false,
            12: false,
            13: false,
            14: false,
            15: false,
            16: true,
            17: false
          },
          analize: {
            1: false,
            2: false,
            3: true,
            4: false,
            5: false,
            6: false,
            7: true,
            8: true,
            9: true,
            10: false,
            11: true,
            12: true,
            13: true,
            14: false,
            15: true,
            16: false,
            17: false
          },
          trade: {
            1: false,
            2: false,
            3: true,
            4: false,
            5: false,
            6: false,
            7: true,
            8: false,
            9: false,
            10: false,
            11: false,
            12: true,
            13: true,
            14: false,
            15: true,
            16: false,
            17: false
          },
          part: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            11: false,
            12: false,
            13: false,
            14: false,
            15: false,
            16: false,
            17: false
          }
        };
        component.tabs = $('.js-modules-tab');
        component.fields = $('.js-modules-field');
        component.priceFirst = $('.js-modules-price[data-type="first"]');
        component.priceLast = $('.js-modules-price[data-type="last"]');
        component.handle(component.calculate);

        $('.js-modules-row').on('click.sup', function(event) {
          var checkbox;

          if (event.target.type !== 'checkbox') {
            event.preventDefault();
            checkbox = $(this).find('input:checkbox');

            if (checkbox.length && checkbox.prop('disabled') !== true) {
              checkbox.prop('checked', !checkbox.prop('checked'));
              component.calculate();
            }
          }
        });

        $('.js-modules-link').on('click.sup', function() {
          // event.preventDefault();
          var parent = $(this).closest('.js-modules-tab');

          if (!parent.hasClass('is-active')) {
            component.tabs.removeClass('is-active');
            parent.addClass('is-active');
            component.types.current = $(this).data('type');
            component.handle(component.calculate);
          }
        });
      };

      component.handle = function(callback) {
        $('.js-modules-field').each(function() {
          if (~component.types.disabled.indexOf(component.types.current)) {
            $(this).prop('disabled', true);
          } else {
            $(this).prop('disabled', false);
          }

          $(this).prop('checked', component.types[component.types.current][$(this).data('module')]);
        });

        if (typeof callback === 'function') {
          callback();
        }
      };

      component.calculate = function() {
        var tab = component.tabs.filter('.is-active');
        // var tabDiscount = false;
        var tabPrice = false;

        // if (tab.length && tab.data('discount')) {
        //   tabDiscount = tab.data('discount');
        // }
        if (tab.length && tab.data('price')) {
          tabPrice = tab.data('price').split(',');
        }

        var priceFirst = 0;
        var priceLast = 0;

        if (!tabPrice) {
          $('.js-modules-field').each(function() {
            if (this.checked) {
              var price = $(this).data('price');
              var discount = $(this).data('discount');

              // if (tabDiscount) {
              //   priceFirst += price;
              // } else {
                priceFirst += (price - (price * (discount * 0.01))) | 0;
              // }

              priceLast += price;
            }
          });
        } else {
          priceFirst = tabPrice[0];
          priceLast = tabPrice[1];
        }

        // if (tabDiscount) {
        //   priceLast = (priceLast - (priceLast * (tabDiscount * 0.01))) | 0;
        // }

        if (component.priceFirst.length) {
          component.priceFirst.html(priceFirst);
        }

        if (component.priceLast.length) {
          component.priceLast.html(priceLast);
        }
      };
    });

    sup.module('slides', function() {
      this.init = function() {
        $('.js-slides').owlCarousel({
          items: 2,
          itemsCustom: [[1100, 2], [0, 1]],
          slideSpeed: 600,
          // autoPlay: 7000,
          // stopOnHover: true,
          navigation: true,
          navigationText: [
            '<svg><use xlink:href="#icon-arrow-left"></use></svg>',
            '<svg><use xlink:href="#icon-arrow-right"></use></svg>'
          ],
          pagination: true,
          lazyLoad: false,
          rewindNav: false
        });
      };
    });
  });
})(window, document);
