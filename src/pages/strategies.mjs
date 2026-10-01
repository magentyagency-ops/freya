import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { glyph } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand, btn, link, meter } from '../lib/ui.mjs';
import { hbars } from '../lib/charts.mjs';
import { strategies, affaires } from '../data/strategies.mjs';

export const meta = {
  id: 'strategies',
  section: 'strategies',
  title: 'Strategies',
  description: 'Women’s sport, sports assets, media and data, structured credit: the four investment strategies of Freya Sports Partners.',
  headerTheme: 'void',
};

const themes = ['ice', 'dark', 'void', 'dark'];

function detail(s, i) {
  const theme = themes[i];
  return html`
  <section class="sec strat" id="${s.anchor}" data-theme="${theme}">
    ${theme !== 'ice' ? gl() : ''}
    <div class="wrap strat__grid${i % 2 ? ' strat__grid--rev' : ''}">
      <div class="strat__main">
        <div class="strat__meta"><span class="idx">${s.code}</span>${s.tag ? `<span class="tag${i === 0 ? ' tag--accent' : ''}">${s.tag}</span>` : ''}</div>
        <h2 class="h1" data-split>${s.name}</h2>
        <p class="lead strat__tagline" data-reveal>${s.tagline}</p>
        <p class="body strat__body" data-reveal>${s.summary} ${s.body}</p>
        <div class="strat__cols" data-reveal>
          <div><h3 class="label">Targets</h3><ul class="ticks">${s.targets.map((t) => `<li>${t}</li>`)}</ul></div>
          <div><h3 class="label">Criteria</h3><ul class="ticks">${s.criteria.map((t) => `<li>${t}</li>`)}</ul></div>
        </div>
        ${i === 0 ? `<div class="btns" data-reveal>${btn('womens-sport.html', 'The women’s sport thesis', { variant: 'solid' })}</div>` : ''}
      </div>
      <aside class="strat__side" data-reveal>
        <div class="strat__glyph">${glyph(s.visual)}</div>
        ${facts([
          ['Instruments', s.instruments.join('<br>')],
          ['Horizon', s.horizon],
          ['Ticket size', s.ticket],
          ['Risk profile', `${meter(s.risk)} <span class="meter__t">${s.risk}/5</span>`],
          ['Target allocation', `${s.allocation}%`],
        ])}
      </aside>
    </div>
  </section>`;
}

export function render() {
  return html`
  ${pageHero({
    code: 'S-00 / Strategies',
    label: 'Strategies',
    title: 'Four strategies.<br><span class="dim">One discipline.</span>',
    lead: 'A multi-strategy fund dedicated to the business of sport: from growth equity to structured financing, with one core thesis — women’s sport.',
    aside: facts([['Strategies', '4 + Advisory'], ['Core thesis', 'Women’s sport · 40%'], ['Horizons', '1 to 10 years'], ['Geography', 'Europe · North America']]),
    visual: `<div class="strat-visual" aria-hidden="true">${strategies.map((s) => `<div>${glyph(s.visual)}<span class="micro">${s.code}</span></div>`).join('')}</div><div class="phero__veil"></div>`,
    crumbs: [[null, 'Strategies']],
  })}

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '01', label: 'Overview', title: 'Performance drivers,<br><span class="dim">deliberately uncorrelated.</span>', lead: 'Sporting results, audiences, contracts: each strategy depends on a different driver. Combined, they reduce the portfolio’s dependence on any single season, league or broadcaster.' })}
      <div class="tbl-wrap" data-reveal>
        <table class="tbl matrix">
          <thead><tr><th scope="col">Strategy</th><th scope="col">Instruments</th><th scope="col">Horizon</th><th scope="col">Ticket</th><th scope="col">Risk</th><th scope="col" class="r">Allocation</th></tr></thead>
          <tbody>
            ${strategies.map((s) => html`<tr>
                <th scope="row"><a href="${s.href}" class="matrix__name"><span class="idx">${s.code}</span>${s.name}${icon.arrowUpRight}</a></th>
                <td>${s.instruments.join(', ')}</td>
                <td class="num">${s.horizon}</td>
                <td class="num">${s.ticket}</td>
                <td>${meter(s.risk)}</td>
                <td class="r num">${s.allocation}%</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
      <div class="alloc">
        ${hbars({
          id: 'fig-allocation',
          fig: 'Fig. 01',
          title: 'Target capital allocation by strategy',
          items: strategies.map((s, i) => ({ label: s.name, sub: s.code, value: s.allocation, hi: i === 0 })),
          unit: '%',
          max: 50,
          source: 'Investment policy — target allocation, illustrative.',
        })}
        <div class="alloc__text" data-reveal>
          <p class="body">The women’s sport strategy carries most of the capital: it is our strongest conviction. The other three strategies bring complementary return drivers and staggered liquidity.</p>
          ${link('womens-sport.html', 'Read the core thesis')}
        </div>
      </div>
    </div>
  </section>

  ${strategies.map(detail)}

  <section class="sec sec--sm" data-theme="void">
    <div class="wrap">
      <a class="affband" href="${affaires.href}" data-reveal>
        <span class="affband__glyph">${glyph('network')}</span>
        <span class="affband__txt">
          <span class="idx">${affaires.code} — ${affaires.tag}</span>
          <span class="h2">${affaires.name}<span class="dim"> — ${affaires.tagline.toLowerCase()}</span></span>
        </span>
        <span class="affband__arrow">${icon.arrowUpRight}</span>
      </a>
    </div>
  </section>

  ${ctaBand({
    label: 'Invest alongside us',
    title: 'Interested in<br><span class="dim">a strategy?</span>',
    text: 'Access to vehicles managed by Freya Sports Partners is restricted to professional investors.',
    primary: ['investors.html', 'Investor centre'],
    secondary: ['contact.html', 'Contact us'],
  })}`;
}
