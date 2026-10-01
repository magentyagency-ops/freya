/* Noyau : utilitaires, boucle d'animation partagée, registre de modules. */
(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const F = (window.FSP = window.FSP || {});
  window.__fsp = true;

  F.doc = doc;
  F.root = root;
  F.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  F.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  F.$ = (s, c = doc) => c.querySelector(s);
  F.$$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  F.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  F.lerp = (a, b, t) => a + (b - a) * t;
  F.easeOut = (t) => 1 - Math.pow(1 - t, 4);
  F.easeInOut = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

  // Registre de modules : chaque module s'initialise une fois le DOM prêt
  F.mods = [];
  F.mod = (name, fn) => F.mods.push([name, fn]);

  // Boucle rAF partagée — un seul requestAnimationFrame pour tout le site
  const subs = new Set();
  let running = false;
  const tick = (t) => {
    subs.forEach((fn) => fn(t));
    if (subs.size) requestAnimationFrame(tick);
    else running = false;
  };
  F.loop = (fn) => {
    subs.add(fn);
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
    return () => subs.delete(fn);
  };

  // État de défilement partagé, mis à jour une fois par frame
  F.vw = innerWidth;
  F.vh = innerHeight;
  F.sy = scrollY;
  const scrollSubs = new Set();
  let scrollQueued = false;
  const flushScroll = () => {
    scrollQueued = false;
    const y = scrollY;
    F.dir = y > F.sy ? 1 : y < F.sy ? -1 : F.dir || 0;
    F.sy = y;
    scrollSubs.forEach((fn) => fn(y));
  };
  addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(flushScroll);
    }
  }, { passive: true });
  F.onScroll = (fn, now = true) => {
    scrollSubs.add(fn);
    if (now) fn(scrollY);
    return () => scrollSubs.delete(fn);
  };

  const resizeSubs = new Set();
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      F.vw = innerWidth;
      F.vh = innerHeight;
      resizeSubs.forEach((fn) => fn());
    }, 120);
  });
  F.onResize = (fn) => resizeSubs.add(fn);

  // Apparition au défilement (une seule fois)
  F.once = (els, cb, opts = {}) => {
    if (!('IntersectionObserver' in window)) return els.forEach(cb);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          cb(e.target);
        }
      });
    }, { rootMargin: opts.margin || '0px 0px -8% 0px', threshold: opts.threshold ?? 0.12 });
    els.forEach((el) => io.observe(el));
    return io;
  };

  // Visibilité continue (pour mettre en pause les animations hors écran)
  F.visible = (el, cb) => {
    if (!('IntersectionObserver' in window)) return cb(true);
    const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return io;
  };

  // Notification discrète
  let toastT;
  F.toast = (msg) => {
    const t = F.$('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  };

  // L'intro (préchargeur) est-elle terminée ?
  F.introDone = new Promise((resolve) => (F._resolveIntro = resolve));

  F.fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
})();
