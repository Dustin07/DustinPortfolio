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
  const fixture = demo.querySelector('[data-fixture]');
  const supports = demo.querySelector('[data-supports]');
  const part = demo.querySelector('[data-part]');
  const ribs = demo.querySelector('[data-ribs]');
  const hole = demo.querySelector('[data-hole]');
  const cleanup = demo.querySelector('[data-cleanup]');
  const preparation = demo.querySelector('[data-preparation]');
  const label = demo.querySelector('[data-stage-label]');
  const labels = ['Prepare the Stock', 'Secure the Workpiece', 'Machine the Bottom', 'Machine the Top & Shaft Hole', 'Remove the Support Tubes', 'Deburr, Polish & Inspect'];
  const duration = 3000, cycle = duration * buttons.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.querySelector('.ambient-field');
  const lengths = paths.map(path => path.getTotalLength());
  let elapsed = 0, last = null, frame = null, paused = false, visible = true;
  const blocked = () => paused || reduced.matches || document.hidden || !visible ||
    ambient?.classList.contains('is-paused') || document.documentElement.classList.contains('figure-viewer-open');
  const render = () => {
    const step = Math.floor(elapsed / duration) % buttons.length;
    const progress = Math.min(1, (elapsed % duration) / 2400);
    demo.dataset.step = String(step);
    label.textContent = labels[step];
    const pathIndex = step === 2 ? 0 : step === 3 ? (progress < .72 ? 1 : 2) : -1;
    const pathProgress = step === 3 ? (pathIndex === 1 ? progress / .72 : (progress - .72) / .28) : progress;
    paths.forEach((path, i) => {
      path.style.opacity = i === pathIndex ? '1' : '0';
      path.style.strokeDasharray = String(lengths[i]);
      path.style.strokeDashoffset = String(lengths[i] * (1 - pathProgress));
    });
    if (pathIndex >= 0) {
      const point = paths[pathIndex].getPointAtLength(lengths[pathIndex] * pathProgress);
      cutter.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }
    cutter.style.opacity = !reduced.matches && pathIndex >= 0 ? '1' : '0';
    stock.style.opacity = step === 0 ? '1' : step === 1 ? '.6' : step === 2 ? String(.6 * (1 - progress)) : '0';
    preparation.style.opacity = step === 0 ? '1' : '0';
    preparation.setAttribute('transform', `translate(0 ${step === 0 ? progress * 200 : 0})`);
    fixture.style.opacity = step === 0 || step === 5 ? '0' : step === 4 ? String(1 - progress) : '1';
    fixture.setAttribute('transform', `translate(${step === 1 ? -25 * (1 - progress) : 0} 0)`);
    supports.style.opacity = step === 0 || step === 5 ? '0' : step === 4 ? String(1 - progress) : '1';
    part.style.opacity = step === 0 ? '0' : step === 1 ? '.3' : '1';
    part.setAttribute('transform', `translate(${step === 4 ? progress * 18 : step === 5 ? 18 : 0} 0)`);
    ribs.style.opacity = step >= 3 ? '1' : '0';
    hole.style.opacity = step >= 4 || (step === 3 && progress >= .72) ? '1' : '0';
    cleanup.style.opacity = step === 4 ? String(1 - progress) : '0';
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === step)));
    references.forEach((reference, i) => { reference.hidden = i !== step; });
  };
  const tick = time => {
    frame = null;
    if (blocked()) { last = null; return; }
    if (last !== null) elapsed = (elapsed + Math.min(time - last, 100)) % cycle;
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
    paused = true; elapsed = i * duration + 2400; render(); sync();
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
