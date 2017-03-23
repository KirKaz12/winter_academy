/* Sup.js: core v0.0.1, http://git.io/vrgHy
 * ----------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

// @codekit-prepend 'plugins/sup-dorm.js'
// @codekit-prepend 'plugins/sup-features.js'

(function(window, document) {
  function Sup() {
    var sup = this;

    // cache
    sup.options = {
      modernizr: false,
      loader: false,
      loaderDelay: false,
      loaderRemove: true,
      loaderSelector: '.js-loading',
      legacyCheck: false,
      legacyMessage: 'Вы используете устаревший браузер!'
    };

    // cache
    sup.cache = {
      html: document.documentElement,
      pageClass: []
    };

    // domready
    sup._domready(function() {
      sup.cache.head = (document.head || document.getElementsByTagName('head')[0]);
      sup.cache.body = (document.body || document.getElementsByTagName('body')[0]);
    });

    // get prefix
    sup.prefix = sup._trim(sup.cache.html.getAttribute('data-prefix') || 'app');

    // detect domain
    sup.url = window.location.href.split(/\?|#/g)[0];
    sup.domain = window.location.protocol+ '//' + window.location.host + '/';

    // detect userAgent
    sup.ua = window.navigator.userAgent;

    // detect device
    sup.device = {
      mobile: !!dorm.mobile,
      phone: !!dorm.phone,
      tablet: !!dorm.tablet,
      desktop: !!dorm.desktop,
      os: !!dorm.os
    };

    // detect browser
    sup.browser = (function(ua, browser) {

      // Webkit
      browser.webkit = 'WebkitAppearance' in sup.cache.html.style;
      browser.chrome = !!(browser.webkit && window.chrome);
      browser.safari = !!(browser.webkit && !window.chrome);

      // Chromium and Safari
      if (browser.webkit) {
        sup._pageClass(browser.chrome ? 'chrome' : 'safari');
      }

      // Explorer
      browser.ie = (function(version, mode) {
        if (/MSIE [5-7]/.test(ua) || mode < 8) {
          version = 7;
        } else if (/MSIE 8/.test(ua) || mode == 8) {
          version = 8;
        } else if (/MSIE 9/.test(ua) || mode == 9) {
          version = 9;
        } else if (~window.navigator.appVersion.indexOf('MSIE 10')) {
          version = 10;
        } else if (~ua.indexOf('Trident') && ~ua.indexOf('rv:11')) {
          version = 11;
        } else if (browser.webkit && /Edge/.test(ua)) {
          version = 'edge';
        }

        if (version) {
          sup._pageClass('ie');
          sup._pageClass('ie' + (version == 'edge' ? '-' : '') + version);
        }

        return version;
      })(false, document.documentMode);

      // Firefox
      browser.firefox = (function(browser) {
        browser = /firefox/i.test(ua);

        if (browser) {
          sup._pageClass('firefox');
        }

        return browser;
      })();

      return browser;
    })(sup.ua, {});

    // features
    if (sup.options.modernizr) {
      sup.features = Modernizr;
      sup.features.addTest = function(name, result, applyClass, applyFeature) {
        if (typeof result == 'function') {
          result = result();
        }

        name = sup._trim(name);
        result = !!result;

        if (!!name) {
          if (applyFeature !== false) {
            this[name] = result;
          }

          if (applyClass !== false) {
            sup._pageClass((!result ? 'no-' : '') + name.toLowerCase());
          }
        }
      }
    } else {
      sup.features = window.__sup_features || {};

      if (sup.features.classNames) {
        sup._pageClass(sup.features.classNames);
        delete sup.features.classNames;
      }

      // detect js support
      this._replaceClass(this.cache.html, sup._getPrefix() + 'no-js', sup._getPrefix() + 'js');
    }

    if (window.__sup_features) {
      delete window.__sup_features;
    }

    // loader state
    sup._pageClass('loading');

    // detect legacy browsers
    if (sup.options.legacyCheck && (!('querySelectorAll' in document) || (sup.browser.ie && sup.browser.ie < 9) || (window.opera && window.opera.version() < 12) || !sup.features.displaytable)) {
      sup._pageClass('legacy');
      alert(sup.options.legacyMessage || 'Error');
    }

    // apply classes
    sup._pageClass();
    delete sup.cache.pageClass;

    // window load
    window.onload = function() {

      // loader state
      sup._replaceClass(sup.cache.html, sup.prefix + '-loading', sup.prefix + '-loaded');

      if (sup.options.loader) {
        setTimeout(function(loader) {
          if (sup.options.loaderRemove) {
            loader = document.querySelector(sup.options.loaderSelector);

            // remove loader
            if (loader) {
              loader.parentNode.removeChild(loader);
            }
          }

          sup._replaceClass(sup.cache.html, sup._getPrefix() + 'loading', '');
        }, sup.features.csstransitions && !!sup.options.loaderDelay ? (sup.options.loaderDelay | 0) : 0);
      }
    };
  }

  // module initiation
  Sup.prototype.module = function(mods, callback) {
    if (typeof mods == 'function') {
      mods = new mods();

      for (var mod in mods) {
        if (typeof mods[mod] == 'function') {
          var modName = sup._trim(mod);
          var modCallback = mods[mod];

          sup[modName] = new modCallback();
          sup[modName].init();
        }
      }
    } else {
      if (typeof callback == 'function') {
        mods = sup._trim(mods);
        sup[mods] = new callback();

        if (sup[mods].init && typeof sup[mods].init == 'function') {
          sup[mods].init();

        }
      }
    }
  };

  // helpers: page class appender
  Sup.prototype._pageClass = function(className) {
    if (!!className) {
      if (!this._isArray(className)) {
        className = this._getPrefix() + className;
      }

      if (this.cache.pageClass) {
        if (this._isArray(className)) {
          for (var i = 0; i < className.length; i++) {
            this.cache.pageClass.push(this._getPrefix() + className[i]);
          }
        } else {
          this.cache.pageClass.push(className);
        }
      } else {
        if (this._isArray(className)) {
          var classNameCache = '';

          for (var b = 0; b < className.length; b++) {
            classNameCache += this._getPrefix() + className[b];
          }

          className = classNameCache;
        }

        this._addClass(this.cache.html, className);
        // this.cache.html.className += className;
      }
    } else {
      if (this.cache.pageClass) {
        className = this.cache.html.className || '';

        for (var c = 0; c < this.cache.pageClass.length; c++) {
          className += this.cache.pageClass[c];
        }

        this._replaceClass(this.cache.html, null, className);
        // this.cache.html.className = className;
      }
    }
  };

  // helpers: createElement
  Sup.prototype._element = function(tagName) {
    return document.createElement(tagName);
  };

  // helpers: domready (based on http://github.com/ded/domready)
  Sup.prototype._domready = (function(ready) {
    var fns = [];
    var fn;
    var f = false;
    var html = document.documentElement;
    var hack = html.doScroll;
    var domContentLoaded = 'DOMContentLoaded';
    var addEventListener = 'addEventListener';
    var onreadystatechange = 'onreadystatechange';
    var readyState = 'readyState';
    var loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/;
    var loaded = loadedRgx.test(document[readyState]);

    function flush(f) {
      loaded = 1;
      while (f = fns.shift()) f();
    }

    document[addEventListener] && document[addEventListener](domContentLoaded, fn = function() {
      document.removeEventListener(domContentLoaded, fn, f);
      flush();
    }, f);

    hack && document.attachEvent(onreadystatechange, fn = function() {
      if (/^c/.test(document[readyState])) {
        document.detachEvent(onreadystatechange, fn);
        flush();
      }
    });

    return (ready = hack ?
      function(fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function() {
            try {
              html.doScroll('left');
            } catch(e) {
              return setTimeout(function() {
                ready(fn);
              }, 50);
            }

            fn();
          }();
      } : function(fn) {
        loaded ? fn() : fns.push(fn);
      });
  })();

  // helpers: get prefix
  Sup.prototype._getPrefix = function(prefix) {
    return ' ' + this.prefix + '-';
  };

  // helpers: trim
  Sup.prototype._trim = function(string) {
    return (string + '').replace(/^\s+|\s+$/g, '');
  };

  // helpers: is array
  Sup.prototype._isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

  // helpers: classList
  Sup.prototype._classList = function(node, firstClass, action, secondClass) {
    var currentClass = this._trim(node.className || '');
    var updatedClass = '';
    var hasClass;
    var replaceAll = action == 'replace' && firstClass == null;

    if (node && node.nodeType == 1) {
      if (!replaceAll) {
        firstClass = this._trim(firstClass || '');
      }

      if (!!currentClass && (!!firstClass || replaceAll)) {
        if (!replaceAll) {
          firstClass = ' ' + firstClass + ' ';
        }

        currentClass = ' ' + currentClass + ' ';
        hasClass = !!~currentClass.indexOf(firstClass) || replaceAll;

        // addClass
        if (action == 'add') {
          if (!hasClass) {
            updatedClass = this._trim(currentClass) + ' ' + this._trim(firstClass);
          }

        // removeClass, replaceClass, toggleClass
        } else if (action == 'remove' || action == 'replace' || action == 'toggle') {
          if (action == 'replace') {
            secondClass = this._trim(secondClass || '');
            secondClass = !!secondClass ? (' ' + secondClass + ' ') : ' ';

            if (replaceAll) {
              firstClass = currentClass;
            }
          }

          if (hasClass) {
            updatedClass = currentClass.replace(firstClass, action == 'replace' ? secondClass : ' ');
          } else {
            if (action == 'toggle') {
              updatedClass = this._trim(currentClass) + ' ' + this._trim(firstClass);
            }
          }

        // hasClass
        } else {
          return hasClass;
        }
      }

      currentClass = this._trim(currentClass);
      updatedClass = this._trim(updatedClass);

      if (!!updatedClass && updatedClass !== currentClass) {
        node.className = updatedClass;
        return updatedClass;
      }
    }

    return currentClass;
  };

  // helpers: addClass
  Sup.prototype._addClass = function(node, className) {
    return this._classList(node, className, 'add');
  };

  // helpers: removeClass
  Sup.prototype._removeClass = function(node, className) {
    return this._classList(node, className, 'remove');
  };

  // helpers: replaceClass
  Sup.prototype._replaceClass = function(node, oldClass, newClass) {
    return this._classList(node, oldClass, 'replace', newClass);
  };

  // helpers: toggleClass
  Sup.prototype._toggleClass = function(node, className) {
    return this._classList(node, className, 'toggle');
  };

  // helpers: hasClass
  Sup.prototype._hasClass = function(node, className) {
    return this._classList(node, className, 'has');
  };

  // helpers: closest node
  Sup.prototype._closest = function(node, className) {
    var parent;

    while (node && node.nodeType !== 9) {
      node = node.parentNode;

      if (node && this._hasClass(node, className)) {
        parent = node;
        break;
      }
    }

    return parent;
  };

  // helpers: empty function
  Sup.prototype._nope = function() {};

  window.sup = new Sup();

  // if (window.console && window.console.log) {
  //   console.log('Front-end: Supercoders, http://supercoders.ru');
  // }
})(window, document);
