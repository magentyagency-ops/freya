// Gabarit HTML minimal : les tableaux sont joints, null/false/undefined disparaissent.
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.join('');
    else if (v === null || v === undefined || v === false) v = '';
    return out + v + str;
  });

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const attrs = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== false && v !== null && v !== undefined)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');

export const pad = (n, size = 2) => String(n).padStart(size, '0');

// Générateur pseudo-aléatoire déterministe (mulberry32) — visuels génératifs stables d'un build à l'autre.
export function rng(seed) {
  let a = typeof seed === 'string' ? [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703) : seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
