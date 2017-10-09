import should from 'should';
import 'jsdom-global/register';
import Tabs from '../dist/storm-tabs.standalone';

const html = `<div class="js-tabs tabs">
				<nav class="tabs__nav">
					<a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1">Tab 1</a>
					<a id="tab-2" class="tabs__nav-link js-tabs__link" href="#panel-2">Tab 2</a>
					<a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3">Tab 3</a>
				</nav>
				<section id="panel-1" class="tabs__section">Tab 1</section>
				<section id="panel-2" class="tabs__section">Tab 2</section>
				<section id="panel-3" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs tabs">
				<nav class="tabs__nav">
					<a id="tab-4" class="tabs__nav-link js-tabs__link" href="#panel-4">Tab 1</a>
					<a id="tab-4" class="tabs__nav-link js-tabs__link" href="#panel-5">Tab 2</a>
					<a id="tab-4" class="tabs__nav-link js-tabs__link" href="#panel-6">Tab 3</a>
				</nav>
				<section id="panel-4" class="tabs__section">Tab 1</section>
				<section id="panel-5" class="tabs__section">Tab 2</section>
				<section id="panel-6" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs-2 tabs">
				<nav class="tabs__nav">
					<a id="tab-7" class="tabs__nav-link js-tabs__link" href="#panel-7">Tab 1</a>
					<a id="tab-8" class="tabs__nav-link js-tabs__link" href="#panel-8">Tab 2</a>
					<a id="tab-9" class="tabs__nav-link js-tabs__link" href="#panel-9">Tab 3</a>
				</nav>
				<section id="panel-7" class="tabs__section">Tab 1</section>
				<section id="panel-8" class="tabs__section">Tab 2</section>
				<section id="panel-9" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs-3 tabs">
				<nav class="tabs__nav">
					<a id="tab-10" class="tabs__nav-link js-tabs__link" href="#panel-10">Tab 1</a>
					<a id="tab-11" class="tabs__nav-link js-tabs__link" href="#panel-11">Tab 2</a>
					<a id="tab-12" class="tabs__nav-link js-tabs__link" href="#panel-12">Tab 3</a>
					<a id="tab-13" class="tabs__nav-link js-tabs__link" href="#panel-99">Tab 4</a>
				</nav>
				<section id="panel-10" class="tabs__section">Tab 1</section>
				<section id="panel-11" class="tabs__section">Tab 2</section>
				<section id="panel-12" class="tabs__section">Tab 3</section>
			</div>`;

document.body.innerHTML = html;

let TabSet = Tabs.init('.js-tabs'),
	TabSet2 = Tabs.init('.js-tabs-2', {
		active: 1
	});

describe('Initialisation', () => {

	it('should return array of tabs', () => {
		should(TabSet)
		.Array()
		.and.have.lengthOf(2);
	});

	
	it('should throw an error if no link elements are found', () => {
		Tabs.init.bind(Tabs, '.js-err').should.throw();
	});

	it('should throw an error if any panels are not found for each link', () => {
		Tabs.init.bind(Tabs, '.js-tabs-3').should.throw();
	});
	
	
	it('each array item should be an object with the correct properties', () => {
		TabSet[0].should.be.an.instanceOf(Object).and.not.empty();
		TabSet[0].should.have.property('DOMElement');
		TabSet[0].should.have.property('settings').Object();
		TabSet[0].should.have.property('init').Function();
		TabSet[0].should.have.property('initAttributes').Function();
		TabSet[0].should.have.property('initTabs').Function();
		TabSet[0].should.have.property('change').Function();
		TabSet[0].should.have.property('open').Function();
		TabSet[0].should.have.property('close').Function();
		TabSet[0].should.have.property('toggle').Function();
    
	});

	it('should initialisation with different settings if different options are passed', () => {
		should(TabSet2[0].settings.active).not.equal(TabSet[0].settings.active);
	});
	
	it('should attach the handleClick eventListener to each tab title click event to toggle documentElement className', () => {
		TabSet[0].tabs[0].click();
		Array.from(TabSet[0].panels[0].classList).should.containEql('active');
		TabSet[0].tabs[1].click();
		Array.from(TabSet[0].panels[0].classList).should.not.containEql('active');
	});

	/*
	 * Write what we expect for each of th keyboard interactions
	 */
	it('should attach keydown eventListener to each tab', () => {
		
		//trigger
		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 32,
				keyCode: 32
			})
		);

		let tabDownEvt = new window.KeyboardEvent('keydown', {
			key : 'Tab',
			keyCode: 9
		});


		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 13,
				keyCode: 13
			})
		);

		TabSet[0].tabs[0].click();

		TabSet[0].tabs[0].dispatchEvent(tabDownEvt);

		//TabSet[0].focusableChildren[0].dispatchEvent(tabDownEvt);

		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				key : 'Tab',
				keyCode: 9,
				shiftKey: true
			})
		);

		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 13,
				keyCode: 13
			})
		);

		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 37,
				keyCode: 37
			})
		);
		
		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 39,
				keyCode: 39
			})
		);

		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 38,
				keyCode: 38
			})
		);

		TabSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 40,
				keyCode: 40
			})
		);
		
	});

});