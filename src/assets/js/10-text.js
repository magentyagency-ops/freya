/* Typographie animée : découpage en mots, apparitions, brouillage, compteurs, surbrillance. */
(() => {
  const F = window.FSP;
  const { doc } = F;

  // Découpe les nœuds texte en mots masqués, en conservant la structure (span.dim, br…)
  function splitWords(el, wrapCls = 'w') {
    let wi = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/([ \t\n\r]+)/);
          if (!parts.some((p) => p.trim())) return;
          const frag = doc.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (!p.trim()) {
              frag.appendChild(doc.createTextNode(' '));
              return;
            }
            const w = doc.createElement('span');
            w.className = wrapCls;
            w.style.setProperty('--wi', wi++);
            const inner = doc.createElement('span');
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && n.tagName !== 'SVG') {
          walk(n);
        }
      });
    };
    walk(el);
    return wi;
  }
  F.splitWords = splitWords;

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—·+';
  function scramble(el, duration = 900) {
    if (F.reduced || el.dataset.scrambled) return;
    el.dataset.scrambled = '1';
    const final = el.textContent;
    const len = final.length;
    const start = performance.now();
    const stop = F.loop((t) => {
      const p = Math.min(1, (t - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++) {
        const c = final[i];
        if (c === ' ' || p >= 1 || p > (i / len) * 0.75 + 0.25) out += c;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p >= 1) stop();
    });
  }
  F.scramble = scramble;

  function count(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (F.reduced || isNaN(target)) {
      el.textContent = F.fmt(target, dec);
      return;
    }
    const start = performance.now();
    const dur = 1700;
    el.textContent = F.fmt(0, dec);
    const stop = F.loop((t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = F.fmt(target * F.easeOut(p), dec);
      if (p >= 1) stop();
    });
  }

  F.mod('text', () => {
    const splits = F.$$('[data-split]');
    splits.forEach((el) => splitWords(el));

    const inHero = (el) => !!el.closest('[data-hero], .phero');
    const reveal = (el) => {
      el.classList.add('is-in');
      if (el.matches('[data-scramble]')) scramble(el);
      F.$$('[data-scramble]', el).forEach((s) => scramble(s));
      F.$$('[data-count]', el).forEach(count);
      if (el.matches('[data-count]')) count(el);
    };

    const targets = F.$$('[data-reveal], [data-split], [data-scramble], .chart, .funnel, .chart--hbars');
    const now = targets.filter(inHero);
    const later = targets.filter((el) => !inHero(el));

    F.introDone.then(() => {
      F.$$('[data-hero], .phero').forEach((h) => h.classList.add('is-live'));
      now.forEach((el) => reveal(el));
    });
    F.once(later, reveal);

    // Mesure des tracés à dessiner
    F.$$('[data-draw]').forEach((p) => {
      try {
        p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
      } catch (e) {}
    });
  });

  // Texte qui s'éclaire mot à mot au rythme du défilement
  F.mod('highlight', () => {
    F.$$('[data-highlight]').forEach((el) => {
      const n = splitWords(el, 'hw');
      const words = F.$$('.hw', el);
      if (F.reduced || !n) return;
      let last = -1;
      F.onScroll(() => {
        const r = el.getBoundingClientRect();
        const start = F.vh * 0.82, end = F.vh * 0.3;
        const p = F.clamp((start - r.top) / (start - end + r.height * 0.6));
        const lit = p * words.length;
        const idx = Math.floor(lit * 4);
        if (idx === last) return;
        last = idx;
        words.forEach((w, i) => (w.style.opacity = (0.16 + F.clamp(lit - i) * 0.84).toFixed(3)));
      });
    });
  });
})();
