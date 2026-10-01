// Visuels génératifs (SVG calculés au build, déterministes).
// Chaque stratégie, projet et note de recherche possède sa propre signature graphique.
import { rng } from './html.mjs';

const f = (n) => Math.round(n * 10) / 10;
const poly = (pts) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L');

// Bruit de valeur 2D lissé (suffisant pour des reliefs fins)
export function noise2D(seed) {
  const r = rng(seed);
  const P = new Uint8Array(512);
  const base = [...Array(256).keys()].sort(() => r() - 0.5);
  for (let i = 0; i < 512; i++) P[i] = base[i & 255];
  const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y) * 0.7;
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  return (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = P[X] + Y, b = P[X + 1] + Y;
    return lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u), lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v);
  };
}

const svgWrap = (vb, inner, cls = 'gx', extra = '') =>
  `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false"${extra}>${inner}</svg>`;

/* --------------------------------------------------------------------------
   Glyphes de stratégies — 240 × 160
   -------------------------------------------------------------------------- */
function glyphRise() {
  let s = '';
  for (let x = 20; x <= 220; x += 25) s += `<path class="g-grid" d="M${x} 14V146"/>`;
  s += `<path class="g-axis" d="M20 146H224"/>`;
  const n = 9;
  for (let k = 0; k < n; k++) {
    const amp = 0.18 + (k / (n - 1)) * 0.82;
    const p = 2.3 - (k / (n - 1)) * 0.75;
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      pts.push([20 + t * 200, 146 - Math.pow(t, p) * 124 * amp]);
    }
    const cls = k === n - 1 ? 'g-hi' : 'g-ln';
    s += `<path class="${cls}" style="--o:${(0.25 + (k / n) * 0.6).toFixed(2)}" d="${poly(pts)}"/>`;
  }
  s += `<circle class="g-dot" cx="20" cy="146" r="2.4"/><circle class="g-hi-dot" cx="220" cy="22" r="3"/>`;
  s += `<path class="g-hi g-dash" d="M220 22H232"/>`;
  return s;
}

function glyphStadium() {
  let s = '';
  const cx = 120, cy = 80;
  for (let i = 0; i < 7; i++) {
    const w = 74 + i * 22, h = 40 + i * 15.5, rx = h * (0.42 + i * 0.03);
    s += `<rect class="${i > 3 ? 'g-ln g-dash' : 'g-ln'}" style="--o:${(0.9 - i * 0.1).toFixed(2)}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(rx)}"/>`;
  }
  s += `<rect class="g-hi" x="${cx - 26}" y="${cy - 15}" width="52" height="30"/>`;
  s += `<path class="g-hi" d="M${cx} ${cy - 15}V${cy + 15}"/><circle class="g-hi" cx="${cx}" cy="${cy}" r="6"/>`;
  for (let a = 0; a < 360; a += 15) {
    const r1 = 66, r2 = 72, rad = (a * Math.PI) / 180;
    s += `<path class="g-grid" d="M${f(cx + Math.cos(rad) * r1 * 1.55)} ${f(cy + Math.sin(rad) * r1)}L${f(cx + Math.cos(rad) * r2 * 1.55)} ${f(cy + Math.sin(rad) * r2)}"/>`;
  }
  return s;
}

function glyphSignal() {
  let s = '';
  const base = 118;
  for (let i = 0; i < 52; i++) {
    const x = 18 + i * 4;
    const h = 8 + Math.abs(Math.sin(i * 0.31) * Math.cos(i * 0.093 + 0.6)) * 78 + (i % 3) * 2;
    s += `<path class="${i === 37 ? 'g-hi' : 'g-ln'}" style="--o:${(0.3 + (h / 96) * 0.6).toFixed(2)}" d="M${x} ${base}V${f(base - h)}"/>`;
  }
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const x = 18 + i * 2.6;
    pts.push([x, 132 + Math.sin(i * 0.36) * 9 * (0.4 + i / 100)]);
  }
  s += `<path class="g-hi" d="${poly(pts)}"/>`;
  s += `<path class="g-axis g-dash" d="M14 40H226"/>`;
  return s;
}

