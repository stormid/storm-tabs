import should from 'should';
import Tabs from '../dist/storm-tabs';
import 'jsdom-global/register';

const html = `<div class="js-tabs tabs">
				<nav class="tabs__nav">
					<a class="tabs__nav-link js-tabs__link" href="#1">Tab 1</a>
					<a class="tabs__nav-link js-tabs__link" href="#2">Tab 2</a>
					<a class="tabs__nav-link js-tabs__link" href="#3">Tab 3</a>
				</nav>
				<section id="1" class="tabs__section">Tab 1</section>
				<section id="2" class="tabs__section">Tab 2</section>
				<section id="3" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs tabs">
				<nav class="tabs__nav">
					<a class="tabs__nav-link js-tabs__link" href="#4">Tab 1</a>
					<a class="tabs__nav-link js-tabs__link" href="#5">Tab 2</a>
					<a class="tabs__nav-link js-tabs__link" href="#6">Tab 3</a>
				</nav>
				<section id="4" class="tabs__section">Tab 1</section>
				<section id="5" class="tabs__section">Tab 2</section>
				<section id="6" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs-2 tabs">
				<nav class="tabs__nav">
					<a class="tabs__nav-link js-tabs__link" href="#7">Tab 1</a>
					<a class="tabs__nav-link js-tabs__link" href="#8">Tab 2</a>
					<a class="tabs__nav-link js-tabs__link" href="#9">Tab 3</a>
				</nav>
				<section id="7" class="tabs__section">Tab 1</section>
				<section id="8" class="tabs__section">Tab 2</section>
				<section id="9" class="tabs__section">Tab 3</section>
			</div>
			<div class="js-tabs-3 tabs">
				<nav class="tabs__nav">
					<a class="tabs__nav-link js-tabs__link" href="#10">Tab 1</a>
					<a class="tabs__nav-link js-tabs__link" href="#11">Tab 2</a>
					<a class="tabs__nav-link js-tabs__link" href="#12">Tab 3</a>
					<a class="tabs__nav-link js-tabs__link" href="#99">Tab 4</a>
				</nav>
				<section id="10" class="tabs__section">Tab 1</section>
				<section id="11" class="tabs__section">Tab 2</section>
				<section id="12" class="tabs__section">Tab 3</section>
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

	it('should throw an error if any target elements are not found for each link', () => {
		Tabs.init.bind(Tabs, '.js-tabs-3').should.throw();
	});
	
	
	it('each array item should be an object with the correct properties', () => {
		TabSet[0].should.be.an.instanceOf(Object).and.not.empty();
		TabSet[0].should.have.property('DOMElement');
		TabSet[0].should.have.property('settings').Object();
		TabSet[0].should.have.property('init').Function();
		TabSet[0].should.have.property('initAria').Function();
		TabSet[0].should.have.property('initTitles').Function();
		TabSet[0].should.have.property('getLinkIndex').Function();
		TabSet[0].should.have.property('getFocusableChildren').Function();
		TabSet[0].should.have.property('keyListener').Function();
		TabSet[0].should.have.property('change').Function();
		TabSet[0].should.have.property('open').Function();
		TabSet[0].should.have.property('close').Function();
		TabSet[0].should.have.property('toggle').Function();
    
	});

	it('should initialisation with different settings if different options are passed', () => {
		should(TabSet2[0].settings.active).not.equal(TabSet[0].settings.active);
	});
	
	it('should attach the handleClick eventListener to each tab title click event to toggle documentElement className', () => {
		TabSet[0].links[0].click();
		Array.from(TabSet[0].targets[0].classList).should.containEql('active');
		TabSet[0].links[1].click();
		Array.from(TabSet[0].targets[0].classList).should.not.containEql('active');
	});

});