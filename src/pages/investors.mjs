import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { pageHero, sh, gl, facts, ctaBand, btn } from '../lib/ui.mjs';
import { sparkline } from '../lib/charts.mjs';
import { site, disclaimer } from '../config.mjs';

export const meta = {
  id: 'investors',
  section: 'investors',
  title: 'Investors',
  description: 'Freya Sports Partners investor relations: principles, key fund terms, reporting, documents and FAQs.',
  headerTheme: 'void',
};

const mail = (s) => `mailto:${site.email}?subject=${encodeURIComponent(s)}`;

const terms = [
  ['Legal form', 'Alternative investment fund (AIF)'],
  ['Domicile', 'France'],
  ['Currency', 'Euro'],
  ['Term', '10 years, extendable twice by one year'],
  ['Investment period', '5 years'],
  ['Minimum commitment', 'Available on request'],
  ['Eligible investors', 'Professional investors (MiFID II)'],
  ['Fees and carried interest', 'Set out in the regulatory documentation'],
  ['Depositary and auditor', 'Tier-one institutions, disclosed on request'],
  ['SFDR classification', 'Specified in the pre-contractual documentation'],
];

const calendar = [
  ['Q1', 'End of April', 'Quarterly letter, position statements, portfolio KPIs.'],
  ['Q2', 'June', 'Annual general meeting, audited impact report, thesis review.'],
  ['Q3', 'End of October', 'Quarterly letter, advisory board meeting.'],
  ['Q4', 'End of January', 'Quarterly letter, audited valuations, tax documents.'],
];

const docs = [
  ['Firm presentation', 'PDF · 24 pages', false],
  ['Responsible investment policy', 'PDF · 12 pages', false],
  ['Conflicts of interest policy', 'PDF · 8 pages', false],
  ['2025 impact report', 'PDF · 36 pages', false],
  ['Investor letter — Q3 2026', 'Data room · investors', true],
  ['Fund regulatory documentation', 'Data room · investors', true],
];

const faq = [
  ['Who can invest in vehicles managed by Freya?', 'Vehicles are restricted to professional investors within the meaning of Directive 2014/65/EU (MiFID II), and to sophisticated investors where applicable regulation permits. An eligibility check precedes any exchange of documentation.'],
  ['What is the minimum commitment?', 'The minimum commitment is set out in the fund documentation, shared once your eligibility has been verified and a non-disclosure agreement signed.'],
  ['How does investor due diligence work?', 'Data room access, meetings with the partners and team, answers to the standard due diligence questionnaire, discussions with the compliance function and, on request, with our auditors.'],
  ['How is the team aligned with investors?', 'Partners co-invest in every vehicle. The team’s carried interest is only paid after capital and a hurdle return have been returned, under the terms of the regulatory documentation.'],
  ['How does reporting work?', 'Every quarter: management letter, position statement, financial, sporting and impact KPIs for every holding. Every year: audited valuations, impact report and investor meeting.'],
  ['How do I access the investor portal?', 'Access is named and protected by two-factor authentication. Credentials are issued by the Investor Relations team once subscription documents are signed.'],
];

function dashboard() {
  const called = [8, 14, 19, 23, 27, 31, 36, 41, 46];
  return html`
  <div class="dash" aria-label="Preview of the portal interface — fictional data" role="img">
    <div class="dash__bar">
      <span class="dash__brand"><svg class="mark" viewBox="0 0 28 32" aria-hidden="true"><path d="M8 3v26"/><path d="M8 13.5 21 5"/><path d="M8 21.5 21 13"/></svg>Freya Portal</span>
      <span class="dash__tabs"><b>Overview</b><span>Holdings</span><span>Cash flows</span><span>Documents</span></span>
      <span class="dash__period micro">Q3 2026</span>
    </div>
    <div class="dash__grid">
      <div class="dash__tile"><span class="micro">Holdings</span><b>12</b><small>10 active · 2 realised</small></div>
      <div class="dash__tile"><span class="micro">Capital called</span><b>46%</b><small>of total commitment</small></div>
      <div class="dash__tile"><span class="micro">Next call</span><b>15 Nov</b><small>Notice no. 7 available</small></div>
      <div class="dash__tile"><span class="micro">Impact KPIs</span><b>24/24</b><small>reported this quarter</small></div>
      <div class="dash__chart">
        <div class="dash__chead"><span class="micro">Cumulative capital called — % of commitment</span><span class="micro">Q3 2024 → Q3 2026</span></div>
        <div class="dash__bars">${called.map((v, i) => `<i style="--h:${v / 50}"${i === called.length - 1 ? ' class="on"' : ''}><span>${v}</span></i>`).join('')}</div>
      </div>
      <div class="dash__list">
        <span class="micro">Latest documents</span>
        <ul>
          ${[['Investor letter — Q3 2026', '01 Oct'], ['Position statement', '30 Sep'], ['Capital call notice no. 7', '22 Sep'], ['2025 impact report', '14 Jun']].map(([t, d]) => `<li><span>${icon.doc}${t}</span><span class="micro">${d}</span></li>`).join('')}
        </ul>
      </div>
      <div class="dash__spark"><span class="micro">Hours broadcast — women’s sport portfolio</span>${sparkline([12, 14, 13, 17, 19, 22, 21, 26, 29, 33, 35, 41], { w: 300, h: 60 })}</div>
    </div>
    <span class="dash__ribbon micro">Interface preview — fictional data</span>
  </div>`;
}

