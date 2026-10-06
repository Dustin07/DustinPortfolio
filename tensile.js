(() => {
  'use strict';
  const demo = document.querySelector('.tensile-demo');
  if (!demo) return;
  const control = demo.querySelector('.tensile-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, visible = true;
  const sync = () => {
    demo.classList.toggle('is-paused', paused || reduced.matches || document.hidden || !visible);
    demo.classList.toggle('is-still', reduced.matches);
    control.textContent = paused ? 'Play Animation' : 'Pause Animation';
    control.setAttribute('aria-pressed', String(paused));
    control.disabled = reduced.matches;
    control.title = reduced.matches ? 'Your system preference disables animation.' : 'Also honors the background-motion pause control.';
  };
  control.hidden = false;
  control.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(demo);
  }
  demo.classList.add('is-enhanced');
  sync();
})();
