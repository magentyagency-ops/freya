/* Graphiques : réticule + info-bulle (courbes), info-bulles par marque (radar, matrice). */
(() => {
  const F = window.FSP;
  const { doc } = F;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const el = (tag, cls, text) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  function placeTip(tip, host, x, y) {
    const hw = host.clientWidth;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = x + 18;
    if (left + tw > hw) left = x - tw - 18;
    let top = y - th / 2;
    top = Math.max(-10, Math.min(host.clientHeight - th + 10, top));
    tip.style.setProperty('--tx', `${Math.round(left)}px`);
    tip.style.setProperty('--ty', `${Math.round(top)}px`);
  }

  function lineChart(fig) {
    const plot = F.$('.chart__plot', fig);
    const svg = F.$('svg', plot);
    const tip = F.$('.chart__tip', plot);
    const dataEl = F.$('script[type="application/json"]', plot);
    if (!svg || !tip || !dataEl) return;
    const data = JSON.parse(dataEl.textContent);
    const g = JSON.parse(svg.dataset.geom);
    const cross = F.$('.c-cross', svg);
    const line = F.$('.c-crossline', svg);
    const n = data.x.length;
    const sx = (i) => g.L + (i / (n - 1)) * (g.R - g.L);
    const sy = (v) => g.B - (v / g.yMax) * (g.B - g.T);
    const dots = data.series.map((s) => {
      const c = doc.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', '5');
      c.setAttribute('class', 'c-crossdot');
      c.style.fill = s.hi ? 'var(--chart-1)' : 'var(--chart-2)';
      cross.appendChild(c);
      return c;
    });
    plot.tabIndex = 0;
    plot.setAttribute('role', 'group');
    plot.setAttribute('aria-label', 'Interactive chart: use the left and right arrow keys to move between years.');
    let idx = n - 1;

    const show = (i) => {
      idx = Math.max(0, Math.min(n - 1, i));
      const x = sx(idx);
      line.setAttribute('transform', `translate(${x} 0)`);
      data.series.forEach((s, k) => {
        dots[k].setAttribute('cx', x);
        dots[k].setAttribute('cy', sy(s.values[idx]));
      });
      tip.replaceChildren();
      const proj = data.proj && data.x[idx] >= data.proj;
      tip.appendChild(el('div', 'tip__x', `${data.x[idx]}${proj ? ' · projection' : ''}`));
      data.series.forEach((s) => {
        const row = el('div', 'tip__row');
        const lab = el('span');
        const key = el('i', `key key--line${s.hi ? ' key--hi' : ''}`);
        lab.append(key, doc.createTextNode(s.name));
        row.append(lab, el('b', '', F.fmt(s.values[idx])));
        tip.appendChild(row);
      });
      if (data.series.length >= 2) {
        const gap = data.series[0].values[idx] - data.series[1].values[idx];
        const row = el('div', 'tip__row tip__gap');
        row.append(el('span', '', 'Gap'), el('b', '', (gap > 0 ? '+' : '') + F.fmt(gap)));
        tip.appendChild(row);
      }
      const ctm = svg.getScreenCTM();
      const pr = plot.getBoundingClientRect();
      if (ctm) {
        const pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = sy(data.series[0].values[idx]);
        const p = pt.matrixTransform(ctm);
        placeTip(tip, plot, p.x - pr.left, p.y - pr.top);
      }
      fig.classList.add('is-hover');
    };
    const hide = () => fig.classList.remove('is-hover');

    svg.addEventListener('pointermove', (e) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(ctm.inverse());
      if (p.x < g.L - 20 || p.x > g.R + 20) return hide();
      show(Math.round(((p.x - g.L) / (g.R - g.L)) * (n - 1)));
    });
    svg.addEventListener('pointerleave', hide);
    plot.addEventListener('focus', () => show(idx));
    plot.addEventListener('blur', hide);
    plot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'Escape') hide();
    });
  }

  // Info-bulles portées par les marques (radar, matrice des risques…)
  function markTips(fig) {
    const tip = F.$('.chart__tip', fig);
    if (!tip) return;
    const host = tip.parentElement;
    const on = (m) => {
      tip.replaceChildren(el('div', 'tip__row', null));
      tip.firstChild.appendChild(el('b', '', m.dataset.tip));
      const r = m.getBoundingClientRect(), hr = host.getBoundingClientRect();
      placeTip(tip, host, r.left + r.width / 2 - hr.left, r.top + r.height / 2 - hr.top);
      tip.classList.add('is-on');
    };
    const off = () => tip.classList.remove('is-on');
    F.$$('[data-tip]', fig).forEach((m) => {
      m.addEventListener('pointerenter', () => on(m));
      m.addEventListener('pointerleave', off);
      m.addEventListener('focus', () => on(m));
      m.addEventListener('blur', off);
    });
  }

  F.mod('charts', () => {
    F.$$('.chart--line').forEach(lineChart);
    F.$$('.chart--radar, .chart--rm').forEach(markTips);
  });
})();
