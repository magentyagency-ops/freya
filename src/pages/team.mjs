import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';
import { partners, team, advisors } from '../data/team.mjs';

export const meta = {
  id: 'team',
  section: 'firm',
  title: 'Team',
  description: 'The partners, investment team and advisory board of Freya Sports Partners: finance, data and experience on the pitch.',
  headerTheme: 'void',
};

const initials = (n) => n.replace(/^Dr\s+/, '').split(/[\s-]+/).filter((w) => /^[A-ZÀ-Ý]/.test(w)).map((w) => w[0]).slice(0, 2).join('');

function partnerTpl(p, i) {
  return html`
  <template id="tpl-${p.id}">
    <div class="pbio__head">
      <div class="portrait pbio__portrait"><canvas data-portrait="${p.id}"></canvas><span class="portrait__id">FSP/P-0${i + 1}</span></div>
      <div>
        <span class="label label--dot">${p.role}</span>
        <h2 class="h2 pbio__name" id="drawer-title">${p.name}</h2>
      </div>
    </div>
    <div class="prose pbio__text">${p.bio.map((b) => `<p>${b}</p>`)}</div>
    ${facts([['Expertise', p.focus.join(' · ')], ['Committees', p.board.join('<br>')]])}
    <div class="btns">
      <a class="btn btn--ghost btn--sm" href="mailto:contact@freyasportspartners.com?subject=${encodeURIComponent('For the attention of ' + p.name)}"><span class="btn__label"><span class="roll"><span data-text="Email">Email</span></span></span><span class="btn__icon">${icon.mail}${icon.mail}</span></a>
    </div>
  </template>`;
}

export function render() {
  return html`
  ${pageHero({
    code: 'F-03 / Team',
    label: 'Team',
    title: 'Investors,<br><span class="dim">operators, athletes.</span>',
    lead: 'A multidisciplinary team bringing together finance, data and experience on the pitch. Gender parity is respected among the partners, on the investment committee and on the advisory board.',
    aside: facts([['People', '16'], ['Nationalities', '6'], ['Partners', '2 women · 2 men'], ['Former athletes', '4']]),
    visual: `<div class="team-visual" aria-hidden="true">${partners.map((p) => `<div class="portrait"><canvas data-portrait="${p.id}"></canvas></div>`).join('')}</div><div class="phero__veil"></div>`,
    crumbs: [['firm.html', 'Firm'], [null, 'Team']],
  })}

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '01', label: 'Partners', title: 'Four partners,<br><span class="dim">personally committed.</span>', lead: 'Partners invest personally in every vehicle managed by the firm and sit on the investment committee.' })}
      <div class="partners">
        ${partners.map((p, i) => html`
          <article class="pcard" data-reveal style="--d:${i}">
            <button class="pcard__btn" type="button" data-drawer-open="tpl-${p.id}" aria-label="Biography of ${p.name}">
              <div class="portrait"><canvas data-portrait="${p.id}"></canvas><span class="portrait__id">FSP/P-0${i + 1}</span></div>
              <div class="pcard__body">
                <h3 class="h4">${p.name}</h3>
                <span class="pcard__role">${p.role}</span>
                <p class="body-sm">${p.short}</p>
                <span class="pcard__more">Biography ${icon.plus}</span>
              </div>
            </button>
          </article>`)}
      </div>
      ${partners.map(partnerTpl)}
    </div>
  </section>

  <section class="sec" data-theme="dark">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '02', label: 'Investment team', title: 'Finance, data,<br><span class="dim">the pitch.</span>', split: true, lead: 'Each strategy is led by a partner–director pair, supported by the data team and the compliance function.' })}
      <ul class="team">
        ${team.map((m, i) => html`
          <li class="tmember" data-reveal style="--d:${i % 4}">
            <div class="portrait portrait--sm"><canvas data-portrait="${m.id}"></canvas><span class="portrait__id">${initials(m.name)}</span></div>
            <h3 class="tmember__name">${m.name}</h3>
            <span class="tmember__role">${m.role}</span>
            <span class="tmember__unit micro">${m.unit}</span>
          </li>`)}
      </ul>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Advisory board', title: 'The view of those<br><span class="dim">who have played.</span>', lead: 'Former athletes, league and media executives, physicians: the advisory board challenges our theses twice a year and supports our holdings.' })}
      <ul class="advisors">
        ${advisors.map((a, i) => html`
          <li class="advisor" data-reveal style="--d:${i}">
            <span class="advisor__mono">${initials(a.name)}</span>
            <div class="advisor__main"><h3 class="h4">${a.name}</h3><p class="body-sm">${a.role}</p></div>
            <span class="tag">${a.area}</span>
          </li>`)}
      </ul>
    </div>
  </section>

  <section class="sec sec--sm" data-theme="dark">
    <div class="wrap culture">
      ${[
        ['50%', 'women among the partners and on the investment committee'],
        ['4', 'former elite athletes on the team and advisory board'],
        ['100%', 'of partners co-invest in every vehicle'],
      ].map(([v, t], i) => html`<div class="culture__item" data-reveal style="--d:${i}"><span class="culture__v">${v}</span><p>${t}</p></div>`)}
      <p class="ill culture__ill">Illustrative data</p>
    </div>
  </section>

  ${ctaBand({
    label: 'Careers',
    title: 'Join<br><span class="dim">the team.</span>',
    text: 'We hire people who love models as much as the pitch. Speculative applications welcome.',
    primary: ['careers.html', 'Open roles'],
    secondary: ['contact.html', 'Write to us'],
  })}

  <aside class="drawer" data-drawer aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="drawer__scrim" data-drawer-close></div>
    <div class="drawer__panel" data-theme="dark">
      <button class="ibtn drawer__close" type="button" data-drawer-close aria-label="Close">${icon.close}</button>
      <div class="drawer__body" data-drawer-body></div>
    </div>
  </aside>`;
}
