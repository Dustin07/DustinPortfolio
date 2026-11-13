(() => {
  'use strict';
  const link = document.querySelector('.contact-primary[href^="mailto:"]');
  const button = document.querySelector('#copy-email');
  const status = document.querySelector('#email-copy-status');
  const fallback = document.querySelector('#email-copy-fallback');
  const field = document.querySelector('#email-copy-value');
  if (!link || !button || !status || !fallback || !field) return;

  let email;
  try { email = decodeURIComponent(link.getAttribute('href').slice(7).split('?')[0]); }
  catch (_) { return; }
  if (!email) return;
  field.value = email;
  let copying = false;
  const selectAddress = () => {
    fallback.hidden = false;
    status.textContent = 'Address selected. Use your device’s Copy command.';
    field.focus();
    field.select();
  };
  button.addEventListener('click', async () => {
    if (copying) return;
    copying = true;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Copying email…';
    try {
      if (!navigator.clipboard?.writeText) { selectAddress(); return; }
      await navigator.clipboard.writeText(email);
      fallback.hidden = true;
      status.textContent = 'Email copied.';
    } catch (_) {
      selectAddress();
    } finally {
      copying = false;
      button.removeAttribute('aria-busy');
    }
  });
  button.hidden = false;
})();
