/* globals anime, KeenSlider, Swiper, noUiSlider, Fancybox */

/**
 * Utility
 *
 * 01.initFancyboxProductGallery - запуск модуля Fancybox для продукта
 * 02.initSmoothScrollLinks - запуск модуля ссылок якорей
 * 03.initHeaderScrolling - запуск модуля плавающего Header
 */

/** initFancyboxProductGallery */

function initFancyboxProductGallery() {
	Fancybox.bind('[data-fancybox]', {
		Carousel: {
			Thumbs: false,
			Toolbar: {
				display: {
					left: [],
					middle: [],
					right: ['close'],
				},
			},
			Zoomable: {
				Panzoom: {
					minScale: 0.5,
					clickAction: 'toggleCover',
					mouseMoveFactor: 1,
					startScale: 'cover',
				},
			},
			Video: {
				html5videoTpl: `
					<video class="f-html5video" playsinline loop muted poster="{{poster}}">
						<source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.
					</video>
				`,
			},
		},
	});
}

/** initSmoothScrollLinks */

function initSmoothScrollLinks() {
	document.addEventListener('click', function (e) {
		const link = e.target.closest('a.js-link-anchor[href^="#"]');
		if (!link) return;

		const targetId = link.getAttribute('href').substring(1);
		if (!targetId) return;

		const targetElement = document.getElementById(targetId);
		if (!targetElement) return;

		e.preventDefault();

		targetElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	});
}

/** initHeaderScrolling */

function initHeaderScrolling() {
	const header = document.querySelector('.js-header');

	const setIsScrolled = () => {
		if (window.scrollY > 5) {
			header.classList.add('is-scrolled');
		} else {
			header.classList.remove('is-scrolled');
		}
	};

	setIsScrolled();

	window.addEventListener('scroll', setIsScrolled);
}

/**
 * Components
 *
 * 00.Component - базовый класс компонента
 * 01.Menu - компонент меню
 * 02.Tabs - компонент табов
 * 03.Modal - компонент модального окна
 * 04.Detail - компонент деталей
 * 05.Counter - компонент счетчика
 * 06.ProductGallery - компонент галериеи продукта
 * 07.FullscreenSlider - компонент полноэкранного слайдера
 * 08.FiltersPopup - компонент попапа фильтров
 * 09.Ranger - компонент диапазона
 */

/**
 * Component
 */

class Component {
	constructor(target) {
		this.component = target instanceof HTMLElement ? target : document.querySelector(target);
	}
}

/** Menu */

class Menu extends Component {
	constructor(target = '.js-menu') {
		super(target);

		if (!this.component) return;

		this.state = {
			isShow: false,
		};

		this.hoverTriggers = this.component.querySelectorAll('.js-menu__hover-trigger');
		this.hideTriggers = this.component.querySelectorAll('.js-menu__hide-trigger');
		this.burger = document.querySelector('.js-menu-burger');
		this.header = document.querySelector('.js-header');

		this.init();
	}

	init() {
		this?.burger.addEventListener('click', this.toggle);
		this?.hideTriggers.forEach((trigger) => {
			trigger.addEventListener('click', this.hide);
		});

		this?.hoverTriggers.forEach((trigger) => {
			trigger.addEventListener('mouseenter', () => {
				if (this.header) this.header.classList.add('is-hovered');
			});
			trigger.addEventListener('mouseleave', () => {
				if (this.header) this.header.classList.remove('is-hovered');
			});
		});
	}

	destroy() {
		this?.burger.removeEventListener('click', this.toggle);
		this?.hideTriggers.forEach((trigger) => {
			trigger.removeEventListener('click', this.hide);
		});
	}

	toggle = () => {
		if (this.state.isShow) {
			this.hide();
		} else {
			this.show();
		}
	};

	show = () => {
		this.state.isShow = true;
		this.burger.classList.add('is-active');
		this.header.classList.add('is-active');
		this.component.classList.add('is-active');
		document.body.classList.add('is-lock');
	};

	hide = () => {
		this.state.isShow = false;
		this.burger.classList.remove('is-active');
		this.header.classList.remove('is-active');
		this.component.classList.remove('is-active');
		document.body.classList.remove('is-lock');
	};
}

