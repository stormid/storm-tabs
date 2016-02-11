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
            titleClass: '.js-tabs__tab',
            currentClass: 'active',
            active: 0
        },
        merge = require('merge');
    
    
    function StormTabs(el, opts) {
        this.settings = merge({}, defaults, opts);
        
        //Need to refactor this
        //iterate through children to find links rather than rewly on element.querySelectorAll
        this.links = [].slice.call(el.querySelectorAll(this.settings.titleClass));
        
        this.targets = this.links.map(function(el){
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
         });
        this.current = this.settings.active;
        this.initAria();
        this.initTitles();
    }
    
    StormTabs.prototype.initAria = function() {
        this.links.forEach(function(el, i){
            STORM.UTILS.attributelist.add(el, {
                'role' : 'tab',
                'aria-expanded' : false,
                'aria-selected' : false,
                'aria-controls' : this.targets[i].getAttribute('id')
            });
        }.bind(this));
        
        this.targets.forEach(function(el){
            STORM.UTILS.attributelist.add(el, {
                'role' : 'tabpanel',
                'aria-hidden' : true,
                tabIndex: '-1'
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
    
    /* REFACTOR ME PLS, DRY*/
    StormTabs.prototype.open = function(i) {
        STORM.UTILS.classlist.add(this.links[i], this.settings.currentClass);
        STORM.UTILS.classlist.add(this.targets[i], this.settings.currentClass);
        STORM.UTILS.attributelist.toggle(this.targets[i], 'aria-hidden');
        STORM.UTILS.attributelist.toggle(this.links[i], 'aria-selected');
        STORM.UTILS.attributelist.toggle(this.links[i], 'aria-expanded');
        STORM.UTILS.attributelist.add(this.targets[i], {
            'tabIndex': '0'
        });
        this.current = i;
        return this;
    };
    
    StormTabs.prototype.close = function(i) {
        STORM.UTILS.classlist.remove(this.links[this.current], this.settings.currentClass);
        STORM.UTILS.classlist.remove(this.targets[this.current], this.settings.currentClass);
        STORM.UTILS.attributelist.toggle(this.targets[i], 'aria-hidden');
        STORM.UTILS.attributelist.toggle(this.links[i], 'aria-selected');
        STORM.UTILS.attributelist.toggle(this.links[i], 'aria-expanded');
        STORM.UTILS.attributelist.add(this.targets[this.current], {
            'tabIndex': '-1'
        });
        return this;
    };
    
    StormTabs.prototype.toggle = function(i) {
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