/* Sup.js: svgsprite v0.0.1, http://git.io/vrgHy
 * ---------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('svgsprite', function() {
      var component = this;

      component.init = function() {
        if (!sup.features.svg) {
          return;
        }

        var url = sup.cache.html.getAttribute('data-svgsprite');
        var revision = 7;

        if (!url) {
          url = './svgsprite.html';
        }

        if (sup.features.localstorage) {
          if (localStorage.getItem('inlineSVGrev') == revision) {
            component.insert(localStorage.getItem('inlineSVGdata'));
          } else {
            component.request(url, function(response) {
              localStorage.setItem('inlineSVGrev', revision);
              localStorage.setItem('inlineSVGdata', response);
              component.insert(response);
            });
          }
        } else {
          component.request(url, function(response) {
            component.insert(response);
          });
        }
      };

      component.request = function(url, callback) {
        $.get(url, function(response) {
          if (typeof callback == 'function') {
            callback(response);
          }
        });
      };

      component.insert = function(data) {
        if (!!data) {
          sup._addClass(sup.cache.html, sup._getPrefix() + 'svgsprite-loaded');
          sup.cache.body.insertAdjacentHTML('afterbegin', data);
        }
      };
    });
  });
})(window, document);
