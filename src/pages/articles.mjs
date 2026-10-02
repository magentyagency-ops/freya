// Generates one page per publication (article-<slug>.html).
import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { cover } from '../lib/glyphs.mjs';
import { gl, btn } from '../lib/ui.mjs';
import { lineChart, hbars } from '../lib/charts.mjs';
import { insightCard } from '../lib/cards.mjs';
import { insights, categories, fmtDate, articleHref } from '../data/insights.mjs';
import { bodies, authors } from '../data/articles.mjs';
import { womensSportRevenue, womensSportSource } from '../data/womens-sport.mjs';
import { site } from '../config.mjs';

const initials = (n) => n.split(/[\s-]+/).filter((w) => /^[A-ZÉ]/.test(w)).map((w) => w[0]).slice(0, 2).join('');

function section(s) {
  let extra = '';
  if (s.figures) {
    extra += html`
    <div class="art__figs">
      ${[['$1.88bn', '2024 · estimate'], ['$2.41bn', '2025 · estimate'], ['$3.04bn', '2026 · forecast']].map(([v, l], i) => `<div class="${i === 0 ? 'is-hi' : ''}"><span>${v}</span><small>${l} · Deloitte</small></div>`).join('')}
    </div>`;
  }
  if (s.chart === 'asym') extra += lineChart({ id: 'fig-art-1', fig: 'Fig. 01', title: 'Global elite women’s sport — annual revenue (USD millions)', ...womensSportRevenue });
  if (s.chart === 'bars') {
    extra += hbars({
      id: 'fig-art-2',
      fig: 'Fig. 02',
      title: 'Global elite women’s sport — revenue mix, 2025 (estimated)',
      items: [
        { label: 'Commercial', sub: 'Sponsorship, merchandising & licensing', value: 46, hi: true },
        { label: 'Matchday', value: 31 },
        { label: 'Broadcast', value: 23 },
      ],
      unit: '%',
      max: 100,
      source: `<a href="${womensSportSource}" target="_blank" rel="noopener noreferrer">Deloitte · Game changers (2026), Fig. 1, p. 4 ↗</a>`,
      note: 'Share of 2025 revenue, not annual growth. Rounded percentages.',
    });
  }
  return html`
  <section class="art__sec" id="${s.id}">
    <h2 class="h3">${s.h}</h2>
    ${s.p.map((p) => `<p>${p}</p>`)}
    ${extra ? `<div class="art__fig">${extra}</div>` : ''}
    ${s.quote ? `<blockquote class="art__quote"><p>${s.quote}</p></blockquote>` : ''}
  </section>`;
}

function gatedBox(item, b) {
  if (b.open) {
    return html`
    <div class="art__box">
      <span class="label label--dot">Press contact</span>
      <p>For information or interview requests, please contact our team.</p>
      <div class="btns">${btn(`mailto:${site.email}?subject=${encodeURIComponent('Press — ' + item.title)}`, 'Contact press office', { variant: 'solid', ico: 'arrowUpRight' })}${btn('press.html', 'Media kit', { variant: 'ghost' })}</div>
    </div>`;
  }
  return html`
  <div class="gated">
    <div class="gated__ghost" aria-hidden="true"><p>${'The rest of this note develops the analysis, data and operational conclusions of our teams. '.repeat(5)}</p></div>
    <div class="gated__box">
      <span class="gated__lock">${icon.lock}</span>
      <div>
        <h3 class="h4">The full note is reserved for investors.</h3>
        <p class="body-sm">Detailed data, models and recommendations are available in the investor centre, or on reasoned request.</p>
      </div>
      <div class="btns">
        ${btn('investors.html', 'Investor centre', { variant: 'solid' })}
        ${btn(`mailto:${site.email}?subject=${encodeURIComponent('Note request — ' + item.title)}`, 'Request the note', { variant: 'ghost', ico: 'arrowUpRight' })}
      </div>
    </div>
  </div>`;
}

function article(item) {
  const b = bodies[item.slug];
  const by = b.authors.map((k) => authors[k]);
  const url = `${site.url}/${articleHref(item)}`;
  const related = insights.filter((i) => i !== item && !i.gated).sort((x, y) => (x.cat === item.cat ? -1 : 0) - (y.cat === item.cat ? -1 : 0)).slice(0, 3);
  return html`
  <article class="art">
    <header class="art__hero" data-theme="void">
      ${gl()}
      <div class="wrap art__head">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Freya</a><span>/</span><a href="insights.html">Insights</a><span>/</span><span aria-current="page">${categories[item.cat]}</span></nav>
        <div class="art__meta" data-reveal>
          <span class="tag tag--accent">${categories[item.cat]}</span>
          <time datetime="${item.date}">${fmtDate(item.date, true)}</time>
          <span>${item.read} min read</span>
          ${item.gated ? `<span class="art__restricted">${icon.lock} Restricted access</span>` : ''}
        </div>
        <h1 class="h1 art__title" data-split>${item.title}</h1>
        <p class="lead art__lead" data-reveal>${item.excerpt}</p>
        <div class="art__byline" data-reveal>
          ${by.map((a) => `<div class="byline"><span class="advisor__mono">${initials(a.name)}</span><span><b>${a.name}</b><span>${a.role}</span></span></div>`).join('')}
        </div>
      </div>
      <div class="wrap"><figure class="art__cover" data-reveal>${cover(item.cover, item.slug)}<figcaption class="micro">Generative visual — FSP/${item.slug.slice(0, 18).toUpperCase()}</figcaption></figure></div>
    </header>

    <div class="art__body" data-theme="ice">
      <div class="wrap art__grid">
        <aside class="art__aside">
          ${b.sections
            ? html`<nav class="toc" aria-label="Contents" data-toc>
                <span class="label">Contents</span>
                <ol>${b.sections.map((s, i) => `<li><a href="#${s.id}"><span class="idx">${String(i + 1).padStart(2, '0')}</span>${s.h}</a></li>`)}</ol>
              </nav>`
            : ''}
          <div class="share">
            <span class="label">Share</span>
            <div class="share__btns">
              <button class="ibtn" type="button" data-copy="${url}" aria-label="Copy link">${icon.copy}</button>
              <a class="ibtn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${icon.linkedin}</a>
              <a class="ibtn" href="mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(url)}" aria-label="Share by email">${icon.mail}</a>
            </div>
          </div>
        </aside>
        <div class="art__main">
          <div class="keypoints">
            <span class="label label--dot">Key takeaways</span>
            <ol>${item.points.map((p, i) => `<li><span class="idx">${String(i + 1).padStart(2, '0')}</span>${p}</li>`)}</ol>
          </div>
          <div class="prose-art">
            ${b.sections ? b.sections.map(section) : b.intro.map((p) => `<p>${p}</p>`)}
          </div>
          ${b.sections ? `<p class="art__method"><span class="label">Methodology</span>${b.method}</p>` : gatedBox(item, b)}
        </div>
      </div>
    </div>
  </article>

  <section class="sec" data-theme="dark">
    <div class="wrap">
      <div class="related__head"><span class="label label--dot">Further reading</span><a class="link" href="insights.html"><span>All publications</span>${icon.arrow}</a></div>
      <div class="icards">${related.map((r) => insightCard(r))}</div>
    </div>
  </section>`;
}

export function pages() {
  return insights.map((item) => ({
    meta: { id: `article-${item.slug}`, section: 'insights', title: item.title, description: item.excerpt, headerTheme: 'void' },
    body: article(item),
  }));
}
