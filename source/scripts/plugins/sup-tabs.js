/* Sup.js: tabs v0.0.1, http://git.io/vrgHy
 * ------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('tabs', function() {
      this.init = function() {
        var module = this;

        module.toggler = $('.js-tab-toggle');
        module.content = $('.js-tab');

        $(document).on('click.tab', '.js-tab-toggle', function(event) {
          event.preventDefault();
          module.operate(this);
        });
      };

      this.operate = function(node) {
        if (!$(node).hasClass('is-active')) {
          var items = this.content.filter('[data-type="' + $(node).data('type') + '"]');

          // this.toggler
          this.toggler.filter('[data-type="' + $(node).data('type') + '"]').removeClass('is-active');
          $(node).addClass('is-active');

          // this.content
          items.addClass('is-hidden').removeClass('is-active');
          items.filter('[data-id="' + $(node).data('id') + '"]').removeClass('is-hidden').addClass('is-active');
        }
      };
    });
  });
})(window, document);
