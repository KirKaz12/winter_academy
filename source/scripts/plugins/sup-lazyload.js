/* Sup.js: lazyload v0.0.1, http://git.io/vrgHy
 * --------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('lazyload', function() {
      var component = this;

      component.init = function() {
        component.selectors = {
          image: '.js-lazy',
          loader: '.js-lazy-loader'
        };

        component.process($(component.selectors.image));
      };

      component.process = function(image) {
        var imageCache = $();

        if (sup._isArray(image)) {
          for (var i = 0; i < image.length; i++) {
            imageCache = imageCache.add(image[i].find(component.selectors.image));
          }

          image = imageCache;
        }

        if (!!!image || typeof image == 'object' && !image.length) {
          return;
        } else {
          if (typeof image == 'string') {
            image = $(image);
          }
        }

        if (image.length) {
          image.each(function() {
            if (!this.getAttribute('data-src')) {
              return;
            }

            if (this.getAttribute('data-deferred') == 'true') {
              this.removeAttribute('data-deferred');
            } else {
              var item = this;
              var itemLoad;
              var itemParent;
              var itemLoader;
              var itemDeep;

              // if not processed
              if (!/is-processed/.test(item.className)) {
                item.className += ' is-processed';

                // change src
                if (this.tagName == 'IMG') {
                  item.src = item.getAttribute('data-src');
                } else {
                  item.style.backgroundImage = 'url(' + item.getAttribute('data-src') + ')';
                }

                item.removeAttribute('data-src');
                itemLoad = imagesLoaded(item);
                itemLoad.on('always', function(instance) {
                  item.className += ' is-ready';
                  itemLoad = null;
                  itemDeep = item.getAttribute('data-deep') == "true";

                  if (itemDeep) {
                    itemParent = sup._closest(item, 'js-lazy-holder');
                  } else {
                    itemParent = item.parentNode;
                  }

                  itemLoader = itemParent.querySelector(component.selectors.loader);

                  // hide loader
                  if (itemLoader) {
                    itemLoader.className+= ' is-active';
                    itemParent.className+= ' is-loaded';

                    setTimeout(function() {
                      itemParent.removeChild(itemLoader);
                    }, sup.features.cssanimations ? 1000 : 0);
                  }
                });
              }
            }
          });
        }
      };
    });
  });
})(window, document);
