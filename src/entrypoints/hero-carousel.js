/**
 * Hero Carousel Component
 * Gestisce l'animazione infinita del carousel nelle sezioni hero
 */

class HeroCarousel {
	constructor(carouselId, options = {}) {
		this.carouselId = carouselId;
		this.carousel = document.getElementById(carouselId);
		this.options = {
			duration: options.duration || 30,
			ease: options.ease || 'none',
			...options,
		};

		this.init();
	}

	init() {
		if (!this.carousel || !window.gsap) {
			console.warn(
				`Carousel ${this.carouselId} non trovato o GSAP non disponibile`,
			);
			return;
		}

		this.setupAnimation();
	}

	setupAnimation() {
		const carouselWidth = this.carousel.scrollWidth / 2;

		// GSAP infinite scroll animation
		gsap.to(this.carousel, {
			x: -carouselWidth,
			ease: this.options.ease,
			duration: this.options.duration,
			repeat: -1,
			modifiers: {
				x: gsap.utils.unitize((x) => parseFloat(x) % carouselWidth),
			},
		});
	}

	// Metodo per fermare l'animazione
	pause() {
		if (this.carousel) {
			gsap.set(this.carousel, { animationPlayState: 'paused' });
		}
	}

	// Metodo per riprendere l'animazione
	play() {
		if (this.carousel) {
			gsap.set(this.carousel, { animationPlayState: 'running' });
		}
	}
}

// Auto-inizializzazione per carousel hero
document.addEventListener('DOMContentLoaded', function () {
	// Cerca tutti i carousel hero nella pagina
	const heroCarousels = document.querySelectorAll('[id*="carousel-"]');

	heroCarousels.forEach((carousel) => {
		const carouselId = carousel.id;

		// Inizializza il carousel con impostazioni specifiche basate sul tipo
		if (
			carouselId.includes('festival-carousel') ||
			carouselId.includes('event-carousel')
		) {
			new HeroCarousel(carouselId, {
				duration: 30, // Durata più lenta per una migliore visualizzazione delle immagini
			});
		} else if (carouselId.includes('logos-carousel')) {
			new HeroCarousel(carouselId, {
				duration: 20, // Durata più veloce per i loghi
			});
		}
	});
});

// Esporta la classe per uso esterno
window.HeroCarousel = HeroCarousel;
