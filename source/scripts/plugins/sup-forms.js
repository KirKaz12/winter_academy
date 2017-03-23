/* Sup.js: forms v0.0.1, http://git.io/vrgHy
 * -----------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  $(document).ready(function() {
    sup.module('forms', function() {
      var component = this;

      component.init = function() {
        component.selector = '.js-form';
        component.process(component.selector);
      };

      component.process = function(selector) {
        if (!!!selector || typeof selector == 'object' && !selector.length) {
          return;
        } else {
          if (typeof selector == 'string') {
            selector = $(selector);
          }
        }

        selector.each(function() {
          var form = $(this);
          var submitted = false;
          var fields = form.find(component.selector + '-validate');
          var button = form.find(component.selector + '-submit');

          // button
          button.data('count', fields.length);

          // form
          form.on('submit.forms', function(event) {
            event.preventDefault();
            submitted = true;

            if (form.hasClass('is-active')) {
              return;
            }

            if (component.validate(fields, false, submitted, button)) {
              var formData = sup.features.formdata ? new FormData(form[0]) : null;

              form.addClass('is-loading is-active');

              $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                processData: sup.features.formdata ? false : true,
                contentType: sup.features.formdata ? false : true,
                data: sup.features.formdata ? formData : form.serialize(),
                success: function(data) {
                  form.removeClass('is-loading').addClass('is-success').one('click.forms', function() {
                    form.removeClass('is-active is-success');
                  });
                },
                error: function() {
                  form.removeClass('is-loading').addClass('is-error').one('click.forms', function() {
                    form.removeClass('is-active is-error');
                  });

                  setTimeout(function() {
                    if (form.hasClass('is-error')) {
                      form.removeClass('is-active is-error');
                    }
                  }, 5000);
                }
              });
            } else {
              event.preventDefault();
              fields.filter('.is-invalid').first().focus();
            }
          });

          // fields
          fields.on('focus.forms blur.forms change.forms keyup.forms', function(event) {
            var field = $(this);
            var value;

            if (event.type == 'focus' && field.data('label') !== true) {
              field.data('label', true);
              field.addClass('is-hinted');
            }

            if (event.type == 'blur') {
              $(this).data('blur', true);
              value = sup._trim(field.val() || '');

              if (field.data('label') === true && !!!value) {
                field.data('label', false);
                field.removeClass('is-hinted');
                field.val('');
              }
            }

            component.validate($(this), event, submitted, button);
          });

          setTimeout(function() {
            fields.each(function() {
              var field = $(this);
              var value = sup._trim(field.val() || '');

              if (!!value) {
                field.data('label', true);
                field.addClass('is-hinted');
              }
            });
          }, 50);
        });
      };

      component.validate = function(fields, event, submitted, button) {
        var result = true;
        var progressCount;
        var progressCounter = button && button.data('progress') === true;
        var progressState;
        var buttonState;

        fields.each(function() {
          var field = $(this);
          var validate = field.data('validate');

          if (submitted || !!$(this).data('blur')) {
            var value = sup._trim(field.val() || '');
            var type = field.attr('type') || (this.tagName == 'SELECT' ? 'select' : 'textarea');
            var valid = true;
            var least = (type == 'tel' || validate == 'contact' ? 7 : (type == 'textarea' ? 10 : 3));
            var skip = validate === false;

            if (field.data('least') | 0) {
              least = field.data('least') | 0;
            }

            // select
            if (type == 'select') {
              if (!!!value && !skip) {
                valid = false;
              }
            } else {
              if (skip) {
                valid = true;
              } else {
                if (!!value || type == 'checkbox') {

                  // checkbox
                  if (type == 'checkbox' && !this.checked) {
                    valid = false;

                    // phone
                  } else if (type == 'tel') {
                    if (!value.match(/^([0-9\(\)\/\+ \-]*)$/) || value.length < least || !!field.data('mask') && ~value.indexOf('_')) {
                      valid = false;
                    }

                    // email
                  } else if (type == 'email') {
                    if (!value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/)) {
                      valid = false;
                    }

                    // contact
                  } else if (field.data('validate') == 'contact') {
                    if (!(value.match(/^([0-9\(\)\/\+ \-]*)$/) && value.length >= least || value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/))) {
                      valid = false;
                    }
                  } else if (value.length < least) {
                    valid = false;
                  }
                } else {
                  valid = false;
                }
              }
            }

            if (!valid) {
              result = false;

              if (progressCounter) {
                progressState = false;

                // +1 to -1
                if (progressState !== field.data('state')) {
                  button.data('valid', (button.data('valid') | 0) - (field.data('state') === undefined ? 0 : 1));
                  field.data('state', false);
                }
              }
            } else {
              if (progressCounter) {
                progressState = true;

                // -1 to +1
                if (progressState !== field.data('state')) {
                  button.data('valid', (button.data('valid') | 0) + 1);
                  field.data('state', true);
                }
              }
            }

            field.toggleClass('is-invalid', !valid);
          }

          if (validate == 'name') {
            var currentValue = (field.val() || '').split(' ');
            var newValue = [];

            if (currentValue.length) {
              for (var i = 0; i < currentValue.length; i++) {
                if (currentValue[i].length > 1) {
                  currentValue[i] = currentValue[i].charAt(0).toUpperCase() + currentValue[i].slice(1);
                }

                newValue.push(currentValue[i]);
              }

              field.val(newValue.join(' '));
            }
          }
        });

        if (progressCounter) {
          progressCount = button.data('valid') | 0;

          if (button.data('cache') !== progressCount && !!button.data('count')) {
            if (!!button.data('cache')) {
              button.removeClass('button__' + button.data('cache') + '-of-' + button.data('count'));
            }

            button.data('cache', progressCount);

            if (!!progressCount) {
              button.addClass('button__' + progressCount + '-of-' + button.data('count'));
            }
          }
        }

        return result;
      };

      component.destroy = function(selector) {
        if (!!!selector) {
          selector = $(component.selector);
        } else if (typeof selector == 'object') {
          if (!selector.length) {
            return;
          } else {
            selector.find(component.selector);
          }
        }

        selector.each(function() {
          var form = $(this);
          var fields = form.find(component.selector + '-validate');

          form.off('.forms');
          fields.off('.forms');
        });
      };
    });
  }, true);
})(window, document);
