import { html } from '../lib/html.mjs';
import { glyph } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand, link } from '../lib/ui.mjs';
import { lineChart } from '../lib/charts.mjs';
import { asymmetry } from '../data/metrics.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'womens-sport',
  section: 'strategies',
  title: 'Women’s sport',
  description: 'Freya Sports Partners’ core thesis: women’s sport is the most undervalued market in global sport. Catalysts, segments, value creation.',
  headerTheme: 'void',
};

const multiples = [
  { v: '4.7', label: 'Audience', note: '2026 index, 2018 = 1' },
  { v: '2.8', label: 'Revenue', note: '2026 index, 2018 = 1' },
  { v: '1.6', label: 'Valuations', note: '2026 index, 2018 = 1' },
];

const catalysts = [
  ['Professional leagues', 'Professional status, minimum salaries, training centres: the economic foundations strengthen season after season.'],
  ['New broadcast deals', 'Rights are now sold separately, to dedicated broadcasters and direct-to-consumer platforms.'],
  ['Premium sponsors arrive', 'Brands seek engaged audiences and strong values. They sign longer — and for more.'],
  ['Governance standards', 'Leagues impose financial and governance rules that make long-term investment safer.'],
];

const segments = [
  ['Clubs & franchises', 'rise', 'Minority growth stakes in clubs with strong audience and commercial revenue potential.'],
  ['Leagues & competitions', 'stadium', 'Supporting leagues and competitions as they structure their commercial model and monetise their rights.'],
  ['Media & platforms', 'signal', 'Distribution platforms, content and communities dedicated to women’s sport.'],
  ['Products & health', 'tranches', 'Tailored equipment, athlete health and performance monitoring, injury prevention.'],
];

const levers = [
  ['Governance', 'A structured board, monthly reporting, an audit committee: the standards of an institutional asset.'],
  ['Commercial revenue', 'Redesigned partnership inventory, dynamic ticketing, hospitality.'],
  ['Data & audience', 'Fan insight, digital strategy, direct monetisation.'],
  ['Infrastructure', 'Access to venues and training centres sized for growth.'],
  ['Talent', 'Executive hiring, athlete support, health and post-career.'],
];

export function render() {
  return html`
  ${pageHero({
    code: 'S-01 / Women’s sport',
    label: 'Core thesis',
    title: 'The most undervalued market<br><span class="dim">in global sport.</span>',
    lead: 'Women’s sport audiences are growing faster than its revenue, and its revenue faster than its valuations. Freya invests in that gap — with method, patience and operational rigour.',
    aside: facts([['Target allocation', '40%'], ['Horizon', '7 – 10 years'], ['Ticket size', '€5 – 25m'], ['Instruments', 'Growth equity']]),
    visual: `<div class="sf-visual" data-reveal>${glyph('rise')}</div><div class="phero__veil"></div>`,
    crumbs: [['strategies.html', 'Strategies'], [null, 'Women’s sport']],
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      <div class="statement-block">
        <div class="statement-block__meta"><span class="idx" data-scramble>01</span><span class="label">The thesis</span></div>
        <p class="statement" data-highlight>Three curves, three speeds. The gap between them is not an anomaly: it is the signature of a market in transition. It closes in steps — with every rights cycle, every premium partner, every new venue.</p>
      </div>
      <div class="multiples">
        ${multiples.map((m, i) => html`
          <div class="multiple" data-reveal style="--d:${i}">
            <span class="label">${m.label}</span>
            <span class="multiple__v">×<span>${m.v}</span></span>
            <span class="micro">${m.note}</span>
            <span class="multiple__bar" style="--w:${parseFloat(m.v) / 4.7}"><i></i></span>
          </div>`)}
      </div>
      <p class="ill">Schematic trajectories — illustrative data as of ${site.asOf}</p>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '02', label: 'Asymmetry', title: 'Audience ahead,<br><span class="dim">revenue behind.</span>', split: true, lead: 'The gap between the attention captured and the revenue generated measures the value the market has yet to price in.' })}
      ${lineChart({ id: 'fig-ws-asym', fig: 'Fig. 01', title: 'Elite women’s sport — audience and revenue, index 2018 = 100', ...asymmetry, gapLabel: 'Asymmetry' })}
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Why now', title: 'Four catalysts,<br><span class="dim">all at once.</span>', lead: 'Each one alone would justify attention. Together, they make the current period a rare entry window.' })}
      <div class="cards" style="--cols:4">
        ${catalysts.map(([t, p], i) => html`
          <article class="card catalyst spot" data-reveal style="--d:${i}">
            <span class="catalyst__n">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="h4">${t}</h3>
            <p>${p}</p>
          </article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '04', label: 'Where we invest', title: 'Four segments,<br><span class="dim">one value chain.</span>' })}
      <div class="segments">
        ${segments.map(([t, g, p], i) => html`
          <article class="segment" data-reveal style="--d:${i}">
            <div class="segment__glyph">${glyph(g)}</div>
            <span class="idx">WS/0${i + 1}</span>
            <h3 class="h3">${t}</h3>
            <p class="body-sm">${p}</p>
          </article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap split">
      <div class="split__aside">
        <span class="idx" data-scramble>05</span>
        <span class="label">Value creation</span>
        <h2 class="h2" data-split>Five levers,<br><span class="dim">pulled from day one.</span></h2>
        <p class="body" data-reveal>Every holding has a 100-day plan built with management and the Advisory practice.</p>
      </div>
      <div class="split__main">
        <ul class="rows">
          ${levers.map(([t, p], i) => html`<li data-reveal style="--d:${i}"><div class="row row--static"><span class="idx">L/0${i + 1}</span><span class="row__title">${t}</span><span class="row__desc">${p}</span></div></li>`)}
        </ul>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      <figure class="quote" data-reveal>
        <span class="quote__mark" aria-hidden="true">“</span>
        <blockquote><p>Women’s sport doesn’t need patrons. It needs demanding investors who treat it as an asset — and who stay long enough to see the value being built.</p></blockquote>
        <figcaption><span class="advisor__mono">LO</span><span><b>Léa Okoye-Brunel</b><span>Partner, Women’s Sport</span></span></figcaption>
      </figure>
    </div>
  </section>

  <section class="sec sec--sm" data-theme="ice">
    <div class="wrap impact-strip">
      <div data-reveal><span class="label label--dot">Impact</span><h2 class="h3">Equality as a performance driver, measured as one.</h2></div>
      <p class="body" data-reveal>Every holding tracks equality, governance and community KPIs, audited every year.</p>
      <div data-reveal>${link('impact.html', 'Our commitments')}</div>
    </div>
  </section>

  ${ctaBand({
    label: 'Women’s sport',
    title: 'A project<br><span class="dim">in women’s sport?</span>',
    text: 'Clubs, leagues, platforms, founders: we review every submission and reply within ten business days.',
    primary: ['contact.html', 'Present a project'],
    secondary: ['article-womens-sport-anatomy-of-a-market.html', 'Read the research note'],
  })}`;
}
