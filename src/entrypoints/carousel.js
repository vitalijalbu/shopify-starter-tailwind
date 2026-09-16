import { Swiper } from 'swiper';
import {
	Navigation,
	Pagination,
	Scrollbar,
	FreeMode,
	Autoplay,
} from 'swiper/modules';

window.Swiper = Swiper;
window.SwiperAutoplay = Autoplay;

document.addEventListener('DOMContentLoaded', function () {
	const productCarousels = document.querySelectorAll('.product-carousel');

	productCarousels.forEach((carousel) => {
		new Swiper(carousel, {
			modules: [Navigation, Pagination, Scrollbar, FreeMode],
			direction: 'horizontal',
			slidesPerView: 'auto',
			spaceBetween: 16,
			freeMode: {
				enabled: true,
				sticky: false,
			},
			navigation: {
				nextEl: '.btn-next',
				prevEl: '.btn-prev',
			},
			breakpoints: {
				240: {
					slidesPerView: 1,
					spaceBetween: 12,
				},
				300: {
					slidesPerView: 1.2,
					spaceBetween: 16,
				},
				480: {
					slidesPerView: 1.5,
					spaceBetween: 16,
				},
				640: {
					slidesPerView: 2.5,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 2.5,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 3.2,
					spaceBetween: 16,
				},
				1200: {
					slidesPerView: 3.2,
					spaceBetween: 28,
				},
				1400: {
					slidesPerView: 3.2,
					spaceBetween: 16,
				},
				1500: {
					slidesPerView: 4.5,
					spaceBetween: 16,
				},
				2000: {
					slidesPerView: 5.2,
					spaceBetween: 16,
				},
			},
			mousewheel: {
				forceToAxis: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			touchRatio: 1,
			touchAngle: 45,
			grabCursor: true,
		});
	});

	const heroCarousels = document.querySelectorAll('.hero-carousel');

	heroCarousels.forEach((carousel) => {
		new Swiper(carousel, {
			modules: [Navigation, Pagination],

			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,

			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},

			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},

			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				dynamicBullets: true,
			},

			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
		});
	});

	const thumbCarousels = document.querySelectorAll('.thumb-carousel');

	thumbCarousels.forEach((carousel) => {
		new Swiper(carousel, {
			modules: [FreeMode, Navigation],

			direction: 'horizontal',
			slidesPerView: 'auto',
			spaceBetween: 8,
			freeMode: true,
			watchSlidesProgress: true,

			breakpoints: {
				300: {
					slidesPerView: 3,
					spaceBetween: 6,
				},
				640: {
					slidesPerView: 4,
					spaceBetween: 8,
				},
				768: {
					slidesPerView: 6,
					spaceBetween: 10,
				},
				1024: {
					slidesPerView: 8,
					spaceBetween: 12,
				},
			},
		});
	});
});

export { Swiper };
