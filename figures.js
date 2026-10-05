(() => {
  'use strict';
  const images = [...document.querySelectorAll('.case-content .engineering-figure img, .case-content .engineering-figure svg')];
  if (!images.length || typeof HTMLDialogElement === 'undefined' ||
      typeof HTMLDialogElement.prototype.showModal !== 'function') return;

  // Use native modal semantics and focus containment; the original figures
  // remain readable when JavaScript or dialog support is unavailable.
  const dialog = document.createElement('dialog');
  dialog.className = 'figure-viewer';
  dialog.setAttribute('aria-labelledby', 'figure-viewer-title');
  dialog.setAttribute('aria-describedby', 'figure-viewer-caption');
  const bar = document.createElement('div');
  bar.className = 'figure-viewer-bar';
  const title = document.createElement('h2');
  title.id = 'figure-viewer-title';
  const actions = document.createElement('div');
  actions.className = 'figure-viewer-actions';
  const size = document.createElement('button');
  size.type = 'button';
  size.className = 'figure-viewer-size';
  size.textContent = 'Actual Size';
  size.setAttribute('aria-pressed', 'false');
  size.setAttribute('aria-controls', 'figure-viewer-media');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'figure-viewer-close';
  close.textContent = 'Close';
  close.setAttribute('aria-label', 'Close Figure');
  actions.append(size, close);
  bar.append(title, actions);
  const figure = document.createElement('figure');
  const media = document.createElement('div');
  media.className = 'figure-viewer-media';
  media.id = 'figure-viewer-media';
  media.setAttribute('role', 'region');
  media.setAttribute('aria-label', 'Figure Detail');
  media.tabIndex = -1;
  const enlarged = document.createElement('img');
  enlarged.decoding = 'async';
  const caption = document.createElement('figcaption');
  caption.id = 'figure-viewer-caption';
  media.append(enlarged);
  figure.append(media, caption);
  dialog.append(bar, figure);
  document.body.append(dialog);
  let opener = null;
  let actualSize = false;
  const setSize = value => {
    actualSize = value;
    if (value) dialog.classList.add('is-actual-size');
    else dialog.classList.remove('is-actual-size');
    size.setAttribute('aria-pressed', String(value));
    media.tabIndex = value ? 0 : -1;
    media.scrollTop = 0;
    media.scrollLeft = 0;
  };
  size.addEventListener('click', () => setSize(!actualSize));

  close.addEventListener('click', () => dialog.close());
  // Cycle through viewer controls, including keyboard panning at actual size.
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const controls = actualSize ? [size, close, media] : [size, close];
      const index = controls.indexOf(event.target);
      controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus({preventScroll:true});
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('figure-viewer-open');
    opener?.focus({preventScroll:true});
  });
  // A click that starts and ends on the backdrop dismisses the figure.
  // Dragging an image outward does not accidentally close the viewer.
  let backdropStart = false;
  const outside = event => {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropStart && event.target === dialog && outside(event)) dialog.close();
    backdropStart = false;
  });

  images.forEach(image => {
    const original = image.closest('figure');
    if (!original || image.closest('a, button')) return;
    const vector = image.tagName?.toLowerCase() === 'svg';
    if (vector && typeof XMLSerializer === 'undefined') return;
    const originalCaption = original.querySelector('figcaption');
    const heading = originalCaption?.querySelector('strong')?.textContent.trim() || 'Project Figure';
    const description = vector ? image.querySelector('title')?.textContent.trim() || heading : image.alt || heading;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'figure-zoom';
    button.setAttribute('aria-label', `Enlarge: ${description}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const cue = document.createElement('span');
    cue.className = 'figure-zoom-cue';
    cue.textContent = 'View Larger';
    cue.setAttribute('aria-hidden', 'true');
    image.before(button);
    button.append(image, cue);
    button.addEventListener('click', () => {
      opener = button;
      setSize(false);
      title.textContent = heading;
      if (vector) {
        const copy = image.cloneNode(true);
        const dimensions = image.viewBox.baseVal;
        if (dimensions.width && dimensions.height) {
          copy.setAttribute('width', String(dimensions.width));
          copy.setAttribute('height', String(dimensions.height));
        }
        // An isolated SVG image preserves vector detail without duplicating
        // title, description, or gradient IDs in the live page document.
        enlarged.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(copy));
      } else enlarged.src = image.currentSrc || image.src;
      enlarged.alt = description;
      caption.textContent = originalCaption?.textContent.trim() || description;
      dialog.showModal();
      document.documentElement.classList.add('figure-viewer-open');
      close.focus({preventScroll:true});
    });
  });
})();
