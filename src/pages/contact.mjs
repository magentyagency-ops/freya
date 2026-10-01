import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { pageHero, sh, facts, btn } from '../lib/ui.mjs';
import { site, clocks, formEndpoint } from '../config.mjs';

export const meta = {
  id: 'contact',
  section: 'contact',
  title: 'Contact',
  description: 'Contact Freya Sports Partners: investors, sports projects, Advisory, press and careers.',
  headerTheme: 'void',
};

const mail = (s) => `mailto:${site.email}?subject=${encodeURIComponent(s)}`;

const routes = [
  ['Investors', 'Firm presentation, vehicles, data room.', 'Investor relations'],
  ['Projects & deals', 'Clubs, leagues, platforms, rights holders.', 'Project'],
  ['Press', 'Interview requests, information, visual assets.', 'Press'],
  ['Careers', 'Open roles and speculative applications.', 'Careers'],
];

const subjects = ['Invest', 'Present a project', 'Advisory', 'Press', 'Careers', 'Other'];

function cityMap() {
  let s = '';
  for (let i = 0; i <= 20; i++) s += `<path class="map-grid" d="M${i * 40} 0V480M0 ${i * 24}H800"/>`;
  s += '<path class="map-river" d="M0 300C90 300 140 250 210 238S330 270 380 252 470 160 540 168 640 250 700 262 760 250 800 244"/>';
  s += '<path class="map-river map-river--b" d="M0 306C90 306 140 256 210 244S330 276 380 258 470 166 540 174 640 256 700 268 760 256 800 250"/>';
  [80, 140, 210].forEach((r, i) => (s += `<circle class="map-ring${i === 0 ? ' is-in' : ''}" cx="400" cy="230" r="${r}"/>`));
  s += '<path class="map-axis" d="M400 0V480M0 230H800"/>';
  s += '<circle class="map-pin-halo" cx="400" cy="230" r="18"/><circle class="map-pin" cx="400" cy="230" r="5"/>';
  s += '<text class="map-txt" x="414" y="222">PARIS</text><text class="map-txt map-txt--dim" x="414" y="246">48.8566° N · 2.3522° E</text>';
  s += '<path class="map-axis" d="M740 40V80M732 50l8-10 8 10"/><text class="map-txt" x="736" y="98">N</text>';
  s += '<path class="map-scale" d="M40 440H120M40 434V446M120 434V446"/><text class="map-txt map-txt--dim" x="40" y="428">1 KM</text>';
  return `<svg class="map" viewBox="0 0 800 480" aria-hidden="true">${s}</svg>`;
}

export function render() {
  return html`
  ${pageHero({
    code: 'C-00 / Contact',
    label: 'Contact',
    title: 'Let’s talk<br><span class="dim">about your project.</span>',
    lead: 'Investors, sports organisations, media, candidates: write to us. Every message receives a reply within 48 business hours.',
    aside: facts([['Email', `<a class="inline-link" href="mailto:${site.email}">${site.email}</a>`], ['Response', 'Within 48 business hours'], ['Office', site.city], ['Meetings', 'By appointment']]),
    visual: `<canvas class="globe-visual" data-viz="globe" data-cx="0.72" aria-hidden="true"></canvas><div class="phero__veil"></div>`,
    crumbs: [[null, 'Contact']],
    cls: 'phero--compact',
  })}

  <section class="sec sec--sm" data-theme="void">
    <div class="wrap">
      <ul class="routes">
        ${routes.map(([t, p, subj], i) => html`
          <li data-reveal style="--d:${i}">
            <a class="route spot" href="${mail(subj)}">
              <span class="idx">C/0${i + 1}</span>
              <h2 class="h4">${t}</h2>
              <p class="body-sm">${p}</p>
              <span class="route__mail">${icon.mail}<span>${site.email}</span></span>
            </a>
          </li>`)}
      </ul>
    </div>
  </section>

  <section class="sec" data-theme="dark" id="form">
    <div class="wrap split">
      <div class="split__aside">
        <span class="idx" data-scramble>01</span>
        <span class="label">Form</span>
        <h2 class="h2" data-split>Write<br><span class="dim">to the team.</span></h2>
        <p class="body" data-reveal>Your message goes to the relevant partner. Investment opportunities are handled in strict confidence.</p>
        <div class="contact__note" data-reveal>${icon.shield}<p class="body-sm">Information you send is used only to answer your request. <a class="inline-link" href="privacy.html">Privacy policy</a>.</p></div>
      </div>
      <form class="split__main form" data-form="contact" data-subject="Website enquiry" ${formEndpoint ? `data-endpoint="${formEndpoint}"` : ''} novalidate>
        <fieldset class="field full">
          <legend class="field__label">Subject of your enquiry</legend>
          <div class="chips">
            ${subjects.map((s, i) => `<label class="chip"><input type="radio" name="subject" value="${s}" data-label="Subject"${i === 0 ? ' checked' : ''}><span>${s}</span></label>`)}
          </div>
        </fieldset>
        <div class="field"><label for="c-name">Full name <span>*</span></label><input id="c-name" name="name" data-label="Name" autocomplete="name" required><span class="field__err">Required</span></div>
        <div class="field"><label for="c-org">Organisation</label><input id="c-org" name="organisation" data-label="Organisation" autocomplete="organization"></div>
        <div class="field"><label for="c-mail">Work email <span>*</span></label><input id="c-mail" name="email" type="email" data-label="Email" autocomplete="email" required><span class="field__err">Invalid email</span></div>
        <div class="field"><label for="c-tel">Phone</label><input id="c-tel" name="phone" type="tel" data-label="Phone" autocomplete="tel"></div>
        <div class="field full"><label for="c-msg">Message <span>*</span></label><textarea id="c-msg" name="message" data-label="Message" rows="5" required placeholder="A few lines about your project or request."></textarea><span class="field__err">Required</span></div>
        <div class="field field--check full"><input id="c-ok" type="checkbox" name="consent" data-label="Consent" required><label for="c-ok">I agree that my data may be used to handle my request, in accordance with the <a href="privacy.html">privacy policy</a>.</label></div>
        <div class="form__foot full">
          <p class="form__status" data-form-status role="status" aria-live="polite"></p>
          ${btn(null, 'Send message', { variant: 'solid', type: 'submit', magnetic: false })}
        </div>
      </form>
    </div>
  </section>

  <section class="sec" data-theme="void" id="office">
    <div class="wrap">
      ${sh({ idx: '02', label: 'Office', title: 'Paris,<br><span class="dim">by appointment.</span>', split: true, lead: 'We welcome investors and project leaders at our Paris office. The address is shared when the meeting is booked.' })}
      <div class="office">
        <div class="office__map" data-reveal>${cityMap()}</div>
        <div class="office__side" data-reveal>
          ${facts([['City', 'Paris, France'], ['Coordinates', site.coords], ['Hours', 'Monday – Friday, 9am – 7pm'], ['Access', 'By appointment only']])}
          <div class="clocks clocks--col">
            ${clocks.map((c) => `<div class="clock" data-tz="${c.tz}" data-open="${c.open.join('-')}"><span class="clock__city">${c.city}</span><span class="clock__time" data-time>--:--:--</span><span class="clock__state" data-state>—</span></div>`)}
          </div>
          ${btn(mail('Meeting request'), 'Book a meeting', { variant: 'ghost', ico: 'arrowUpRight' })}
        </div>
      </div>
    </div>
  </section>`;
}
