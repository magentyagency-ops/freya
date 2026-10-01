/* News wire: relative times, search, filters, business-only toggle, paging. */
(() => {
  const F = window.FSP;

  const ago = (iso) => {
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${Math.max(1, m)} min ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} h ago`;
    const d = Math.round(h / 24);
    return d === 1 ? 'Yesterday' : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  F.mod('news-ago', () => F.$$('[data-ago]').forEach((t) => (t.textContent = ago(t.getAttribute('datetime')))));

  F.mod('news', () => {
    const list = F.$('[data-newslist]');
    if (!list) return;
    const items = F.$$('[data-news]', list);
    const PAGE = 12;
    const st = { sport: 'all', topic: 'all', period: 'all', q: '', biz: false, shown: PAGE };
    const count = F.$('[data-nf-count]');
    const empty = F.$('[data-nf-empty]');
    const more = F.$('[data-nf-more]');
    const resets = F.$$('[data-nf-reset]');
    if (!more || !count) return;
    const q = F.$('[data-nf-q]');
    const biz = F.$('[data-nf-biz]');

    // Read state from URL (shareable filtered views)
    const url = new URL(location.href);
    ['sport', 'topic', 'period'].forEach((k) => url.searchParams.get(k) && (st[k] = url.searchParams.get(k)));
    st.q = url.searchParams.get('q') || '';
    st.biz = url.searchParams.get('biz') === '1';

    const sync = () => {
      F.$$('[data-nf]').forEach((g) => F.$$('[data-v]', g).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === st[g.dataset.nf]))));
      biz.setAttribute('aria-pressed', String(st.biz));
      if (q.value !== st.q) q.value = st.q;
      const u = new URL(location.href);
      ['sport', 'topic', 'period'].forEach((k) => (st[k] === 'all' ? u.searchParams.delete(k) : u.searchParams.set(k, st[k])));
      st.q ? u.searchParams.set('q', st.q) : u.searchParams.delete('q');
      st.biz ? u.searchParams.set('biz', '1') : u.searchParams.delete('biz');
      history.replaceState(null, '', u);
    };

    const apply = () => {
      const terms = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      const now = Date.now();
      let n = 0;
      const any = st.sport !== 'all' || st.topic !== 'all' || st.period !== 'all' || st.q || st.biz;
      items.forEach((it) => {
        const ok = (any || !it.hasAttribute('data-front')) &&
          (st.sport === 'all' || it.dataset.sport === st.sport) &&
          (st.topic === 'all' || it.dataset.topic === st.topic) &&
          (st.period === 'all' || now - new Date(it.dataset.date) < Number(st.period) * 864e5) &&
          (!st.biz || it.dataset.biz === '1') &&
          terms.every((t) => it.dataset.text.includes(t));
        if (ok) n++;
        it.hidden = !ok || n > st.shown;
      });
      count.textContent = `${n} stor${n === 1 ? 'y' : 'ies'}`;
      empty.hidden = n > 0;
      more.parentElement.hidden = n <= st.shown;
      const filtered = st.sport !== 'all' || st.topic !== 'all' || st.period !== 'all' || st.q || st.biz;
      resets[0].hidden = !filtered;
      sync();
    };

    F.$$('[data-nf]').forEach((g) =>
      F.$$('[data-v]', g).forEach((b) => b.addEventListener('click', () => { st[g.dataset.nf] = b.dataset.v; st.shown = PAGE; apply(); }))
    );
    biz.addEventListener('click', () => { st.biz = !st.biz; st.shown = PAGE; apply(); });
    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = q.value.trim(); st.shown = PAGE; apply(); }, 120); });
    more.addEventListener('click', () => { st.shown += PAGE; apply(); });
    resets.forEach((r) => r.addEventListener('click', () => { Object.assign(st, { sport: 'all', topic: 'all', period: 'all', q: '', biz: false, shown: PAGE }); apply(); }));
    F.$$('[data-nf-jump]').forEach((b) => b.addEventListener('click', () => {
      st.sport = b.dataset.nfJump; st.shown = PAGE; apply();
      F.$('#wire').scrollIntoView({ behavior: F.reduced ? 'auto' : 'smooth' });
    }));
    // "/" focuses search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.target.closest('input, textarea')) { e.preventDefault(); q.focus(); }
    });
    apply();
  });
})();
