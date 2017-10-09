/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 1.1.2: Mon, 09 Oct 2017 10:32:26 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');

	return els.map((el) => Object.assign(Object.create(componentPrototype), {
			DOMElement: el,
			settings: Object.assign({}, defaults, el.dataset, opts)
		}).init());
};

export default { init };