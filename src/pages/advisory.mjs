import { html } from '../lib/html.mjs';
import { glyph } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';

export const meta = {
  id: 'advisory',
  section: 'advisory',
  title: 'Advisory',
  description: 'Freya Sports Partners’ Advisory practice: strategy, partnerships, brand, transactions and financing for sports organisations.',
  headerTheme: 'void',
};

const services = [
  { t: 'Strategy & development', d: 'Strategic plans, business models and growth roadmaps, built on the data from our models.', deliv: ['Economic and sporting diagnostic', 'Three- or five-year strategic plan', 'Detailed financial model', 'Operational roadmap'], who: ['Clubs and franchises', 'Leagues and federations', 'Local authorities'] },
  { t: 'Partnerships & sponsorship', d: 'Partnership architecture, inventory valuation and negotiation support with brands.', deliv: ['Inventory audit and valuation', 'Partner offer architecture', 'Negotiation support', 'Partner ROI measurement'], who: ['Clubs and leagues', 'Athletes', 'Brands'] },
  { t: 'Brand & positioning', d: 'Brand platforms for clubs, leagues and athletes: a story, an audience, a commercial value.', deliv: ['Brand platform', 'Audience and content strategy', 'Athlete positioning', 'Guidelines and narrative'], who: ['Clubs and leagues', 'Athletes', 'Competitions'] },
  { t: 'Transactions', d: 'Fundraising, disposals, equity investments: preparation, independent valuation and support through to closing.', deliv: ['Fundraising or sale readiness', 'Buy-side due diligence', 'Independent valuation', 'Shareholder agreements and governance'], who: ['Clubs and franchises', 'Investors', 'Platforms'] },
  { t: 'Structured financing', d: 'Financing solutions backed by rights, sponsorship and infrastructure, alongside specialist lenders.', deliv: ['Contractual cash-flow analysis', 'Financing structuring', 'Introductions to lenders', 'Covenant monitoring'], who: ['Clubs', 'Leagues', 'Venue owners'] },
];

const audiences = [
  ['Clubs & franchises', 'Revenue growth, governance, fundraising readiness.'],
  ['Leagues & federations', 'Media rights, business model, competitive balance.'],
  ['Athletes', 'Personal brand, partnerships, investments.'],
  ['Brands', 'Sponsorship strategy, asset selection, ROI measurement.'],
  ['Investors & public bodies', 'Due diligence, valuation, infrastructure projects.'],
];

const phases = [
  ['Diagnostic', '2 – 4 weeks', 'Interviews, data, benchmarks: a shared reading of the issues and priorities.'],
  ['Roadmap', '2 – 4 weeks', 'Costed options, trade-offs, an action plan approved by leadership.'],
  ['Execution', '4 – 12 weeks', 'Team support, negotiations, implementation.'],
  ['Measurement', 'Ongoing', 'Outcome KPIs, quarterly review, adjustments.'],
];

// Anonymised mandates — illustrative examples
const cases = [
  ['Top-flight women’s club', 'Partnership strategy overhaul', '+62%', 'sponsorship revenue in two seasons'],
  ['European professional league', 'Broadcast rights tender', '×2.4', 'annual value of the new contract'],
  ['Olympic athlete', 'Personal brand structuring', '4', 'premium partners signed in a year'],
  ['Multi-club group', 'Buy-side due diligence', '6 wks', 'from letter of intent to decision'],
];

export function render() {
  return html`
  ${pageHero({
    code: 'A-01 / Advisory',
    label: 'Advisory practice',
    title: 'Advice,<br><span class="dim">with the depth of an investor.</span>',
    lead: 'Strategy, partnerships, brand, transactions: our Advisory practice supports sports organisations as they scale, with the tools and standards of a fund.',
    aside: facts([['Mandates completed', '30+'], ['Clients', 'Clubs, leagues, brands, athletes'], ['Typical length', '6 to 16 weeks'], ['Team', '6 consultants']]),
    visual: `<canvas class="net-visual" data-viz="network" aria-hidden="true"></canvas><div class="phero__veil"></div>`,
    crumbs: [[null, 'Advisory']],
  })}

  <section class="sec" data-theme="void" id="services">
    <div class="wrap">
      ${sh({ idx: '01', label: 'Services', title: 'Five areas of expertise,<br><span class="dim">one standard.</span>', lead: 'Our consultants work with the investment team and the data platform. Our recommendations are the ones we would apply to our own holdings.' })}
      <div class="acc" data-acc data-acc-single>
        ${services.map((s, i) => html`
          <div class="acc__item${i === 0 ? ' is-open' : ''}">
            <h3>
              <button class="acc__btn" type="button" aria-expanded="${i === 0}" aria-controls="svc-${i}" id="svc-${i}-btn">
                <span class="idx">A/0${i + 1}</span>
                <span class="acc__title">${s.t}</span>
                <span class="acc__meta">${s.who.slice(0, 2).map((w) => `<span class="tag">${w}</span>`)}</span>
                <i class="acc__icon" aria-hidden="true"></i>
              </button>
            </h3>
            <div class="acc__panel" id="svc-${i}" role="region" aria-labelledby="svc-${i}-btn">
              <div><div class="acc__inner">
                <p>${s.d}</p>
                <div><h4>Deliverables</h4><ul class="ticks">${s.deliv.map((d) => `<li>${d}</li>`)}</ul></div>
                <div><h4>For whom</h4><ul class="ticks">${s.who.map((d) => `<li>${d}</li>`)}</ul></div>
              </div></div>
            </div>
          </div>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '02', label: 'Who we work with', title: 'The people<br><span class="dim">who make sport.</span>', split: true, lead: 'We work with every stakeholder in the business of sport — never on both sides of the same table.' })}
      <div class="audiences">
        ${audiences.map(([t, p], i) => html`<article class="audience" data-reveal style="--d:${i}"><span class="idx">0${i + 1}</span><h3 class="h4">${t}</h3><p class="body-sm">${p}</p></article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Method', title: 'Four phases,<br><span class="dim">measured results.</span>' })}
      <ol class="tl" style="--n:4">
        ${phases.map(([t, d, p], i) => html`<li class="tl__item${i === 2 ? ' is-now' : ''}" data-reveal style="--d:${i}"><span class="tl__year">0${i + 1}</span><span class="tag">${d}</span><h3 class="h4">${t}</h3><p>${p}</p></li>`)}
      </ol>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '04', label: 'Selected mandates', title: 'Results,<br><span class="dim">not slide decks.</span>', split: true, lead: 'Our mandates are confidential. The examples below are anonymised.' })}
      <div class="cases">
        ${cases.map(([who, what, v, unit], i) => html`
          <article class="case" data-reveal style="--d:${i}">
            <div class="case__top"><span class="idx">M/0${i + 1}</span><span class="case__glyph">${glyph(['rise', 'signal', 'network', 'stadium'][i])}</span></div>
            <span class="case__v">${v}</span>
            <span class="case__unit">${unit}</span>
            <div class="case__foot"><b>${who}</b><span>${what}</span></div>
          </article>`)}
      </div>
      <p class="ill cases__ill">Illustrative results</p>
    </div>
  </section>

  ${ctaBand({
    label: 'Advisory',
    title: 'Let’s talk<br><span class="dim">about your project.</span>',
    text: 'A first thirty-minute conversation, with no commitment, to understand your ambitions and constraints.',
    primary: ['contact.html', 'Book a meeting'],
    secondary: ['strategies.html', 'Our strategies'],
  })}`;
}
