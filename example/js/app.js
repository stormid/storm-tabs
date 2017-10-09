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
    DOWN: 40
};

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.panels = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        !!this.tabs.length && this.tabs[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if (hash !== false) this.panels.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAttributes().initTabs().open(this.current);

        return this;
    },
    initAttributes: function initAttributes() {
        var _this2 = this;

        this.tabs.forEach(function (tab, i) {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', false);
            _this2.panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
            tab.setAttribute('tabindex', '-1');
            _this2.panels[i].setAttribute('role', 'tabpanel');
            _this2.panels[i].setAttribute('hidden', 'hidden');
            _this2.panels[i].setAttribute('tabindex', '-1');
            if (!_this2.panels[i].firstElementChild || _this2.panels[i].firstElementChild.hasAttribute('tabindex')) return;
            _this2.panels[i].firstElementChild.setAttribute('tabindex', '-1');
        });
        return this;
    },
    initTabs: function initTabs() {
        var _this3 = this;

        var change = function change(id) {
            _this3.toggle(id);
            window.setTimeout(function () {
                _this3.tabs[_this3.current].focus();
            }, 16);
        },
            nextId = function nextId() {
            return _this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1;
        },
            previousId = function previousId() {
            return _this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1;
        };

        this.lastFocusedTab = 0;

        this.tabs.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.LEFT:
                        change.call(_this3, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        e.stopPropagation();
                        _this3.panels[i].focus();
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
    change: function change(type, i) {
        this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.panels[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
        (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
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

        window.history && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBQWMsR0FBNUIsQUFBK0IsU0FGcEIsQUFBaUQsQUFFNUQsQUFBd0M7QUFGb0IsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2Us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O2FBQUEsQUFBSyxPQUFMLEFBQVksU0FBWixBQUFxQixBQUNyQjtlQUFBLEFBQU8sQUFDVjtBQTFGVSxBQTJGWDtBQTNGVyw0QkFBQSxBQTJGSixHQUFHLEFBQ047WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixHQUFHLEFBRXZCOztlQUFBLEFBQU8sV0FBVyxPQUFBLEFBQU8sUUFBUCxBQUFlLFVBQVUsRUFBRSxLQUFLLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQTdDLEFBQXlCLEFBQU8sQUFBMEIsV0FBMUQsQUFBcUUsSUFBSSxLQUFBLEFBQUssS0FBTCxBQUFVLEdBQVYsQUFBYSxhQUF4RyxBQUFrQixBQUF5RSxBQUEwQixBQUVySDs7WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixNQUFNLEtBQUEsQUFBSyxLQUEvQixBQUEwQixBQUFVLFFBQy9CLEtBQUEsQUFBSyxNQUFNLEtBQVgsQUFBZ0IsU0FBaEIsQUFBeUIsS0FBekIsQUFBOEIsQUFFbkM7O2VBQUEsQUFBTyxBQUNWO0EsQUFwR1U7QUFBQSxBQUNYOzs7Ozs7Ozs7Z0JDVlcsQUFDQyxBQUNaO2tCQUZXLEFBRUcsQUFDZDtZLEFBSFcsQUFHSDtBQUhHLEFBQ1giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRhYnMgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0VGFicy5pbml0KCcuanMtdGFicycpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTtcbiIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignVGFicyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0RE9NRWxlbWVudDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIGVsLmRhdGFzZXQsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBTUEFDRTogMzIsXG4gICAgRU5URVI6IDEzLFxuICAgIFRBQjogOSxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy50YWJzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcbiAgICAgICAgdGhpcy5wYW5lbHMgPSB0aGlzLnRhYnMubWFwKGVsID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSkgfHwgY29uc29sZS5lcnJvcignVGFiIHRhcmdldCBub3QgZm91bmQnKSk7XG4gICAgICAgICEhdGhpcy50YWJzLmxlbmd0aCAmJiB0aGlzLnRhYnNbMF0ucGFyZW50Tm9kZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFibGlzdCcpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy5wYW5lbHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKClcbiAgICAgICAgICAgIC5pbml0VGFicygpXG4gICAgICAgICAgICAub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWIsIGkpID0+IHtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0YWIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgaWYoIXRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkIHx8IHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLmhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IDA7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7ICBcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjaGFuZ2UodHlwZSwgaSkge1xuICAgICAgICB0aGlzLnRhYnNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnBhbmVsc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJykgOiB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YWJzW2ldIDogdGhpcy50YWJzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy5wYW5lbHNbaV0gOiB0aGlzLnBhbmVsc1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICB9LFxuICAgIG9wZW4oaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnb3BlbicsIGkpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb3NlKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ2Nsb3NlJywgaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9nZ2xlKGkpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBpKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYnNfX2xpbmsnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
