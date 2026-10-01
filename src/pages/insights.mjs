import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { cover } from '../lib/glyphs.mjs';
import { pageHero, facts } from '../lib/ui.mjs';
import { insightCard } from '../lib/cards.mjs';
import { insights, categories, fmtDate, articleHref } from '../data/insights.mjs';
import { bodies, authors } from '../data/articles.mjs';
import { formEndpoint } from '../config.mjs';

export const meta = {
  id: 'insights',
  section: 'insights',
  title: 'Insights',
  description: 'Research notes, methodology, data and interviews from Freya Sports Partners on the business of sport and women’s sport.',
  headerTheme: 'void',
};

export function render() {
  const sorted = [...insights].sort((a, b) => b.date.localeCompare(a.date));
  const featured = insights.find((i) => i.featured);
  const rest = sorted.filter((i) => i !== featured);
  const cats = Object.keys(categories).filter((c) => insights.some((i) => i.cat === c));
  const a = bodies[featured.slug].authors.map((k) => authors[k].name).join(' · ');
  return html`
  ${pageHero({
    code: 'R-00 / Insights',
    label: 'Insights',
    title: 'Research, data<br><span class="dim">and convictions.</span>',
    lead: 'We publish what we learn: research notes, methodology, data and interviews. Some full notes are reserved for investors.',
    aside: facts([['Publications', String(insights.length)], ['Research notes', String(insights.filter((i) => i.cat === 'research').length)], ['Frequency', 'Monthly'], ['Investor letter', 'Quarterly']]),
    visual: `<div class="rs-visual">${cover('contours', 'freya-research', 'cover rs-cover')}</div><div class="phero__veil"></div>`,
    crumbs: [[null, 'Insights']],
    cls: 'phero--compact',
  })}

  <section class="sec sec--sm" data-theme="ice">
    <div class="wrap">
      <article class="feat" data-reveal>
        <a class="feat__a" href="${articleHref(featured)}">
          <div class="feat__cover">${cover(featured.cover, featured.slug)}<span class="icard__cat">Featured · ${categories[featured.cat]}</span></div>
          <div class="feat__body">
            <div class="icard__meta"><time datetime="${featured.date}">${fmtDate(featured.date, true)}</time><span>${featured.read} min read</span></div>
            <h2 class="h2 feat__title">${featured.title}</h2>
            <p class="lead">${featured.excerpt}</p>
            <ul class="ticks">${featured.points.map((p) => `<li>${p}</li>`)}</ul>
            <div class="feat__foot"><span class="micro">By ${a}</span><span class="feat__more">Read the note ${icon.arrow}</span></div>
          </div>
        </a>
      </article>
    </div>
  </section>

  <section class="sec" data-theme="ice" id="publications">
    <div class="wrap">
      <div class="filters" data-filters="rs-grid">
        <div class="seg" role="group" aria-label="Filter by category" data-filter-group="cat">
          <button class="seg__btn" type="button" data-filter="all" aria-pressed="true">All <sup>${rest.length}</sup></button>
          ${cats.map((c) => `<button class="seg__btn" type="button" data-filter="${c}" aria-pressed="false">${categories[c]} <sup>${rest.filter((i) => i.cat === c).length}</sup></button>`)}
        </div>
        <span class="filter-count" data-filter-count aria-live="polite">${rest.length} results</span>
      </div>
      <div class="icards" id="rs-grid">${rest.map((i) => insightCard(i, { filter: true }))}</div>
      <p class="body-sm" data-filter-empty hidden>No publications in this category yet.</p>
    </div>
  </section>

  <section class="sec sec--sm" data-theme="dark">
    <div class="wrap newsband">
      <div class="newsband__head">
        <span class="label label--dot">Research notes</span>
        <h2 class="h2" data-split>Get our analysis,<br><span class="dim">four times a year.</span></h2>
      </div>
      <form class="news newsband__form" data-form="newsletter" ${formEndpoint ? `data-endpoint="${formEndpoint}"` : ''} novalidate data-reveal>
        <label class="label" for="news-email-2">Work email</label>
        <div class="news__field">
          <input id="news-email-2" name="email" type="email" placeholder="name@organisation.com" autocomplete="email" required>
          <button type="submit" aria-label="Subscribe">${icon.arrow}</button>
        </div>
        <p class="news__msg" role="status" aria-live="polite"></p>
        <p class="body-sm">No more than four emails a year. One-click unsubscribe. See our <a class="inline-link" href="privacy.html">privacy policy</a>.</p>
      </form>
    </div>
  </section>`;
}
