/* Composants : accordéons, filtres, tiroir, accès investisseurs, étapes épinglées. */
(() => {
  const F = window.FSP;
  const { doc, root } = F;

  F.mod('accordion', () => {
    F.$$('[data-acc]').forEach((acc) => {
      const single = acc.hasAttribute('data-acc-single');
      F.$$('.acc__item', acc).forEach((item) => {
        const btn = F.$('.acc__btn', item);
        btn.addEventListener('click', () => {
          const open = !item.classList.contains('is-open');
          if (single) F.$$('.acc__item.is-open', acc).forEach((o) => { o.classList.remove('is-open'); F.$('.acc__btn', o).setAttribute('aria-expanded', 'false'); });
          item.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', String(open));
        });
      });
      // Ouverture par ancre (#poste-xxx)
      if (location.hash) {
        const target = F.$(location.hash, acc);
        if (target && target.classList.contains('acc__item')) F.$('.acc__btn', target).click();
      }
    });
  });

  // Filtres : boutons [data-filter-group] > [data-filter], éléments [data-filter-item] avec data-tags
  F.mod('filters', () => {
    F.$$('[data-filters]').forEach((wrap) => {
      const scope = doc.getElementById(wrap.dataset.filters);
      if (!scope) return;
      const items = F.$$('[data-filter-item]', scope);
      const counter = F.$('[data-filter-count]', wrap);
      const state = {};
      const apply = () => {
        let n = 0, k = 0;
        items.forEach((it) => {
          const tags = (it.dataset.tags || '').split(' ');
          const ok = Object.values(state).every((v) => v === 'all' || tags.includes(v));
          it.classList.toggle('is-out', !ok);
          if (ok) {
            n++;
            it.classList.remove('is-in-anim');
            void it.offsetWidth;
            it.style.setProperty('--k', k++);
            it.classList.add('is-in-anim');
            it.classList.add('is-in');
          }
        });
        if (counter) counter.textContent = `${n} result${n > 1 ? 's' : ''}`;
        const empty = F.$('[data-filter-empty]', scope.parentElement);
        if (empty) empty.hidden = n > 0;
      };
      F.$$('[data-filter-group]', wrap).forEach((group) => {
        const key = group.dataset.filterGroup;
        state[key] = 'all';
        F.$$('[data-filter]', group).forEach((b) => {
          b.addEventListener('click', () => {
            F.$$('[data-filter]', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            state[key] = b.dataset.filter;
            apply();
          });
        });
      });
      F.$$('[data-view]', wrap).forEach((b) => {
        b.addEventListener('click', () => {
          F.$$('[data-view]', wrap).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          scope.dataset.layout = b.dataset.view;
        });
      });
    });
  });

  // Tiroir : [data-drawer-open="tpl-id"] clone <template id="tpl-id"> dans le tiroir
  F.mod('drawer', () => {
    const drawer = F.$('[data-drawer]');
    if (!drawer) return;
    const body = F.$('[data-drawer-body]', drawer);
    let lastFocus = null;
    const close = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      root.style.overflow = '';
      lastFocus && lastFocus.focus({ preventScroll: true });
    };
    const open = (id, trigger) => {
      const tpl = doc.getElementById(id);
      if (!tpl) return;
      lastFocus = trigger;
      body.replaceChildren(tpl.content.cloneNode(true));
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      root.style.overflow = 'hidden';
      F.$('.drawer__panel', drawer).scrollTop = 0;
      F.$$('[data-portrait]', body).forEach((c) => F.portrait && F.portrait(c));
      setTimeout(() => F.$('[data-drawer-close].drawer__close', drawer)?.focus({ preventScroll: true }), 60);
    };
    doc.addEventListener('click', (e) => {
      const t = e.target.closest('[data-drawer-open]');
      if (t) {
        e.preventDefault();
        open(t.dataset.drawerOpen, t);
      }
      if (e.target.closest('[data-drawer-close]')) close();
    });
    doc.addEventListener('keydown', (e) => e.key === 'Escape' && drawer.classList.contains('is-open') && close());
  });

  // Accès investisseurs : confirmation du profil professionnel (mémorisée pour la session)
  F.mod('gate', () => {
    const gate = F.$('[data-gate]');
    if (!gate) return;
    const KEY = 'fsp-gate';
    let status = null;
    try { status = sessionStorage.getItem(KEY); } catch (e) {}
    const form = F.$('form', gate);
    const msg = F.$('[data-gate-msg]', gate);
    const apply = (s) => {
      root.classList.toggle('is-gated', s !== 'pro');
      F.$$('[data-gate-note]').forEach((n) => (n.hidden = s === 'pro'));
    };
    const show = () => {
      gate.classList.add('is-open');
      root.style.overflow = 'hidden';
      setTimeout(() => F.$('input', gate)?.focus({ preventScroll: true }), 300);
    };
    const hide = () => {
      gate.classList.remove('is-open');
      root.style.overflow = '';
    };
    if (status) apply(status);
    else {
      apply('none');
      F.introDone.then(() => setTimeout(show, 700));
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const profile = (F.$('input[name="profil"]:checked', form) || {}).value;
      const ok = F.$('input[name="accept"]', form).checked;
      if (!profile || !ok) {
        msg.textContent = !profile ? 'Please select your profile.' : 'Please confirm you have read the disclaimers.';
        return;
      }
      try { sessionStorage.setItem(KEY, profile); } catch (err) {}
      apply(profile);
      hide();
      if (profile !== 'pro') F.toast('Access limited to public information');
    });
    F.$$('[data-gate-open]').forEach((b) => b.addEventListener('click', show));
  });

  // Sommaire d'article : section active
  F.mod('toc', () => {
    const toc = F.$('[data-toc]');
    if (!toc) return;
    const links = F.$$('a', toc);
    const secs = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    F.onScroll(() => {
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < F.vh * 0.35) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
    });
  });

  // Étapes épinglées : le panneau reflète l'étape au centre de l'écran
  F.mod('steps', () => {
    F.$$('[data-steps]').forEach((wrap) => {
      const steps = F.$$('.step', wrap);
      const num = F.$('[data-step-num]', wrap);
      const title = F.$('[data-step-title]', wrap);
      const metric = F.$('[data-step-metric]', wrap);
      const label = F.$('[data-step-label]', wrap);
      const bars = F.$$('.steps__bar i', wrap);
      const viz = F.$$('[data-step-viz]', wrap);
      let cur = -1;
      const set = (i) => {
        if (i === cur) return;
        cur = i;
        const s = steps[i];
        steps.forEach((x, k) => x.classList.toggle('is-active', k === i));
        if (num) num.firstChild.textContent = String(i + 1).padStart(2, '0');
        if (title) title.textContent = s.dataset.title;
        if (metric) metric.textContent = s.dataset.metric;
        if (label) label.textContent = s.dataset.metricLabel;
        bars.forEach((b, k) => b.classList.toggle('on', k <= i));
        viz.forEach((v) => v.classList.toggle('is-on', Number(v.dataset.stepViz) === i));
        F.$$('[data-viz="dots"]', wrap).forEach((c) => (c.dataset.step = i));
      };
      set(0);
      F.onScroll(() => {
        const mid = F.vh * 0.5;
        let best = 0, bd = Infinity;
        steps.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bd) { bd = d; best = i; }
        });
        set(best);
      });
    });
  });
})();
