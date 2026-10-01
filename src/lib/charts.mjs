// Graphiques générés au build (SVG/HTML), enrichis au survol par freya.js.
// Forme « emphase » : une série accent (--chart-1), le contexte en gris (--chart-2).
// Chaque graphique a une légende (≥ 2 séries), des libellés directs sélectifs et une vue tableau.
import { html, esc } from './html.mjs';

const f = (n) => Math.round(n * 10) / 10;
const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// Interpolation monotone (Fritsch–Carlson) : courbe lissée sans dépassement des données
export function monotonePath(pts) {
  const n = pts.length;
  if (n < 2) return '';
  const dx = [], dy = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    dy[i] = pts[i + 1][1] - pts[i][1];
    m[i] = dy[i] / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${f(pts[i][0] + h)} ${f(pts[i][1] + h * t[i])} ${f(pts[i + 1][0] - h)} ${f(pts[i + 1][1] - h * t[i + 1])} ${f(pts[i + 1][0])} ${f(pts[i + 1][1])}`;
  }
  return d;
}

export function dataTable({ caption, head, rows }) {
  return html`
  <details class="chart__table">
    <summary><span>View data</span><i aria-hidden="true"></i></summary>
    <div class="tbl-wrap">
      <table class="tbl tbl--data">
        <caption class="sr-only">${caption}</caption>
        <thead><tr>${head.map((h, i) => `<th scope="col"${i ? ' class="r"' : ''}>${h}</th>`)}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td class="r num">${c}</td>` : `<th scope="row">${c}</th>`)).join('')}</tr>`)}</tbody>
      </table>
    </div>
  </details>`;
}

/* --------------------------------------------------------------------------
   Courbes indexées avec zone d'écart (asymétrie)
   -------------------------------------------------------------------------- */
export function lineChart({
  id,
  fig = 'Fig. 01',
  title,
  x,
  series, // [{ name, values, hi }]
  projFrom = null,
  yMax,
  yStep,
  unit = '',
  gapLabel = null,
  source = 'Freya model — illustrative data.',
  compact = false,
}) {
  const W = 800, H = compact ? 380 : 440, L = 52, R = 712, T = 20, B = H - 48;
  const sx = (i) => L + (i / (x.length - 1)) * (R - L);
  const sy = (v) => B - (v / yMax) * (B - T);
  const pIdx = projFrom ? x.indexOf(projFrom) - 1 : x.length - 1;

  let grid = '';
  for (let v = 0; v <= yMax; v += yStep) {
    grid += `<path class="c-gridline${v === 0 ? ' c-base' : ''}" d="M${L} ${f(sy(v))}H${R}"/><text class="c-ytick" x="${L - 12}" y="${f(sy(v) + 4)}">${fmt(v)}</text>`;
  }
  const xt = x.map((xv, i) => (i % (compact ? 2 : 1) === 0 || i === x.length - 1 ? `<text class="c-xtick" x="${f(sx(i))}" y="${B + 28}">${xv}</text>` : '')).join('');

  const pts = series.map((s) => s.values.map((v, i) => [sx(i), sy(v)]));
  let gap = '';
  if (gapLabel && series.length >= 2) {
    const top = pts[0], bot = pts[1];
    const area = monotonePath(top) + 'L' + monotonePath([...bot].reverse()).slice(1);
    gap = `<path class="c-wash" d="${area}"/>`;
  }
  const lines = series
    .map((s, k) => {
      const p = pts[k];
      const real = p.slice(0, pIdx + 1), proj = p.slice(pIdx);
      const cls = s.hi ? 'c-line c-line--hi' : 'c-line c-line--ctx';
      return `<path class="${cls}" data-draw d="${monotonePath(real)}"/>` + (projFrom ? `<path class="${cls} c-line--proj" d="${monotonePath(proj)}"/>` : '');
    })
    .join('');
  const ends = series
    .map((s, k) => {
      const [ex, ey] = pts[k][pts[k].length - 1];
      const v = s.values[s.values.length - 1];
      return `<circle class="c-end${s.hi ? ' c-end--hi' : ''}" cx="${f(ex)}" cy="${f(ey)}" r="4.5"/><text class="c-endlabel" x="${f(ex + 14)}" y="${f(ey - 2)}">${esc(s.name)}</text><text class="c-endval" x="${f(ex + 14)}" y="${f(ey + 15)}">${fmt(v)}</text>`;
    })
    .join('');

  let projZone = '';
  if (projFrom) {
    const px = sx(pIdx);
    projZone = `<rect class="c-proj" x="${f(px)}" y="${T}" width="${f(R - px)}" height="${f(B - T)}"/><path class="c-projline" d="M${f(px)} ${T}V${B}"/><text class="c-projlabel" x="${f(px + 10)}" y="${T + 14}">Projection</text>`;
  }
  let gapAnn = '';
  if (gapLabel) {
    const i = Math.min(pIdx, x.length - 1);
    const ax = sx(i), y1 = sy(series[0].values[i]), y2 = sy(series[1].values[i]);
    const my = y1 + (y2 - y1) * 0.32;
    gapAnn = `<path class="c-ann" d="M${f(ax)} ${f(y1 + 8)}V${f(y2 - 8)}"/><path class="c-ann" d="M${f(ax - 4)} ${f(y1 + 8)}H${f(ax + 4)}M${f(ax - 4)} ${f(y2 - 8)}H${f(ax + 4)}"/><text class="c-anntext" x="${f(ax + 12)}" y="${f(my + 4)}">${gapLabel}</text>`;
  }

  const data = JSON.stringify({ x, unit, proj: projFrom, series: series.map((s) => ({ name: s.name, values: s.values, hi: !!s.hi })) });
  return html`
  <figure class="chart chart--line" id="${id}" data-chart="line" data-reveal>
    <div class="chart__head">
      <div class="chart__title"><span class="label">${fig}</span><p>${title}</p></div>
      <ul class="chart__legend">
        ${series.map((s) => `<li><i class="key key--line${s.hi ? ' key--hi' : ''}"></i>${s.name}</li>`)}
        ${gapLabel ? '<li><i class="key key--wash"></i>Gap</li>' : ''}
        ${projFrom ? '<li><i class="key key--proj"></i>Projection</li>' : ''}
      </ul>
    </div>
    <div class="chart__plot">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" data-geom='${JSON.stringify({ L, R, T, B, yMax, W, H })}'>
        ${projZone}${grid}${xt}${gap}${lines}${gapAnn}${ends}
        <g class="c-cross" aria-hidden="true"><path class="c-crossline" d="M0 ${T}V${B}"/></g>
        <rect class="c-hit" x="${L}" y="${T}" width="${R - L}" height="${B - T}" fill="transparent"/>
      </svg>
      <div class="chart__tip" aria-hidden="true"></div>
      <script type="application/json">${data}</script>
    </div>
    <figcaption class="chart__cap"><span>Source: ${source}</span>${projFrom ? `<span>Projections from ${projFrom}.</span>` : ''}</figcaption>
    ${dataTable({
      caption: title,
      head: ['Year', ...series.map((s) => s.name)],
      rows: x.map((xv, i) => [String(xv) + (projFrom && xv >= projFrom ? ' (p)' : ''), ...series.map((s) => fmt(s.values[i]))]),
    })}
  </figure>`;
}

/* --------------------------------------------------------------------------
   Barres horizontales (HTML) — une série, emphase sur un élément
   -------------------------------------------------------------------------- */
export function hbars({ id, fig, title, items, unit = '%', max = null, decimals = 0, source = 'Freya model — illustrative data.', note = '' }) {
  const m = max || Math.max(...items.map((i) => i.value));
  return html`
  <figure class="chart chart--hbars" id="${id}" data-reveal>
    <div class="chart__head">
      <div class="chart__title"><span class="label">${fig}</span><p>${title}</p></div>
    </div>
    <ul class="hbars" role="list">
      ${items.map(
        (it, i) => html`
        <li class="hbar${it.hi ? ' hbar--hi' : ''}" style="--v:${(it.value / m).toFixed(4)};--i:${i}" tabindex="0" data-tip="${esc(it.label)} — ${fmt(it.value, decimals)} ${unit}">
          <span class="hbar__label">${it.label}${it.sub ? `<small>${it.sub}</small>` : ''}</span>
          <span class="hbar__track"><span class="hbar__fill"></span><span class="hbar__val num">${fmt(it.value, decimals)}<small>${unit}</small></span></span>
        </li>`
      )}
    </ul>
    <figcaption class="chart__cap"><span>Source: ${source}</span>${note ? `<span>${note}</span>` : ''}</figcaption>
  </figure>`;
}

/* --------------------------------------------------------------------------
   Colonnes ordinales (entonnoir de sélection)
   -------------------------------------------------------------------------- */
export function funnel({ steps, log = true }) {
  const max = Math.max(...steps.map((s) => s.value));
  const h = (v) => (log ? Math.log10(v + 1) / Math.log10(max + 1) : v / max);
  return html`
  <ol class="funnel" data-reveal>
    ${steps.map(
      (s, i) => html`
      <li class="funnel__step${i === steps.length - 1 ? ' is-hi' : ''}" style="--h:${h(s.value).toFixed(3)};--i:${i}">
        <div class="funnel__col"><span class="funnel__val">${fmt(s.value)}</span><span class="funnel__bar"></span></div>
        <div class="funnel__txt">
          <span class="idx">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="h4">${s.name}</h3>
          <p>${s.text}</p>
        </div>
      </li>`
    )}
  </ol>`;
}

/* --------------------------------------------------------------------------
   Radar (profil multifacteur) — 2 séries : actif analysé vs médiane
   -------------------------------------------------------------------------- */
export function radar({ id, fig, title, axes, series, max = 100 }) {
  const S = 520, C = S / 2, Rr = 178;
  const n = axes.length;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return [C + Math.cos(a) * Rr * (v / max), C + Math.sin(a) * Rr * (v / max)];
  };
  let grid = '';
  for (let r = 1; r <= 4; r++) {
    const ring = axes.map((_, i) => pt(i, (max * r) / 4));
    grid += `<path class="c-gridline" d="M${ring.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z"/>`;
  }
  axes.forEach((a, i) => {
    const [x, y] = pt(i, max);
    const [lx, ly] = pt(i, max * 1.2);
    const anchor = Math.abs(lx - C) < 8 ? 'middle' : lx > C ? 'start' : 'end';
    grid += `<path class="c-gridline" d="M${C} ${C}L${f(x)} ${f(y)}"/><text class="c-axislabel" x="${f(lx)}" y="${f(ly + 4)}" text-anchor="${anchor}">${a}</text>`;
  });
  const shapes = series
    .map((s) => {
      const p = s.values.map((v, i) => pt(i, v));
      const d = `M${p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
      const dots = p.map(([x, y], i) => `<circle class="c-rdot${s.hi ? ' c-rdot--hi' : ''}" cx="${f(x)}" cy="${f(y)}" r="4.5" tabindex="${s.hi ? 0 : -1}" data-tip="${esc(axes[i])} — ${s.name} : ${s.values[i]}/100"/>`).join('');
      return `<path class="${s.hi ? 'c-rarea c-rarea--hi' : 'c-rarea'}" d="${d}"/>${dots}`;
    })
    .join('');
  return html`
  <figure class="chart chart--radar" id="${id}" data-chart="radar" data-reveal>
    <div class="chart__head">
      <div class="chart__title"><span class="label">${fig}</span><p>${title}</p></div>
      <ul class="chart__legend">${series.map((s) => `<li><i class="key key--line${s.hi ? ' key--hi' : ''}"></i>${s.name}</li>`)}</ul>
    </div>
    <div class="chart__plot chart__plot--radar">
      <svg viewBox="-40 -10 ${S + 80} ${S + 20}" role="img" aria-label="${esc(title)}">${grid}${shapes}</svg>
      <div class="chart__tip" aria-hidden="true"></div>
    </div>
    <figcaption class="chart__cap"><span>Score out of 100 — illustrative example.</span></figcaption>
    ${dataTable({ caption: title, head: ['Factor', ...series.map((s) => s.name)], rows: axes.map((a, i) => [a, ...series.map((s) => String(s.values[i]))]) })}
  </figure>`;
}

