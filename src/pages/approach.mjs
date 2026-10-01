import { html } from '../lib/html.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';
import { radar, riskMatrix } from '../lib/charts.mjs';
import { selection } from '../data/metrics.mjs';

export const meta = {
  id: 'approach',
  section: 'firm',
  title: 'Approach',
  description: 'From data to conviction: a five-stage investment process, the six-factor Freya model, risk management and data platform.',
  headerTheme: 'void',
};

const steps = [
  { title: 'Sourcing', head: 'A proprietary flow, qualified continuously.', text: 'A proprietary network of federations, leagues, clubs, broadcasters, agents and investment banks. Every opportunity is logged, qualified and tracked in our systems — even when declined.', ticks: ['Continuous coverage of twelve sports', 'Qualification within ten business days', 'Full history kept for every opportunity'], label: 'opportunities analysed' },
  { title: 'Modelling', head: 'A model that forces you to be explicit.', text: 'Shortlisted opportunities enter the Freya model: six factors weighted by strategy, calibrated on historical transactions and sporting performance.', ticks: ['Multi-factor score out of 100', 'Sporting performance scenarios', 'Sensitivity to rights cycles'], label: 'opportunities modelled' },
  { title: 'Due diligence', head: 'Four diligences, two sets of eyes.', text: 'Financial, legal, sporting, reputational: each dimension is investigated by a pair, then cross-checked by an independent third party.', ticks: ['Review of rights and sponsorship contracts', 'Audit of wage bill and transfers', 'Field interviews: staff, athletes, partners'], label: 'in-depth reviews' },
  { title: 'Committee', head: 'A written decision, and a challenged one.', text: 'Written memorandum, adversarial review, unanimous decision. For every case, one partner is appointed to argue the opposite position.', ticks: ['Standardised memorandum', 'Appointed devil’s advocate', 'Reasoned, archived decision'], label: 'cases presented' },
  { title: 'Investment', head: 'A thesis reviewed every year.', text: 'Instrument structuring, a 100-day plan, governance, Advisory support. Monitoring is monthly; the thesis is reviewed every year, without complacency.', ticks: ['100-day plan', 'Board seat or observer', 'Annual thesis review'], label: 'positions opened' },
];

const factors = [
  ['Sporting performance', 20, 'Results, progression, squad depth, tracking data.'],
  ['Audience', 20, 'Attendance, TV and streaming audiences, digital communities.'],
  ['Revenue', 20, 'Quality, recurrence and diversification of revenue.'],
  ['Governance', 15, 'Board independence, cost control, compliance.'],
  ['Rights & assets', 15, 'Media and sponsorship contracts, real estate, academy, brand.'],
  ['Impact', 10, 'Equality, local roots, environmental footprint.'],
];

const risks = [
  { code: 'R1', name: 'Sporting', p: 3, i: 4, desc: 'Relegation, injuries, lasting underperformance.', mit: 'Relegation clauses, diversification across sports, insurance cover.', freq: 'Monthly' },
  { code: 'R2', name: 'Media rights', p: 3, i: 3, desc: 'Downward renegotiation of broadcast contracts.', mit: 'Maturities aligned with rights cycles, stress scenarios.', freq: 'Quarterly' },
  { code: 'R3', name: 'Counterparty', p: 2, i: 4, desc: 'Default of a broadcaster, sponsor or debtor club.', mit: 'Rated counterparties, enforceable security, group limits.', freq: 'Monthly' },
  { code: 'R4', name: 'Regulatory', p: 2, i: 3, desc: 'Changes to league and federation financial rules.', mit: 'Legal monitoring, dialogue with governing bodies, adaptation clauses.', freq: 'Quarterly' },
  { code: 'R5', name: 'Reputation', p: 1, i: 5, desc: 'Governance or conduct contrary to our principles.', mit: 'Reputational due diligence, ethics clauses, exit rights.', freq: 'Ongoing' },
  { code: 'R6', name: 'Liquidity', p: 4, i: 3, desc: 'Difficulty exiting a minority stake.', mit: 'Long horizon, tag-along rights, shareholder agreements.', freq: 'Half-yearly' },
];

const sources = [
  ['Performance', 11, 'Optical tracking, event data, training load, results history.'],
  ['Audience', 9, 'Attendance, linear and digital audiences, social engagement, ticketing.'],
  ['Finance', 8, 'Published accounts, wage bills, transfers, sponsorship contracts.'],
  ['Governance', 5, 'Board composition, pay, litigation, compliance.'],
  ['Market', 5, 'Rights tenders, comparable transactions, valuations.'],
];

