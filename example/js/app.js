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
                        if (!_this3.getFocusableChildren(_this3.targets[i]).length || _this3.current !== i) return;

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
            e.preventDefault();
            this.focusableChildren[this.focusableChildren.length - 1].focus();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBQWMsR0FBNUIsQUFBK0IsU0FGcEIsQUFBaUQsQUFFNUQsQUFBd0M7QUFGb0IsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2Us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OztlQUFBLEFBQU8sV0FBVyxPQUFBLEFBQU8sUUFBUCxBQUFlLFVBQVUsRUFBRSxLQUFLLEtBQUEsQUFBSyxNQUFMLEFBQVcsR0FBWCxBQUFjLGFBQTlDLEFBQXlCLEFBQU8sQUFBMkIsV0FBM0QsQUFBc0UsSUFBSSxLQUFBLEFBQUssTUFBTCxBQUFXLEdBQVgsQUFBYyxhQUExRyxBQUFrQixBQUEwRSxBQUEyQixBQUV2SDs7WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixNQUFNLEtBQUEsQUFBSyxLQUEvQixBQUEwQixBQUFVLFFBQy9CLEtBQUEsQUFBSyxNQUFNLEtBQVgsQUFBZ0IsU0FBaEIsQUFBeUIsS0FBekIsQUFBOEIsQUFFbkM7O2VBQUEsQUFBTyxBQUNWO0EsQUF4SlU7QUFBQSxBQUNYOzs7Ozs7Ozs7Z0JDWFcsQUFDQyxBQUNaO2tCQUZXLEFBRUcsQUFDZDtZLEFBSFcsQUFHSDtBQUhHLEFBQ1giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRhYnMgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0VGFicy5pbml0KCcuanMtdGFicycpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTtcbiIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignVGFicyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0RE9NRWxlbWVudDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIGVsLmRhdGFzZXQsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBTUEFDRTogMzIsXG4gICAgRU5URVI6IDEzLFxuICAgIFRBQjogOSxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgVVA6MzgsXG4gICAgRE9XTjogNDBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy5saW5rcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IHRoaXMubGlua3MubWFwKGVsID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSkgfHwgY29uc29sZS5lcnJvcignVGFiIHRhcmdldCBub3QgZm91bmQnKSk7XG4gICAgICAgICEhdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1swXS5wYXJlbnROb2RlLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0Jyk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuc2V0dGluZ3MuYWN0aXZlO1xuXG4gICAgICAgIGlmKGhhc2ggIT09IGZhbHNlKSB0aGlzLnRhcmdldHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBcmlhKClcbiAgICAgICAgICAgIC5pbml0VGl0bGVzKClcbiAgICAgICAgICAgIC5vcGVuKHRoaXMuY3VycmVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0QXJpYSgpIHtcbiAgICAgICAgdGhpcy5saW5rcy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxpbmtzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSxcbiAgICAgICAgICAgIHByZXZpb3VzSWQgPSAoKSA9PiAodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy5saW5rcy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IDA7XG5cbiAgICAgICAgdGhpcy5saW5rcy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuVVA6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlRBQjpcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy50YXJnZXRzW2ldKS5sZW5ndGggfHwgdGhpcy5jdXJyZW50ICE9PSBpKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gdGhpcy5nZXRMaW5rSW5kZXgoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpOyAgXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZ2V0TGlua0luZGV4KGxpbmspe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5rcy5sZW5ndGg7IGkrKykgaWYobGluayA9PT0gdGhpcy5saW5rc1tpXSkgcmV0dXJuIGk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJJbmRleF06bm90KFt0YWJJbmRleD1cIi0xXCJdKSddO1xuICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG4gICAgfSxcbiAgICBzZXRUYXJnZXRGb2N1cyh0YWJJbmRleCl7XG4gICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4gPSB0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKHRoaXMudGFyZ2V0c1t0YWJJbmRleF0pO1xuICAgICAgICBpZighdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICB9LmJpbmQodGhpcyksIDEpO1xuICAgIH0sXG4gICAga2V5TGlzdGVuZXIoZSl7XG4gICAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcbiAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGZvY3VzZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdEZvY3VzZWRUYWIgIT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmxhc3RGb2N1c2VkVGFiICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rc1t0aGlzLmxhc3RGb2N1c2VkVGFiXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICB0aGlzLmxpbmtzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMubGlua3NbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgICh0eXBlID09PSAnb3BlbicgPyB0aGlzLnRhcmdldHNbaV0gOiB0aGlzLnRhcmdldHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYnNfX2xpbmsnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
