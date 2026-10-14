(() => {
  'use strict';
  const demo = document.querySelector('.tensile-demo');
  if (!demo) return;
  const control = demo.querySelector('.tensile-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.querySelector('.ambient-field');
  let paused = false, visible = true;
  const sync = () => {
    const pagePaused = ambient?.classList.contains('is-still') || false;
    demo.classList.toggle('is-paused', paused || reduced.matches || pagePaused || document.hidden || !visible);
    demo.classList.toggle('is-still', reduced.matches);
    control.textContent = paused ? 'Play Animation' : 'Pause Animation';
    control.setAttribute('aria-pressed', String(paused));
    control.disabled = reduced.matches || pagePaused;
    control.title = reduced.matches ? 'Your system preference disables animation.' : pagePaused ? 'Resume page animations in the footer to use this control.' : 'Also honors the page animation control in the footer.';
  };
  control.hidden = false;
  control.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if (ambient && 'MutationObserver' in window) {
    new MutationObserver(sync).observe(ambient, {attributes:true, attributeFilter:['class']});
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(demo);
  }
  demo.classList.add('is-enhanced');
  sync();
})();
