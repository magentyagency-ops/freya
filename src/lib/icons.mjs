// Icônes au trait 1.25 px, grille 20 × 20 — currentColor.
const svg = (d, extra = '') =>
  `<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;

export const icon = {
  arrow: svg('<path d="M3.5 10h12.5M11.5 5.5 16 10l-4.5 4.5"/>'),
  arrowUpRight: svg('<path d="M6 14 14.5 5.5M7 5.5h7.5V13"/>'),
  arrowDown: svg('<path d="M10 3.5V16M5.5 11.5 10 16l4.5-4.5"/>'),
  arrowUp: svg('<path d="M10 16.5V4M5.5 8.5 10 4l4.5 4.5"/>'),
  arrowLeft: svg('<path d="M16.5 10H4M8.5 5.5 4 10l4.5 4.5"/>'),
  lock: svg('<rect x="4.5" y="9" width="11" height="8" rx="1"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/>'),
  plus: svg('<path d="M10 4v12M4 10h12"/>'),
  minus: svg('<path d="M4 10h12"/>'),
  close: svg('<path d="m5 5 10 10M15 5 5 15"/>'),
  download: svg('<path d="M10 3.5v9M6 8.5l4 4 4-4M4 16.5h12"/>'),
  mail: svg('<rect x="3" y="5" width="14" height="10" rx="1"/><path d="m3.5 5.5 6.5 5 6.5-5"/>'),
  copy: svg('<rect x="7" y="7" width="9" height="9" rx="1"/><path d="M13 7V4.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5H7"/>'),
  check: svg('<path d="m4.5 10.5 3.5 3.5 7.5-8"/>'),
  grid: svg('<rect x="3.5" y="3.5" width="5" height="5"/><rect x="11.5" y="3.5" width="5" height="5"/><rect x="3.5" y="11.5" width="5" height="5"/><rect x="11.5" y="11.5" width="5" height="5"/>'),
  list: svg('<path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"/>'),
  eye: svg('<path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5Z"/><circle cx="10" cy="10" r="2.2"/>'),
  eyeOff: svg('<path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5Z"/><path d="m4 16 12-12"/>'),
  shield: svg('<path d="M10 2.8 4 5v4.6c0 3.7 2.6 6.4 6 7.6 3.4-1.2 6-3.9 6-7.6V5l-6-2.2Z"/><path d="m7.3 10 2 2 3.6-4"/>'),
  doc: svg('<path d="M5 2.5h6.5L15 6v11.5H5z"/><path d="M11.5 2.5V6H15M7.5 10h5M7.5 13h5"/>'),
  linkedin: svg('<rect x="3" y="3" width="14" height="14" rx="1.5"/><path d="M6.8 8.6v5.2M6.8 6.2v.1M9.6 13.8V8.6m0 2.5c0-1.4.9-2.6 2.2-2.6s2 .9 2 2.4v2.9"/>'),
  search: svg('<circle cx="8.8" cy="8.8" r="5"/><path d="m12.5 12.5 4 4"/>'),
  globe: svg('<circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2 2.2 2.8 4.6 2.8 7s-.8 4.8-2.8 7c-2-2.2-2.8-4.6-2.8-7S8 5.2 10 3Z"/>'),
  clock: svg('<circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.6 1.8"/>'),
  phone: svg('<path d="M5 3.5h3l1.3 3.4-1.8 1.2a8.5 8.5 0 0 0 4.4 4.4l1.2-1.8 3.4 1.3v3c0 .6-.5 1-1 1C8.6 16 4 11.4 4 4.5c0-.5.4-1 1-1Z"/>'),
  pin: svg('<path d="M10 17.5s5.5-5.2 5.5-9.5a5.5 5.5 0 0 0-11 0c0 4.3 5.5 9.5 5.5 9.5Z"/><circle cx="10" cy="8" r="2"/>'),
  spark: svg('<path d="M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M4.7 4.7l2.8 2.8M12.5 12.5l2.8 2.8M4.7 15.3l2.8-2.8M12.5 7.5l2.8-2.8"/>'),
  play: svg('<path d="M6.5 4.5v11l9-5.5z"/>'),
  filter: svg('<path d="M3 5h14M5.5 10h9M8 15h4"/>'),
};

// La marque : rune Fehu ᚠ — une hampe, deux traits ascendants parallèles.
export const markPaths = '<path d="M8 3v26"/><path d="M8 13.5 21 5"/><path d="M8 21.5 21 13"/>';
export const mark = (cls = 'mark') =>
  `<svg class="${cls}" viewBox="0 0 28 32" aria-hidden="true" focusable="false">${markPaths}</svg>`;
