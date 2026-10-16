/* Site-wide motion preference; the page background stays static. */
(() => {
  const field = document.createElement('div');
  field.className = 'ambient-field';
  field.setAttribute('aria-hidden', 'true');
  document.body.prepend(field);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceKey = 'dustin-portfolio-motion-paused';
  let paused = false;
  try { paused = sessionStorage.getItem(preferenceKey) === 'true'; } catch (_) { /* Storage is optional. */ }
  const footer = document.querySelector('footer');
  const control = footer ? document.createElement('button') : null;
  const syncMotion = () => {
    const still = reducedMotion.matches || paused;
    field.classList.toggle('is-paused', document.hidden || still);
    field.classList.toggle('is-still', still);
    document.documentElement.classList.toggle('motion-disabled', still);
    if (control) {
      control.setAttribute('aria-pressed', String(paused));
      control.disabled = reducedMotion.matches;
      control.title = reducedMotion.matches ? 'Motion is disabled by your system preference.' : '';
    }
  };
  if (control) {
    control.type = 'button';
    control.className = 'motion-control';
    control.textContent = 'Pause Page Animations';
    footer.append(control);
    control.addEventListener('click', () => {
      paused = !paused;
      try { sessionStorage.setItem(preferenceKey, String(paused)); } catch (_) { /* Storage is optional. */ }
      syncMotion();
    });
  }
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
