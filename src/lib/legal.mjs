// Gabarit des pages juridiques : sommaire épinglé + sections.
import { html } from './html.mjs';
import { pageHero } from './ui.mjs';

export const todo = (t) => `<span class="todo" title="To complete">${t}</span>`;

export function legalPage({ code, label, title, lead, updated, sections, crumb }) {
  return html`
  ${pageHero({ code, label, title, lead, crumbs: [[null, crumb]], cls: 'phero--short', aside: `<p class="micro">Last updated: ${updated}</p>` })}
  <section class="sec sec--sm" data-theme="ice">
    <div class="wrap legal">
      <aside class="legal__toc">
        <nav class="toc" aria-label="Contents" data-toc>
          <span class="label">Contents</span>
          <ol>${sections.map((s, i) => `<li><a href="#${s.id}"><span class="idx">${String(i + 1).padStart(2, '0')}</span>${s.h}</a></li>`)}</ol>
        </nav>
      </aside>
      <div class="legal__body">
        ${sections.map(
          (s, i) => html`
          <section class="legal__sec art__sec" id="${s.id}">
            <h2 class="h4"><span class="idx">${String(i + 1).padStart(2, '0')}</span>${s.h}</h2>
            ${s.html}
          </section>`
        )}
      </div>
    </div>
  </section>`;
}
