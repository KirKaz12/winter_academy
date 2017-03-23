/* Sup.js: features v0.0.1, http://git.io/vrgHy
 * --------------------------------------------
 *
 * (c) Supercoders
 * http://supercoders.ru
 * MIT Licensed
 */

(function(window, document) {
  var Features = function() {
    var component = this;

    component.prefixes = {};
    component.prefixes.string = ' ms Moz O Webkit';
    component.prefixes.css = ' -ms- -moz- -o- -webkit-'.split(' ');
    component.prefixes.dom = component.prefixes.string.toLowerCase().split(' ');
    component.prefixes.style = component.prefixes.string.split(' ');
    component.classNames = [];
    component.ua = window.navigator.userAgent;
  };

  Features.prototype.testStyle = function(name, property, value, tagName, opposite) {
    var result;
    var props = [];
    var tag = tagName == 'document' ? document.documentElement : document.createElement(tagName || 'div');

    if (!!(name || property)) {
      for (var prefix in this.prefixes.css) {
        props.push({
          name: property || name,
          value: value || 'string',
          prefix: prefix | 0,
          oppposite: !!opposite
        });
      }

      for (var prop in props) {
        if (!result) {
          var propName = props[prop].name;
          var propValue = props[prop].value;

          if (propValue == 'string' && !opposite) {
            if (~propName.indexOf('-')) {
              propName = propName.split('-');

              for (var i = 0; i < propName.length; i++) {
                if (i || (props[prop].prefix | 0)) {
                  propName[i] = propName[i].charAt(0).toUpperCase() + propName[i].slice(1);
                }
              }

              propName = propName.join('');
            }

            props[prop].name = this.prefixes.style[props[prop].prefix] + propName;
            result = typeof tag.style[props[prop].name] === 'string';
          } else {
            if (opposite) {
              propValue = this.prefixes.css[props[prop].prefix] + propValue;
            } else {
              propName = this.prefixes.css[props[prop].prefix] + propName;
            }

            tag.style.cssText = propName + ':' + propValue + ';';
            result = !!tag.style.length;
          }

          if (result && props[prop].prefix) {
            this[name + 'Prefix'] = this.prefixes.dom[props[prop].prefix];
          }
        }
      }
    }

    return !!result;
  }

  Features.prototype.testDom = function(name, property, element) {
    var prefixes = this.prefixes.dom;
    var result;
    var prop;

    for (var prefix in prefixes) {
      if (!!prefixes[prefix]) {
        prop = prefixes[prefix] + (property || name).charAt(0).toUpperCase() + (property || name).slice(1);
      } else {
        prop = (property || name);
      }

      if ((element || document)[prop] && !result) {
        this[name + 'Prefix'] = prefixes[prefix];
        result = true;
      }
    }

    return !!result;
  };

  Features.prototype.addTest = function(name, result, applyClass, applyFeature) {
    if (typeof result == 'function') {
      result = result();
    }

    name = name + '';
    result = !!result;

    if (!!name) {
      if (applyFeature !== false) {
        this[name] = result;
      }

      if (applyClass !== false) {
        var className = (!result ? 'no-' : '') + name.toLowerCase();

        if (this.classNames) {
          this.classNames.push(className)
        } else {
          sup._pageClass(className);
        }
      }
    }

    return result;
  }

  Features.prototype.testStyles = function(rule, callback) {
    var mod = 'supjs';
    var style;
    var ret;
    var node;
    var docOverflow;
    var docElement = document.documentElement;
    var div = document.createElement('div');
    var body = document.body;

    if (!body) {
      body = document.createElement('body');
      body.fake = true;
    }

    style = document.createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }

    div.id = mod;

    if (body.fake) {
      body.style.background = '';
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);

    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;
  }

  var features = new Features();

  // geolocation (detects support for the Geolocation API for users to provide their location to web applications)
  // features.addTest('geolocation', 'geolocation' in navigator);

  // history (detects support for the History API for manipulating the browser session history)
  // features.addTest('history', function() {
  //   if ((~features.ua.indexOf('Android 2.') ||
  //       (~features.ua.indexOf('Android 4.0'))) &&
  //       ~features.ua.indexOf('Mobile Safari') &&
  //       !~features.ua.indexOf('Chrome') &&
  //       !~features.ua.indexOf('Windows Phone')) {
  //     return false;
  //   }
  //
  //   return (window.history && 'pushState' in window.history);
  // });

  // svg (detects support for SVG in `<embed>` or `<object>` elements)
  features.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

  // svg filters (http://www.w3.org/TR/SVG11/filters.html)
  // features.addTest('svgfilters', function() {
  //   try {
  //     return 'SVGFEColorMatrixElement' in window && SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
  //   } catch(exception) {
  //     return false;
  //   }
  // });

  // fileReader (tests for the File API specification support)
  // features.addTest('filereader', !!(window.File && window.FileList && window.FileReader));

  // localStorage (http://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)
  features.addTest('localstorage', function() {
    var label = 'sup';

    try {
      localStorage.setItem(label, label);
      localStorage.removeItem(label);
      return true;
    } catch(exception) {
      return false;
    }
  });

  // webp (tests for webp support)
  // features.addTest('webp', function() {
  //   var name = 'webp';
  //   var uri = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  //   var image = new Image();
  //
  //   function test(event) {
  //     var result = event && event.type === 'load' ? image.width == 1 : false;
  //     features.addTest(name, !!result);
  //   }
  //
  //   image.onerror = test;
  //   image.onload = test;
  //   image.src = uri;
  // }, false, false);

  // canvas (detects support for the `<canvas>` element for 2D drawing)
  // features.addTest('canvas', function() {
  //   var element = document.createElement('canvas');
  //   return !!(element.getContext && element.getContext('2d'));
  // });

  // audio (detects the audio element)
  // features.addTest('audio', function() {
  //   var element = document.createElement('audio');
  //   var bool = false;
  //
  //   try {
  //     if (bool = !!element.canPlayType) {
  //       bool = new Boolean(bool);
  //       bool.ogg = element.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
  //       bool.mp3 = element.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/, '');
  //       bool.opus = element.canPlayType('audio/ogg; codecs="opus"') || element.canPlayType('audio/webm; codecs="opus"').replace(/^no$/, '');
  //       bool.wav = element.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
  //       bool.m4a  = (element.canPlayType('audio/x-m4a;') || element.canPlayType('audio/aac;')).replace(/^no$/, '');
  //       features.audioType = bool;
  //     }
  //   } catch(exception) {}
  //
  //   return bool;
  // });

  // video (detects support for the video element)
  // features.addTest('video', function() {
  //   var element = document.createElement('video');
  //   var bool = false;
  //
  //   try {
  //     if (bool = !!element.canPlayType) {
  //       bool = new Boolean(bool);
  //       bool.ogg = element.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
  //       bool.h264 = element.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
  //       bool.webm = element.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
  //       bool.vp9 = element.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');
  //       bool.hls = element.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
  //       features.videoType = bool;
  //     }
  //   } catch(exception) {}
  //
  //   return bool;
  // });

  // fullscreen (detects support for the ability to make the current website take over the user's entire screen)
  // features.addTest('fullscreen', function() {
  //   return features.testDom('fullscreen', 'exitFullscreen') || features.testDom('fullscreen', 'cancelFullScreen');
  // });

  // requestAnimationFrame (detects support for the window.requestAnimationFrame API)
  // features.addTest('raf', function() {
  //   return features.testDom('raf', 'requestAnimationFrame', window);
  // });

  // webGL
  // features.addTest('webgl', function() {
  //   var canvas = document.createElement('canvas');
  //   var supports = 'probablySupportsContext' in canvas ? 'probablySupportsContext' : 'supportsContext';
  //
  //   if (supports in canvas) {
  //     return canvas[supports]('webgl') || canvas[supports]('experimental-webgl');
  //   }
  //
  //   return 'WebGLRenderingContext' in window;
  // });

  // calc (method of allowing calculated values for length units in CSS)
  features.addTest('csscalc', function() {
    return features.testStyle('csscalc', 'width', 'calc(10px)', false, true)
  });

  // gradients (detects gradients support)
  features.addTest('cssgradients', function() {
    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var css = '';
    var angle;

    for (var i = 0, len = features.prefixes.css.length - 1; i < len; i++) {
      angle = (i === 0 ? 'to ' : '');
      css += str1 + features.prefixes.css[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
    }

    var element = document.createElement('a');
    var style = element.style;

    css += str1 + '-webkit-' + str2;
    style.cssText = css;

    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });

  // table (detect display: table support)
  features.addTest('displaytable', function() {
    return features.testStyle('displaytable', 'display', 'table');
  });

  // blend-mode (detects mix-blend-mode support)
  features.addTest('blendmode', function() {
    return !!('CSS' in window && 'supports' in window.CSS && window.CSS.supports('mix-blend-mode', 'multiply'));
  });

  // background-blend-mode (detects the ability for the browser to composite backgrounds using blending modes)
  // features.addTest('backgroundblendmode', function() {
  //   return features.testStyle('backgroundblendmode', 'background-blend-mode');
  // });

  // filters (detects CSS filters support)
  // features.addTest('cssfilters', function() {
  //   return features.testStyle('cssfilters', 'filter', 'blur(2px)', 'a') && ((document.documentMode === undefined || document.documentMode > 9));
  // });

  // animations (detects whether or not elements can be animated using CSS)
  features.addTest('cssanimations', function() {
    return features.testStyle('cssanimations', 'animation-name');
  });

  // background-size (detects background-size support)
  features.addTest('backgroundsize', function() {
    return features.testStyle('backgroundsize', 'background-size');
  });

  // border-radius (detects border-radius support)
  // features.addTest('borderradius', function() {
  //   return features.testStyle('borderradius', 'border-radius');
  // });

  // box-shadow (detects box-shadow support)
  // features.addTest('boxshadow', function() {
  //   return features.testStyle('boxshadow', 'box-shadow');
  // });

  // flexbox (detects support for the flexible box layout model)
  // features.addTest('flexbox', function() {
  //   return features.testStyle('flexbox', 'flex-basis', '1px');
  // });

  // flexbox legacy (detects support for legacy syntax)
  // features.addTest('flexboxlegacy', function() {
  //   return features.testStyle('flexboxlegacy', 'box-direction', 'reverse');
  // });

  // flex line wrapping (detects support for the part of flexbox, which isn’t present in all flexbox implementations)
  // features.addTest('flexwrap', function() {
  //   return features.testStyle('flexwrap', 'flex-wrap', 'wrap');
  // });

  // flexbox tweener (detects support for the old syntax)
  // features.addTest('flexboxtweener', function() {
  //   return features.testStyle('flexboxtweener', 'flex-align', 'end');
  // });

  // transforms (detects css transforms support)
  features.addTest('csstransforms', function() {
    return !~features.ua.indexOf('Android 2.') && features.testStyle('csstransforms', 'transform', 'scale(1)');
  });

  // 3d transforms (detects 3d support in css transforms)
  features.addTest('csstransforms3d', function() {
    return features.testStyle('csstransforms3d', 'perspective', '1px');
  });

  // transform-style: preserve-3d (detects support for getting a proper 3D perspective on elements)
  // features.addTest('preserve3d', function() {
  //   var outerAnchor = document.createElement('a');
  //   var innerAnchor = document.createElement('a');
  //   var style = 'display: block;transform-origin: right; transform: rotateY(40deg);';
  //   var result;
  //   var parent = document.documentElement;
  //
  //   outerAnchor.style.cssText = style + 'transform-style: preserve-3d;';
  //   innerAnchor.style.cssText = style + 'width: 9px; height: 1px; background: #000;';
  //
  //   outerAnchor.appendChild(innerAnchor);
  //   parent.appendChild(outerAnchor);
  //
  //   result = innerAnchor.getBoundingClientRect();
  //   parent.removeChild(outerAnchor);
  //
  //   return result.width && result.width < 4;
  // });

  // transitions (detects css transitions support)
  features.addTest('csstransitions', function() {
    return features.testStyle('csstransitions', 'transition', 'all');
  });

  // vw units (detects support for vw units in css)
  // features.testStyles('#supjs { width: 50vw; }', function(element) {
  //   var width = parseInt(window.innerWidth / 2, 10);
  //   var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle).width, 10);
  //
  //   features.addTest('cssvwunit', compStyle == width);
  // });

  // vh units (detects support for vh units in css)
  // features.testStyles('#supjs { height: 50vh; }', function(element) {
  //   var height = parseInt(window.innerHeight / 2, 10);
  //   var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle).height, 10);
  //
  //   features.addTest('cssvhunit', compStyle == height);
  // });

  window.__sup_features = features;
})(window, document);
