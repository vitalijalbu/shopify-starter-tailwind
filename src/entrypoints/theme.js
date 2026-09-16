import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import Swiper from "swiper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Register GSAP plugins PRIMA di tutto
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Make GSAP available globally SUBITO
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollSmoother = ScrollSmoother;

// Import altri moduli DOPO aver configurato GSAP
import "./carousel.js";
import "./hero-carousel.js";
import "./magnetic-hover.js";
import "./page-hero-canvas.js";
import NewsletterAC from "./newsletter.js";
import {
  Navigation,
  Pagination,
  Autoplay,
  Thumbs,
  EffectFade,
} from "swiper/modules";

// Configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay, Thumbs, EffectFade]);

// Make Swiper globally available
window.Swiper = Swiper;

// Inizializza Alpine.js
window.Alpine = Alpine;
Alpine.plugin(focus);

// Store globali Alpine.js per il tema
Alpine.store("cart", {
  itemCount: 0, // Solo per il badge nel menu
});

Alpine.store("theme", {
  mobileMenuOpen: false,
  searchOpen: false,

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  },

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
  },
});

// Assicurati che themeApp sia disponibile anche prima di Alpine init
window.themeApp =
  window.themeApp ||
  (() => ({
    mobileMenuOpen: false,
    searchOpen: false,
    cartOpen: false,

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },
    toggleSearch() {
      this.searchOpen = !this.searchOpen;
    },
    closeSearch() {
      this.searchOpen = false;
    },
    toggleCart() {
      this.cartOpen = !this.cartOpen;
    },
    closeCart() {
      this.cartOpen = false;
    },

    init() {
      console.log("Theme app initialized");
    },
  }));

// Funzione init globale per compatibilità
window.init =
  window.init ||
  // Componenti Alpine.js personalizzati
  document.addEventListener("alpine:init", () => {
    // Componente principale dell'app
    Alpine.init();

    // Definizione della funzione themeApp globale
    window.themeApp = () => ({
      // Store del tema
      mobileMenuOpen: false,
      searchOpen: false,
      cartOpen: false,

      // Metodi per gestire il menu mobile
      toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      },

      closeMobileMenu() {
        this.mobileMenuOpen = false;
      },

      // Metodi per gestire la ricerca
      toggleSearch() {
        this.searchOpen = !this.searchOpen;
      },

      closeSearch() {
        this.searchOpen = false;
      },

      // Metodi per gestire il carrello
      toggleCart() {
        this.cartOpen = !this.cartOpen;
      },

      closeCart() {
        this.cartOpen = false;
      },

      // Metodo di inizializzazione
      init() {
        console.log("Theme app initialized");

        // Chiudi menu mobile quando si clicca fuori
        this.$nextTick(() => {
          document.addEventListener("click", (e) => {
            if (!e.target.closest("[x-data]") && this.mobileMenuOpen) {
              this.mobileMenuOpen = false;
            }
          });
        });
      },
    });

    Alpine.data("productForm", () => ({
      selectedVariant: null,
      quantity: 1,

      init() {
        this.selectedVariant = this.$el.querySelector('[name="id"]')?.value;
      },

      updateVariant(variantId) {
        this.selectedVariant = variantId;
      },

      addToCart() {
        // Logica per aggiungere al carrello
        console.log("Adding to cart:", {
          variant: this.selectedVariant,
          quantity: this.quantity,
        });
      },
    }));

    Alpine.data("productGallery", () => ({
      activeIndex: 0,

      setActive(index) {
        this.activeIndex = index;
      },

      next() {
        const images = this.$refs.gallery.children;
        this.activeIndex = (this.activeIndex + 1) % images.length;
      },

      prev() {
        const images = this.$refs.gallery.children;
        this.activeIndex =
          this.activeIndex === 0 ? images.length - 1 : this.activeIndex - 1;
      },
    }));
  });

// Avvia Alpine.js
Alpine.start();

// Event listeners per Shopify
document.addEventListener("DOMContentLoaded", () => {
  // Sticky Header functionality
  const header = document.querySelector('header[role="banner"]');
  let lastScrollY = window.scrollY;
  let isScrollingDown = false;

  if (header) {
    // Funzione per gestire lo scroll dell'header
    function handleHeaderScroll() {
      const currentScrollY = window.scrollY;

      // Determina la direzione dello scroll
      isScrollingDown = currentScrollY > lastScrollY;

      // Se si sta scrollando verso il basso e si è scesi di almeno 100px
      if (isScrollingDown && currentScrollY > 100) {
        header.classList.add("header-scrolled");
        header.classList.remove("header-top");
      }
      // Se si sta scrollando verso l'alto o si è in cima
      else if (!isScrollingDown || currentScrollY <= 50) {
        header.classList.remove("header-scrolled");
        header.classList.add("header-top");
      }

      lastScrollY = currentScrollY;
    }

    // Throttle function per migliorare le performance
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleHeaderScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Aggiungi event listener per lo scroll
    window.addEventListener("scroll", requestTick, { passive: true });

    // Inizializza lo stato dell'header
    header.classList.add("header-top");
  }

  // Listener per aggiornamenti del carrello
  document.addEventListener("cart:updated", (event) => {
    console.log("Cart updated:", event.detail);
  });

  // Listener per varianti prodotto
  document.addEventListener("variant:changed", (event) => {
    console.log("Variant changed:", event.detail);
  });

  // Inizializza Newsletter ActiveCampaign
  new NewsletterAC();

  // Inizializza gli effetti scroll DOPO che tutto il DOM è pronto
  import("./scroll-effects.js")
    .then(() => {})
    .catch((error) => {
      console.error("Error loading scroll effects:", error);
    });
});
