// Waitlist forms: <form data-waitlist="menus"> with an email input. Posts to the Sogilex Supabase
// project (publishable key: public by design; the table only accepts inserts). Without script the
// form falls back to the mailto link in its <noscript>.
(() => {
  const URL = 'https://sdltqbctuieyjlujsdhj.supabase.co/rest/v1/waitlist';
  const KEY = 'sb_publishable_SLyXLfw7hZQTL_xEpofo8g_XgKZZStM';
  document.querySelectorAll('form[data-waitlist]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return; // honeypot
      const email = form.elements.email.value.trim();
      if (!form.elements.email.checkValidity()) { status.textContent = 'Please enter a valid email address.'; return; }
      button.disabled = true;
      status.textContent = 'Adding you…';
      try {
        const res = await fetch(URL, {
          method: 'POST',
          headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ email, product: form.dataset.waitlist }),
        });
        if (res.ok || res.status === 409) {
          status.textContent = res.status === 409 ? "You're already signed up. We'll email you when new looks land." : "Done. We'll email you when new looks land.";
          form.classList.add('done');
          form.elements.email.value = '';
        } else {
          throw new Error(String(res.status));
        }
      } catch {
        status.textContent = "That didn't go through. Try again, or email hello@sogilex.com.";
      } finally {
        button.disabled = false;
      }
    });
  });
})();
