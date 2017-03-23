/* Sup.js: metrics v0.0.1, http://git.io/vrgHy
 * -------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module(function() {
      sup.cache.$win = $(window);
      sup.cache.$html = $(sup.cache.html);
      sup.cache.$head = $(sup.cache.head);
      sup.cache.$body = $(sup.cache.body);
      // sup.cache.$ruler = $('.js-ruler');

      var components = {

        // viewport listener
        viewport: function() {
          this.init = function() {
            var component = this;

            component.data = {
              extra: []
            };

            component.update();
            // component.mobile();
            component.viewport();
            sup.cache.$win.on('resize.sup orientationchange.sup' + (sup.device.mobile ? ' scroll' : ''), $.throttle(150, component.update));
            // sup.cache.$win.on('resize.sup orientationchange.sup', component.mobile);
            sup.cache.$win.on('resize.sup orientationchange.sup', component.viewport);
          };

          this.extra = function(fn) {
            if (typeof fn == 'function') {
              sup.viewport.data.extra.push(fn);
            } else {
              for (var i = 0; i < sup.viewport.data.extra.length; i++) {
                if (typeof sup.viewport.data.extra[i] == 'function') {
                  sup.viewport.data.extra[i]();
                }
              }
            }
          };

          // this.mobile = function() {
          //   sup.viewport.data.mobile = parseInt(sup.$.ruler.css('font-size'), 10) == 10;
          // };

          this.viewport = function() {
            if (sup.viewport.data.width <= 400 || window.innerWidth <= 400) {
              var meta = document.getElementById('viewport');

              if (meta) {
                meta.setAttribute('content', 'width=400, minimal-ui');
              }
            }
          };

          this.update = function() {
            sup.viewport.data.width = sup.cache.$win.width();
            sup.viewport.data.height = sup.cache.$win.height();
            sup.viewport.extra();
          };
        },

        // offset listener
        offset: function() {
          this.init = function() {
            this.data = {};
            this.update();
            sup.cache.$win.on('scroll.sup orientationchange.sup', this.update);
          };

          this.update = function() {
            sup.offset.data.top = sup.cache.$win.scrollTop();
            sup.offset.data.bottom = sup.offset.data.top + sup.viewport.data.height;
            sup.offset.data.left = sup.cache.$win.scrollLeft();
            sup.offset.data.right = sup.offset.data.left + sup.viewport.data.width;
          };
        }
      };

      return components;
    });

    if (window.console && window.console.log) {
      console.log('Front-end: Supercoders, http://supercoders.ru');
    }
  });
})(window, document);
