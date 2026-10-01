import { html } from '../lib/html.mjs';
import { cover } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand, btn } from '../lib/ui.mjs';
import { jobs } from '../data/careers.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'careers',
  section: 'firm',
  title: 'Careers',
  description: 'Join Freya Sports Partners: culture, hiring process and open roles in Paris.',
  headerTheme: 'void',
};

const values = [
  ['Rigour', 'We write, we quantify, we review. Then we start again.'],
  ['Curiosity', 'A credit analyst who watches the match; a former player who reads a balance sheet.'],
  ['Collective', 'Decisions are collective. So is the credit.'],
  ['Independence', 'No conflicts of interest, no compromise on our principles.'],
];

const offer = [
  ['Aligned pay', 'Market salary, collective bonus, carried interest in the vehicles for experienced hires.'],
  ['Continuous learning', 'Modelling, sports law, data: an individual budget and monthly internal sessions.'],
  ['Time on the ground', 'Two days a month with portfolio companies: training sessions, boards, matches.'],
  ['Balance', 'Two days of remote work a week, extended parental leave for every parent.'],
  ['Giving back', 'One day a month for a sports association of your choice.'],
];

const process = [
  ['Application', 'CV and a one-page note: a sports asset you would like to finance, and why.', '1 week'],
  ['Interviews', 'A partner and your future manager. Background, motivation, curiosity.', '1 week'],
  ['Case study', 'A real, anonymised deal, 48 hours, presented to the team.', '1 week'],
  ['Meet the team', 'Lunch with the team, then a decision within 72 hours.', '72 hours'],
];

export function render() {
  return html`
  ${pageHero({
    code: 'F-05 / Careers',
    label: 'Careers',
    title: 'Building the benchmark<br><span class="dim">in sports investment.</span>',
    lead: 'We are looking for demanding, curious, team-minded people — who love a well-built model as much as a well-played match.',
    aside: facts([['Open roles', String(jobs.length)], ['Location', 'Paris'], ['Process', '4 stages · 3 to 5 weeks'], ['Remote work', '2 days a week']]),
    visual: `<div class="careers-visual">${cover('ridges', 'freya-careers', 'cover careers-cover')}</div><div class="phero__veil"></div>`,
    crumbs: [['firm.html', 'Firm'], [null, 'Careers']],
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap">
      ${sh({ idx: '01', label: 'Culture', title: 'Four values,<br><span class="dim">visible every day.</span>' })}
      <div class="cards cards--line" style="--cols:4">
        ${values.map(([t, p], i) => html`<article class="card card--flat" data-reveal style="--d:${i}"><span class="idx">V/0${i + 1}</span><h3 class="h3 values__t">${t}</h3><p>${p}</p></article>`)}
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap split">
      <div class="split__aside">
        <span class="idx" data-scramble>02</span>
        <span class="label">What we offer</span>
        <h2 class="h2" data-split>A setting<br><span class="dim">that matches the standard.</span></h2>
      </div>
      <div class="split__main">
        <dl class="dl-rows offer">${offer.map(([t, d], i) => `<div data-reveal style="--d:${i}"><dt>${t}</dt><dd>${d}</dd></div>`)}</dl>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="void">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Process', title: 'Four stages,<br><span class="dim">three to five weeks.</span>', split: true, lead: 'Every application receives a reasoned answer, including when it is not successful.' })}
      <ol class="tl" style="--n:4">
        ${process.map(([t, p, d], i) => html`<li class="tl__item${i === 0 ? ' is-now' : ''}" data-reveal style="--d:${i}"><span class="tl__year">0${i + 1}</span><span class="tag">${d}</span><h3 class="h4">${t}</h3><p>${p}</p></li>`)}
      </ol>
    </div>
  </section>

  <section class="sec" data-theme="dark" id="roles">
    <div class="wrap">
      ${sh({ idx: '04', label: 'Open roles', title: `${jobs.length} open roles<br><span class="dim">in Paris.</span>` })}
      <div class="acc" data-acc>
        ${jobs.map((j, i) => html`
          <div class="acc__item" id="role-${j.id}">
            <h3>
              <button class="acc__btn" type="button" aria-expanded="false" aria-controls="job-${j.id}" id="job-${j.id}-btn">
                <span class="idx">${String(i + 1).padStart(2, '0')}</span>
                <span class="acc__title">${j.title}</span>
                <span class="acc__meta"><span class="tag">${j.team}</span><span class="tag">${j.type}</span><span class="tag">${j.level}</span></span>
                <i class="acc__icon" aria-hidden="true"></i>
              </button>
            </h3>
            <div class="acc__panel" id="job-${j.id}" role="region" aria-labelledby="job-${j.id}-btn">
              <div><div class="acc__inner">
                <p>${j.intro}</p>
                <div><h4>Responsibilities</h4><ul class="ticks">${j.missions.map((m) => `<li>${m}</li>`)}</ul></div>
                <div><h4>Profile</h4><ul class="ticks">${j.profile.map((m) => `<li>${m}</li>`)}</ul></div>
                <div class="btns">
                  ${btn(`mailto:${site.email}?subject=${encodeURIComponent('Application — ' + j.title)}`, 'Apply', { variant: 'solid', ico: 'arrowUpRight' })}
                  <span class="micro">${j.place} · Start ${j.start}</span>
                </div>
              </div></div>
            </div>
          </div>`)}
      </div>
    </div>
  </section>

  ${ctaBand({
    label: 'Speculative application',
    title: 'Your profile<br><span class="dim">isn’t listed?</span>',
    text: 'We read every speculative application. Attach a one-page note on a sports asset you believe is undervalued.',
    primary: [`mailto:${site.email}?subject=${encodeURIComponent('Speculative application')}`, 'Apply anyway'],
    secondary: ['team.html', 'Meet the team'],
  })}`;
}