/** Tabs */

class Tabs extends Component {
	constructor(target = '.js-tabs') {
		super(target);

		if (!this.component) return;

		this.buttons = this.component.querySelectorAll('.js-tabs-button');
		this.content = this.component.querySelectorAll('.js-tabs-content');

		this.init();
	}

	init() {
		if (this.buttons[0]) this.change(this.buttons[0].getAttribute('data-tab-id'));

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => this.change(button.getAttribute('data-tab-id')));
		});
	}

	change = (id) => {
		this.buttons.forEach((item) => {
			if (item.getAttribute('data-tab-id') === id) item.classList.add('is-active');
			if (item.getAttribute('data-tab-id') !== id) item.classList.remove('is-active');
		});
		this.content.forEach((item) => {
			if (item.getAttribute('data-tab-id') === id) item.classList.add('is-active');
			if (item.getAttribute('data-tab-id') !== id) item.classList.remove('is-active');
		});
	};
}

/** Modal */

class Modal extends Component {
	constructor(target = '.js-molal') {
		super(target);

		if (!this.component) return;

		this.showTimeout = Number(this.component.getAttribute('data-timeout'));
		this.showTriggers = document.querySelectorAll(`[data-show-modal="${this.component.id}"]`);
		this.hideTriggers = document.querySelectorAll(`[data-hide-modal="${this.component.id}"]`);

		this.init();
	}

	init() {
		this.showTriggers.forEach((trigger) => trigger.addEventListener('click', this.show));
		this.hideTriggers.forEach((trigger) => trigger.addEventListener('click', this.hide));

		this.component.addEventListener('click', ({ target }) => {
			if (target && target.hasAttribute('data-hide-modal')) this.hide();
		});

		if (!Number.isNaN(this.showTimeout) && this.showTimeout) {
			setTimeout(this.show, this.showTimeout);
		}
	}

	show = () => {
		this.component.classList.add('is-active');
		document.body.classList.add('is-lock');
	};

	hide = () => {
		this.component.classList.remove('is-active');
		document.body.classList.remove('is-lock');
	};
}

/** Detail */

class Detail extends Component {
	constructor(target = '.js-detail') {
		super(target);

		if (!this.component) return;

		this.state = {
			isShow: false,
		};

		this.trigger = this.component.querySelector('.js-detail__button');
		this.content = this.component.querySelector('.js-detail__body');

		this.init();
	}

	init() {
		if (this.component.getAttribute('data-detail-initial-state') === 'show') {
			setTimeout(() => this.show(0), 200);
		} else {
			this.hide(0);
		}

		this.trigger.addEventListener('click', this.toggle);
	}

	destroy() {
		anime.animate(this.content, {
			height: (elem) => elem.scrollHeight,
			duration: 0,
		});

		this.trigger.removeEventListener('click', this.toggle);
	}

	toggle = () => {
		if (this.state.isShow) {
			this.hide();
		} else {
			this.show();
		}
	};

	show = (duration = 200) => {
		this.state.isShow = false;
		this.trigger.classList.remove('is-active');
		this.content.classList.remove('is-active');

		anime.animate(this.content, {
			height: 0,
			duration,
		});
	};

	hide = (duration = 200) => {
		this.state.isShow = true;
		this.trigger.classList.add('is-active');
		this.content.classList.add('is-active');

		anime.animate(this.content, {
			height: (elem) => elem.scrollHeight,
			duration,
		});
	};
}

/** Counter */

class Counter extends Component {
	constructor(target = '.js-counter') {
		super(target);

		if (!this.component) return;

		this.state = {
			value: 0,
		};

		this.increaseButton = this.component.querySelector('.js-counter__increase');
		this.decreaseButton = this.component.querySelector('.js-counter__decrease');
		this.valueContainer = this.component.querySelector('.js-counter__value');

		this.init();
	}

	init() {
		if (!this.valueContainer) return;

		this.state.value = Number(this.valueContainer.value) || 0;

		this?.increaseButton?.addEventListener('click', this.increase);
		this?.decreaseButton?.addEventListener('click', this.decrease);
	}

