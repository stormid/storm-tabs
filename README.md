#Storm tabs

[![Build Status](https://travis-ci.org/mjbp/storm-tabs.svg?branch=master)](https://travis-ci.org/mjbp/storm-tabs)
[![codecov.io](http://codecov.io/github/mjbp/storm-tabs/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-tabs?branch=master)
[![npm version](https://badge.fury.io/js/storm-tabs.svg)](https://badge.fury.io/js/storm-tabs)

Multi-panelled content areas 

##Usage
HTML
```
<a href="#target" class="js-toggler"></a>
<div id="target"></div>
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


##Example
[https://mjbp.github.io/storm-tabs](https://mjbp.github.io/storm-tabs)


##Options
```
    {
		delay: 0,
		targetLocal: false,
		callback: null
    }
```

e.g.
```
Tabs.init('.js-tabs',);
```


##API
####`Tabs.init(selector, opts)`
Initialise the module with a DOM selector and  options object


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