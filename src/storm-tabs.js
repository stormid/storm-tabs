module.exports = (function() {
	'use strict';
    
    var KEY_CODES = {
            RETURN: 13,
            TAB: 9
        },
        instances = [],
        triggerEvents = ['click', 'keydown'],
        assign = require('object-assign'),
        merge = require('merge'),
        defaults = {
            titleClass: '.js-tabs__link',
            currentClass: 'active',
            active: 0
        },
        StormTabs = {
            init: function() {
                this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
                this.targets = this.links.map(function(el){
                    return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
                 });

                this.current = this.settings.active;
                this.initAria()
                    .initTitles()
                    .open(this.current);
            },
            initAria: function() {
                this.links.forEach(function(el, i){
                    this.attributelist.set(el, {
                        'role' : 'tab',
                        'aria-expanded' : false,
                        'aria-selected' : false,
                        'aria-controls' : this.targets[i].getAttribute('id')
                    });
                }.bind(this));

                this.targets.forEach(function(el){
                    this.attributelist.set(el, {
                        'role' : 'tabpanel',
                        'aria-hidden' : true,
                        'tabIndex': '-1'
                    });
                }.bind(this));
                return this;
            },
            initTitles: function() {
                var handler = function(i){
                    this.toggle(i);
                };

                this.links.forEach(function(el, i){
                    triggerEvents.forEach(function(ev){
                        el.addEventListener(ev, function(e){
                            if(!!e.keyCode && e.keyCode === KEY_CODES.TAB) { return; }
                            if(!!!e.keyCode || e.keyCode === KEY_CODES.RETURN){
                                e.preventDefault();
                                handler.call(this, i);
                            }
                        }.bind(this), false);
                    }.bind(this));
                    
                }.bind(this));

                return this;
            },
            change: function(type, i) {
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

                this.classlist(this.links[i])[methods[type].classlist](this.settings.currentClass);
                this.classlist(this.targets[i])[methods[type].classlist](this.settings.currentClass);
                this.attributelist.toggle(this.targets[i], 'aria-hidden');
                this.attributelist.toggle(this.links[i], ['aria-selected', 'aria-expanded']);
                this.attributelist.set(methods[type].tabIndex.target, {
                    'tabIndex': methods[type].tabIndex.value
                });
            },
            open: function(i) {
                this.change('open', i);
                this.current = i;
                return this;
            },
            close: function(i) {
                this.change('close', i);
                return this;
            },
            toggle: function(i) {
                if(this.current === i) { return; }
                    if(this.current === null) { 
                        this.open(i);
                        return this;
                    }
                     this.close(this.current)
                        .open(i);
                    return this;
                }
            };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            throw new Error('Tabs cannot be initialised, no augmentable elements found');
        }
        
        els.forEach(function(el, i){
            instances[i] = assign(Object.create(StormTabs), {
                DOMElement: el,
                settings: merge({}, defaults, opts)
            }, {
                classlist: require('dom-classlist'),
                attributelist: require('storm-attributelist')
            });
            
            instances[i].init();
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
	
 }());