(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
  _component2.default.init('.js-tabs');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
  onDOMContentLoadedTasks.forEach(function (fn) {
    return fn();
  });
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(_componentPrototype2.default), {
			DOMElement: el,
			settings: Object.assign({}, _defaults2.default, el.dataset, opts)
		}).init();
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.targets = this.links.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        !!this.links.length && this.links[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if (hash !== false) this.targets.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAria().initTitles().open(this.current);

        return this;
    },
    initAria: function initAria() {
        var _this2 = this;

        this.links.forEach(function (el, i) {
            el.setAttribute('role', 'tab');
            el.setAttribute('aria-expanded', false);
            el.setAttribute('aria-selected', false);
            el.setAttribute('aria-controls', _this2.targets[i].getAttribute('id'));
            _this2.targets[i].setAttribute('role', 'tabpanel');
            _this2.targets[i].setAttribute('aria-hidden', true);
            _this2.targets[i].setAttribute('tabIndex', '-1');
        });
        return this;
    },
    initTitles: function initTitles() {
        var _this3 = this;

        var change = function change(id) {
            _this3.toggle(id);
            window.setTimeout(function () {
                _this3.links[_this3.current].focus();
            }, 16);
        },
            nextId = function nextId() {
            return _this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1;
        },
            previousId = function previousId() {
            return _this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1;
        };

        this.lastFocusedTab = 0;

        this.links.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.UP:
                        e.preventDefault();
                        change.call(_this3, previousId());
                        break;
                    case KEY_CODES.LEFT:
                        change.call(_this3, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        change.call(_this3, nextId());
                        break;
                    case KEY_CODES.RIGHT:
                        change.call(_this3, nextId());
                        break;
                    case KEY_CODES.ENTER:
                        change.call(_this3, i);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        change.call(_this3, i);
                        break;
                    case KEY_CODES.TAB:
                        if (!_this3.getFocusableChildren(_this3.targets[i]).length || _this3.current !== i || e.shiftKey) return;

                        e.preventDefault();
                        e.stopPropagation();
                        _this3.lastFocusedTab = _this3.getLinkIndex(e.target);
                        _this3.setTargetFocus(_this3.lastFocusedTab);
                        break;
                    default:
                        break;
                }
            });
            el.addEventListener('click', function (e) {
                e.preventDefault();
                change.call(_this3, i);
            }, false);
        });

        return this;
    },
    getLinkIndex: function getLinkIndex(link) {
        for (var i = 0; i < this.links.length; i++) {
            if (link === this.links[i]) return i;
        }return null;
    },
    getFocusableChildren: function getFocusableChildren(node) {
        var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus: function setTargetFocus(tabIndex) {
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);
        if (!this.focusableChildren.length) return false;

        window.setTimeout(function () {
            this.focusableChildren[0].focus();
            this.keyEventListener = this.keyListener.bind(this);

            document.addEventListener('keydown', this.keyEventListener);
        }.bind(this), 1);
    },
    keyListener: function keyListener(e) {
        if (e.keyCode !== KEY_CODES.TAB) return;
        var focusedIndex = this.focusableChildren.indexOf(document.activeElement);

        if (focusedIndex < 0) {
            document.removeEventListener('keydown', this.keyEventListener);
            return;
        }

        if (e.shiftKey && focusedIndex === 0) {
            if (this.lastFocusedTab !== 0) {
                e.preventDefault();
                this.links[this.lastFocusedTab].focus();
            }
        } else {
            if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
                document.removeEventListener('keydown', this.keyEventListener);
                if (this.lastFocusedTab !== this.links.length - 1) {
                    e.preventDefault();
                    this.lastFocusedTab = this.lastFocusedTab + 1;
                    this.links[this.lastFocusedTab].focus();
                }
            }
        }
    },
    change: function change(type, i) {
        this.links[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.targets[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
        this.links[i].setAttribute('aria-selected', this.links[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        this.links[i].setAttribute('aria-expanded', this.links[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.targets[i] : this.targets[this.current]).setAttribute('tabIndex', type === 'open' ? '0' : '-1');
    },
    open: function open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close: function close(i) {
        this.change('close', i);
        return this;
    },
    toggle: function toggle(i) {
        if (this.current === i) return;

        window.history && window.history.pushState({ URL: this.links[i].getAttribute('href') }, '', this.links[i].getAttribute('href'));

        if (this.current === null) this.open(i);else this.close(this.current).open(i);

        return this;
    }
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    titleClass: '.js-tabs__link',
    currentClass: 'active',
    active: 0
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBQWMsR0FBNUIsQUFBK0IsU0FGcEIsQUFBaUQsQUFFNUQsQUFBd0M7QUFGb0IsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2Us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TjtZQUFHLEtBQUEsQUFBSyxZQUFSLEFBQW9CLEdBQUcsQUFFdkI7O2VBQUEsQUFBTyxXQUFXLE9BQUEsQUFBTyxRQUFQLEFBQWUsVUFBVSxFQUFFLEtBQUssS0FBQSxBQUFLLE1BQUwsQUFBVyxHQUFYLEFBQWMsYUFBOUMsQUFBeUIsQUFBTyxBQUEyQixXQUEzRCxBQUFzRSxJQUFJLEtBQUEsQUFBSyxNQUFMLEFBQVcsR0FBWCxBQUFjLGFBQTFHLEFBQWtCLEFBQTBFLEFBQTJCLEFBRXZIOztZQUFHLEtBQUEsQUFBSyxZQUFSLEFBQW9CLE1BQU0sS0FBQSxBQUFLLEtBQS9CLEFBQTBCLEFBQVUsUUFDL0IsS0FBQSxBQUFLLE1BQU0sS0FBWCxBQUFnQixTQUFoQixBQUF5QixLQUF6QixBQUE4QixBQUVuQzs7ZUFBQSxBQUFPLEFBQ1Y7QSxBQTFKVTtBQUFBLEFBQ1g7Ozs7Ozs7OztnQkNYVyxBQUNDLEFBQ1o7a0JBRlcsQUFFRyxBQUNkO1ksQUFIVyxBQUdIO0FBSEcsQUFDWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVGFicyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJzLmluaXQoJy5qcy10YWJzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pO1xuIiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdFxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdUYWJzIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcblxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgZWwuZGF0YXNldCwgb3B0cylcblx0XHR9KS5pbml0KCkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgIFNQQUNFOiAzMixcbiAgICBFTlRFUjogMTMsXG4gICAgVEFCOiA5LFxuICAgIExFRlQ6IDM3LFxuICAgIFJJR0hUOiAzOSxcbiAgICBVUDozOCxcbiAgICBET1dOOiA0MFxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLmxpbmtzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGhpcy5saW5rcy5tYXAoZWwgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpKSB8fCBjb25zb2xlLmVycm9yKCdUYWIgdGFyZ2V0IG5vdCBmb3VuZCcpKTtcbiAgICAgICAgISF0aGlzLmxpbmtzLmxlbmd0aCAmJiB0aGlzLmxpbmtzWzBdLnBhcmVudE5vZGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMudGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQsIGkpID0+IHsgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGhhc2gpIHRoaXMuY3VycmVudCA9IGk7IH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdEFyaWEoKVxuICAgICAgICAgICAgLmluaXRUaXRsZXMoKVxuICAgICAgICAgICAgLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBcmlhKCkge1xuICAgICAgICB0aGlzLmxpbmtzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aGlzLnRhcmdldHNbaV0uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGl0bGVzKCkge1xuICAgICAgICBsZXQgY2hhbmdlID0gaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKGlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubGlua3NbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy5saW5rcy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKTtcblxuICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gMDtcblxuICAgICAgICB0aGlzLmxpbmtzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5VUDpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIG5leHRJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIG5leHRJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRU5URVI6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5TUEFDRTpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuVEFCOlxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbaV0pLmxlbmd0aCB8fCB0aGlzLmN1cnJlbnQgIT09IGkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gdGhpcy5nZXRMaW5rSW5kZXgoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpOyAgXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZ2V0TGlua0luZGV4KGxpbmspe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5rcy5sZW5ndGg7IGkrKykgaWYobGluayA9PT0gdGhpcy5saW5rc1tpXSkgcmV0dXJuIGk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJJbmRleF06bm90KFt0YWJJbmRleD1cIi0xXCJdKSddO1xuICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG4gICAgfSxcbiAgICBzZXRUYXJnZXRGb2N1cyh0YWJJbmRleCl7XG4gICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4gPSB0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKHRoaXMudGFyZ2V0c1t0YWJJbmRleF0pO1xuICAgICAgICBpZighdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB9LmJpbmQodGhpcyksIDEpO1xuICAgIH0sXG4gICAga2V5TGlzdGVuZXIoZSl7XG4gICAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcbiAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGZvY3VzZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaWYodGhpcy5sYXN0Rm9jdXNlZFRhYiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtzW3RoaXMubGFzdEZvY3VzZWRUYWJdLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdEZvY3VzZWRUYWIgIT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmxhc3RGb2N1c2VkVGFiICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rc1t0aGlzLmxhc3RGb2N1c2VkVGFiXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICB0aGlzLmxpbmtzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMubGlua3NbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgICh0eXBlID09PSAnb3BlbicgPyB0aGlzLnRhcmdldHNbaV0gOiB0aGlzLnRhcmdldHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYnNfX2xpbmsnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
