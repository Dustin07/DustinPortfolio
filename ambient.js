(() => {
  const field = document.createElement('div');
  field.className = 'ambient-field';
  field.setAttribute('aria-hidden', 'true');
  // Decorative airflow-inspired geometry, not a simulation or technical drawing.
  const streamlines = Array.from({ length: 12 }, (_, i) => {
    const y = 115 + i * 62;
    const lift = 150 * Math.exp(-Math.pow((i - 5.5) / 3.8, 2));
    const accent = i === 3 ? 'flow-orange' : i === 8 ? 'flow-maize' : '';
    return `<path class="${accent}" d="M -100 ${y} C 260 ${y}, 350 ${y - lift}, 640 ${y - lift} S 1040 ${y + 70}, 1540 ${y + 30}"/>`;
  }).join('');
  field.innerHTML = `<div class="ambient-flow"><div class="ambient-color"></div><svg class="ambient-streamlines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false"><g fill="none">${streamlines}</g></svg><div class="ambient-glint"></div></div>`;
  document.body.prepend(field);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceKey = 'dustin-portfolio-motion-paused';
  let paused = false;
  try { paused = sessionStorage.getItem(preferenceKey) === 'true'; } catch (_) { /* Motion control also works without storage. */ }
  const footer = document.querySelector('footer');
  const control = footer ? document.createElement('button') : null;
  if (control) {
    control.type = 'button';
    control.className = 'motion-control';
    control.textContent = 'Pause Background Motion';
    footer.append(control);
    control.addEventListener('click', () => {
      paused = !paused;
      try { sessionStorage.setItem(preferenceKey, String(paused)); } catch (_) { /* Storage is optional. */ }
      syncMotion();
    });
  }
  let pending = false;
  const update = () => {
    pending = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    field.style.setProperty('--flow-x', reducedMotion.matches || paused ? '0px' : `${Math.sin(progress * Math.PI) * 24}px`);
    field.style.setProperty('--flow-y', reducedMotion.matches || paused ? '0px' : `${progress * -55}px`);
  };
  const schedule = () => {
    if (document.hidden || reducedMotion.matches || paused) return;
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  const syncMotion = () => {
    field.classList.toggle('is-paused', document.hidden || reducedMotion.matches || paused);
    field.classList.toggle('is-still', reducedMotion.matches || paused);
    if (control) {
      control.setAttribute('aria-pressed', String(paused));
      control.disabled = reducedMotion.matches;
      control.title = reducedMotion.matches ? 'Motion is disabled by your system preference.' : '';
    }
    if (!document.hidden) update();
  };
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
  update();
})();
