const KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    UP:38,
    DOWN: 40
};

export default {
    init() {
        let hash = location.hash.slice(1) || false;

        this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.targets = this.links.map(el => document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found'));
        !!this.links.length && this.links[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if (hash) this.targets.every((target, i) => { if (target.getAttribute('id') === hash) this.current = i; });

        this.initAria()
            .initTitles()
            .open(this.current);

        return this;
    },
    initAria() {
        this.links.forEach((el, i) => {
            el.setAttribute('role', 'tab');
            el.setAttribute('aria-expanded', false);
            el.setAttribute('aria-selected', false);
            el.setAttribute('aria-controls', this.targets[i].getAttribute('id'));
            this.targets[i].setAttribute('role', 'tabpanel');
            this.targets[i].setAttribute('aria-hidden', true);
            this.targets[i].setAttribute('tabIndex', '-1');
        });
        return this;
    },
    initTitles() {
        let handler = i => {
                this.toggle(i);
            },
            next = () => {
                this.toggle((this.current === this.links.length - 1 ? 0 : this.current + 1));
                window.setTimeout(() => { this.links[this.current].focus(); }, 16);
            },
            previous = () => {
                this.toggle((this.current === 0 ? this.links.length - 1 : this.current - 1));
                window.setTimeout(() => { this.links[this.current].focus(); }, 16);
            };

        this.lastFocusedTab = 0;

        this.links.forEach((el, i) => {
            //navigate
            el.addEventListener('keydown', e => {
                switch (e.keyCode) {
                case KEY_CODES.UP:
                    e.preventDefault();
                    previous();
                    break;
                case KEY_CODES.LEFT:
                    previous();
                    break;
                case KEY_CODES.DOWN:
                    e.preventDefault();
                    next();
                    break;
                case KEY_CODES.RIGHT:
                    next();
                    break;
                case KEY_CODES.ENTER:
                    handler.call(this, i);
                    window.setTimeout(() => { this.links[i].focus(); }, 16);
                    break;
                case KEY_CODES.SPACE:
                    e.preventDefault();
                    handler.call(this, i);
                    window.setTimeout(() => { this.links[i].focus(); }, 16);
                    break;
                case KEY_CODES.TAB:
                    e.preventDefault();
                    e.stopPropagation();
                    this.lastFocusedTab = this.getLinkIndex(e.target);
                    this.setTargetFocus(this.lastFocusedTab);
                    handler.call(this, i);
                    break;
                default:
                    break;
                }
            });
            el.addEventListener('click', e => {
                e.preventDefault();
                handler.call(this, i);  
            }, false);
        });

        return this;
    },
    getLinkIndex(link){
        for(let i = 0; i < this.links.length; i++) if(link === this.links[i]) return i;
        return null;
    },
    getFocusableChildren(node) {
        let focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus(tabIndex){
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);
        if(!this.focusableChildren.length) return;
        
        window.setTimeout(function(){
            this.focusableChildren[0].focus();
            this.keyEventListener = this.keyListener.bind(this);
            
            document.addEventListener('keydown', this.keyEventListener);
        }.bind(this), 0);
    },
    keyListener(e){
        if (e.keyCode !== KEY_CODES.TAB) return;
        let focusedIndex = this.focusableChildren.indexOf(document.activeElement);
        
        if(focusedIndex < 0) {
            document.removeEventListener('keydown', this.keyEventListener);
            return;
        }
        
        if(e.shiftKey && focusedIndex === 0) {
            e.preventDefault();
            this.focusableChildren[this.focusableChildren.length - 1].focus();
        } else {
            if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
                document.removeEventListener('keydown', this.keyEventListener);
                if(this.lastFocusedTab !== this.links.length - 1) {
                    e.preventDefault();
                    this.lastFocusedTab = this.lastFocusedTab + 1;
                    this.links[this.lastFocusedTab].focus();
                }
                
            }
        }
    },
    change(type, i) {
        let methods = {
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
        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true' );
        this.links[i].setAttribute('aria-selected', this.links[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true' );
        this.links[i].setAttribute('aria-expanded', this.links[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true' );
        methods[type].tabIndex.target.setAttribute('tabIndex', methods[type].tabIndex.value);
        
    },
    open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close(i) {
        this.change('close', i);
        return this;
    },
    toggle(i) {
        if(this.current === i) return;
        
        window.history.pushState({ URL: this.links[i].getAttribute('href') }, '', this.links[i].getAttribute('href'));

        if(this.current === null) {
            this.open(i);
        } else {
            this.close(this.current)
                .open(i);
        }

        return this;
    }
};