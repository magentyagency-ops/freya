// Composants d'interface partagés.
import { html, attrs, esc } from './html.mjs';
import { icon } from './icons.mjs';

// Bouton fendu : libellé roulant | cellule flèche
export function btn(href, label, { variant = 'ghost', size = '', ico = 'arrow', magnetic = true, cls: extra = '', ...rest } = {}) {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, extra].filter(Boolean).join(' ');
  const tag = href ? 'a' : 'button';
  const a = href ? { href, ...rest } : { type: rest.type || 'button', ...rest };
  return html`<${tag} class="${cls}"${attrs(a)}${magnetic ? ' data-magnetic' : ''}><span class="btn__label"><span class="roll"><span data-text="${esc(label)}">${label}</span></span></span><span class="btn__icon">${icon[ico]}${icon[ico]}</span></${tag}>`;
}

export const link = (href, label, cls = '') =>
  html`<a class="link ${cls}" href="${href}"><span>${label}</span>${icon.arrow}</a>`;

export const gl = (fade = true) => `<div class="gl${fade ? ' gl--fade' : ''}" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`;
export const regs = (which = ['tl', 'tr']) => which.map((w) => `<span class="reg reg--${w}" aria-hidden="true"></span>`).join('');
export const brk = () => `<div class="brk" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`;

// En-tête de section : index + label / titre + chapeau
export function sh({ idx, label, title, lead, split = false, tag = 'h2', cls = '', titleCls = 'h2' }) {
  return html`
  <header class="sh${split ? ' sh--split' : ''} ${cls}">
    <div class="sh__meta">
      ${idx ? `<span class="idx" data-scramble>${idx}</span>` : ''}
      ${label ? `<span class="label">${label}</span>` : ''}
    </div>
    <div class="sh__main">
      <${tag} class="${titleCls}" data-split>${title}</${tag}>
      ${lead ? `<p class="lead" data-reveal>${lead}</p>` : ''}
    </div>
  </header>`;
}

// Bandeau d'appel à l'action
export function ctaBand({ label = 'Next step', title, text, primary, secondary, theme = 'void' }) {
  return html`
  <section class="sec cta-band" data-theme="${theme}">
    ${gl()}
    <div class="wrap cta-band__inner">
      <div class="cta-band__head">
        <span class="label label--dot" data-reveal>${label}</span>
        <h2 class="h1" data-split>${title}</h2>
      </div>
      <div class="cta-band__side" data-reveal>
        ${text ? `<p class="lead">${text}</p>` : ''}
        <div class="btns">
          ${primary ? btn(primary[0], primary[1], { variant: 'solid' }) : ''}
          ${secondary ? btn(secondary[0], secondary[1], { variant: 'ghost' }) : ''}
        </div>
      </div>
    </div>
  </section>`;
}

// Hero des pages intérieures
export function pageHero({ code, label, title, lead, aside = '', visual = '', theme = 'void', crumbs = [], cls = '' }) {
  return html`
  <section class="phero ${cls}" data-theme="${theme}">
    ${gl()}
    ${visual ? `<div class="phero__visual" aria-hidden="true">${visual}</div>` : ''}
    <div class="wrap phero__inner">
      <div class="phero__top">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="index.html">Freya</a>
          ${crumbs.map(([href, l]) => (href ? `<span>/</span><a href="${href}">${l}</a>` : `<span>/</span><span aria-current="page">${l}</span>`))}
        </nav>
        ${code ? `<span class="micro phero__code" data-scramble>${code}</span>` : ''}
      </div>
      <div class="phero__body">
        ${label ? `<span class="label label--dot phero__label" data-reveal>${label}</span>` : ''}
        <h1 class="h1 phero__title" data-split>${title}</h1>
        <div class="phero__foot">
          ${lead ? `<p class="lead phero__lead" data-reveal>${lead}</p>` : '<span></span>'}
          ${aside ? `<div class="phero__aside" data-reveal>${aside}</div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

// Liste de faits clés (dl)
export const facts = (items, cls = '') =>
  html`<dl class="facts ${cls}">${items.map(([k, v]) => `<div class="facts__row"><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>`;

// Indicateur chiffré animé
export function stat({ value, unit = '', label, note = '', decimals = 0, prefix = '' }) {
  return html`
  <div class="stat" data-reveal>
    <div class="stat__value num"><span>${prefix}</span><span data-count="${value}" data-decimals="${decimals}">${value}</span><span class="stat__unit">${unit}</span></div>
    <div class="stat__label">${label}</div>
    ${note ? `<p class="stat__note">${note}</p>` : ''}
  </div>`;
}

export const meter = (level, max = 5) =>
  `<span class="meter" role="img" aria-label="${level} out of ${max}">${Array.from({ length: max }, (_, i) => `<i${i < level ? ' class="on"' : ''}></i>`).join('')}</span>`;
