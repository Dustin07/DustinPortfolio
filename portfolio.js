(() => {
  'use strict';
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Store only project-view preferences in this tab, never visitor analytics.
  const storageKey = 'dustin-portfolio-library';
  const remember = value => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(value)); } catch (_) { /* Storage is optional. */ }
  };
  const recalled = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      return {category:typeof value.category === 'string' ? value.category : 'All', query:typeof value.query === 'string' ? value.query.slice(0,120) : ''};
    } catch (_) { return null; }
  };
  const cards = [...document.querySelectorAll('.project-card')];
  const buttons = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#project-search');
  if (cards.length && search) {
    document.querySelector('.project-toolbar').hidden = false;
    document.querySelector('.filters').hidden = false;
    const count = document.querySelector('#project-count');
    const empty = document.querySelector('#project-empty');
    const reset = document.querySelector('#project-reset');
    const categories = buttons.map(button => button.dataset.filter);
    const params = new URLSearchParams(location.search);
    const previous = location.hash === '#work' ? recalled() : null;
    const categoryFromURL = params.get('category');
    let category = categories.includes(categoryFromURL) ? categoryFromURL :
      (!params.has('category') && !params.has('q') && categories.includes(previous?.category) ? previous.category : 'All');
    search.value = (params.get('q') ?? (!params.has('category') ? previous?.query : '') ?? '').slice(0, 120);
    const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ');
    const searchable = cards.map(card => normalize(card.textContent + ' ' + (card.dataset.keywords || '')));
    const apply = (syncURL = true) => {
      const query = search.value.trim().slice(0, 120);
      const words = normalize(query).split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach((card, index) => {
        card.hidden = (category !== 'All' && card.dataset.category !== category) ||
          !words.every(word => searchable[index].includes(word));
        if (!card.hidden) visible++;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      count.textContent = `${visible} ${visible === 1 ? 'Project' : 'Projects'}`;
      empty.hidden = visible > 0;
      reset.hidden = category === 'All' && !query;
      remember({ category, query });
      if (syncURL) {
        const url = new URL(location.href);
        if (category === 'All') url.searchParams.delete('category'); else url.searchParams.set('category', category);
        if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
        history.replaceState(null, '', url);
      }
    };
    buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; apply(); }));
    let searchTimer;
    search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(apply, 150); });
    search.addEventListener('keydown', event => {
      if (event.key === 'Escape') { clearTimeout(searchTimer); search.value = ''; apply(); }
    });
    reset.addEventListener('click', () => {
      clearTimeout(searchTimer); category = 'All'; search.value = ''; apply(); search.focus();
    });
    addEventListener('pageshow', () => apply(false));
    apply();
  }

  const toc = document.querySelector('.case-toc');
  if (toc) {
    const links = document.createElement('div');
    links.className = 'toc-links';
    links.id = 'project-sections';
    toc.querySelectorAll('a').forEach(link => links.append(link));
    const heading = toc.querySelector('strong');
    const toggle = document.createElement('button');
    toggle.className = 'toc-toggle';
    toggle.type = 'button';
    toggle.textContent = 'Inside This Project';
    toggle.setAttribute('aria-label', 'Inside This Project');
    toggle.setAttribute('aria-controls', links.id);
    toggle.setAttribute('aria-expanded', 'false');
    toc.insertBefore(toggle, heading);
    toc.append(links);
    toc.classList.add('enhanced');
    toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true')));
    toc.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
    links.addEventListener('click', event => {
      if (event.target.closest('a')) toggle.setAttribute('aria-expanded', 'false');
    });
    const print = document.createElement('button');
    print.type = 'button';
    print.className = 'print-project';
    print.textContent = 'Print / Save Case Study';
    print.addEventListener('click', () => window.print());
    document.querySelector('.case-bottom')?.append(print);
  }

  const header = document.querySelector('.topbar');
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (target) { target.tabIndex = -1; target.focus({preventScroll:true}); }
  }));
  const nav = header?.querySelector('.nav');
  const navigation = nav?.querySelector('.navlinks');
  if (navigation) {
    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'menu-toggle';
    menu.textContent = 'Menu';
    menu.setAttribute('aria-label', 'Main Menu');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-controls', 'primary-links');
    navigation.id = 'primary-links';
    nav.insertBefore(menu, navigation);
    nav.classList.add('nav-enhanced');
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') !== 'true')));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); clearance(); }
    });
    nav.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        menu.setAttribute('aria-expanded', 'false'); menu.focus();
      }
    });
    const clearance = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-clearance', `${Math.ceil(height) + (innerWidth <= 760 ? 8 : 12) + 24}px`);
    };
    if ('ResizeObserver' in window) new ResizeObserver(clearance).observe(header);
    else addEventListener('resize', clearance, {passive:true});
    clearance();
  }
  const sectionLinks = toc ? [...toc.querySelectorAll('a[href^="#"]')] :
    [...document.querySelectorAll('.navlinks a[href^="#"]')];
  const sections = sectionLinks.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(item => item.section);
  if (sections.length) {
    let scheduled = false;
    const highlight = () => {
      scheduled = false;
      const offset = (header?.getBoundingClientRect().bottom || 80) + 32;
      let current = null;
      sections.forEach(item => { if (item.section.getBoundingClientRect().top <= offset) current = item; });
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
      if (toc && !current) current = sections[0];
      sections.forEach(item => {
        if (item === current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
    };
    const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(highlight); } };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    highlight();
  }
})();
