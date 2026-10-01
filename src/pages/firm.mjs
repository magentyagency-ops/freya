import { html } from '../lib/html.mjs';
import { fehuConstruction } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';

export const meta = {
  id: 'firm',
  section: 'firm',
  title: 'The Firm',
  description: 'Freya Sports Partners, an independent investment firm dedicated to the business of sport: purpose, principles, governance and milestones.',
  headerTheme: 'void',
};

const principles = [
  ['Independence', 'A partner-owned firm with no affiliation to any club, league or broadcaster. Our recommendations serve one interest only: that of our investors.'],
  ['Discipline', 'A written process, applied to every opportunity and documented at every stage. Conviction comes after measurement, never before.'],
  ['Alignment', 'Partners invest personally alongside our investors. Same risks, same horizon, same standards.'],
  ['Transparency', 'Complete reporting, explicit assumptions, acknowledged mistakes. Trust is built on precision.'],
  ['Long-term view', 'Sport moves in cycles: seasons, rights, generations of athletes. Our investments are sized to see them through.'],
  ['Measured impact', 'Equality, governance and local roots are tracked with KPIs, just like financial performance.'],
];

const governance = [
  { name: 'Investment committee', text: 'Decides every investment and every exit, based on a written memorandum and an adversarial review.', facts: [['Frequency', 'Monthly'], ['Members', 'Partners + 1 independent'], ['Decision', 'Unanimous']] },
  { name: 'Risk committee', text: 'Monitors portfolio exposure, counterparties and concentration limits. Holds a veto right.', facts: [['Frequency', 'Quarterly'], ['Chair', 'Independent'], ['Power', 'Veto']] },
  { name: 'Advisory board', text: 'Former athletes, club, league and media executives: a view from the pitch on our theses and holdings.', facts: [['Frequency', 'Twice a year'], ['Members', '6'], ['Role', 'Advisory']] },
  { name: 'Compliance & control', text: 'A function independent from management: anti-money laundering, conflicts of interest, ethics and ongoing control.', facts: [['Frequency', 'Ongoing'], ['Head', 'CCO'], ['Report', 'Annual']] },
];

const milestones = [
  { y: '2024', t: 'Origins', p: 'First research on the economics of women’s sport. Founding team assembled.' },
  { y: '2025', t: 'Platform', p: 'Data platform and six-factor Freya model go live. First transactions.' },
  { y: '2026', t: 'Acceleration', p: 'Advisory practice launched and women’s sport strategy deployed.', now: true },
  { y: '2027', t: 'Horizon', p: 'Broader European footprint and preparation of a second vehicle.', next: true },
];

export function render() {
  return html`
  ${pageHero({
    code: 'F-01 / Firm',
    label: 'The Firm',
    title: 'An independent firm,<br><span class="dim">built for sport’s long game.</span>',
    lead: 'Freya Sports Partners was born from one observation: sport has become an economy in its own right, yet it is still too often analysed with yesterday’s tools. We built a firm able to read it with the precision of an institutional investor — and to back it with the patience it requires.',
    aside: facts([['Headquarters', 'Paris'], ['Status', 'Independent firm'], ['Ownership', 'Partner-owned'], ['Footprint', 'Europe · North America']]),
    visual: `<div class="firme-visual" data-reveal>${fehuConstruction()}</div><div class="phero__veil"></div>`,
    crumbs: [[null, 'The Firm']],
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap statement-block">
      <div class="statement-block__meta"><span class="idx" data-scramble>01</span><span class="label">Purpose</span></div>
      <p class="statement" data-highlight>We believe the value of sport can be measured, that it is built over time, and that it only lasts if it is shared — between clubs, athletes, investors and the communities that support them.</p>
    </div>
  </section>

  <section class="sec sign" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '02', label: 'Name and mark', title: 'Freya, Fehu,<br><span class="dim">and a 40-unit grid.</span>' })}
      <div class="sign__grid">
        <div class="sign__mark" data-reveal>
          <div class="sign__plate">
            <svg class="mark sign__svg" viewBox="0 0 28 32" aria-hidden="true"><path class="b" d="M8 13.5 21 5"/><path class="b" d="M8 21.5 21 13"/><path d="M8 3v26"/></svg>
            <span class="sign__cap micro">ᚠ — Fehu · rune 01/24</span>
            <span class="sign__cap sign__cap--r micro">Angle 33° · Stave 26 u</span>
          </div>
        </div>
        <div class="sign__text">
          ${[
            ['Freya', 'A figure of Norse mythology, Freya is associated with both prosperity and battle — with value and effort. Her name expresses the firm’s ambition: to reconcile capital and performance.'],
            ['Fehu', 'Our mark derives from Fehu, the first rune of the Elder Futhark. It stood for mobile wealth — wealth that circulates, is passed on and grows. One stave, two rising strokes: structure and growth. Nothing more.'],
            ['The grid', 'The mark is drawn on a 40-unit grid with a single 33° angle. The same rigour we apply to our models: few elements, each one justified.'],
          ].map(([t, p], i) => html`<div class="sign__item" data-reveal style="--d:${i}"><span class="idx">0${i + 1}</span><div><h3 class="h3">${t}</h3><p class="body">${p}</p></div></div>`)}
        </div>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Principles', title: 'Six principles,<br><span class="dim">applied without exception.</span>', lead: 'They govern our investment decisions, our governance and our relationship with investors. They are binding: every partner commits to them in writing.' })}
      <div class="cards cards--line" style="--cols:3">
        ${principles.map(([t, p], i) => html`
          <article class="card card--flat principle-card" data-reveal style="--d:${i % 3}">
            <div class="card__top"><span class="idx">P/0${i + 1}</span></div>
            <h3 class="h3">${t}</h3>
            <p>${p}</p>
          </article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '04', label: 'Governance', title: 'Checks and balances,<br><span class="dim">written and effective.</span>', split: true, lead: 'Four bodies, independent of one another, oversee management. No investment decision escapes adversarial review.' })}
      <div class="gov">
        ${governance.map((g, i) => html`
          <article class="gov__item" data-reveal style="--d:${i}">
            <span class="gov__n">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="h4">${g.name}</h3>
            <p class="body-sm">${g.text}</p>
            ${facts(g.facts, 'facts--compact')}
          </article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '05', label: 'Milestones', title: 'From a thesis<br><span class="dim">to a platform.</span>' })}
      <ol class="tl" style="--n:4">
        ${milestones.map((m, i) => html`
          <li class="tl__item${m.now ? ' is-now' : ''}${m.next ? ' is-next' : ''}" data-reveal style="--d:${i}">
            <span class="tl__year">${m.y}</span>
            ${m.now ? '<span class="tag tag--accent"><i></i>In progress</span>' : m.next ? '<span class="tag">Target</span>' : '<span class="tag">Done</span>'}
            <h3 class="h4">${m.t}</h3>
            <p>${m.p}</p>
          </li>`)}
      </ol>
    </div>
  </section>

  ${ctaBand({
    label: 'Continue',
    title: 'One method,<br><span class="dim">one team.</span>',
    text: 'See how we turn data into conviction, and meet the people behind those decisions.',
    primary: ['team.html', 'Meet the team'],
    secondary: ['approach.html', 'Our approach'],
  })}`;
}
