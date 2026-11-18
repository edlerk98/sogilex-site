// Sogilex: the living field, the reactive wordmark, card light, and scroll reveals.
// Everything here is decoration: the page reads and works the same without it.
(() => {
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -9999, y: -9999, active: false };
  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; pointer.x = pointer.y = -9999; });

  // ---------- the field: a grid of points that drift and wake up near the cursor ----------
  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, pts = [];
  const GAP = 34, RADIUS = 170;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    for (let y = GAP / 2; y < h + GAP; y += GAP) {
      for (let x = GAP / 2; x < w + GAP; x += GAP) {
        pts.push({ bx: x, by: y, x, y, seed: Math.random() * Math.PI * 2, glow: 0 });
      }
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    const near = [];
    for (const p of pts) {
      // slow ambient drift
      const dx0 = reduce ? 0 : Math.sin(t / 2400 + p.seed) * 2.2;
      const dy0 = reduce ? 0 : Math.cos(t / 2900 + p.seed) * 2.2;
      let x = p.bx + dx0, y = p.by + dy0;
      // cursor: points ease away and light up
      const dx = x - pointer.x, dy = y - pointer.y;
      const d = Math.hypot(dx, dy);
      let target = 0;
      if (d < RADIUS) {
        const f = 1 - d / RADIUS;
        target = f;
        if (!reduce) { x += (dx / (d || 1)) * f * 14; y += (dy / (d || 1)) * f * 14; }
        near.push({ x, y, f });
      }
      p.glow += (target - p.glow) * 0.12;
      p.x = x; p.y = y;
      const a = 0.12 + p.glow * 0.85;
      const r = 1.1 + p.glow * 1.8;
      ctx.fillStyle = p.glow > 0.02 ? `rgba(200,241,105,${a})` : 'rgba(243,239,230,0.13)';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // a few threads between lit points, like a network waking up
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const a = near[i], b = near[j];
        const dd = Math.hypot(a.x - b.x, a.y - b.y);
        if (dd < GAP * 1.6) {
          ctx.strokeStyle = `rgba(200,241,105,${Math.min(a.f, b.f) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  }

  build();
  window.addEventListener('resize', () => { build(); if (reduce) frame(0); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(frame); });
  if (reduce) frame(0); else requestAnimationFrame(frame);

  // ---------- the wordmark: letters near the cursor lift and light ----------
  const letters = [...document.querySelectorAll('.word span:not(.period)')];
  if (!reduce && letters.length) {
    // once a letter has assembled, hand its position back from the CSS animation to this loop
    document.querySelectorAll('.word span').forEach((s) => s.addEventListener('animationend', () => {
      s.classList.add('ready'); s.dataset.ready = '1';
    }));
    const loop = () => {
      for (const s of letters) {
        const r = s.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(pointer.x - cx, pointer.y - cy);
        const f = Math.max(0, 1 - d / 260);
        if (!s.dataset.ready) continue; // still assembling
        s.style.transform = `translateY(${(-f * 0.08).toFixed(4)}em)`;
        s.classList.toggle('hot', f > 0.55);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------- cards: light follows the cursor ----------
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---------- scroll reveal ----------
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach((n) => io.observe(n));
})();
