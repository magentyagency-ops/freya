// Cartes partagées entre plusieurs pages.
import { html } from './html.mjs';
import { icon } from './icons.mjs';
import { cover } from './glyphs.mjs';
import { categories, fmtDate, articleHref } from '../data/insights.mjs';

export function insightCard(i, { size = '', filter = false } = {}) {
  return html`
  <article class="icard ${size}" data-reveal${filter ? ` data-filter-item data-tags="${i.cat}"` : ''}>
    <a class="icard__a" href="${articleHref(i)}">
      <div class="icard__cover">${cover(i.cover, i.slug)}<span class="icard__cat">${categories[i.cat]}</span>${i.gated ? `<span class="icard__lock">${icon.lock}</span>` : ''}</div>
      <div class="icard__meta"><time datetime="${i.date}">${fmtDate(i.date)}</time><span>${i.read} min</span></div>
      <h3 class="icard__title">${i.title}</h3>
      <p class="icard__excerpt">${i.excerpt}</p>
      <span class="icard__more">Read ${icon.arrow}</span>
    </a>
  </article>`;
}
