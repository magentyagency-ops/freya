/* Défilement : section horizontale épinglée, parallaxe légère. */
(() => {
  const F = window.FSP;

  F.mod('hscroll', () => {
    F.$$('[data-hscroll]').forEach((sec) => {
      const track = F.$('[data-hs-track]', sec);
      const cur = F.$('[data-hs-current]', sec);
      const bar = F.$('[data-hs-bar]', sec);
      const cards = F.$$(':scope > *', track);
      if (!track || !cards.length) return;
      let dist = 0, top = 0, active = false, lastI = -1;

      const measure = () => {
        active = F.vw > 900;
        if (!active) {
          sec.style.removeProperty('--hs-h');
          track.style.removeProperty('--x');
          return;
        }
        dist = Math.max(0, track.scrollWidth - F.vw);
        sec.style.setProperty('--hs-h', `${F.vh + dist}px`);
        top = sec.getBoundingClientRect().top + scrollY;
      };

      const update = (y) => {
        let p;
        if (active) {
          p = F.clamp((y - top) / Math.max(1, dist));
          track.style.setProperty('--x', `${(-p * dist).toFixed(1)}px`);
        } else {
          p = F.clamp(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth));
        }
        bar && bar.style.setProperty('--p', (0.2 + p * 0.8).toFixed(4));
        const i = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
        if (i !== lastI && cur) {
          lastI = i;
          cur.textContent = String(i + 1).padStart(2, '0');
        }
      };

      measure();
      F.onResize(() => { measure(); update(scrollY); });
      addEventListener('load', () => { measure(); update(scrollY); });
      F.onScroll(update);
      track.addEventListener('scroll', () => !active && update(scrollY), { passive: true });
    });
  });

  // Parallaxe : data-parallax="0.15" (fraction de la vitesse de défilement)
  F.mod('parallax', () => {
    if (F.reduced) return;
    const els = F.$$('[data-parallax]');
    if (!els.length) return;
    F.onScroll(() => {
      els.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > F.vh + 200) return;
        const k = parseFloat(el.dataset.parallax) || 0.1;
        const c = r.top + r.height / 2 - F.vh / 2;
        el.style.transform = `translate3d(0, ${(-c * k).toFixed(1)}px, 0)`;
      });
    });
  });
})();
