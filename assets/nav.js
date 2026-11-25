// Phones and small tablets: puts the main menu behind a "Menu" button (styles in site.css, under .nav-js).
// The button says whether the menu is open (aria-expanded); Escape or a click outside closes it.
(() => {
  document.querySelectorAll('.site-header nav').forEach((nav, i) => {
    const list = nav.querySelector('.nav');
    if (!list) return;
    list.id = list.id || 'main-menu-' + i;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', list.id);
    btn.innerHTML = '<span class="nav-btn-icon" aria-hidden="true"></span>Menu';
    nav.prepend(btn);
    const set = (open) => { list.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!list.classList.contains('open')));
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) set(false); });
    // Escape closes the Services list first (services.js), then the menu. Capture runs before that handler.
    let svcWasOpen = false;
    nav.addEventListener('keydown', () => { svcWasOpen = !!nav.querySelector('.nav-services.open'); }, true);
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && list.classList.contains('open') && !svcWasOpen) { set(false); btn.focus(); }
    });
    // Following an in-page link (e.g. "How we design") closes the menu.
    list.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  });
  document.documentElement.classList.add('nav-js');
})();
