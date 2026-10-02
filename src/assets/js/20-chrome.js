/* Chrome du site : préchargeur, en-tête, méga-menus, menu, curseur, horloges, grille. */
(() => {
  const F = window.FSP;
  const { doc, root } = F;

  /* Préchargeur — première visite de la session, sur l'accueil */
  F.mod('preloader', () => {
    const pre = F.$('[data-preloader]');
    if (!pre || !root.classList.contains('is-intro')) {
      pre?.remove();
      F._resolveIntro();
      return;
    }
    setTimeout(() => {
      pre.classList.add('is-done');
      F._resolveIntro();
      try { sessionStorage.setItem('fsp-intro-v2', '1'); } catch (e) {}
      setTimeout(() => {
        root.classList.remove('is-intro');
        pre.remove();
      }, 450);
    }, 1100);
  });

  /* En-tête : état, masquage directionnel, progression, thème de la section survolée */
  F.mod('header', () => {
    const hdr = F.$('[data-hdr]');
    if (!hdr) return;
    const progress = F.$('.hdr__progress', hdr);
    let lastTheme = hdr.dataset.theme;

    const probe = () => {
      const y = hdr.offsetHeight / 2;
      const stack = doc.elementsFromPoint(F.vw / 2, y);
      for (const el of stack) {
        if (hdr.contains(el) || el.closest('.scrim, .menu, .gridview')) continue;
        const sec = el.closest('[data-theme]');
        if (sec && sec !== hdr) return sec.dataset.theme;
      }
      return lastTheme;
    };

    F.onScroll((y) => {
      hdr.classList.toggle('is-scrolled', y > 8);
      if (!root.classList.contains('has-mega') && !root.classList.contains('has-menu')) {
        hdr.classList.toggle('is-hidden', y > 240 && F.dir > 0);
        root.classList.toggle('hdr-hidden', hdr.classList.contains('is-hidden'));
      }
      const max = doc.documentElement.scrollHeight - F.vh;
      if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      const th = probe();
      if (th && th !== lastTheme) {
        lastTheme = th;
        hdr.dataset.theme = th === 'void' ? 'dark' : th;
      }
    });

    /* Méga-menus */
    const buttons = F.$$('[data-mega]', hdr);
    const scrim = F.$('[data-scrim]');
    let open = null, closeT;
    const panelOf = (b) => F.$(`[data-mega-panel="${b.dataset.mega}"]`, hdr);
    const close = () => {
      if (!open) return;
      open.setAttribute('aria-expanded', 'false');
      panelOf(open).classList.remove('is-open');
      open = null;
      hdr.classList.remove('is-mega');
      root.classList.remove('has-mega');
    };
    const show = (b) => {
      clearTimeout(closeT);
      if (open === b) return;
      if (open) {
        open.setAttribute('aria-expanded', 'false');
        panelOf(open).classList.remove('is-open');
      }
      open = b;
      b.setAttribute('aria-expanded', 'true');
      panelOf(b).classList.add('is-open');
      hdr.classList.add('is-mega');
      root.classList.add('has-mega');
    };
    buttons.forEach((b) => {
      b.addEventListener('click', () => (open === b ? close() : show(b)));
      if (F.fine) {
        b.addEventListener('mouseenter', () => { clearTimeout(closeT); closeT = setTimeout(() => show(b), open ? 0 : 90); });
      }
    });
    if (F.fine) {
      hdr.addEventListener('mouseleave', () => { clearTimeout(closeT); closeT = setTimeout(close, 220); });
      hdr.addEventListener('mouseenter', () => open && clearTimeout(closeT));
      F.$$('.nav__link:not([data-mega]), .brand, .hdr__actions', hdr).forEach((el) => el.addEventListener('mouseenter', () => { clearTimeout(closeT); closeT = setTimeout(close, 120); }));
    }
    scrim && scrim.addEventListener('click', close);
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) {
        const b = open;
        close();
        b.focus();
      }
    });

    /* Menu plein écran */
    const toggle = F.$('[data-menu-toggle]');
    const menu = F.$('[data-menu]');
    if (toggle && menu) {
      const label = F.$('.burger__txt', toggle);
      const setMenu = (on) => {
        menu.classList.toggle('is-open', on);
        hdr.classList.toggle('is-menu', on);
        root.classList.toggle('has-menu', on);
        toggle.setAttribute('aria-expanded', String(on));
        if (label) label.textContent = on ? 'Close' : 'Menu';
        root.style.overflow = on ? 'hidden' : '';
        if (on) hdr.dataset.theme = 'dark';
        if (on) setTimeout(() => F.$('a', menu)?.focus({ preventScroll: true }), 350);
      };
      toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
      doc.addEventListener('keydown', (e) => e.key === 'Escape' && menu.classList.contains('is-open') && (setMenu(false), toggle.focus()));
      F.$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    }
  });


  /* Effet magnétique */
  F.mod('magnetic', () => {
    if (!F.fine || F.reduced) return;
    F.$$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.classList.add('is-mag');
        el.style.setProperty('--mag-x', `${(x * 0.18).toFixed(1)}px`);
        el.style.setProperty('--mag-y', `${(y * 0.32).toFixed(1)}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-mag');
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      });
    });
  });

  /* Halo qui suit le pointeur sur les cartes */
  F.mod('spotlight', () => {
    doc.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('[data-spotlight] .scard__a, .spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  /* Horloges des places financières */
  F.mod('clocks', () => {
    const clocks = F.$$('[data-tz]');
    if (!clocks.length) return;
    const fmts = clocks.map((c) => new Intl.DateTimeFormat('en-GB', { timeZone: c.dataset.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    const days = clocks.map((c) => new Intl.DateTimeFormat('en-US', { timeZone: c.dataset.tz, weekday: 'short', hour: 'numeric', hour12: false }));
    const update = () => {
      const now = new Date();
      clocks.forEach((c, i) => {
        F.$('[data-time]', c).textContent = fmts[i].format(now);
        const parts = days[i].formatToParts(now);
        const wd = parts.find((p) => p.type === 'weekday').value;
        const h = parseInt(parts.find((p) => p.type === 'hour').value, 10) % 24;
        const [o, cl] = c.dataset.open.split('-').map(Number);
        const isOpen = !['Sat', 'Sun'].includes(wd) && h >= o && h < cl;
        const st = F.$('[data-state]', c);
        st.textContent = isOpen ? 'Open' : 'Closed';
        st.classList.toggle('is-open', isOpen);
      });
    };
    update();
    setInterval(update, 1000);
  });

  /* Signature géante du pied de page : halo qui suit la souris */
  F.mod('giant', () => {
    const g = F.$('[data-giant]');
    if (!g || !F.fine) return;
    const grad = doc.getElementById('ftr-spot');
    const svg = F.$('svg', g);
    const ftr = g.closest('footer');
    ftr.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      grad.setAttribute('cx', (((e.clientX - r.left) / r.width) * 1000).toFixed(1));
      grad.setAttribute('cy', (((e.clientY - r.top) / r.height) * 214).toFixed(1));
    }, { passive: true });
  });

  /* Grille de composition — touche G */
  F.mod('gridview', () => {
    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'g' && e.key !== 'G') return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, textarea, select, [contenteditable]')) return;
      root.classList.toggle('show-grid');
    });
  });

  /* Coordonnées du pointeur dans le hero */
  F.mod('hud', () => {
    const out = F.$('[data-hud-coords]');
    const hero = F.$('[data-hero]');
    if (!out || !hero) return;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      out.textContent = `X ${x.toFixed(3)} · Y ${y.toFixed(3)}`;
    }, { passive: true });
  });
})();
