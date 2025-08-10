/* globals KeenSlider, noUiSlider, Fancybox, Swiper, anime */

/**
 * Components
 *
 * 01.Menu
 * 02.Detail
 * 03.Counter
 * 04.Product gallery
 * 05.Fullscreen slider
 * 07.Filters popup
 */

// Menu component
class Menu {
	constructor(target = '.js-menu') {
		this.menu = target instanceof HTMLElement ? target : document.querySelector(target);
		if (!this.menu) return;

		this.state = {
			isShow: false,
		};

		this.menuHoverTriggers = this.menu.querySelectorAll('.js-menu__hover-trigger');
		this.menuHideTriggers = this.menu.querySelectorAll('.js-menu__hide-trigger');
		this.menuBurger = document.querySelector('.js-menu-burger');
		this.header = document.querySelector('.js-header');

		this.destroy = this.destroy.bind(this);
		this.toggle = this.toggle.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.init();
	}

	init() {
		this?.menuBurger.addEventListener('click', this.toggle);
		this?.menuHideTriggers.forEach((trigger) => {
			trigger.addEventListener('click', this.hide);
		});

		this?.menuHoverTriggers.forEach((trigger) => {
			trigger.addEventListener('mouseenter', () => {
				if (this.header) this.header.classList.add('is-hovered');
			});
			trigger.addEventListener('mouseleave', () => {
				if (this.header) this.header.classList.remove('is-hovered');
			});
		});
	}

	destroy() {
		this?.menuBurger.removeEventListener('click', this.toggle);
		this?.menuHideTriggers.forEach((trigger) => {
			trigger.removeEventListener('click', this.hide);
		});
	}

	toggle() {
		if (this.state.isShow) {
			this.hide();
		} else {
			this.show();
		}
	}

	show() {
		this.state.isShow = true;
		this.menuBurger.classList.add('is-active');
		this.header.classList.add('is-active');
		this.menu.classList.add('is-active');
		this.body.classList.add('is-lock');
	}

	hide() {
		this.state.isShow = false;
		this.menuBurger.classList.remove('is-active');
		this.header.classList.remove('is-active');
		this.menu.classList.remove('is-active');
		this.body.classList.remove('is-lock');
	}
}

// Detail component
class Detail {
	constructor(target = '.js-detail') {
		this.detail = target instanceof HTMLElement ? target : document.querySelector(target);
		if (!this.detail) return;

		this.state = {
			isShow: false,
		};

		this.detailButton = this.detail.querySelector('.js-detail__button');
		this.detailBody = this.detail.querySelector('.js-detail__body');

		this.destroy = this.destroy.bind(this);
		this.toggle = this.toggle.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.init();
	}

	init() {
		if (this.detail.getAttribute('data-detail-initial-state') === 'show') {
			this.state.isShow = true;
		} else {
			anime.animate(this.detailBody, {
				height: 0,
				duration: 0,
			});
		}

		this.detailButton.addEventListener('click', this.toggle);
	}

	destroy() {
		anime.animate(this.detailBody, {
			height: (elem) => elem.scrollHeight,
			duration: 0,
		});

		this.detailButton.removeEventListener('click', this.toggle);
	}

	toggle() {
		if (this.state.isShow) {
			this.hide();
		} else {
			this.show();
		}
	}

	hide() {
		this.state.isShow = false;
		this.detailButton.classList.remove('is-active');
		this.detailBody.classList.remove('is-active');

		anime.animate(this.detailBody, {
			height: 0,
			duration: 200,
		});
	}

	show() {
		this.state.isShow = true;
		this.detailButton.classList.add('is-active');
		this.detailBody.classList.add('is-active');

		anime.animate(this.detailBody, {
			height: (elem) => elem.scrollHeight,
			duration: 200,
		});
	}
}

// Counter component
class Counter {
	constructor(target = '.js-counter') {
		this.counter = target instanceof HTMLElement ? target : document.querySelector(target);
		if (!this.counter) return;

		this.state = {
			value: 0,
		};

		this.counterIncrease = this.counter.querySelector('.js-counter__increase');
		this.counterDecrease = this.counter.querySelector('.js-counter__decrease');
		this.counterValue = this.counter.querySelector('.js-counter__value');

		this.increase = this.increase.bind(this);
		this.decrease = this.decrease.bind(this);

		this.init();
	}

	init() {
		if (!this.counterValue) return;

		this.state.value = Number(this.counterValue.value) || 0;

		this?.counterIncrease?.addEventListener('click', this.increase);
		this?.counterDecrease?.addEventListener('click', this.decrease);
	}

	destroy() {
		this?.counterIncrease?.removeEventListener('click', this.increase);
		this?.counterDecrease?.removeEventListener('click', this.decrease);
	}

