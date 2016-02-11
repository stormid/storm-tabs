var STORM = (function(w, d) {
	'use strict';
    
    var Tabs = require('./libs/storm-tabs'),
        init = function() {
            Tabs.init('.js-tabs');
        };
	
	return {
		init: init
	};
	
})(window, document, undefined);

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);