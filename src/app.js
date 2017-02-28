import Tabs from './libs/storm-tabs';

const onDOMContentLoadedTasks = [() => {
	Tabs.init('.js-tabs');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });