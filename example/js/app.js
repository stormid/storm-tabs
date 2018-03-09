(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

        this.settings.updateURL && window.history && window.history.replaceState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));
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
    updateURL: true,
    active: 0
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBQWMsR0FBNUIsQUFBK0IsU0FGcEIsQUFBaUQsQUFFNUQsQUFBd0M7QUFGb0IsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2Us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cUIsQUFDckI7ZUFBQSxBQUFPLEFBQ1Y7QUF4RlUsQUF5Rlg7QUF6RlcsNEJBQUEsQUF5RkosR0FBRyxBQUNOO1lBQUcsS0FBQSxBQUFLLFlBQVIsQUFBb0IsR0FBRyxBQUV0Qjs7YUFBQSxBQUFLLFNBQUwsQUFBYyxhQUFhLE9BQTVCLEFBQW1DLFdBQVksT0FBQSxBQUFPLFFBQVAsQUFBZSxhQUFhLEVBQUUsS0FBSyxLQUFBLEFBQUssS0FBTCxBQUFVLEdBQVYsQUFBYSxhQUFoRCxBQUE0QixBQUFPLEFBQTBCLFdBQTdELEFBQXdFLElBQUksS0FBQSxBQUFLLEtBQUwsQUFBVSxHQUFWLEFBQWEsYUFBeEksQUFBK0MsQUFBNEUsQUFBMEIsQUFDcko7WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixNQUFNLEtBQUEsQUFBSyxLQUEvQixBQUEwQixBQUFVLFFBQy9CLEtBQUEsQUFBSyxNQUFNLEtBQVgsQUFBZ0IsU0FBaEIsQUFBeUIsS0FBekIsQUFBOEIsQUFFbkM7O2VBQUEsQUFBTyxBQUNWO0EsQUFqR1U7QUFBQSxBQUNYOzs7Ozs7Ozs7Z0JDVlcsQUFDQyxBQUNaO2tCQUZXLEFBRUcsQUFDZDtlQUhXLEFBR0EsQUFDWDtZLEFBSlcsQUFJSDtBQUpHLEFBQ1giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBUYWJzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYnMuaW5pdCgnLmpzLXRhYnMnKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7XG4iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMucGFuZWxzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICAhIXRoaXMudGFicy5sZW5ndGggJiYgdGhpcy50YWJzWzBdLnBhcmVudE5vZGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMucGFuZWxzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpXG4gICAgICAgICAgICAuaW5pdFRhYnMoKVxuICAgICAgICAgICAgLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgdGFiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5SSUdIVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgbmV4dElkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5FTlRFUjpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlNQQUNFOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpOyAgXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy50YWJzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgKHRoaXMuc2V0dGluZ3MudXBkYXRlVVJMICYmIHdpbmRvdy5oaXN0b3J5KSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGl0bGVDbGFzczogJy5qcy10YWJzX19saW5rJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIHVwZGF0ZVVSTDogdHJ1ZSxcbiAgICBhY3RpdmU6IDBcbn07Il19