	increase() {
		if (!this.counterValue) return;

		this.state.value += 1;
		this.counterValue.value = this.state.value;
	}

	decrease() {
		if (!this.counterValue || this.state.value <= 0) return;

		this.state.value -= 1;
		this.counterValue.value = this.state.value;
	}
}

// Product gallery component
class ProductGallery {
	constructor(target = '.js-product-gallery') {
		this.gallery = target instanceof HTMLElement ? target : document.querySelector(target);
		if (!this.gallery) return;

		this.mainSlider = null;
		this.thumbSlider = null;

		this.init();
	}

	init() {
		const mainSliderElement = this.gallery.querySelector('.js-product-gallery__main-slider');
		const thumbSliderElement = this.gallery.querySelector('.js-product-gallery__thumb-slider');

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

// Fullscreen slider
class FullscreenSlider {
	constructor(mainSelector, footerSelector) {
		this.mainSelector = mainSelector;
		this.footerSelector = footerSelector;
		this.mainSwiper = null;
		this.footerSwiper = null;

		this.init();
	}

	init() {
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

		if (this.mainSwiper.activeIndex === 0) {
			this.animateFirstSlide(activeSlide);
		}
	}

	animateFirstSlide(slide) {
		const heading = slide.querySelector('.fullscreen-slider__slide-heading');
		const { chars } = anime.text.split(heading, { chars: true });

		anime.animate(chars, {
			x: {
				from: '50%',
			},
			opacity: {
				from: 0,
				to: 1,
			},
			delay: anime.stagger(50),
			ease: 'inOutQuad',
		});
	}
}

// Filters popup
class FiltersPopup {
	constructor(target = '.js-filters-popup') {
		this.popup = target instanceof HTMLElement ? target : document.querySelector(target);
		if (!this.popup) return;

		this.showTrigger = document.querySelector('.js-filters-popup-show');
		this.hideTrigger = document.querySelector('.js-filters-popup-hide');

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.init();
	}

	init() {
		this.showTrigger.addEventListener('click', this.show);
		this.hideTrigger.addEventListener('click', this.hide);
	}

	destroy() {
		this.showTrigger.removeEventListener('click', this.show);
		this.hideTrigger.removeEventListener('click', this.hide);
	}

	show() {
		this.popup.classList.add('is-active');
	}

	hide() {
		this.popup.classList.remove('is-active');
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

	document.querySelectorAll('.js-detail').forEach((elem) => new Detail(elem));
	document.querySelectorAll('.js-counter').forEach((elem) => new Counter(elem));

	Fancybox.bind('[data-fancybox="product-gallery"]', {
		Carousel: {
			Video: {
				html5videoTpl: `
					<video class="f-html5video" playsinline loop muted poster="{{poster}}">
						<source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.
					</video>
				`,
			},
		},
	});

	window.addEventListener('scroll', () => {
		const header = document.querySelector('.js-header');
		if (window.scrollY > 5) {
			header.classList.add('is-scrolled');
		} else {
			header.classList.remove('is-scrolled');
		}
	});

	const ranger = document.querySelector('.js-ranger');

	if (ranger) {
		const rangerSlider = ranger.querySelector('.js-ranger__slider');
		const rangerValue = ranger.querySelector('.js-ranger__value');
		const rangerInputMin = ranger.querySelector('.js-ranger__input-min');
		const rangerInputMax = ranger.querySelector('.js-ranger__input-max');

		const startMin = Number(rangerInputMin.value) || 0;
		const startMax = Number(rangerInputMax.value) || 100;

		noUiSlider.create(rangerSlider, {
			start: [startMin, startMax],
			connect: true,
			range: {
				min: startMin,
				max: startMax,
			},
		});

		rangerSlider.noUiSlider.on('update', (values) => {
			const min = Math.round(values[0]);
			const max = Math.round(values[1]);

			rangerValue.textContent = `Цены: ${min} ₽ – ${max} ₽`;

			rangerInputMin.value = min;
			rangerInputMax.value = max;
		});

		rangerInputMin.addEventListener('change', () => {
			let val = Number(rangerInputMin.value);
			let maxVal = Number(rangerInputMax.value);
			if (val < 0) val = 0;
			if (val > maxVal) val = maxVal;
			rangerSlider.noUiSlider.set([val, null]);
		});

		rangerInputMax.addEventListener('change', () => {
			let val = Number(rangerInputMax.value);
			let minVal = Number(rangerInputMin.value);
			if (val > 100) val = 100;
			if (val < minVal) val = minVal;
			rangerSlider.noUiSlider.set([null, val]);
		});
	}
});
