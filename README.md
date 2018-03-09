# Storm tabs

Accessible (ARIA and keyboard support) tabs for multi-panelled content areas.

[![npm version](https://badge.fury.io/js/storm-tabs.svg)](https://badge.fury.io/js/storm-tabs)

## Example
[https://stormid.github.io/storm-tabs](https://stormid.github.io/storm-tabs)

## Usage
HTML
```
<div class="js-tabs tabs">
    <nav class="tabs__nav">
        <a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1">Tab 1</a>
        <a id="tab-2" class="tabs__nav-link js-tabs__link" href="#panel-2">Tab 2</a>
        <a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3">Tab 3</a>
    </nav>
    <section id="panel-1" class="tabs__section">Panel 1</section>
    <section id="panel-2" class="tabs__section">Panel 2</section>
    <section id="panel-3" class="tabs__section">Panel 3</section>
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

## Options
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

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends unpon Object.assign so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

## Dependencies
None

## License
MIT