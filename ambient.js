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
  let pending = false;
  const update = () => {
    pending = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    field.style.setProperty('--flow-x', reducedMotion.matches ? '0px' : `${Math.sin(progress * Math.PI) * 24}px`);
    field.style.setProperty('--flow-y', reducedMotion.matches ? '0px' : `${progress * -55}px`);
  };
  const schedule = () => {
    if (document.hidden || reducedMotion.matches) return;
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', update);
  const visibility = () => {
    field.classList.toggle('is-paused', document.hidden);
    if (!document.hidden) update();
  };
  document.addEventListener('visibilitychange', visibility);
  visibility();
  update();
})();
