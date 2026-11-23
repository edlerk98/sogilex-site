// Sogilex services: THE ONE LIST. Everything Sogilex offers is described here once, and the site builds from it:
//   - the "Services" tab in the top menu of every page (a link to /services/ plus a drop-down list),
//   - the cards on the homepage (<div data-services>) and on /services/ (<div data-services="full">).
// To add a service, add one entry below. Nothing else needs changing.
window.SOGILEX_SERVICES = [
  {
    id: 'build', label: 'Build', tag: 'Beta', title: 'Websites',
    blurb: 'Describe your business in a few sentences. Get a one-page site you can change by asking or by clicking the words, publish, and keep.',
    make: { href: 'https://build.sogilex.com/', text: 'Open Build' },
    about: { href: '/examples/', text: 'See examples' },
  },
  {
    id: 'menus', label: 'Menus', tag: 'Beta', title: 'Restaurant menus',
    blurb: 'Type your dishes and prices once, or read them from a photo. Print it, put it online behind a QR code, and change prices any time.',
    make: { href: 'https://build.sogilex.com/menus/', text: 'Make a menu' },
    about: { href: '/menus/', text: 'How it works' },
  },
  {
    id: 'flyers', label: 'Flyers', tag: 'Beta', title: 'Flyers',
    blurb: 'Event and promo flyers with one clear message, real typography and your own photos. Print it or save an image.',
    make: { href: 'https://build.sogilex.com/flyers/', text: 'Make a flyer' },
    about: { href: '/flyers/', text: 'How it works' },
  },
  {
    id: 'posts', label: 'Posts', tag: 'Beta', title: 'Social media posts',
    blurb: "This week's deal, a new dish, an event or a real customer review, as a ready-to-post image with a caption written for you.",
    make: { href: 'https://build.sogilex.com/posts/', text: 'Make a post' },
    about: { href: '/posts/', text: 'How it works' },
  },
  {
    id: 'invoices', label: 'Invoices', tag: 'Beta', title: 'Quotes & invoices',
    blurb: 'Quotes and invoices with your logo and exact totals. Offer optional add-ons, turn an accepted quote into an invoice in one click, and see who still owes you.',
    make: { href: 'https://build.sogilex.com/invoices/', text: 'Make an invoice' },
    about: { href: '/invoices/', text: 'How it works' },
  },
];

// Shown under the services in the menu and on /services/: the service where we do the work for you.
window.SOGILEX_DONE_FOR_YOU = { href: '/#done-for-you', text: 'Rather we do it for you?' };

(() => {
  const list = window.SOGILEX_SERVICES;
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    }
    kids.flat().forEach((c) => c != null && n.append(c));
    return n;
  };

  // Top menu: the "Services" item gets a drop-down list (the link itself still goes to /services/).
  document.querySelectorAll('.nav .nav-services').forEach((li) => {
    const link = li.querySelector('a');
    const id = 'svc-menu-' + Math.random().toString(36).slice(2, 7);
    const panel = el('div', { class: 'svc-menu', id, role: 'list' },
      list.map((s) => el('a', { class: 'svc-item', role: 'listitem', href: s.make.href },
        el('span', { class: 'svc-item-title', text: s.title }), el('span', { class: 'svc-item-label', text: s.label }))),
      el('a', { class: 'svc-all', href: '/services/', text: 'All services →' }),
      el('a', { class: 'svc-dfy', href: window.SOGILEX_DONE_FOR_YOU.href, text: window.SOGILEX_DONE_FOR_YOU.text + ' →' }));
    const toggle = el('button', { type: 'button', class: 'svc-toggle', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': 'Show all services' },
      el('span', { 'aria-hidden': 'true', text: '▾' }));
    const set = (open) => { li.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); };
    toggle.addEventListener('click', (e) => { e.stopPropagation(); set(!li.classList.contains('open')); });
    document.addEventListener('click', (e) => { if (!li.contains(e.target)) set(false); });
    li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); toggle.focus(); } });
    link.after(toggle, panel);
  });

  // Cards: <div data-services> on the homepage, <div data-services="full"> on /services/.
  document.querySelectorAll('[data-services]').forEach((box) => {
    box.replaceChildren(...list.map((s) => el('article', { class: 'card panel live', id: box.dataset.services === 'full' ? s.id : null },
      el('div', { class: 'card-top' }, el('span', { class: 'label', text: s.label }), s.tag ? el('span', { class: 'tag on', text: s.tag }) : null),
      el('h3', { text: s.title }),
      el('p', { text: s.blurb }),
      el('a', { class: 'more', href: s.make.href, text: s.make.text + ' →' }),
      s.about ? el('a', { class: 'more more-quiet', href: s.about.href, text: s.about.text }) : null)));
  });
})();
