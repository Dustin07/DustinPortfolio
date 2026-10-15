/* Progressive motion never delays filtering or hides content pending JavaScript. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const disabled = () => reduced.matches || document.hidden || document.documentElement.classList.contains('motion-disabled');
  const targets = document.querySelectorAll('.featured-card, .timeline-card, .skills > div, .related-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      if (!disabled()) target.classList.add('motion-enter');
      observer.unobserve(target);
    });
  }, {threshold:0.12});
  targets.forEach(target => observer.observe(target));

  const cards = [...document.querySelectorAll('.project-card')];
  const running = new Set();
  let before = new Map(), frame = 0;
  const cancel = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    running.forEach(animation => animation.cancel());
    running.clear();
  };
  document.addEventListener('portfolio:before-filter', () => {
    cancel();
    before = new Map();
    if (disabled()) return;
    cards.filter(card => !card.hidden).forEach(card => before.set(card, card.getBoundingClientRect()));
  });
  document.addEventListener('portfolio:filtered', () => {
    if (disabled()) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (disabled()) return;
      // Finish layout reads before starting any animation writes.
      const visible = cards.filter(card => !card.hidden).map(card => ({card, rect:card.getBoundingClientRect()}));
      visible.forEach(({card, rect}) => {
        if (typeof card.animate !== 'function') return;
        const previous = before.get(card);
        const x = previous ? previous.left - rect.left : 0;
        const y = previous ? previous.top - rect.top : 8;
        if (previous && Math.abs(x) < 1 && Math.abs(y) < 1) return;
        const animation = card.animate([
          {transform:'translate(' + x + 'px,' + y + 'px)', opacity:previous ? 1 : .85},
          {transform:'translate(0,0)', opacity:1}
        ], {duration:280, easing:'cubic-bezier(.22,1,.36,1)'});
        running.add(animation);
        animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      });
    });
  });
  document.addEventListener('focusin', cancel);
  document.addEventListener('visibilitychange', () => {if (document.hidden) cancel();});
  if ('MutationObserver' in window) {
    new MutationObserver(() => {
      if (!disabled()) return;
      cancel();
      targets.forEach(target => target.classList.remove('motion-enter'));
    }).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    cancel();
    observer.disconnect();
    targets.forEach(target => target.classList.remove('motion-enter'));
  });
})();
