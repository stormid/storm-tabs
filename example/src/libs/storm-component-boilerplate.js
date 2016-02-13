/**
 * @name storm-component-boilerplate: 
 * @version 0.1.0: Wed, 10 Feb 2016 11:18:31 GMT
 * @author mjbp
 * @license MIT
 */(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormComponentBoilerplate = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        defaults = {
            delay: 200,
            callback: null
        },
        merge = require('merge');
    
    
    function StormComponentBoilerplate(el, opts) {
        this.settings = merge({}, defaults, opts);
        this.DOMElement = el;
        this.DOMElement.addEventListener('click', this.handleClick.bind(this), false);
    }
    
    StormComponentBoilerplate.prototype.handleClick = function(e) {
        console.log(e.target, 'I\'ve been clicked');
    };
    
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            throw new Error('Boilerplate cannot be initialised, no augmentable elements found');
        }
        
        els.forEach(function(el){
            instances.push(new StormComponentBoilerplate(el, opts));
        });
        return instances;
    }
    
    function reload(els, opts) {
        destroy();
        init(els, opts);
    }
    
    function destroy() {
        instances = [];  
    }
	
	return {
		init: init,
        reload: reload,
        destroy: destroy
	};
	
 }));