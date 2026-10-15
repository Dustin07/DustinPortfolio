/* Progressive entrances: content remains readable if enhancement is unavailable. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.featured-card, .timeline-card, .skills > div, .related-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      if (!reduced.matches) target.classList.add('motion-enter');
      observer.unobserve(target);
    });
  }, {threshold:0.12});
  targets.forEach(target => observer.observe(target));
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    targets.forEach(target => target.classList.remove('motion-enter'));
  });
})();
