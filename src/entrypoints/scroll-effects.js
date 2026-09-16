/**
 * ScrollSmoother e effetti scroll personalizzati
 * Gestisce gli attributi data-scroll="effect-name-here"
 */

class ScrollEffects {
  constructor() {
    this.smoother = null;
    this.effects = new Map();
    this.init();
  }

  init() {
    // Aspetta che il DOM sia completamente caricato E che GSAP sia disponibile
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.waitForGSAP());
    } else {
      this.waitForGSAP();
    }
  }

  waitForGSAP() {
    // Aspetta che GSAP sia disponibile
    if (
      typeof window.gsap === "undefined" ||
      typeof window.ScrollTrigger === "undefined"
    ) {
      setTimeout(() => this.waitForGSAP(), 100);
      return;
    }
    this.setup();
  }

  setup() {
    try {
      // Crea riferimenti locali alle librerie GSAP
      window.gsap = window.gsap;
      window.ScrollTrigger = window.ScrollTrigger;
      window.ScrollSmoother = window.ScrollSmoother;

      this.initScrollSmoother();
      this.registerEffects();
      this.applyEffects();
    } catch (error) {
      console.error("Error initializing ScrollEffects:", error);
    }
  }

  initScrollSmoother() {
    // Verifica che gli elementi necessari esistano
    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");

    if (!wrapper || !content) {
      console.warn(
        "ScrollSmoother: wrapper or content elements not found. Using ScrollTrigger only."
      );
      return;
    }

    // ScrollSmoother potrebbe non essere disponibile nella versione gratuita di GSAP
    // Proviamo a crearlo, ma se fallisce usiamo solo ScrollTrigger
    try {
      if (typeof ScrollSmoother !== "undefined" && ScrollSmoother.create) {
        this.smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
        });
      } else {
        console.warn("ScrollSmoother not available. Using ScrollTrigger only.");
      }
    } catch (error) {
      console.warn(
        "ScrollSmoother initialization failed, using ScrollTrigger only:",
        error
      );
    }
  }

  registerEffects() {
    // Effetto fade-in
    this.effects.set("fade-in", (element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto slide-up
    this.effects.set("slide-up", (element) => {
      gsap.fromTo(
        element,
        { x: 0, y: 100, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto slide-left
    this.effects.set("slide-left", (element) => {
      gsap.fromTo(
        element,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto slide-right
    this.effects.set("slide-right", (element) => {
      gsap.fromTo(
        element,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto parallax per le immagini
    this.effects.set("parallax", (element) => {
      gsap.to(element, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Effetto parallax delicato specifico per immagini hero
    this.effects.set("hero-parallax", (element) => {
      gsap.set(element, { scale: 1.1, transformOrigin: "center center" });
      gsap.to(element, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Effetto zoom-in per le immagini
    this.effects.set("zoom-in", (element) => {
      gsap.fromTo(
        element,
        { scale: 1.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto: scala solo l'immagine interna quando entra in viewport
    // Uso: aggiungi data-scroll="hero-image-scale" al container dell'immagine
    this.effects.set("hero-image-scale", (element) => {
      // Cerca una img interna comune (supporta <picture><img>)
      const media =
        element.querySelector(":scope picture img") ||
        element.querySelector(":scope > img") ||
        element.querySelector("img");
      if (!media) return;

      // Pre-set per evitare flicker
      gsap.set(media, { scale: 1.2, transformOrigin: "center center" });

      gsap.to(media, {
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "top center",
          scrub: 2,
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      });
    });

    // Effetto stagger per elementi multipli
    this.effects.set("stagger", (element) => {
      const children = element.children;
      gsap.fromTo(
        children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto per singola card prodotto/brand: anima i figli (per non confliggere con hover scale del wrapper)
    this.effects.set("product-card", (element) => {
      if (element.getAttribute("data-pc-init")) return;
      element.setAttribute("data-pc-init", "true");

      // Proviamo a trovare coppie comuni: immagine + contenuto
      const items = [];
      const imageLike =
        element.querySelector(":scope > a") ||
        element.querySelector(
          ":scope > .bg-white, :scope > .image, :scope > .card-media, :scope > .p-4, :scope > .pt-4"
        );
      const contentLike =
        element.querySelector(":scope > .mt-3") ||
        element.querySelector(
          ":scope > .p-6, :scope > .content, :scope > .card-content"
        );

      if (imageLike) items.push(imageLike);
      if (contentLike) items.push(contentLike);

      // Fallback: se non trovate, anima tutti i figli diretti non script/style
      let fallbackUsed = false;
      if (items.length === 0) {
        const directChildren = Array.from(element.children).filter(
          (c) => c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
        );
        if (directChildren.length) {
          items.push(...directChildren);
          fallbackUsed = true;
        }
      }

      if (items.length === 0) return;

      // Nascondi il wrapper per evitare "skeleton" grigio prima dell'animazione
      gsap.set(element, { autoAlpha: 0 });

      // Pre-set iniziale per evitare flicker al primo paint (solo figli)
      gsap.set(items, {
        autoAlpha: 0,
        opacity: 0,
        y: 24,
        willChange: "transform, opacity",
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Mostra il wrapper subito all'avvio della timeline
      tl.to(element, { autoAlpha: 1, duration: 0.001 });

      // Anima i figli con stagger
      tl.to(
        items,
        {
          autoAlpha: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: fallbackUsed ? 0.04 : 0.05,
        },
        0
      );
    });

    // Effetto rotate per elementi decorativi
    this.effects.set("rotate", (element) => {
      gsap.fromTo(
        element,
        { rotation: -10, opacity: 0 },
        {
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Effetto text-reveal per testi
    this.effects.set("text-reveal", (element) => {
      const text = element.textContent;
      const words = text.trim().split(/\s+/);
      element.innerHTML = words
        .map((w) => `<span class="word">${w}</span>`)
        .join(" ");
      const wordSpans = element.querySelectorAll(".word");
      gsap.fromTo(
        wordSpans,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Nuovo effetto: slide-rotate-up
    this.effects.set("slide-rotate-up", (element) => {
      if (!element.getAttribute("data-sru-init")) {
        const txt = element.textContent;
        const words = txt.trim().split(/\s+/);
        element.innerHTML = words
          .map(
            (w) =>
              `<span class="sru-clip"><span class="sru-word">${w}</span></span>`
          )
          .join(" ");
        element.setAttribute("data-sru-init", "true");
      }

      const clips = element.querySelectorAll(".sru-clip");
      gsap.set(clips, { display: "inline-block", overflow: "hidden" });
      const wordsEls = element.querySelectorAll(".sru-word");
      gsap.set(wordsEls, {
        display: "inline-block",
        yPercent: 120,
        rotation: 15,
        transformOrigin: "left bottom",
      });

      gsap.to(wordsEls, {
        yPercent: 0,
        rotation: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  applyEffects() {
    // Trova tutti gli elementi con data-scroll e applica l'effetto registrato
    const elements = document.querySelectorAll("[data-scroll]");
    elements.forEach((element) => {
      const effectName = element.getAttribute("data-scroll");
      const effect = this.effects.get(effectName);
      if (effect) {
        effect(element);
      } else {
        console.warn(`Effect "${effectName}" not found for element:`, element);
      }
    });
  }

  // Metodo per refresh degli effetti (utile per contenuto dinamico)
  refresh() {
    ScrollTrigger.refresh();
    if (this.smoother) {
      this.smoother.scrollTop(0);
    }
  }

  // Metodo per disabilitare temporaneamente gli effetti
  disable() {
    ScrollTrigger.killAll();
    if (this.smoother) {
      this.smoother.kill();
    }
  }
}

// Inizializza automaticamente quando il modulo viene importato
const scrollEffects = new ScrollEffects();

// Esporta l'istanza per uso esterno se necessario
window.ScrollEffects = scrollEffects;

export default scrollEffects;