export function render() {
  const total = sources.reduce((a, s) => a + s[1], 0);
  return html`
  ${pageHero({
    code: 'F-02 / Approach',
    label: 'Approach',
    title: 'From data<br><span class="dim">to conviction.</span>',
    lead: 'Our method fits in one sentence: measure before you believe. Every opportunity goes through five stages and a proprietary six-factor model before reaching the investment committee.',
    aside: facts([['Selection rate', '&lt; 1%'], ['Model factors', '6'], ['Data sources', String(total)], ['Average review', '14 weeks']]),
    visual: `<canvas class="flow-visual" data-viz="flow" data-cy="0.42"></canvas><div class="phero__veil phero__veil--soft"></div>`,
    crumbs: [['firm.html', 'Firm'], [null, 'Approach']],
  })}

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '01', label: 'Process', title: 'Five stages,<br><span class="dim">one standard.</span>', lead: 'The process is the same for every strategy. Only the model weightings and the type of instrument change.' })}
      <div class="steps" data-steps>
        <div class="steps__pin">
          <div class="steps__panel">
            <div class="steps__top">
              <span class="label label--dot">Stage</span>
              <span class="steps__num" data-step-num>01<small>/05</small></span>
              <h3 class="h3" data-step-title>${steps[0].title}</h3>
            </div>
            <canvas class="steps__dots" data-viz="dots" data-counts="${selection.map((s) => s.value).join(',')}" aria-hidden="true"></canvas>
            <div class="steps__foot">
              <div class="steps__metric"><b class="num" data-step-metric>${selection[0].value.toLocaleString('en-US')}</b><span class="micro" data-step-label>${steps[0].label}</span></div>
              <div class="steps__bar">${steps.map(() => '<i></i>')}</div>
            </div>
          </div>
        </div>
        <div class="steps__list">
          ${steps.map((s, i) => html`
            <article class="step" data-title="${s.title}" data-metric="${selection[i].value.toLocaleString('en-US')}" data-metric-label="${s.label}">
              <span class="idx">${String(i + 1).padStart(2, '0')} — ${s.title}</span>
              <h3 class="h3">${s.head}</h3>
              <p>${s.text}</p>
              <ul class="ticks">${s.ticks.map((t) => `<li>${t}</li>`)}</ul>
            </article>`)}
        </div>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '02', label: 'The Freya model', title: 'Six factors,<br><span class="dim">one score out of 100.</span>', split: true, lead: 'The model compares each asset with the median of its universe. It does not decide: it forces us to state what we believe, and why.' })}
      <div class="model">
        <div class="model__chart">
          ${radar({
            id: 'fig-radar',
            fig: 'Fig. 02',
            title: 'Multi-factor profile — asset under review vs universe median',
            axes: factors.map((f) => f[0]),
            series: [
              { name: 'Asset under review', hi: true, values: [78, 86, 64, 71, 58, 82] },
              { name: 'Universe median', values: [55, 52, 57, 49, 51, 46] },
            ],
          })}
        </div>
        <div class="model__side">
          <div class="model__score" data-reveal>
            <span class="label">Freya score — example</span>
            <div class="bignum__v"><span data-count="73">73</span><small>/100</small></div>
            <p class="body-sm">Universe median: 52. Committee threshold: 65.</p>
          </div>
          <ul class="factors">
            ${factors.map(([n, w, d], i) => html`
              <li class="factor" data-reveal style="--d:${i}">
                <div class="factor__head"><span class="factor__name">${n}</span><span class="factor__w num">${w}%</span></div>
                <span class="factor__bar" style="--w:${w / 20}"><i></i></span>
                <p>${d}</p>
              </li>`)}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Risk management', title: 'Name the risks<br><span class="dim">before they happen.</span>', lead: 'Six risk families are mapped for every holding and reviewed by a committee chaired independently of management.' })}
      <div class="risk">
        <div class="risk__matrix">
          <div class="chart__head"><div class="chart__title"><span class="label">Fig. 03</span><p>Risk map — probability and impact (1 to 5)</p></div></div>
          ${riskMatrix({ id: 'fig-risks', risks })}
        </div>
        <div class="risk__table">
          <div class="tbl-wrap">
            <table class="tbl">
              <thead><tr><th scope="col">Risk</th><th scope="col">Mitigation</th><th scope="col" class="r">Review</th></tr></thead>
              <tbody>${risks.map((r) => html`<tr><th scope="row"><span class="risk__code">${r.code}</span>${r.name}<small>${r.desc}</small></th><td>${r.mit}</td><td class="r">${r.freq}</td></tr>`)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark" id="data">
    <div class="wrap">
      ${sh({ idx: '04', label: 'Data platform', title: 'The pitch,<br><span class="dim">read like a market.</span>', split: true, lead: `${total} data sources feed our models, from players’ positions on the pitch to the clauses of rights contracts.` })}
      <div class="datax">
        <figure class="datax__pitch" data-reveal>
          <div class="datax__bar">
            <span class="label label--dot">Space control — simulation</span>
            <span class="micro">25 Hz tracking · 22 players · Voronoi diagram</span>
          </div>
          <div class="datax__canvas"><canvas data-viz="pitch" aria-label="Simulation of space control on a football pitch" role="img"></canvas></div>
          <figcaption class="chart__cap"><span>Illustrative visualisation — each zone is assigned to the nearest team.</span></figcaption>
        </figure>
        <ul class="sources">
          ${sources.map(([n, c, d], i) => html`
            <li class="source" data-reveal style="--d:${i}">
              <span class="source__n num">${String(c).padStart(2, '0')}</span>
              <div><h3 class="h4">${n}</h3><p class="body-sm">${d}</p></div>
            </li>`)}
        </ul>
      </div>
    </div>
  </section>

  ${ctaBand({
    label: 'Put the method to the test',
    title: 'An opportunity<br><span class="dim">to submit?</span>',
    text: 'Clubs, leagues, platforms, rights holders: every submission receives a reasoned answer within ten business days.',
    primary: ['contact.html', 'Submit an opportunity'],
    secondary: ['strategies.html', 'Our strategies'],
  })}`;
}