	destroy() {
		this?.increaseButton?.removeEventListener('click', this.increase);
		this?.decreaseButton?.removeEventListener('click', this.decrease);
	}

	increase = () => {
		if (!this.valueContainer) return;

		this.state.value += 1;
		this.valueContainer.value = this.state.value;
	};

	decrease = () => {
		if (!this.valueContainer || this.state.value <= 0) return;

		this.state.value -= 1;
		this.valueContainer.value = this.state.value;
	};
}

/** ProductGallery */

class ProductGallery extends Component {
	constructor(target = '.js-product-gallery') {
		super(target);

		if (!this.component) return;

		this.mainSlider = null;
		this.thumbSlider = null;

		this.init();
	}

	init() {
		const mainSliderElement = this.component?.querySelector('.js-product-gallery__main-slider');
		const thumbSliderElement = this.component?.querySelector('.js-product-gallery__thumb-slider');

		if (!mainSliderElement) return;

		this.mainSlider = new KeenSlider(mainSliderElement, {
			disabled: false,
			drag: false,
			slides: {
				perView: 1,
				spacing: 0,
			},
			breakpoints: {
				'(min-width: 64rem)': {
					disabled: true,
					slides: {
						perView: 99,
					},
				},
			},
			detailsChanged: (s) => {
				s.slides.forEach((element, idx) => {
					element.style.opacity = s.track.details.slides[idx].portion;
					element.style.zIndex = s.track.details.slides[idx].portion + 1;
				});
			},
			renderMode: 'custom',
		});

		if (thumbSliderElement && this.mainSlider) {
			this.thumbSlider = new KeenSlider(
				thumbSliderElement,
				{
					initial: 0,
					disabled: false,
					slides: {
						perView: 4,
						spacing: 10,
					},
					breakpoints: {
						'(min-width: 64rem)': {
							disabled: true,
						},
					},
				},
				[this.ThumbnailPlugin(this.mainSlider)],
			);
		}
	}

	ThumbnailPlugin(main) {
		return (slider) => {
			function removeActive() {
				slider.slides.forEach((slide) => {
					slide.classList.remove('active');
				});
			}

			function addActive(idx) {
				slider.slides[idx].classList.add('active');
			}

			function addClickEvents() {
				slider.slides.forEach((slide, idx) => {
					slide.addEventListener('click', () => {
						main.moveToIdx(idx);
					});
				});
			}

			slider.on('created', () => {
				addActive(slider.track.details.rel);
				addClickEvents();
				main.on('animationStarted', (main) => {
					removeActive();
					const next = main.animator.targetIdx || 0;
					addActive(main.track.absToRel(next));
					slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
				});
			});
		};
	}
}

/** FullscreenSlider */

class FullscreenSlider {
	constructor(mainSelector, footerSelector) {
		this.mainSelector = mainSelector;
		this.footerSelector = footerSelector;
		this.mainSwiper = null;
		this.footerSwiper = null;
		this.headingAnimation = null; // Храним анимацию

		this.init();
	}

	init() {
		this.prepareFirstSlideAnimation();
		this.initMainSlider();
		this.initFooterSlider();
	}

	initMainSlider() {
		this.mainSwiper = new Swiper(this.mainSelector, {
			direction: 'vertical',
			mousewheel: true,
			speed: 800,
			effect: 'creative',
			resistance: false,
			creativeEffect: {
				prev: { translate: [0, 0, -0.5] },
				next: { translate: [0, '100%', 0] },
			},
			on: {
				slideChange: () => this.onSlideChange(),
			},
		});

		this.onSlideChange();
	}

	initFooterSlider() {
		this.footerSwiper = new Swiper(this.footerSelector, {
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			resistance: false,
			mousewheel: {
				releaseOnEdges: true,
			},
			nested: true,
		});
	}

	prepareFirstSlideAnimation() {
		const firstSlide = document.querySelector(`${this.mainSelector} .swiper-slide:first-child`);
		if (!firstSlide) return;

		const heading = firstSlide.querySelector('.fullscreen-slider__slide-heading');
		if (!heading) return;

		const { chars } = anime.text.split(heading, { chars: true, words: true });

		this.headingAnimation = anime.animate(chars, {
			opacity: { from: 0, to: 1 },
			delay: anime.stagger(100),
			ease: 'inQuad',
			autoplay: false,
		});
	}

