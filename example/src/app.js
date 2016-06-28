var UTILS = {
		attributelist: require('storm-attributelist')
	},
	UI = (function(w, d) {
		'use strict';

		var Tabs = require('./libs/storm-tabs'),
			init = function() {
				Tabs.init('.js-tabs');
			};

		return {
			init: init
		};

	})(window, document, undefined);

global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);