#Storm tabs

[![Build Status](https://travis-ci.org/mjbp/storm-tabs.svg?branch=master)](https://travis-ci.org/mjbp/storm-tabs)
[![codecov.io](http://codecov.io/github/mjbp/storm-tabs/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-tabs?branch=master)
[![npm version](https://badge.fury.io/js/storm-tabs.svg)](https://badge.fury.io/js/storm-tabs)

Multi-panelled content areas 

##Example
[https://mjbp.github.io/storm-tabs](https://mjbp.github.io/storm-tabs)

##Usage
HTML
```
<div class="js-tabs tabs">
    <nav class="tabs__nav">
        <a class="tabs__nav-link js-tabs__link" href="#1">Tab 1</a>
        <a class="tabs__nav-link js-tabs__link" href="#2">Tab 2</a>
        <a class="tabs__nav-link js-tabs__link" href="#3">Tab 3</a>
    </nav>
    <section id="1" class="tabs__section">Tab 1</section>
    <section id="2" class="tabs__section">Tab 2</section>
    <section id="3" class="tabs__section">Tab 3</section>
</div>
```

JS
```
npm i -S storm-tabs
```
either using es6 import
```
import Tabs from 'storm-tabs';

Tabs.init('.js-tabs');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-tabs.standalone.js')
    .then(() => {
        StormTabs.init('.js-tabs');
    });
```
or es5 commonjs  (legacy, use the .standalone version in the /dist folder)
```
var Tabs = require('./libs/storm-tabs');

Tabs.init('.js-tabs');
```

##Options
```
    {
		titleClass: '.js-tabs__link',
		currentClass: 'active',
		active: 0
    }
```

e.g.
```
Tabs.init('.js-tabs',);
```


##Tests
```
npm run test
```

##Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends unpon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

##Dependencies
None

##License
MIT