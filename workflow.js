(() => {
  'use strict';
  const figures = [...document.querySelectorAll('.workflow-figure')];
  if (!figures.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.querySelector('.ambient-field');
  const states = figures.map(figure => {
    const steps = [...figure.querySelectorAll('.workflow > li')];
    if (steps.length < 2) return null;
    steps.forEach((step, index) => {
      step.style.setProperty('--step-delay', `${index * 3}s`);
      step.style.setProperty('--sequence-duration', `${steps.length * 3}s`);
    });
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'workflow-toggle';
    control.textContent = 'Pause Step Animation';
    const caption = figure.querySelector('figcaption');
    caption?.append(control);
    const state = {figure, control, paused:false, visible:false};
    control.addEventListener('click', () => { state.paused = !state.paused; sync(); });
    figure.classList.add('workflow-enhanced');
    return state;
  }).filter(Boolean);
  function sync() {
    const globalPause = ambient?.classList.contains('is-still') || false;
    states.forEach(({figure, control, paused, visible}) => {
      const still = reduced.matches || globalPause;
      figure.classList.toggle('workflow-still', still);
      figure.classList.toggle('workflow-paused', paused || still || document.hidden || !visible);
      control.textContent = paused ? 'Play Step Animation' : 'Pause Step Animation';
      control.setAttribute('aria-pressed', String(paused));
      control.disabled = still;
      control.title = still ? 'Motion is disabled by your system or site preference.' : 'Highlights the existing workflow steps in order; timing is illustrative.';
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = states.find(item => item.figure === entry.target);
        if (state) state.visible = entry.isIntersecting;
      });
      sync();
    }, {threshold:0.15});
    states.forEach(state => observer.observe(state.figure));
  } else states.forEach(state => {state.visible = true;});
  if (ambient && 'MutationObserver' in window) {
    new MutationObserver(sync).observe(ambient, {attributes:true, attributeFilter:['class']});
  }
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
