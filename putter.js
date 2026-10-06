(() => {
  'use strict';
  const demo = document.querySelector('.putter-demo');
  if (!demo) return;
  const control = demo.querySelector('.putter-toggle');
  const buttons = [...demo.querySelectorAll('.putter-stage')];
  const references = [...demo.querySelectorAll('.putter-reference')];
  const paths = [...demo.querySelectorAll('[data-cut-path]')];
  const cutter = demo.querySelector('[data-cutter]');
  const stock = demo.querySelector('[data-stock]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.querySelector('.ambient-field');
  const lengths = paths.map(path => path.getTotalLength());
  let elapsed = 0, last = null, frame = null, paused = false, visible = true;
  const blocked = () => paused || reduced.matches || document.hidden || !visible ||
    ambient?.classList.contains('is-paused') || document.documentElement.classList.contains('figure-viewer-open');
  const render = () => {
    const step = Math.floor(elapsed / 4000) % 3;
    const progress = Math.min(1, (elapsed % 4000) / 3200);
    demo.dataset.step = String(step);
    paths.forEach((path, i) => {
      path.style.opacity = i === step ? '1' : '0';
      path.style.strokeDasharray = String(lengths[i]);
      path.style.strokeDashoffset = String(lengths[i] * (1 - progress));
    });
    const point = paths[step].getPointAtLength(lengths[step] * progress);
    cutter.setAttribute('transform', `translate(${point.x} ${point.y})`);
    cutter.style.opacity = reduced.matches ? '0' : '1';
    stock.style.opacity = step === 0 ? String(.55 * (1 - progress)) : '0';
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === step)));
    references.forEach((reference, i) => { reference.hidden = i !== step; });
  };
  const tick = time => {
    frame = null;
    if (blocked()) { last = null; return; }
    if (last !== null) elapsed = (elapsed + Math.min(time - last, 100)) % 12000;
    last = time;
    render();
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; last = null;
    control.textContent = paused ? 'Play Animation' : 'Pause Animation';
    control.disabled = reduced.matches;
    control.title = reduced.matches ? 'Animation is disabled by your reduced-motion preference. Select an operation to inspect it.' : 'Select an operation to pause and inspect it.';
    if (reduced.matches) render();
    if (!blocked()) frame = requestAnimationFrame(tick);
  };
  control.hidden = false;
  control.addEventListener('click', () => { paused = !paused; sync(); });
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    paused = true; elapsed = i * 4000 + 3200; render(); sync();
  }));
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }).observe(demo);
  if (ambient) new MutationObserver(sync).observe(ambient, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  demo.classList.add('is-enhanced'); render(); sync();
})();
