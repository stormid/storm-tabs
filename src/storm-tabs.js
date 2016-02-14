(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormTabs = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        defaults = {
            titleClass: '.js-tabs__link',
            currentClass: 'active',
            active: 0
        },
		classlist = require('dom-classlist'),
		attributelist = require('storm-attributelist'),
        merge = require('merge'),
		find = function(node, condition) {
			var found = [],
				loop = function(n) {
					for(var i = 0; i < n.length; i++){
						!!condition(n[i]) && found.push(n[i]);
						if(!!n[i].children && !!n[i].children.length) { loop(n[i].children); }
					}
					return found;
				};
			
			return (node.children && loop(node.children)) || null;
		};
    
    function StormTabs(el, opts) {
        this.settings = merge({}, defaults, opts);
		
		this.links = [].slice.call(el.querySelectorAll(this.settings.titleClass));
		
		this.targets = this.links.map(function(el){
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
         });
		
        this.current = this.settings.active;
        this.initAria()
			.initTitles()
			.open(this.current);
    }
    
    StormTabs.prototype.initAria = function() {
        this.links.forEach(function(el, i){
            attributelist.set(el, {
                'role' : 'tab',
                'aria-expanded' : false,
                'aria-selected' : false,
                'aria-controls' : this.targets[i].getAttribute('id')
            });
        }.bind(this));
        
        this.targets.forEach(function(el){
            attributelist.set(el, {
                'role' : 'tabpanel',
                'aria-hidden' : true,
                'tabIndex': '-1'
            });
        });
        return this;
    };
    
    StormTabs.prototype.initTitles = function() {
        var handler = function(i){
            this.toggle(i);
        };
        
        this.links.forEach(function(el, i){
            el.addEventListener('click', function(e){
                e.preventDefault();
                handler.call(this, i);
            }.bind(this), false);
        }.bind(this));
        
        return this;
    };
	
	StormTabs.prototype.change = function(type, i) {
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
		
		classlist(this.links[i])[methods[type].classlist](this.settings.currentClass);
		classlist(this.targets[i])[methods[type].classlist](this.settings.currentClass);
        attributelist.toggle(this.targets[i], 'aria-hidden');
        attributelist.toggle(this.links[i], ['aria-selected', 'aria-expanded']);
		attributelist.set(methods[type].tabIndex.target, {
            'tabIndex': methods[type].tabIndex.value
        });
	};
    
    StormTabs.prototype.open = function(i) {
		this.change('open', i);
        this.current = i;
        return this;
    };
    
    StormTabs.prototype.close = function(i) {
		this.change('close', i);
        return this;
    };
    
    StormTabs.prototype.toggle = function(i) {
		if(this.current === i) { return; }
        if(this.current === null) { 
            this.open(i);
            return this;
        }
         this.close(this.current)
            .open(i);
        return this;
    };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            throw new Error('Tabs cannot be initialised, no augmentable elements found');
        }
        
        els.forEach(function(el){
            instances.push(new StormTabs(el, opts));
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