	onSlideChange() {
		const header = document.querySelector('header');
		if (!header) return;

		const activeSlide = this.mainSwiper.slides[this.mainSwiper.activeIndex];
		if (!activeSlide) return;

		const headerColor = activeSlide.getAttribute('data-header-color') || '';

		header.className = header.className
			.split(' ')
			.filter((c) => !c.startsWith('header--'))
			.join(' ');

		if (headerColor) {
			header.classList.add(`header--${headerColor}`);
		}

		if (this.mainSwiper.activeIndex === 0 && this.headingAnimation) {
			this.headingAnimation.restart();
		}
	}
}

/** FiltersPopup */

class FiltersPopup extends Component {
	constructor(target = '.js-filters-popup') {
		super(target);

		if (!this.component) return;

		this.showTrigger = document.querySelector('.js-filters-popup-show');
		this.hideTrigger = document.querySelector('.js-filters-popup-hide');

		this.init();
	}

	init() {
		this.showTrigger?.addEventListener('click', this.show);
		this.hideTrigger?.addEventListener('click', this.hide);
	}

	destroy() {
		this.showTrigger?.removeEventListener('click', this.show);
		this.hideTrigger?.removeEventListener('click', this.hide);
	}

	show = () => {
		this.component.classList.add('is-active');
	};

	hide = () => {
		this.component.classList.remove('is-active');
	};
}

/** Ranger */
class Ranger extends Component {
	constructor(target = '.js-ranger') {
		super(target);

		if (!this.component) return;

		this.state = {
			minValue: 0,
			maxValue: 100,
		};

		this.slider = this.component.querySelector('.js-ranger__slider');
		this.value = this.component.querySelector('.js-ranger__value');
		this.inputMin = this.component.querySelector('.js-ranger__input-min');
		this.inputMax = this.component.querySelector('.js-ranger__input-max');

		this.init();
	}

	init() {
		this.state.minValue = Number(this.inputMin.value);
		this.state.minValue = Number(this.inputMax.value);

		noUiSlider.create(this.slider, {
			start: [this.state.minValue, this.state.maxValue],
			connect: true,
			range: {
				min: this.state.minValue,
				max: this.state.maxValue,
			},
		});

		this.slider.noUiSlider.on('update', (values) => {
			const min = Math.round(values[0]);
			const max = Math.round(values[1]);

			this.value.textContent = `Цены: ${min} ₽ – ${max} ₽`;

			this.inputMin.value = min;
			this.inputMax.value = max;
		});

		this.inputMin.addEventListener('change', () => {
			let val = Number(this.inputMin.value);
			let maxVal = Number(this.inputMax.value);
			if (val < 0) val = 0;
			if (val > maxVal) val = maxVal;
			this.slider.noUiSlider.set([val, null]);
		});

		this.inputMax.addEventListener('change', () => {
			let val = Number(this.inputMax.value);
			let minVal = Number(this.inputMin.value);
			if (val > 100) val = 100;
			if (val < minVal) val = minVal;
			this.slider.noUiSlider.set([null, val]);
		});
	}
}

/**
 * Main function
 */
window.addEventListener('DOMContentLoaded', () => {
	new Menu();
	new FiltersPopup();
	new ProductGallery();
	new FullscreenSlider('#fullscreen-slider', '#fullscreen-slider-footer');

	document.querySelectorAll('.js-tabs').forEach((elem) => new Tabs(elem));
	document.querySelectorAll('.js-detail').forEach((elem) => new Detail(elem));
	document.querySelectorAll('.js-counter').forEach((elem) => new Counter(elem));
	document.querySelectorAll('.js-ranger').forEach((elem) => new Ranger(elem));
	document.querySelectorAll('.js-modal').forEach((elem) => new Modal(elem));

	initFancyboxProductGallery();
	initSmoothScrollLinks();
	initHeaderScrolling();
});
