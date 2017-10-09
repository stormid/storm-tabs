const KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

export default {
    init() {
        let hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.panels = this.tabs.map(el => document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found'));
        !!this.tabs.length && this.tabs[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if(hash !== false) this.panels.forEach((target, i) => { if (target.getAttribute('id') === hash) this.current = i; });

        this.initAttributes()
            .initTabs()
            .open(this.current);

        return this;
    },
    initAttributes() {
        this.tabs.forEach((tab, i) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', false);
            this.panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
            tab.setAttribute('tabindex', '-1');
            this.panels[i].setAttribute('role', 'tabpanel');
            this.panels[i].setAttribute('hidden', 'hidden');
            this.panels[i].setAttribute('tabindex', '-1');
            if(!this.panels[i].firstElementChild || this.panels[i].firstElementChild.hasAttribute('tabindex')) return;
            this.panels[i].firstElementChild.setAttribute('tabindex', '-1');
        });
        return this;
    },
    initTabs() {
        let change = id => {
                this.toggle(id);
                window.setTimeout(() => { this.tabs[this.current].focus(); }, 16);
            },
            nextId = () => (this.current === this.tabs.length - 1 ? 0 : this.current + 1),
            previousId = () => (this.current === 0 ? this.tabs.length - 1 : this.current - 1);

        this.lastFocusedTab = 0;

        this.tabs.forEach((el, i) => {
            el.addEventListener('keydown', e => {
                switch (e.keyCode) {
                case KEY_CODES.LEFT:
                    change.call(this, previousId());
                    break;
                case KEY_CODES.DOWN:
                    e.preventDefault();
                    e.stopPropagation();
                    this.panels[i].focus();
                    break;
                case KEY_CODES.RIGHT:
                    change.call(this, nextId());
                    break;
                case KEY_CODES.ENTER:
                    change.call(this, i);
                    break;
                case KEY_CODES.SPACE:
                    e.preventDefault();
                    change.call(this, i);
                    break;
                default:
                    break;
                }
            });
            el.addEventListener('click', e => {
                e.preventDefault();
                change.call(this, i);  
            }, false);
        });

        return this;
    },
    change(type, i) {
        this.tabs[i].classList[(type === 'open' ? 'add' : 'remove')](this.settings.currentClass);
        this.panels[i].classList[(type === 'open' ? 'add' : 'remove')](this.settings.currentClass);
        type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true' );
        (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', (type === 'open' ? '0' : '-1'));
        (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', (type === 'open' ? '0' : '-1'));
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
        
        window.history && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));

        if(this.current === null) this.open(i);
        else this.close(this.current).open(i);

        return this;
    }
};