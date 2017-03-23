/* Sup.js: slider v0.0.1, http://git.io/vrgHy
 * ------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('slider', function() {
      this.init = function() {
        this.process('.js-slider');
      };

      this.process = function(selector) {
        $(selector).each(function() {
          var slider = $(this);
          var slides = slider.find(selector + '-slides');

          slides.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            slick.$slides.eq(currentSlide).removeClass('is-active');
            slick.$slides.eq(nextSlide).addClass('is-active');

            if (slick.options.asNavFor) {
              var carousel = $(slick.options.asNavFor).slick('getSlick');

              carousel.$slides.removeClass('is-active');
              carousel.$slidesCache.removeClass('is-active');
              carousel.$slides.eq(nextSlide).addClass('is-active');
            }
          });

          slides.on('init', function(event, slick) {
            if (slick.options.asNavFor) {
              setTimeout(function() {
                var carousel = $(slick.options.asNavFor).slick('getSlick');

                carousel.$slides.eq(0).addClass('is-active');
                carousel.$slidesCache.eq(0).addClass('is-active');
              }, 400);
            }
          });

          slides.slick({
            fade: true,
            customPaging : function(slider, i) {
              return '<span>' + i + '</span>';
            },
            autoplay: !!slider.data('autoplay') ? true : false,
            autoplaySpeed: !!slider.data('autoplay') ? (slider.data('autoplay') | 0) * 1000 : null,
            accessibility: false,
            appendArrows: slider,
            prevArrow: slider.find(selector + '-prev'),
            nextArrow: slider.find(selector + '-next'),
            slide: selector + '-slide',
            speed: 800,
            dots: slider.data('dots') === true,
            asNavFor: slider.data('nav') || null,
            adaptiveHeight: true
          });
        });
      };
    });
  });
})(window, document);