/* --------------------------------------------------------------------------
   Matrice des risques (probabilité × impact) — séquentiel une teinte
   -------------------------------------------------------------------------- */
export function riskMatrix({ id, risks }) {
  const cells = [];
  for (let imp = 5; imp >= 1; imp--) {
    for (let p = 1; p <= 5; p++) {
      const score = p * imp;
      const lvl = score >= 15 ? 4 : score >= 9 ? 3 : score >= 5 ? 2 : 1;
      const here = risks.filter((r) => r.p === p && r.i === imp);
      cells.push(
        `<div class="rm__cell" data-l="${lvl}">${here.map((r) => `<button type="button" class="rm__risk" data-tip="${esc(r.name)} — probability ${r.p}/5, impact ${r.i}/5">${r.code}</button>`).join('')}</div>`
      );
    }
  }
  return html`
  <figure class="chart chart--rm" id="${id}" data-reveal>
    <div class="rm">
      <span class="rm__ylabel micro">Impact →</span>
      <div class="rm__grid">${cells}</div>
      <span class="rm__xlabel micro">Probability →</span>
    </div>
    <div class="chart__tip" aria-hidden="true"></div>
    <ul class="rm__legend">
      <li><i data-l="1"></i>Low</li><li><i data-l="2"></i>Moderate</li><li><i data-l="3"></i>High</li><li><i data-l="4"></i>Critical</li>
    </ul>
  </figure>`;
}

export const sparkline = (values, { w = 120, h = 32, cls = '' } = {}) => {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  const [lx, ly] = pts[pts.length - 1];
  return `<svg class="spark ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${monotonePath(pts)}"/><circle cx="${f(lx)}" cy="${f(ly)}" r="2.5"/></svg>`;
};
