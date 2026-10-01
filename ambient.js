(() => {
  const field = document.createElement('div');
  field.className = 'ambient-field';
  field.setAttribute('aria-hidden', 'true');
  field.innerHTML = '<div class="ambient-flow"><div class="ambient-color"></div><div class="ambient-glint"></div></div>';
  document.body.prepend(field);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  const update = () => {
    pending = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    field.style.setProperty('--flow-x', reducedMotion.matches ? '0px' : `${Math.sin(progress * Math.PI * 2) * 65}px`);
    field.style.setProperty('--flow-y', reducedMotion.matches ? '0px' : `${progress * -100}px`);
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  update();
})();

