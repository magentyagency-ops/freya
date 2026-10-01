// Freya Newsroom — front page (news.html) + one page per article (news-<slug>.html).
import { readFileSync } from 'node:fs';
import { html, esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { cover } from '../lib/glyphs.mjs';
import { gl } from '../lib/ui.mjs';
import { site } from '../config.mjs';

export const loadNews = () => {
  try {
    const d = JSON.parse(readFileSync(new URL('../data/news.json', import.meta.url), 'utf8'));
    return { updated: d.updated, articles: d.articles || [], wire: d.wire || [] };
  } catch {
    return { updated: null, articles: [], wire: [] };
  }
};

const BUSINESS = new Set(['Business', 'Media & rights', 'Investment', 'Governance']);
const COVER = { Football: ['field', 'contours', 'bars'], Basketball: ['scatter', 'bars', 'rings'], Rugby: ['contours', 'field', 'ridges'], Tennis: ['rings', 'scatter'], Cricket: ['rings', 'field'], Cycling: ['ridges', 'contours'], Athletics: ['bars', 'ridges'], Other: ['contours', 'ridges', 'scatter'] };
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const coverType = (a) => { const l = COVER[a.sport] || COVER.Other; return l[hash(a.slug) % l.length]; };
const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');
export const newsHref = (a) => `news-${a.slug}.html`;
const longDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
const shortDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Paris' });
const readTime = (a) => Math.max(2, Math.round(a.body.join(' ').split(/\s+/).length / 200));

const art = (a, cls = '') =>
  `<div class="ncover ${cls}">` +
  (a.image ? `<img src="${a.image}" alt="" class="ncover__img" loading="lazy">` : cover(coverType(a), a.slug)) +
  `<span class="ncover__sport">${a.sport}</span>${BUSINESS.has(a.topic) ? '<span class="ncover__biz">Business</span>' : ''}</div>`;

const meta = (a) => `<span class="nmeta"><time datetime="${a.date}" data-ago>${shortDate(a.date)}</time><span>${a.topic}</span><span>${readTime(a)} min read</span></span>`;

export function newsCard(a, { size = '', front = false } = {}) {
  return html`
  <article class="ncard ${size}"${front ? ' data-front' : ''} data-news data-sport="${slug(a.sport)}" data-topic="${slug(a.topic)}" data-date="${a.date}" data-biz="${BUSINESS.has(a.topic) ? 1 : 0}" data-text="${esc((a.headline + ' ' + a.standfirst + ' ' + a.sport).toLowerCase())}">
    <a class="ncard__a" href="${newsHref(a)}">
      ${art(a)}
      ${meta(a)}
      <h3 class="ncard__h">${esc(a.headline)}</h3>
      ${size !== 'ncard--sm' ? `<p class="ncard__p">${esc(a.standfirst)}</p>` : ''}
    </a>
  </article>`;
}

function wireList(wire, n = 14) {
  return html`<ol class="nwire">${wire.slice(0, n).map((w) => `<li><a href="${esc(w.url)}" target="_blank" rel="noopener"><span class="nwire__m"><time datetime="${w.date}" data-ago>${shortDate(w.date)}</time> · ${esc(w.source)}</span><span class="nwire__t">${esc(w.title)}</span></a></li>`).join('')}</ol>`;
}

function front(d) {
  const A = d.articles;
  const [lead, ...rest] = A;
  const side = rest.slice(0, 2);
  const sports = [...new Set(A.map((a) => a.sport))];
  const topics = [...new Set(A.map((a) => a.topic))];
  const count = (k, v) => A.filter((a) => a[k] === v).length;
  if (!lead) return `<section class="sec" data-theme="void"><div class="wrap"><p class="lead">The newsroom is being prepared. Come back tomorrow morning.</p></div></section>`;
  return html`
  <section class="nhead" data-theme="void">
    ${gl()}
    <div class="wrap">
      <div class="nhead__top">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Freya</a><span>/</span><span aria-current="page">Newsroom</span></nav>
        <span class="micro nhead__live">Updated ${d.updated ? new Date(d.updated).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }) : ''} CET</span>
      </div>
      <div class="nhead__mast">
        <h1 class="nhead__title" data-split>Freya <span class="dim">Newsroom</span></h1>
        <p class="nhead__tag" data-reveal>Women’s sport, every morning.<br><span class="dim">Results, money, media and power — told by Freya.</span></p>
      </div>
      <div class="nhead__bar">
        <span>${d.updated ? longDate(d.updated) : ''}</span>
        <span>${A.length} stories · ${sports.length} sports</span>
        <span>Paris</span>
      </div>
    </div>
  </section>

  <section class="sec sec--sm nfront" data-theme="void">
    <div class="wrap nfront__grid">
      <article class="nlead" data-reveal>
        <a class="nlead__a" href="${newsHref(lead)}">
          ${art(lead, 'ncover--lg')}
          <div class="nlead__body">
            ${meta(lead)}
            <h2 class="nlead__h">${esc(lead.headline)}</h2>
            <p class="nlead__p">${esc(lead.standfirst)}</p>
            ${lead.why ? `<p class="nlead__why"><span class="label label--dot">Why it matters</span>${esc(lead.why)}</p>` : ''}
          </div>
        </a>
      </article>
      <div class="nfront__side">${side.map((a) => newsCard(a, { size: 'ncard--row' }))}</div>
    </div>
  </section>

  <section class="sec sec--sm wirepage" data-theme="dark" id="latest">
    <div class="wrap">
      <div class="nwbar">
        <label class="nwbar__search">${icon.search}<input type="search" placeholder="Search stories, players, clubs…" aria-label="Search stories" data-nf-q></label>
        <div class="seg" role="group" aria-label="Period" data-nf="period">
          <button class="seg__btn" type="button" data-v="1" aria-pressed="false">Today</button>
          <button class="seg__btn" type="button" data-v="7" aria-pressed="false">This week</button>
          <button class="seg__btn" type="button" data-v="all" aria-pressed="true">All</button>
        </div>
        <button class="nwbar__biz" type="button" aria-pressed="false" data-nf-biz>${icon.spark}<span>Business only</span></button>
      </div>
      <div class="nwbar__row">
        <div class="seg" role="group" aria-label="Sport" data-nf="sport">
          <button class="seg__btn" type="button" data-v="all" aria-pressed="true">All sports <sup>${A.length}</sup></button>
          ${sports.map((s) => `<button class="seg__btn" type="button" data-v="${slug(s)}" aria-pressed="false">${s} <sup>${count('sport', s)}</sup></button>`)}
        </div>
        <div class="seg" role="group" aria-label="Topic" data-nf="topic">
          <button class="seg__btn" type="button" data-v="all" aria-pressed="true">All topics</button>
          ${topics.map((t) => `<button class="seg__btn" type="button" data-v="${slug(t)}" aria-pressed="false">${t} <sup>${count('topic', t)}</sup></button>`)}
        </div>
      </div>
      <div class="nwgrid">
        <div class="nwmain">
          <div class="nwmain__head"><span class="filter-count" data-nf-count aria-live="polite">${A.length} stories</span><button class="link" type="button" data-nf-reset hidden><span>Clear filters</span></button></div>
          <div class="ngrid" data-newslist>${A.map((a, i) => newsCard(a, { front: i < 3 }))}</div>
          <p class="nwempty body-sm" data-nf-empty hidden>No story matches these filters. <button class="inline-link" type="button" data-nf-reset>Clear filters</button></p>
          <div class="nwmore"><button class="btn btn--ghost btn--sm" type="button" data-nf-more><span class="btn__label"><span class="roll"><span data-text="More stories">More stories</span></span></span><span class="btn__icon">${icon.arrowDown}${icon.arrowDown}</span></button></div>
        </div>
        <aside class="nwside">
          <div class="nwcard">
            <span class="label nwteaser__live">The wire</span>
            <p class="micro">Latest headlines from other newsrooms</p>
            ${wireList(d.wire)}
          </div>
        </aside>
      </div>
    </div>
  </section>`;
}

function articlePage(a, all) {
  const related = all.filter((x) => x !== a && x.sport === a.sport).concat(all.filter((x) => x !== a && x.sport !== a.sport)).slice(0, 3);
  const url = `${site.url}/${newsHref(a)}`;
  return html`
  <article class="nart">
    <header class="nart__hero" data-theme="void">
      ${gl()}
      <div class="wrap nart__head">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Freya</a><span>/</span><a href="news.html">Newsroom</a><span>/</span><span aria-current="page">${a.sport}</span></nav>
        <div class="art__meta" data-reveal><span class="tag tag--accent">${a.sport}</span><span class="tag">${a.topic}</span><time datetime="${a.date}">${longDate(a.date)}</time><span>${readTime(a)} min read</span></div>
        <h1 class="h1 nart__title" data-split>${esc(a.headline)}</h1>
        <p class="lead nart__lead" data-reveal>${esc(a.standfirst)}</p>
        <div class="art__byline" data-reveal><div class="byline"><span class="advisor__mono"><svg class="mark" viewBox="0 0 28 32" style="width:14px;height:16px"><path d="M8 3v26"/><path d="M8 13.5 21 5"/><path d="M8 21.5 21 13"/></svg></span><span><b>Freya Newsroom</b><span>Freya Sports Partners</span></span></div></div>
      </div>
      <div class="wrap">${art(a, 'ncover--hero')}</div>
    </header>
    <div class="art__body" data-theme="ice">
      <div class="wrap art__grid">
        <aside class="art__aside">
          ${a.facts?.length ? `<div class="nfacts"><span class="label">Key facts</span><ul>${a.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
          <div class="share">
            <span class="label">Share</span>
            <div class="share__btns">
              <button class="ibtn" type="button" data-copy="${url}" aria-label="Copy link">${icon.copy}</button>
              <a class="ibtn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${icon.linkedin}</a>
              <a class="ibtn" href="mailto:?subject=${encodeURIComponent(a.headline)}&body=${encodeURIComponent(url)}" aria-label="Share by email">${icon.mail}</a>
            </div>
          </div>
        </aside>
        <div class="art__main">
          <div class="prose-art">${a.body.map((p, i) => `<p${i === 0 ? ' class="nart__first"' : ''}>${esc(p)}</p>`).join('')}</div>
          ${a.why ? `<div class="nwhy"><span class="label label--dot">Why it matters</span><p>${esc(a.why)}</p></div>` : ''}
          <div class="nsources">
            <span class="label">Reporting based on</span>
            <ul>${a.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener"><b>${esc(s.name)}</b><span>${esc(s.title)}</span>${icon.arrowUpRight}</a></li>`).join('')}</ul>
            <p class="micro">Written by the Freya Newsroom from public reporting. Original articles belong to their publishers.</p>
          </div>
        </div>
      </div>
    </div>
  </article>
  <section class="sec" data-theme="dark">
    <div class="wrap">
      <div class="related__head"><span class="label label--dot">More from the newsroom</span><a class="link" href="news.html"><span>All stories</span>${icon.arrow}</a></div>
      <div class="ngrid ngrid--3">${related.map((r) => newsCard(r))}</div>
    </div>
  </section>`;
}

export function pages() {
  const d = loadNews();
  return [
    {
      meta: { id: 'news', section: 'news', title: 'Newsroom — Women’s sport, every morning', description: 'The Freya Newsroom: women’s sport news written every morning — results, business, media and governance.', headerTheme: 'void' },
      body: front(d),
    },
    ...d.articles.map((a) => ({
      meta: { id: `news-${a.slug}`, section: 'news', title: a.headline, description: a.standfirst, headerTheme: 'void', image: a.image },
      body: articlePage(a, d.articles),
    })),
  ];
}
