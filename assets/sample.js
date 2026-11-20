// "Get a free sample menu" (homepage). Saves the request in Supabase (table sample_requests: anyone can add one,
// nobody can read them back through the API), and the database then emails it to hello@sogilex.com.
(() => {
  const URL = 'https://sdltqbctuieyjlujsdhj.supabase.co/rest/v1/sample_requests';
  const KEY = 'sb_publishable_SLyXLfw7hZQTL_xEpofo8g_XgKZZStM'; // public by design
  const form = document.getElementById('sample-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const say = (text, err) => { status.textContent = text; status.classList.toggle('err', !!err); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // a bot filled the hidden field
    const v = (n) => form.elements[n].value.trim();
    for (const n of ['restaurant', 'name', 'email']) {
      const el = form.elements[n];
      const bad = !v(n) || !el.checkValidity();
      el.setAttribute('aria-invalid', String(bad));
      if (bad) { say(n === 'email' && v(n) ? 'Please check your email address.' : 'Please fill in your restaurant, your name and your email.', true); el.focus(); return; }
    }
    button.disabled = true; say('Sending…');
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ restaurant: v('restaurant'), name: v('name'), email: v('email'), phone: v('phone') || null, note: v('note') || null }),
      });
      if (!res.ok) {
        let msg = '';
        try { const j = await res.json(); if (j && j.code === 'P0001') msg = j.message; } catch { /* not JSON */ }
        throw new Error(msg);
      }
      form.classList.add('done');
      say("Thanks! We'll be in touch within one business day.");
      form.reset();
    } catch (err) {
      say((err && err.message) || "That didn't go through. Try again, or email hello@sogilex.com.", true);
    } finally { button.disabled = false; }
  });
})();
