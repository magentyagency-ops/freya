import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { sigil } from '../lib/glyphs.mjs';
import { pageHero, facts, ctaBand } from '../lib/ui.mjs';
import { portfolio, stratLabels } from '../data/portfolio.mjs';

export const meta = {
  id: 'portfolio',
  section: 'portfolio',
  title: 'Portfolio',
  description: 'Freya Sports Partners’ holdings, presented under code names: women’s sport, sports assets, media and data, structured credit.',
  headerTheme: 'void',
};

const statusLabel = { active: 'Active', realised: 'Realised' };

function tpl(p, i) {
  return html`
  <template id="tpl-p-${i}">
    <div class="pdet__head">
      <div class="pdet__sigil">${sigil(p.code)}</div>
      <div>
        <span class="label label--dot">P-${String(i + 1).padStart(2, '0')} · ${stratLabels[p.strat]}</span>
        <h2 class="pdet__code" id="drawer-title">${p.code}</h2>
        <p class="body">${p.desc}</p>
      </div>
    </div>
    <div class="pdet__kpis">${p.kpis.map(([k, v]) => `<div><span class="pdet__kv">${v}</span><span class="micro">${k}</span></div>`)}</div>
    <div class="prose"><h3 class="label">Thesis</h3><p>${p.thesis}</p></div>
    <div><h3 class="label">Value creation levers</h3><ul class="ticks">${p.levers.map((l) => `<li>${l}</li>`)}</ul></div>
    ${facts([['Instrument', p.instr], ['Year', String(p.year)], ['Region', p.region], ['Status', statusLabel[p.status]]])}
    <p class="ill">Illustrative data — detailed information restricted to investors</p>
  </template>`;
}

export function render() {
  const active = portfolio.filter((p) => p.status === 'active').length;
  const count = (k) => portfolio.filter((p) => p.strat === k).length;
  return html`
  ${pageHero({
    code: 'P-00 / Portfolio',
    label: 'Portfolio',
    title: 'Positions<br><span class="dim">built with conviction.</span>',
    lead: 'Our holdings are presented under code names, in line with our confidentiality commitments. Detailed information is available to investors.',
    aside: facts([['Positions', String(portfolio.length)], ['Active', String(active)], ['Realised', String(portfolio.length - active)], ['Countries', '7']]),
    visual: `<div class="pf-visual" aria-hidden="true">${portfolio.map((p) => `<span>${sigil(p.code)}</span>`).join('')}</div><div class="phero__veil"></div>`,
    crumbs: [[null, 'Portfolio']],
  })}

  <section class="sec" data-theme="void">
    <div class="wrap">
      <div class="filters" data-filters="pf-grid">
        <div class="filters__groups">
          <div class="seg" role="group" aria-label="Filter by strategy" data-filter-group="strat">
            <button class="seg__btn" type="button" data-filter="all" aria-pressed="true">All <sup>${portfolio.length}</sup></button>
            ${Object.entries(stratLabels).map(([k, l]) => `<button class="seg__btn" type="button" data-filter="${k}" aria-pressed="false">${l} <sup>${count(k)}</sup></button>`)}
          </div>
          <div class="seg" role="group" aria-label="Filter by status" data-filter-group="status">
            <button class="seg__btn" type="button" data-filter="all" aria-pressed="true">All statuses</button>
            <button class="seg__btn" type="button" data-filter="active" aria-pressed="false">Active</button>
            <button class="seg__btn" type="button" data-filter="realised" aria-pressed="false">Realised</button>
          </div>
        </div>
        <div class="filters__end">
          <span class="filter-count" data-filter-count aria-live="polite">${portfolio.length} results</span>
          <div class="views" role="group" aria-label="View">
            <button type="button" data-view="grid" aria-pressed="true" aria-label="Grid">${icon.grid}</button>
            <button type="button" data-view="list" aria-pressed="false" aria-label="List">${icon.list}</button>
          </div>
        </div>
      </div>

      <ul class="pf" id="pf-grid" data-layout="grid">
        ${portfolio.map((p, i) => html`
          <li class="pf__item" data-filter-item data-tags="${p.strat} ${p.status}" data-reveal style="--d:${i % 4}">
            <button class="pcase spot" type="button" data-drawer-open="tpl-p-${i}">
              <span class="pcase__top"><span class="idx">P-${String(i + 1).padStart(2, '0')}</span><span class="pcase__status${p.status === 'active' ? ' is-on' : ''}">${statusLabel[p.status]}</span></span>
              <span class="pcase__sigil">${sigil(p.code)}</span>
              <span class="pcase__code">${p.code}</span>
              <span class="pcase__desc">${p.desc}</span>
              <span class="pcase__meta"><span>${stratLabels[p.strat]}</span><span>${p.year}</span><span>${p.region}</span></span>
            </button>
          </li>`)}
      </ul>
      <p class="pf__empty body-sm" data-filter-empty hidden>No position matches these filters.</p>
      ${portfolio.map(tpl)}
      <p class="ill pf__note">Illustrative portfolio. Code names do not reveal the identity of holdings.</p>
    </div>
  </section>

  ${ctaBand({
    label: 'Investors',
    title: 'Access portfolio<br><span class="dim">details.</span>',
    text: 'Valuations, KPIs and board minutes are available in the data room for Freya Sports Partners investors.',
    primary: ['investors.html', 'Investor centre'],
    secondary: ['login.html', 'Secure portal'],
  })}

  <aside class="drawer" data-drawer aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="drawer__scrim" data-drawer-close></div>
    <div class="drawer__panel" data-theme="dark">
      <button class="ibtn drawer__close" type="button" data-drawer-close aria-label="Close">${icon.close}</button>
      <div class="drawer__body" data-drawer-body></div>
    </div>
  </aside>`;
}
