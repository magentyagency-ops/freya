import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { fehuConstruction } from '../lib/glyphs.mjs';
import { pageHero, sh, gl, facts, ctaBand } from '../lib/ui.mjs';
import { insights, fmtDate, articleHref } from '../data/insights.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'press',
  section: 'press',
  title: 'Press',
  description: 'Freya Sports Partners press room: releases, boilerplate, logos, colours and contacts.',
  headerTheme: 'void',
};

const boiler = `${site.name} is an independent investment firm dedicated to the business of sport. Based in Paris, the firm invests in the organisations, rights and assets shaping the sport of tomorrow, with one core thesis: women’s sport is the most undervalued market in global sport. It operates through four strategies — women’s sport, sports assets, media and data, structured credit — and an advisory practice, Advisory.`;

const colors = [
  ['Void', '#030508', 'Primary background'],
  ['Night', '#0B1016', 'Surfaces'],
  ['Steel', '#5B6877', 'Secondary text'],
  ['Ice', '#E6EBEF', 'Light background'],
  ['Glacier', '#A6D4EF', 'Single accent'],
];

const logos = [
  ['Logo — light', 'freya-logo-light.svg', 'dark'],
  ['Logo — dark', 'freya-logo-dark.svg', 'light'],
  ['Mark — light', 'freya-mark-light.svg', 'dark'],
  ['Mark — dark', 'freya-mark.svg', 'light'],
];

export function render() {
  const releases = insights.filter((i) => i.cat === 'release' || i.cat === 'interview');
  return html`
  ${pageHero({
    code: 'M-00 / Press',
    label: 'Press & media',
    title: 'Press<br><span class="dim">& media.</span>',
    lead: 'Press releases, company boilerplate, brand assets and contacts for journalists.',
    aside: facts([['Press contact', `<a class="inline-link" href="mailto:${site.email}?subject=Press">${site.email}</a>`], ['Response time', '24 hours'], ['Languages', 'English · French'], ['Spokespeople', 'Partners']]),
    crumbs: [[null, 'Press']],
    cls: 'phero--compact',
  })}

  <section class="sec" data-theme="void">
    ${gl()}
    <div class="wrap split">
      <div class="split__aside">
        <span class="idx" data-scramble>01</span>
        <span class="label">About</span>
        <h2 class="h2" data-split>Company<br><span class="dim">boilerplate.</span></h2>
      </div>
      <div class="split__main">
        <div class="boiler" data-reveal>
          <p class="prose-lg"><span>${boiler}</span></p>
          <button class="link boiler__copy" type="button" data-copy="${boiler.replace(/"/g, '&quot;')}">${icon.copy}<span>Copy text</span></button>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      ${sh({ idx: '02', label: 'Releases', title: 'Press releases<br><span class="dim">and interviews.</span>' })}
      <ul class="rows">
        ${releases.map((r, i) => html`<li data-reveal style="--d:${i}"><a class="row" href="${articleHref(r)}"><span class="idx">${fmtDate(r.date)}</span><span class="row__title">${r.title}</span><span class="row__desc">${r.excerpt}</span><span class="row__icon">${icon.arrowUpRight}</span></a></li>`)}
      </ul>
    </div>
  </section>

  <section class="sec" data-theme="ice">
    <div class="wrap">
      ${sh({ idx: '03', label: 'Media kit', title: 'Brand<br><span class="dim">assets.</span>', lead: 'Vector files free to use when illustrating an article about Freya Sports Partners. Please do not alter them.' })}
      <div class="logos">
        ${logos.map(([t, f, bg], i) => html`
          <figure class="logo-tile logo-tile--${bg}" data-reveal style="--d:${i}">
            <div class="logo-tile__art"><img src="assets/brand/${f}" alt="${t}" loading="lazy"></div>
            <figcaption><span>${t}</span><a class="link" href="assets/brand/${f}" download>${icon.download}<span>SVG</span></a></figcaption>
          </figure>`)}
      </div>
      <div class="kit">
        <div class="kit__colors" data-reveal>
          <h3 class="label">Colours</h3>
          <ul class="swatches">
            ${colors.map(([n, hex, use]) => `<li><button class="swatch" type="button" data-copy="${hex}" aria-label="Copy ${hex}"><span class="swatch__chip" style="background:${hex}"></span><span class="swatch__n">${n}</span><span class="swatch__hex">${hex}</span><span class="swatch__use">${use}</span></button></li>`)}
          </ul>
        </div>
        <div class="kit__type" data-reveal>
          <h3 class="label">Typography</h3>
          <div class="specimen"><span class="specimen__big">Aa</span><div><b>Geist</b><span>Headlines and text — 250 to 550</span></div></div>
          <div class="specimen specimen--mono"><span class="specimen__big">01</span><div><b>Geist Mono</b><span>Labels, data, indices</span></div></div>
        </div>
        <div class="kit__sign" data-reveal>
          <h3 class="label">The mark</h3>
          <div class="kit__fehu">${fehuConstruction()}</div>
          <p class="body-sm">Fehu rune ᚠ — one stave, two strokes rising at 33°, 40-unit grid.</p>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand({
    label: 'Press contact',
    title: 'An interview<br><span class="dim">request?</span>',
    text: 'Our partners speak on the business of sport, women’s sport and investment. Reply within 24 hours.',
    primary: [`mailto:${site.email}?subject=${encodeURIComponent('Press — interview request')}`, 'Contact the press office'],
    secondary: ['insights.html', 'Our publications'],
  })}`;
}