export function render() {
  return html`
  ${pageHero({
    code: 'I-00 / Investors',
    label: 'Investor relations',
    title: 'Access built<br><span class="dim">on trust.</span>',
    lead: 'Freya opens a direct dialogue with investors who share its vision of sport: patient, demanding and grounded in projects with real value.',
    aside: facts([['Eligible investors', 'Professional (MiFID II)'], ['Reporting', 'Quarterly'], ['Data room', 'Named access'], ['Profile', '<button class="inline-link" type="button" data-gate-open>Change my profile</button>']]),
    visual: `<canvas class="inv-visual" data-gl="surface" data-density="low" data-cam-y="4.4" aria-hidden="true"></canvas><div class="phero__veil"></div>`,
    crumbs: [[null, 'Investors']],
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '01', label: 'Principles', title: 'Three commitments<br><span class="dim">to our investors.</span>' })}
      <div class="cards cards--line" style="--cols:3">
        ${[
          ['Transparency', 'Complete reporting and explicit assumptions — including when the news is bad.'],
          ['Alignment', 'Partners co-invest in every vehicle; the team’s carried interest depends on realised performance.'],
          ['Availability', 'A dedicated contact, a reply within 48 business hours, direct access to the partners.'],
        ].map(([t, p], i) => html`<article class="card card--flat" data-reveal style="--d:${i}"><span class="idx">E/0${i + 1}</span><h3 class="h3 values__t">${t}</h3><p>${p}</p></article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '02', label: 'The fund', title: 'Key<br><span class="dim">terms.</span>', split: true, lead: 'Non-binding summary. Only the fund’s regulatory documentation is authoritative.' })}
      <div class="terms" data-gated>${facts(terms, 'terms__list')}</div>
      <p class="gate-note body-sm" data-gate-note hidden>${icon.lock} This information is reserved for professional investors. <button class="inline-link" type="button" data-gate-open>Change my profile</button></p>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Reporting & portal', title: 'Your entire portfolio,<br><span class="dim">in one place.</span>', lead: 'The investor portal brings together reporting, capital calls, distributions, tax documents and impact KPIs for every holding.' })}
      <div data-reveal>${dashboard()}</div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '04', label: 'Calendar', title: 'A rhythm known<br><span class="dim">in advance.</span>' })}
      <ol class="tl" style="--n:4">
        ${calendar.map(([q, d, p], i) => html`<li class="tl__item${i === 2 ? ' is-now' : ''}" data-reveal style="--d:${i}"><span class="tl__year">${q}</span><span class="tag">${d}</span><p>${p}</p></li>`)}
      </ol>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap split">
      <div class="split__aside">
        <span class="idx" data-scramble>05</span>
        <span class="label">Documents</span>
        <h2 class="h2" data-split>Documentation<br><span class="dim">on request.</span></h2>
        <p class="body" data-reveal>Public documents are sent within 48 hours. Restricted documents are available in the data room.</p>
      </div>
      <ul class="split__main docs">
        ${docs.map(([t, m, locked], i) => html`
          <li data-reveal style="--d:${i}">
            <a class="doc" href="${locked ? 'login.html' : mail('Document request — ' + t)}">
              <span class="doc__ico">${locked ? icon.lock : icon.doc}</span>
              <span class="doc__t">${t}<small>${m}</small></span>
              <span class="doc__cta">${locked ? 'Data room' : 'Request'} ${locked ? icon.arrow : icon.arrowUpRight}</span>
            </a>
          </li>`)}
      </ul>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '06', label: 'FAQ', title: 'Frequently asked<br><span class="dim">questions.</span>' })}
      <div class="acc acc--faq" data-acc>
        ${faq.map(([q, a], i) => html`
          <div class="acc__item">
            <h3><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-${i}-btn"><span class="idx">Q/0${i + 1}</span><span class="acc__title">${q}</span><span class="acc__meta"></span><i class="acc__icon" aria-hidden="true"></i></button></h3>
            <div class="acc__panel" id="faq-${i}" role="region" aria-labelledby="faq-${i}-btn"><div><div class="acc__inner"><p>${a}</p></div></div></div>
          </div>`)}
      </div>
    </div>
  </section>

  ${ctaBand({
    label: 'Investor relations',
    title: 'Start<br><span class="dim">the conversation.</span>',
    text: 'Firm presentation, meetings with the partners, data room access: the Investor Relations team replies within 48 hours.',
    primary: [mail('Investor relations'), 'Contact the team'],
  })}

  <div class="gate" data-gate role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <div class="gate__panel" data-theme="dark">
      <span class="label label--dot">Regulatory notice</span>
      <h2 class="h3" id="gate-title">Information reserved for professional investors.</h2>
      <p>The following pages describe alternative investment vehicles whose distribution is restricted. Please specify your profile to continue.</p>
      <form novalidate>
        <div class="gate__opts">
          <label class="gate__opt"><input type="radio" name="profil" value="pro"><span><b>Professional investor</b><small>Within the meaning of Directive 2014/65/EU (MiFID II), or a sophisticated investor under applicable regulation.</small></span></label>
          <label class="gate__opt"><input type="radio" name="profil" value="public"><span><b>Other visitor</b><small>Access to the firm’s public information only.</small></span></label>
        </div>
        <div class="gate__legal" tabindex="0">${disclaimer} The information in this section is not intended for persons resident in any jurisdiction where its distribution would be restricted.</div>
        <div class="field field--check"><input type="checkbox" id="gate-accept" name="accept"><label for="gate-accept">I have read and accept the notices above.</label></div>
        <div class="gate__foot">
          <p class="form__status" data-gate-msg role="status" aria-live="polite"></p>
          ${btn(null, 'Continue', { variant: 'solid', type: 'submit', magnetic: false })}
        </div>
      </form>
    </div>
  </div>`;
}
