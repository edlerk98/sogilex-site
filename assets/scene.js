// Sogilex homepage scene: a sunset over a particle sea, drifting sparks, a cursor glow and
// trailing ring, click ripples, and a sun that sets as you scroll. Pure decoration: the page
// reads and works the same without it. Canvas 2D, no images, no network.
"use strict";
class SunsetScene {
  // Page-wide scene: a sunset over a particle sea, with drifting sparks. It sits fixed behind the
  // content, so the cursor works on every section, and the sun sets as you scroll. Canvas 2D, no
  // images. Reduced motion gets a still frame; the loop stops while the tab is hidden.
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.raf = 0;
    this.mounted = false;
    this.pointer = { x: -9999, y: -9999, active: false, touch: false };
    this.ring = { x: 0, y: 0 };
    this.ripples = [];
    this.scroll = 0;
    this.progress = 0;
    this.setCanvas = (el) => {
      if (el === this.canvas) return;
      this.stop();
      this.canvas = el;
      if (el && this.mounted) this.start();
    };
  }

  start() {
    this.ctx = this.canvas.getContext('2d');
    this.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.t0 = performance.now();
    this.w = 0;
    this.resize();
    this.readScroll();
    this.onMove = (e) => {
      const first = !this.pointer.active;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.touch = e.pointerType === 'touch';
      this.pointer.active = true;
      if (first) { this.ring.x = e.clientX; this.ring.y = e.clientY; }
    };
    this.onLeave = () => { this.pointer.active = false; };
    this.onDown = (e) => {
      if (this.reduced) return;
      this.ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (this.ripples.length > 4) this.ripples.shift();
    };
    this.onScroll = () => this.readScroll();
    this.onResize = () => this.resize();
    this.onVis = () => { if (!document.hidden) this.loop(); };
    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerdown', this.onDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', this.onLeave);
    window.addEventListener('blur', this.onLeave);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVis);
    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.canvas);
    }
    this.loop();
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.onMove) {
      window.removeEventListener('pointermove', this.onMove);
      window.removeEventListener('pointerdown', this.onDown);
      document.documentElement.removeEventListener('mouseleave', this.onLeave);
      window.removeEventListener('blur', this.onLeave);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('visibilitychange', this.onVis);
    }
    if (this.ro) this.ro.disconnect();
    this.onMove = null;
    this.ro = null;
    this.ctx = null;
  }

  loop() {
    if (this.raf || !this.ctx) return;
    const step = (now) => {
      this.raf = 0;
      if (!this.ctx || document.hidden) return;
      this.frame(this.reduced ? 0 : now - this.t0);
      if (!this.reduced) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  readScroll() {
    const se = document.scrollingElement || document.documentElement;
    this.scroll = se.scrollTop || window.scrollY || 0;
    const max = Math.max(1, se.scrollHeight - window.innerHeight);
    this.progress = Math.min(1, this.scroll / max);
    // The horizon starts just below the element marked data-horizon (the hero buttons), so the
    // sea never runs behind the hero text on any screen size.
    const anchor = document.querySelector('[data-horizon]');
    this.anchorY = anchor ? anchor.getBoundingClientRect().bottom + this.scroll + 48 : 0;
    if (this.reduced) this.frame(0);
  }

  resize() {
    const c = this.canvas;
    if (!c) return;
    const w = Math.max(1, c.clientWidth);
    const h = Math.max(1, c.clientHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w * h * dpr * dpr > 5000000) dpr = Math.sqrt(5000000 / (w * h));
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    this.build();
    this.readScroll();
    if (this.reduced) this.frame(0);
  }

  build() {
    const W = this.w;
    const H = this.h;
    const small = W < 700;
    this.rows = small ? 30 : 44;
    this.cols = small ? 72 : 124;
    this.px = new Float32Array(this.cols);
    this.py = new Float32Array(this.cols);
    this.pa = new Float32Array(this.cols);
    this.ps = new Float32Array(this.cols);
    const n = small ? 34 : 66;
    this.nodes = [];
    for (let i = 0; i < n; i++) {
      this.nodes.push({
        x: Math.random() * W, y: Math.random() * H, d: 0.35 + Math.random() * 0.65,
        ph: Math.random() * 6.283, c: Math.random() < 0.6 ? '255,154,77' : '240,69,143', sx: 0, sy: 0, glow: 0
      });
    }
  }

  smooth(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  frame(t) {
    const ctx = this.ctx;
    if (!ctx || !this.nodes) return;
    const W = this.w;
    const H = this.h;
    const P = this.pointer;
    const p = this.progress;
    const now = performance.now();
    const live = P.active && !this.reduced;
    const Hs = Math.min(H, 1000);

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    // The sun: sinks below the horizon as the page scrolls.
    const set = this.smooth(0, 0.55, p);
    const dusk = 1 - this.smooth(0.05, 0.6, p) * 0.6;
    const horizon = this.anchorY
      ? Math.max(Hs * 0.42, this.anchorY - this.scroll * 0.6)
      : Hs * (0.72 - p * 0.1);
    const sunR = Math.min(W, Hs) * 0.15;
    const sunX = W * 0.7;
    const sunY = horizon - sunR * 0.45 + set * sunR * 2;
    let g = ctx.createRadialGradient(sunX, horizon, 0, sunX, horizon, sunR * 4.2);
    g.addColorStop(0, 'rgba(242,73,107,' + (0.32 * dusk).toFixed(3) + ')');
    g.addColorStop(0.4, 'rgba(217,30,140,' + (0.1 * dusk).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(217,30,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(sunX - sunR * 4.2, horizon - sunR * 4.2, sunR * 8.4, sunR * 8.4);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, horizon);
    ctx.clip();
    g = ctx.createRadialGradient(sunX, sunY - sunR * 0.3, sunR * 0.05, sunX, sunY, sunR);
    g.addColorStop(0, 'rgba(255,226,196,0.95)');
    g.addColorStop(0.45, 'rgba(255,154,77,0.9)');
    g.addColorStop(0.85, 'rgba(242,73,107,0.7)');
    g.addColorStop(1, 'rgba(217,30,140,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, 6.2832);
    ctx.fill();
    ctx.restore();

    // The sea: rows of points on a moving wave surface, far to near.
    const f = Hs * 0.5;
    const rows = this.rows;
    const cols = this.cols;
    const zN = 1.3;
    const zF = 26;
    const R = 170;
    const refl = 1 - set;
    for (let r = rows - 1; r >= 0; r--) {
      const z = zN * Math.pow(zF / zN, r / (rows - 1));
      const fog = Math.pow(1 - (z - zN) / (zF - zN), 1.2);
      const xs = (z * W) / (2 * f) * 1.15;
      const shift = (r % 2) * 0.5 + Math.sin(r * 1.7) * 0.3;
      const cr = Math.round(217 + (255 - 217) * fog);
      const cg = Math.round(30 + (154 - 30) * fog);
      const cb = Math.round(140 + (77 - 140) * fog);
      for (let c = 0; c < cols; c++) {
        const u = ((c + shift) / (cols - 1)) * 2 - 1;
        const x = u * xs;
        const y = 0.16 * (Math.sin(x * 0.9 + t * 0.0007) * 0.6 + Math.sin(z * 0.55 - t * 0.0009 + x * 0.3) * 0.8 + Math.sin((x + z) * 0.35 + t * 0.0005) * 0.5);
        const sx = W / 2 + (x * f) / z;
        let sy = horizon + ((1 - y) * f) / z;
        let bright = 0;
        if (live) {
          const dx = sx - P.x;
          const dy = sy - P.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            const k = (1 - d / R) * (1 - d / R);
            sy -= k * 26 * (0.3 + fog);
            bright += k;
          }
        }
        for (let i = 0; i < this.ripples.length; i++) {
          const rp = this.ripples[i];
          const age = now - rp.t;
          if (age > 1800) continue;
          const dx = sx - rp.x;
          const dy = sy - rp.y;
          const dd = Math.sqrt(dx * dx + dy * dy) - age * 0.45;
          const e = (1 - age / 1800) * Math.exp(-(dd * dd) / 900);
          sy -= e * 16 * (0.3 + fog);
          bright += e * 0.8;
        }
        const streak = Math.exp(-Math.pow((sx - sunX) / (W * 0.09), 2)) * refl;
        this.px[c] = sx;
        this.py[c] = sy;
        this.pa[c] = Math.min(1, (0.12 + fog * 0.55) * dusk + streak * 0.7 * (0.3 + fog) + bright * 0.7);
        this.ps[c] = (0.7 + fog * 1.5) * (1 + bright);
      }
      const rgb = cr + ',' + cg + ',' + cb;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + ((0.04 + fog * 0.4) * dusk).toFixed(3) + ')';
      ctx.lineWidth = 0.5 + fog * 0.8;
      ctx.beginPath();
      ctx.moveTo(this.px[0], this.py[0]);
      for (let c = 1; c < cols; c++) ctx.lineTo(this.px[c], this.py[c]);
      ctx.stroke();
      ctx.fillStyle = 'rgb(' + rgb + ')';
      for (let c = 0; c < cols; c++) {
        const s = this.ps[c];
        ctx.globalAlpha = this.pa[c];
        ctx.fillRect(this.px[c] - s / 2, this.py[c] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    if (this.ripples.length && now - this.ripples[0].t > 1800) this.ripples.shift();

    // Sparks: drift up the page with parallax, link when close, reach for the cursor.
    const nodes = this.nodes;
    const span = H + 40;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!this.reduced) n.y -= 0.12 * n.d;
      if (n.y < -20) { n.y += span; n.x = Math.random() * W; }
      n.sx = n.x + Math.sin(t * 0.0004 + n.ph) * 14 * n.d;
      n.sy = ((((n.y - this.scroll * 0.25 * n.d) % span) + span) % span) - 20;
      let gl = 0;
      if (live) {
        const dx = n.sx - P.x;
        const dy = n.sy - P.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) gl = 1 - d / 200;
      }
      n.glow += (gl - n.glow) * 0.12;
    }
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 > 17000) continue;
        const al = (1 - Math.sqrt(d2) / 130) * 0.16 * (1 + (a.glow + b.glow) * 2);
        if (al <= 0.005) continue;
        ctx.strokeStyle = 'rgba(' + a.c + ',' + Math.min(1, al).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }
    if (live) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.glow < 0.02) continue;
        ctx.strokeStyle = 'rgba(255,154,77,' + (n.glow * 0.5).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(P.x, P.y);
        ctx.lineTo(n.sx, n.sy);
        ctx.stroke();
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const r = (1 + n.d * 1.6) * (1 + n.glow);
      const tw = 0.6 + 0.4 * Math.sin(t * 0.002 + n.ph * 3);
      ctx.fillStyle = 'rgba(' + n.c + ',' + Math.min(1, (0.06 + n.glow * 0.25) * n.d).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, r * 5, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = 'rgba(' + n.c + ',' + Math.min(1, 0.7 * n.d * tw + n.glow * 0.4).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, r, 0, 6.2832);
      ctx.fill();
    }

    // The cursor: a soft glow everywhere, and a ring that trails the pointer (mouse only).
    if (live) {
      g = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, 240);
      g.addColorStop(0, 'rgba(242,73,107,0.13)');
      g.addColorStop(1, 'rgba(242,73,107,0)');
      ctx.fillStyle = g;
      ctx.fillRect(P.x - 240, P.y - 240, 480, 480);
      if (!P.touch) {
        this.ring.x += (P.x - this.ring.x) * 0.18;
        this.ring.y += (P.y - this.ring.y) * 0.18;
        ctx.strokeStyle = 'rgba(255,154,77,0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.ring.x, this.ring.y, 16, 0, 6.2832);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

(() => {
  const c = document.getElementById('scene');
  if (!c || !c.getContext) return;
  const s = new SunsetScene();
  s.mounted = true;
  s.setCanvas(c);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => s.readScroll());
  document.documentElement.classList.add('scene-on');
})();
