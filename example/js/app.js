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
                        if (!_this3.getFocusableChildren(_this3.targets[i]).length) return;

                        e.preventDefault();
                        e.stopPropagation();
                        _this3.lastFocusedTab = _this3.getLinkIndex(e.target);
                        _this3.setTargetFocus(_this3.lastFocusedTab);
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
        }.bind(this), 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBQWMsR0FBNUIsQUFBK0IsU0FGcEIsQUFBaUQsQUFFNUQsQUFBd0M7QUFGb0IsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2Us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Qjs7ZUFBQSxBQUFPLFdBQVcsT0FBQSxBQUFPLFFBQVAsQUFBZSxVQUFVLEVBQUUsS0FBSyxLQUFBLEFBQUssTUFBTCxBQUFXLEdBQVgsQUFBYyxhQUE5QyxBQUF5QixBQUFPLEFBQTJCLFdBQTNELEFBQXNFLElBQUksS0FBQSxBQUFLLE1BQUwsQUFBVyxHQUFYLEFBQWMsYUFBMUcsQUFBa0IsQUFBMEUsQUFBMkIsQUFFdkg7O1lBQUcsS0FBQSxBQUFLLFlBQVIsQUFBb0IsTUFBTSxLQUFBLEFBQUssS0FBL0IsQUFBMEIsQUFBVSxRQUMvQixLQUFBLEFBQUssTUFBTSxLQUFYLEFBQWdCLFNBQWhCLEFBQXlCLEtBQXpCLEFBQThCLEFBRW5DOztlQUFBLEFBQU8sQUFDVjtBLEFBekpVO0FBQUEsQUFDWDs7Ozs7Ozs7O2dCQ1hXLEFBQ0MsQUFDWjtrQkFGVyxBQUVHLEFBQ2Q7WSxBQUhXLEFBR0g7QUFIRyxBQUNYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUYWJzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYnMuaW5pdCgnLmpzLXRhYnMnKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7XG4iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIFVQOjM4LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubGlua3MgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuICAgICAgICB0aGlzLnRhcmdldHMgPSB0aGlzLmxpbmtzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICAhIXRoaXMubGlua3MubGVuZ3RoICYmIHRoaXMubGlua3NbMF0ucGFyZW50Tm9kZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFibGlzdCcpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy50YXJnZXRzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXJpYSgpXG4gICAgICAgICAgICAuaW5pdFRpdGxlcygpXG4gICAgICAgICAgICAub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEFyaWEoKSB7XG4gICAgICAgIHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJwYW5lbCcpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRUaXRsZXMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXh0SWQgPSAoKSA9PiAodGhpcy5jdXJyZW50ID09PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMubGlua3MubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSAwO1xuXG4gICAgICAgIHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlVQOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIHByZXZpb3VzSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIHByZXZpb3VzSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkRPV046XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgbmV4dElkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5SSUdIVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgbmV4dElkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5FTlRFUjpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlNQQUNFOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5UQUI6XG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKHRoaXMudGFyZ2V0c1tpXSkubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gdGhpcy5nZXRMaW5rSW5kZXgoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTsgIFxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGdldExpbmtJbmRleChsaW5rKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGlua3MubGVuZ3RoOyBpKyspIGlmKGxpbmsgPT09IHRoaXMubGlua3NbaV0pIHJldHVybiBpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldEZvY3VzYWJsZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiSW5kZXhdOm5vdChbdGFiSW5kZXg9XCItMVwiXSknXTtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuICAgIH0sXG4gICAgc2V0VGFyZ2V0Rm9jdXModGFiSW5kZXgpe1xuICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbdGFiSW5kZXhdKTtcbiAgICAgICAgaWYoIXRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5rZXlFdmVudExpc3RlbmVyID0gdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9LFxuICAgIGtleUxpc3RlbmVyKGUpe1xuICAgICAgICBpZiAoZS5rZXlDb2RlICE9PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG4gICAgICAgIGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgIFxuICAgICAgICBpZihmb2N1c2VkSW5kZXggPCAwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxhc3RGb2N1c2VkVGFiICE9PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gdGhpcy5sYXN0Rm9jdXNlZFRhYiArIDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlua3NbdGhpcy5sYXN0Rm9jdXNlZFRhYl0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMubGlua3NbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnRhcmdldHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgIHRoaXMubGlua3NbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YXJnZXRzW2ldIDogdGhpcy50YXJnZXRzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgIH0sXG4gICAgb3BlbihpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdvcGVuJywgaSk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvc2UoaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnY2xvc2UnLCBpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0b2dnbGUoaSkge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IGkpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGl0bGVDbGFzczogJy5qcy10YWJzX19saW5rJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIGFjdGl2ZTogMFxufTsiXX0=
