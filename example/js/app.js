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
			settings: Object.assign({}, _defaults2.default, opts)
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

        var hash = location.hash.slice(1) || null;

        this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.targets = this.links.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });

        !!this.links.length && this.links[0].parentNode.setAttribute('role', 'tablist');

        this.current = this.settings.active;

        if (hash) {
            this.targets.forEach(function (target, i) {
                if (target.getAttribute('id') === hash) {
                    _this.current = i;
                }
            });
        }

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
        });

        this.targets.forEach(function (el) {
            el.setAttribute('role', 'tabpanel');
            el.setAttribute('aria-hidden', true);
            el.setAttribute('tabIndex', '-1');
        });
        return this;
    },
    initTitles: function initTitles() {
        var _this3 = this;

        var handler = function handler(i) {
            _this3.toggle(i);
        };

        this.lastFocusedTab = 0;

        this.links.forEach(function (el, i) {
            //navigate
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.UP:
                        e.preventDefault();
                        _this3.toggle(_this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1);
                        window.setTimeout(function () {
                            _this3.links[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.LEFT:
                        _this3.toggle(_this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1);
                        window.setTimeout(function () {
                            _this3.links[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        _this3.toggle(_this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1);
                        window.setTimeout(function () {
                            _this3.links[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.RIGHT:
                        _this3.toggle(_this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1);
                        window.setTimeout(function () {
                            _this3.links[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.ENTER:
                        handler.call(_this3, i);
                        window.setTimeout(function () {
                            _this3.links[i].focus();
                        }, 16);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        handler.call(_this3, i);
                        window.setTimeout(function () {
                            _this3.links[i].focus();
                        }, 16);
                        break;
                    case KEY_CODES.TAB:
                        e.preventDefault();
                        e.stopPropagation();
                        _this3.lastFocusedTab = _this3.getLinkIndex(e.target);
                        _this3.setTargetFocus(_this3.lastFocusedTab);
                        handler.call(_this3, i);
                        break;
                    default:
                        //
                        break;
                }
            });

            //toggle
            el.addEventListener('click', function (e) {
                e.preventDefault();
                handler.call(_this3, i);
            }, false);
        });

        return this;
    },
    getLinkIndex: function getLinkIndex(link) {
        for (var i = 0; i < this.links.length; i++) {
            if (link === this.links[i]) return i;
        }
        return null;
    },
    getFocusableChildren: function getFocusableChildren(node) {
        var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus: function setTargetFocus(tabIndex) {
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);

        if (this.focusableChildren.length) {
            window.setTimeout(function () {
                this.focusableChildren[0].focus();
                this.keyEventListener = this.keyListener.bind(this);

                document.addEventListener('keydown', this.keyEventListener);
            }.bind(this), 0);
        }
    },
    keyListener: function keyListener(e) {
        if (e.keyCode !== KEY_CODES.TAB) {
            return;
        }
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
        var methods = {
            open: {
                classlist: 'add',
                tabIndex: {
                    target: this.targets[i],
                    value: '0'
                }
            },
            close: {
                classlist: 'remove',
                tabIndex: {
                    target: this.targets[this.current],
                    value: '-1'
                }
            }
        };

        this.links[i].classList[methods[type].classlist](this.settings.currentClass);
        this.targets[i].classList[methods[type].classlist](this.settings.currentClass);
        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
        this.links[i].setAttribute('aria-selected', this.links[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        this.links[i].setAttribute('aria-expanded', this.links[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        methods[type].tabIndex.target.setAttribute('tabIndex', methods[type].tabIndex.value);
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

        window.history.pushState({ URL: this.links[i].getAttribute('href') }, '', this.links[i].getAttribute('href'));

        if (this.current === null) {
            this.open(i);
            return this;
        }
        this.close(this.current).open(i);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzBCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7V0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ05qQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxNQUFNLElBQUEsQUFBSSxNQUFWLEFBQU0sQUFBVSxBQUVoQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQUQ7Z0JBQVEsQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUQsQUFDWjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBRkgsQUFBaUQsQUFFNUQsQUFBNEI7QUFGZ0MsQUFDdEUsR0FEcUIsRUFBUixBQUFRLEFBR25CO0FBSEosQUFBTyxBQUlQLEVBSk87QUFMUjs7a0JBV2UsRUFBRSxNLEFBQUY7Ozs7Ozs7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REwsQUFDVSxBQUVWOztlQUFBLEFBQU8sQUFDVjtBLEFBdE1VO0FBQUEsQUFDWDs7Ozs7Ozs7O2dCQ1hXLEFBQ0MsQUFDWjtrQkFGVyxBQUVHLEFBQ2Q7WSxBQUhXLEFBR0g7QUFIRyxBQUNYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUYWJzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYnMuaW5pdCgnLmpzLXRhYnMnKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7XG4iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIFVQOjM4LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IG51bGw7XG5cbiAgICAgICAgdGhpcy5saW5rcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IHRoaXMubGlua3MubWFwKGVsID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICEhdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1swXS5wYXJlbnROb2RlLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0Jyk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYgKGhhc2gpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0QXJpYSgpXG4gICAgICAgICAgICAuaW5pdFRpdGxlcygpXG4gICAgICAgICAgICAub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEFyaWEoKSB7XG4gICAgICAgIHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRhcmdldHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKGkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSAwO1xuXG4gICAgICAgIHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIC8vbmF2aWdhdGVcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlVQOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMubGlua3MubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxpbmtzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRU5URVI6XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxpbmtzW2ldLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubGlua3NbaV0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5UQUI6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMuZ2V0TGlua0luZGV4KGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUYXJnZXRGb2N1cyh0aGlzLmxhc3RGb2N1c2VkVGFiKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vdG9nZ2xlXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7ICBcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBnZXRMaW5rSW5kZXgobGluayl7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmtzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmsgPT09IHRoaXMubGlua3NbaV0pIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJJbmRleF06bm90KFt0YWJJbmRleD1cIi0xXCJdKSddO1xuICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG4gICAgfSxcbiAgICBzZXRUYXJnZXRGb2N1cyh0YWJJbmRleCl7XG4gICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4gPSB0aGlzLmdldEZvY3VzYWJsZUNoaWxkcmVuKHRoaXMudGFyZ2V0c1t0YWJJbmRleF0pO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlFdmVudExpc3RlbmVyID0gdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAga2V5TGlzdGVuZXIoZSl7XG4gICAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9jdXNlZEluZGV4ID0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICBcbiAgICAgICAgaWYoZm9jdXNlZEluZGV4IDwgMCkge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKGUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuW3RoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCFlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5sYXN0Rm9jdXNlZFRhYiAhPT0gdGhpcy5saW5rcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMubGFzdEZvY3VzZWRUYWIgKyAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmtzW3RoaXMubGFzdEZvY3VzZWRUYWJdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2UodHlwZSwgaSkge1xuICAgICAgICBsZXQgbWV0aG9kcyA9IHtcbiAgICAgICAgICAgIG9wZW46IHtcbiAgICAgICAgICAgICAgICBjbGFzc2xpc3Q6ICdhZGQnLFxuICAgICAgICAgICAgICAgIHRhYkluZGV4OiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXRzW2ldLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJzAnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiB7XG4gICAgICAgICAgICAgICAgY2xhc3NsaXN0OiAncmVtb3ZlJyxcbiAgICAgICAgICAgICAgICB0YWJJbmRleDoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMudGFyZ2V0c1t0aGlzLmN1cnJlbnRdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJy0xJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxpbmtzW2ldLmNsYXNzTGlzdFttZXRob2RzW3R5cGVdLmNsYXNzbGlzdF0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnRhcmdldHNbaV0uY2xhc3NMaXN0W21ldGhvZHNbdHlwZV0uY2xhc3NsaXN0XSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICB0aGlzLmxpbmtzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMubGlua3NbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgIG1ldGhvZHNbdHlwZV0udGFiSW5kZXgudGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCBtZXRob2RzW3R5cGVdLnRhYkluZGV4LnZhbHVlKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oaSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKHRoaXMuY3VycmVudClcbiAgICAgICAgICAgIC5vcGVuKGkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHRpdGxlQ2xhc3M6ICcuanMtdGFic19fbGluaycsXG4gICAgY3VycmVudENsYXNzOiAnYWN0aXZlJyxcbiAgICBhY3RpdmU6IDBcbn07Il19
