import { html } from '../lib/html.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'impact',
  section: 'firm',
  title: 'Impact',
  description: 'Equality, governance, communities, climate: Freya Sports Partners’ impact commitments, their KPIs and our responsible investment policy.',
  headerTheme: 'void',
};

// Progress on commitments — ILLUSTRATIVE
const progress = [
  { v: 34, target: 40, label: 'Women in leadership bodies', unit: '%' },
  { v: 78, target: 100, label: 'Holdings with an audit committee', unit: '%' },
  { v: 56, target: 100, label: 'Carbon footprints completed', unit: '%' },
  { v: 89, target: 100, label: 'Pay gap measured', unit: '%' },
];

const ring = ({ v, target }) => {
  const R = 52, C = 2 * Math.PI * R;
  const pv = (v / 100) * C, pt = (target / 100) * C;
  const ta = (target / 100) * 360 - 90;
  const tx = 60 + Math.cos((ta * Math.PI) / 180) * R, ty = 60 + Math.sin((ta * Math.PI) / 180) * R;
  return `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
    <circle class="ring__track" cx="60" cy="60" r="${R}"/>
    <circle class="ring__target" cx="60" cy="60" r="${R}" stroke-dasharray="${pt.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/>
    <circle class="ring__val" cx="60" cy="60" r="${R}" style="--c:${C.toFixed(1)};--v:${pv.toFixed(1)}" transform="rotate(-90 60 60)"/>
    <circle class="ring__tick" cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3.5"/>
  </svg>`;
};

const pillars = [
  ['Equality', 'Accelerate the professionalisation of women’s sport and guarantee equal treatment in every holding.', '40% women in portfolio leadership bodies by 2028.'],
  ['Governance', 'Independent boards, transparent pay, zero tolerance on compliance.', '100% of holdings with an audit committee by 2027.'],
  ['Communities', 'Root clubs in their communities: development, access to sport, local partnerships.', '1% of portfolio company revenue dedicated to local programmes.'],
  ['Climate', 'Measure, then reduce the footprint of travel, venues and events.', 'Carbon footprint covering 100% of the portfolio by 2027.'],
];

const kpis = [
  ['Equality', 'Share of women in leadership bodies', 'Annual', 'Portfolio company reporting'],
  ['Equality', 'Pay gap for comparable roles', 'Annual', 'Social audit'],
  ['Equality', 'Broadcast hours of women’s competitions', 'Half-yearly', 'Broadcasters'],
  ['Governance', 'Board independence', 'Annual', 'Board minutes'],
  ['Governance', 'Reported compliance incidents', 'Ongoing', 'Compliance function'],
  ['Communities', 'Registered players supported', 'Annual', 'Federations, clubs'],
  ['Climate', 'Emissions, scopes 1 to 3', 'Annual', 'Carbon footprint'],
  ['Climate', 'Share of low-carbon travel', 'Annual', 'Portfolio companies'],
];

const exclusions = ['Unregulated sports betting', 'Tobacco and vaping products', 'Controversial weapons', 'Thermal coal', 'Entities under international sanctions', 'Serious human rights abuses', 'Sponsorship harmful to athlete health'];

const integration = [
  ['ESG due diligence', 'Systematic, carried out with an independent third party for every investment.'],
  ['Shareholder clauses', 'Quantified ESG commitments written into shareholder agreements.'],
  ['100-day plan', 'Impact roadmap built with management.'],
  ['Annual review', 'Audited KPIs; part of the team’s variable pay is linked to them.'],
];

export function render() {
  return html`
  ${pageHero({
    code: 'F-04 / Impact',
    label: 'Impact & responsibility',
    title: 'Measuring impact<br><span class="dim">with the rigour of performance.</span>',
    lead: 'Impact is not an afterthought. It is built into our investment model, tracked through KPIs, audited every year and published.',
    aside: facts([['KPIs tracked', '24'], ['Review', 'Annual, audited'], ['Report', 'Published every spring'], ['Exclusions', '7 sectors']]),
    visual: `<div class="impact-visual" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<i style="--i:${i}"></i>`).join('')}</div><div class="phero__veil"></div>`,
    crumbs: [['firm.html', 'Firm'], [null, 'Impact']],
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '01', label: 'Commitments', title: 'Four commitments,<br><span class="dim">each with a dated target.</span>' })}
      <div class="pillars">
        ${pillars.map(([t, p, target], i) => html`
          <article class="pillar" data-reveal style="--d:${i}">
            <span class="idx">I/0${i + 1}</span>
            <h3 class="h3">${t}</h3>
            <p class="body-sm">${p}</p>
            <div class="pillar__target"><span class="micro">Target</span><p>${target}</p></div>
          </article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '02', label: 'Progress', title: 'Where we stand,<br><span class="dim">unrounded.</span>', split: true, lead: `Progress measured across the whole portfolio as of ${site.asOf}. The marker shows each commitment’s target.` })}
      <div class="rings">
        ${progress.map((p, i) => html`
          <figure class="ringcard" data-reveal style="--d:${i}">
            <div class="ringcard__viz">${ring(p)}<span class="ringcard__v"><span><span data-count="${p.v}">${p.v}</span><small>${p.unit}</small></span></span></div>
            <figcaption><b>${p.label}</b><span class="micro">Target ${p.target}${p.unit}</span></figcaption>
          </figure>`)}
      </div>
      <p class="ill rings__ill">Illustrative data</p>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '03', label: 'KPIs', title: 'Twenty-four KPIs,<br><span class="dim">eight published here.</span>', lead: 'KPIs are collected from each holding, checked by the team and audited by a third party before publication.' })}
      <div class="tbl-wrap" data-reveal>
        <table class="tbl kpi-tbl">
          <thead><tr><th scope="col">Theme</th><th scope="col">Indicator</th><th scope="col">Frequency</th><th scope="col">Source</th></tr></thead>
          <tbody>${kpis.map(([a, b, c, d]) => `<tr><td><span class="tag">${a}</span></td><th scope="row">${b}</th><td>${c}</td><td>${d}</td></tr>`)}</tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '04', label: 'Responsible investment', title: 'What we refuse,<br><span class="dim">what we require.</span>' })}
      <div class="resp">
        <div class="resp__col" data-reveal><h3 class="h4">Sector exclusions</h3><ul class="ticks">${exclusions.map((e) => `<li>${e}</li>`)}</ul></div>
        <div class="resp__col" data-reveal style="--d:1"><h3 class="h4">Built into every stage</h3><dl class="dl-rows">${integration.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`)}</dl></div>
      </div>
    </div>
  </section>

  ${ctaBand({
    label: 'Impact report',
    title: 'Receive<br><span class="dim">the impact report.</span>',
    text: 'Methodology, KPIs by holding, progress on commitments: the report is available on request.',
    primary: [`mailto:${site.email}?subject=${encodeURIComponent('Request — Impact report')}`, 'Request the report'],
    secondary: ['approach.html', 'Our approach'],
  })}`;
}
