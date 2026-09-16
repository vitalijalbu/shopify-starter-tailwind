import { gsap } from 'gsap';

function attachMagnetic(el) {
  const move = (e) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;

    let angle = Math.atan2(y, x) * (180 / Math.PI);
    const distance = Math.sqrt(x * x + y * y);
    const rotationIntensity = Math.min(distance / 10, 30);
    angle = Math.sign(angle) * rotationIntensity;
    if (x < 0) angle = -angle;

    gsap.to(el, {
      x: x * 0.2,
      y: y * 0.2,
      rotation: angle * 0.8,
      transformOrigin: 'center center',
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const reset = () => {
    gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.8, ease: 'power2.out' });
  };

  el.addEventListener('mousemove', move);
  el.addEventListener('mouseleave', reset);
}

function initMagnetic() {
  const nodes = document.querySelectorAll('[data-magnetic]');
  nodes.forEach((n) => attachMagnetic(n));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMagnetic);
} else {
  initMagnetic();
}
