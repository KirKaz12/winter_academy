/* Sup.js: expand v0.0.1, http://git.io/vrgHy
 * ------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('expand', function() {
      this.init = function() {
        $(document).on('click.toggle', '.js-expand', function(event) {
          var active;
          var quit;
          var parent;
          var content;

          if ($(this).data('mobile') == true) {
            quit = app.viewport.data.mobile ? false : true;
          }

          if (!quit) {
            event.preventDefault();

            if ($(this).data('deep') == true) {
              parent = $(this).closest('.js-expand-holder');

              if (parent.length) {
                content = parent.find('.js-expand-content')
              }
            } else {
              content = $(this).next('.js-expand-content');
            }

            if (content && content.length) {
              if (parent && parent.length) {
                active = $(parent).hasClass('is-expanded');

                $(this).toggleClass('is-active', !active);
                content.toggleClass('is-active', !active);
                parent.toggleClass('is-expanded', !active);
              } else {
                $(this).toggleClass('is-active', !$(this).hasClass('is-active'));
              }
            }
          }
        });
      };
    });
  });
})(window, document);