function glyphTranches() {
  let s = `<path class="g-axis" d="M14 84H228"/>`;
  s += `<path class="g-ln" d="M26 84V146M20 138l6 8 6-8"/>`;
  for (let i = 0; i < 7; i++) {
    const x = 52 + i * 22;
    s += `<path class="g-ln" style="--o:.75" d="M${x} 84V64M${x - 4} 70l4-6 4 6"/>`;
  }
  s += `<path class="g-hi" d="M210 84V18M204 26l6-8 6 8"/>`;
  for (let y = 92; y <= 140; y += 6) s += `<path class="g-grid" d="M40 ${y}H200"/>`;
  s += `<rect class="g-ln g-dash" x="40" y="92" width="160" height="50"/>`;
  return s;
}

function glyphNetwork(seed = 'network') {
  const r = rng(seed);
  const pts = [];
  let guard = 0;
  while (pts.length < 22 && guard++ < 2000) {
    const p = [20 + r() * 200, 16 + r() * 128];
    if (pts.every(([x, y]) => Math.hypot(x - p[0], (y - p[1]) * 1.2) > 30)) pts.push(p);
  }
  const hub = pts.reduce((best, p) => (Math.hypot(p[0] - 120, p[1] - 80) < Math.hypot(best[0] - 120, best[1] - 80) ? p : best));
  let s = '';
  const seen = new Set();
  pts.forEach((p, i) => {
    const near = pts.map((q, j) => [j, Math.hypot(q[0] - p[0], q[1] - p[1])]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
    near.forEach(([j]) => {
      const key = [i, j].sort().join('-');
      if (seen.has(key)) return;
      seen.add(key);
      s += `<path class="g-ln" style="--o:.45" d="M${f(p[0])} ${f(p[1])}L${f(pts[j][0])} ${f(pts[j][1])}"/>`;
    });
  });
  pts.filter((p) => p !== hub && Math.hypot(p[0] - hub[0], p[1] - hub[1]) < 95).forEach((p) => {
    s += `<path class="g-hi" style="--o:.8" d="M${f(hub[0])} ${f(hub[1])}L${f(p[0])} ${f(p[1])}"/>`;
  });
  pts.forEach((p) => (s += `<circle class="${p === hub ? 'g-hi-dot' : 'g-dot'}" cx="${f(p[0])}" cy="${f(p[1])}" r="${p === hub ? 4 : 2}"/>`));
  s += `<circle class="g-hi g-dash" cx="${f(hub[0])}" cy="${f(hub[1])}" r="12"/>`;
  return s;
}

const GLYPHS = { rise: glyphRise, stadium: glyphStadium, signal: glyphSignal, tranches: glyphTranches, network: () => glyphNetwork() };

export const glyph = (type, cls = 'gx') => svgWrap('0 0 240 160', (GLYPHS[type] || glyphRise)(), cls);

/* --------------------------------------------------------------------------
   Sigils — signature runique de chaque participation (60 × 88)
   -------------------------------------------------------------------------- */
export function sigil(seed, cls = 'sigil') {
  const r = rng(seed);
  const X = [12, 30, 48], Y = [10, 33, 56, 79];
  const segs = new Set();
  const add = (a, b) => segs.add(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`);
  const staves = r() < 0.55 ? [r() < 0.5 ? 0 : 1] : [0, 2];
  staves.forEach((c) => add([X[c], Y[0]], [X[c], Y[3]]));
  const branches = 2 + Math.floor(r() * 2);
  for (let b = 0; b < branches; b++) {
    const c = staves[Math.floor(r() * staves.length)];
    const row = Math.floor(r() * 3);
    const dir = c === 2 ? -1 : c === 0 ? 1 : r() < 0.5 ? -1 : 1;
    const c2 = Math.min(2, Math.max(0, c + dir * (r() < 0.7 ? 1 : 2)));
    const row2 = Math.min(3, Math.max(0, row + (r() < 0.5 ? 1 : -1)));
    if (c2 !== c) add([X[c], Y[row]], [X[c2], Y[row2]]);
  }
  const dot = r() < 0.4 ? `<circle class="sg-dot" cx="${X[Math.floor(r() * 3)]}" cy="${Y[Math.floor(r() * 4)]}" r="3.2"/>` : '';
  const grid = X.map((x) => Y.map((y) => `<circle class="sg-pt" cx="${x}" cy="${y}" r="1"/>`).join('')).join('');
  return svgWrap('0 0 60 89', grid + `<path class="sg-ln" d="${[...segs].join('')}"/>` + dot, cls);
}

/* --------------------------------------------------------------------------
   Couvertures des notes de recherche — 480 × 300
   -------------------------------------------------------------------------- */
function coverRidges(seed) {
  const n = noise2D(seed);
  const rows = 24, W = 480, top = 58, step = 9.5;
  let s = '';
  for (let j = 0; j < rows; j++) {
    const y0 = top + j * step;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const x = 40 + (i / 64) * 400;
      const env = Math.exp(-Math.pow((x - 250) / 92, 2));
      const v = Math.abs(n(i * 0.16, j * 0.42)) * 1.5 + Math.max(0, n(i * 0.07 + 9, j * 0.2)) * 0.7;
      pts.push([x, y0 - env * v * 62 - env * 4]);
    }
    const d = poly(pts);
    s += `<path class="cv-fill" d="${d}L440 ${y0 + 30}L40 ${y0 + 30}Z"/><path class="${j === 13 ? 'cv-hi' : 'cv-ln'}" d="${d}"/>`;
  }
  return s + `<path class="cv-axis" d="M40 290H440"/>`;
}

function coverBars(seed) {
  const n = noise2D(seed);
  let s = '';
  for (let i = 0; i < 96; i++) {
    const x = 32 + i * 4.4;
    const h = 6 + Math.pow(Math.abs(n(i * 0.09, 0.5)) * 1.8 + Math.abs(n(i * 0.31, 3.2)) * 0.6, 1.3) * 95;
    s += `<path class="${i % 23 === 11 ? 'cv-hi' : 'cv-ln'}" d="M${f(x)} ${f(150 - h)}V${f(150 + h * 0.62)}"/>`;
  }
  return s + `<path class="cv-axis" d="M24 150H456"/>`;
}

function coverRings(seed) {
  const r = rng(seed);
  const cx = 300 + r() * 60, cy = 150;
  let s = `<path class="cv-axis" d="M0 ${cy}H480M${f(cx)} 0V300"/>`;
  for (let i = 1; i <= 14; i++) {
    const rad = i * 13 + r() * 4;
    const dash = i % 3 === 0 ? ` stroke-dasharray="${f(2 + r() * 6)} ${f(3 + r() * 9)}"` : '';
    s += `<circle class="${i === 9 ? 'cv-hi' : 'cv-ln'}" cx="${f(cx)}" cy="${cy}" r="${f(rad)}"${dash}/>`;
  }
  const a = r() * Math.PI * 2;
  s += `<circle class="cv-dot" cx="${f(cx + Math.cos(a) * 9 * 13)}" cy="${f(cy + Math.sin(a) * 9 * 13)}" r="4"/>`;
  return s;
}

function coverField(seed) {
  const r = rng(seed);
  let s = `<rect class="cv-ln" x="40" y="30" width="400" height="240"/><path class="cv-ln" d="M240 30V270"/><circle class="cv-ln" cx="240" cy="150" r="36"/>`;
  s += `<rect class="cv-ln" x="40" y="88" width="62" height="124"/><rect class="cv-ln" x="378" y="88" width="62" height="124"/>`;
  s += `<rect class="cv-ln" x="40" y="122" width="22" height="56"/><rect class="cv-ln" x="418" y="122" width="22" height="56"/>`;
  for (let k = 0; k < 4; k++) {
    let x = 80 + r() * 140, y = 50 + r() * 200;
    const pts = [[x, y]];
    for (let i = 0; i < 5; i++) {
      x += 30 + r() * 40; y += (r() - 0.5) * 70;
      pts.push([x, Math.max(40, Math.min(260, y))]);
    }
    s += `<path class="${k === 0 ? 'cv-hi' : 'cv-ln cv-dash'}" d="${poly(pts)}"/>`;
    s += `<circle class="${k === 0 ? 'cv-dot' : 'cv-pt'}" cx="${f(pts[pts.length - 1][0])}" cy="${f(pts[pts.length - 1][1])}" r="3.5"/>`;
  }
  for (let i = 0; i < 18; i++) s += `<circle class="cv-pt" cx="${f(60 + r() * 360)}" cy="${f(46 + r() * 208)}" r="2.2"/>`;
  return s;
}

function coverContours(seed) {
  const n = noise2D(seed);
  const cols = 52, rows = 34, W = 480, H = 300;
  const sx = W / (cols - 1), sy = H / (rows - 1);
  const v = [];
  for (let j = 0; j < rows; j++) {
    v[j] = [];
    for (let i = 0; i < cols; i++) v[j][i] = n(i * 0.085, j * 0.085) + n(i * 0.21 + 7, j * 0.21) * 0.35;
  }
  let s = '';
  const levels = [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6];
  levels.forEach((lv, li) => {
    let d = '';
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = v[j][i], b = v[j][i + 1], c = v[j + 1][i + 1], e = v[j + 1][i];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (e > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x = i * sx, y = j * sy;
        const T = [x + sx * ((lv - a) / (b - a)), y];
        const R = [x + sx, y + sy * ((lv - b) / (c - b))];
        const B = [x + sx * ((lv - e) / (c - e)), y + sy];
        const L = [x, y + sy * ((lv - a) / (e - a))];
        const seg = { 1: [L, B], 2: [B, R], 3: [L, R], 4: [T, R], 5: [L, T, B, R], 6: [T, B], 7: [L, T], 8: [L, T], 9: [T, B], 10: [L, B, T, R], 11: [T, R], 12: [L, R], 13: [B, R], 14: [L, B] }[idx];
        for (let k = 0; k < seg.length; k += 2) d += `M${Math.round(seg[k][0])} ${Math.round(seg[k][1])}L${Math.round(seg[k + 1][0])} ${Math.round(seg[k + 1][1])}`;
      }
    }
    s += `<path class="${li === 5 ? 'cv-hi' : 'cv-ln'}" d="${d}"/>`;
  });
  return s;
}

function coverScatter(seed) {
  const r = rng(seed);
  let s = `<path class="cv-axis" d="M50 260H450M50 260V30"/>`;
  for (let x = 50; x <= 450; x += 50) s += `<path class="cv-grid" d="M${x} 30V260"/>`;
  for (let y = 30; y <= 260; y += 46) s += `<path class="cv-grid" d="M50 ${y}H450"/>`;
  for (let i = 0; i < 46; i++) {
    const x = 60 + r() * 380;
    const y = 250 - (x - 60) * 0.48 + (r() - 0.5) * 80;
    s += `<circle class="${i === 7 ? 'cv-dot' : 'cv-pt'}" cx="${f(x)}" cy="${f(Math.max(36, Math.min(255, y)))}" r="${i === 7 ? 4.5 : 2.6}"/>`;
  }
  s += `<path class="cv-hi" d="M60 250L440 68"/>`;
  return s;
}

const COVERS = { ridges: coverRidges, bars: coverBars, rings: coverRings, field: coverField, contours: coverContours, scatter: coverScatter };

export const cover = (type, seed, cls = 'cover') =>
  svgWrap('0 0 480 300', (COVERS[type] || coverRidges)(seed), cls, ' preserveAspectRatio="xMidYMid slice"');

/* --------------------------------------------------------------------------
   Épure de construction de la rune Fehu (page Firme, kit presse)
   -------------------------------------------------------------------------- */
export function fehuConstruction() {
  let s = '';
  for (let i = 0; i <= 14; i++) s += `<path class="fc-grid" d="M${40 + i * 40} 40V600M40 ${40 + i * 40}H600"/>`;
  s += `<circle class="fc-guide" cx="320" cy="320" r="280"/><circle class="fc-guide" cx="320" cy="320" r="173"/>`;
  s += `<path class="fc-guide" d="M0 520L640 103M0 360L640 -57M0 680L640 263"/>`;
  s += `<path class="fc-guide fc-dash" d="M200 40V600M480 40V600M40 152H600M40 488H600"/>`;
  s += `<path class="fc-mark" d="M200 72V568"/><path class="fc-mark" d="M200 290L480 108"/><path class="fc-mark" d="M200 462L480 280"/>`;
  s += `<circle class="fc-node" cx="200" cy="290" r="5"/><circle class="fc-node" cx="200" cy="462" r="5"/><circle class="fc-node" cx="480" cy="108" r="5"/><circle class="fc-node" cx="480" cy="280" r="5"/>`;
  s += `<path class="fc-arc" d="M268 246A80 80 0 0 0 280 290"/>`;
  s += `<text class="fc-txt" x="292" y="276">33°</text><text class="fc-txt" x="214" y="384">172</text><text class="fc-txt" x="488" y="198">172</text>`;
  s += `<text class="fc-txt" x="44" y="30">ᚠ / FEHU — DRAWING 01</text><text class="fc-txt" x="520" y="626">GRID 40 U</text>`;
  return svgWrap('0 0 640 640', s, 'fehu-c');
}
