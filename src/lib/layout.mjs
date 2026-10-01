// Gabarit commun à toutes les pages.
import { html, esc } from './html.mjs';
import { icon, mark } from './icons.mjs';
import { glyph } from './glyphs.mjs';
import { btn } from './ui.mjs';
import { site, nav, menu, footerCols, disclaimer, clocks, formEndpoint } from '../config.mjs';
import { strategies, affaires } from '../data/strategies.mjs';

const brand = (tag = 'a') => html`
  <${tag} class="brand"${tag === 'a' ? ' href="index.html" aria-label="Freya Sports Partners — Home"' : ''}>
    ${mark()}
    <span class="brand__word">FREYA</span>
    <span class="brand__sub">Sports<br>Partners</span>
  </${tag}>`;

function megaStrategies() {
  const items = [...strategies, affaires];
  return html`
  <div class="mega" id="mega-strategies" data-mega-panel="strategies">
    <div class="wrap mega__inner">
      <div class="mega__intro" style="--i:0">
        <span class="label label--dot">Strategies</span>
        <p class="mega__title">Four strategies.<br><span class="dim">One discipline.</span></p>
        <p>A multi-strategy fund dedicated to the business of sport, and an advisory practice.</p>
        <a class="link" href="strategies.html"><span>Overview</span>${icon.arrow}</a>
      </div>
      <ul class="mega__grid" style="--cols:5">
        ${items.map(
          (s, i) => html`
          <li><a class="mega__card" href="${s.href}" style="--i:${i + 1}">
            <span class="mega__top"><span class="mega__code">${s.code}</span>${s.tag ? `<span class="tag">${s.tag}</span>` : ''}</span>
            <span class="mega__glyph">${glyph(s.visual)}</span>
            <strong>${s.name}</strong>
            <span class="d">${s.tagline}</span>
            ${icon.arrowUpRight}
          </a></li>`
        )}
      </ul>
    </div>
  </div>`;
}

function megaList(item) {
  return html`
  <div class="mega" id="mega-${item.id}" data-mega-panel="${item.id}">
    <div class="wrap mega__inner">
      <div class="mega__intro" style="--i:0">
        <span class="label label--dot">${item.label}</span>
        <p class="mega__title">${item.intro.title}</p>
        <p>${item.intro.text}</p>
      </div>
      <ul class="mega__grid mega__grid--list" style="--cols:${item.children.length}">
        ${item.children.map(
          (c, i) => html`
          <li><a class="mega__card mega__card--text" href="${c.href}" style="--i:${i + 1}">
            <span class="mega__top"><span class="mega__code">${c.code}</span></span>
            <strong>${c.label}</strong>
            <span class="d">${c.desc}</span>
            ${icon.arrowUpRight}
          </a></li>`
        )}
      </ul>
    </div>
  </div>`;
}

function header(page) {
  const current = page.section || page.id;
  return html`
  <a class="skip" href="#main">Skip to content</a>
  <header class="hdr" data-hdr data-theme="${page.headerTheme || 'dark'}">
    <div class="wrap hdr__bar">
      ${brand()}
      <nav class="nav" aria-label="Main navigation">
        <ul class="nav__list">
          ${nav.map((item) => {
            const isCur = current === item.id || (item.children || []).some((c) => c.href === `${page.id}.html`) || (item.mega === 'strategies' && ['strategies', 'womens-sport'].includes(page.id));
            if (item.children || item.mega) {
              return html`<li><button class="nav__link${isCur ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="mega-${item.id}" data-mega="${item.id}">${item.label}<i class="nav__caret" aria-hidden="true"></i></button></li>`;
            }
            return html`<li><a class="nav__link${isCur ? ' is-current' : ''}" href="${item.href}"${isCur ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
          })}
        </ul>
      </nav>
      <div class="hdr__actions">
        <a class="hdr__portal" href="login.html">${icon.lock}<span>Investor portal</span></a>
        ${btn('contact.html', 'Contact', { variant: 'solid', size: 'sm', magnetic: false })}
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle><span class="burger__txt">Menu</span><span class="burger__lines" aria-hidden="true"><i></i><i></i></span></button>
      </div>
    </div>
    ${nav.filter((n) => n.children).map(megaList)}
    ${megaStrategies()}
    <div class="hdr__progress" aria-hidden="true"><i></i></div>
  </header>
  <div class="scrim" data-scrim aria-hidden="true"></div>
  <div class="menu" id="menu" data-menu data-theme="void">
    <div class="wrap menu__inner">
      <nav class="menu__nav" aria-label="Menu">
        <ol>
          ${menu.map(
            (m, i) => html`<li style="--i:${i}"><a href="${m.href}"${page.id === m.id ? ' aria-current="page"' : ''}><span class="menu__idx">${String(i).padStart(2, '0')}</span><span class="menu__label">${m.label}</span>${icon.arrowUpRight}</a></li>`
          )}
        </ol>
      </nav>
      <div class="menu__aside">
        <div class="btns">
          ${btn('login.html', 'Investor portal', { variant: 'ghost', ico: 'lock', magnetic: false })}
          ${btn('contact.html', 'Contact us', { variant: 'solid', magnetic: false })}
        </div>
        <div class="menu__meta">
          <a class="micro" href="mailto:${site.email}">${site.email}</a>
          <span class="micro">${site.city} · ${site.coords}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function clockList() {
  return html`<div class="clocks" data-clocks>
    ${clocks.map(
      (c) => html`<div class="clock" data-tz="${c.tz}" data-open="${c.open.join('-')}"><span class="clock__city">${c.city}</span><span class="clock__time" data-time>--:--:--</span><span class="clock__state" data-state>—</span></div>`
    )}
  </div>`;
}

function footer(page) {
  return html`
  <footer class="ftr" data-theme="void">
    <div class="wrap">
      ${page.id !== 'contact'
        ? html`<a class="ftr__cta" href="contact.html">
            <span class="label label--dot">Contact</span>
            <span class="ftr__cta-title">A project, a question?<br><span class="dim">Let’s talk.</span></span>
            <span class="ftr__arrow" aria-hidden="true">${icon.arrowUpRight}</span>
          </a>`
        : ''}
      <div class="ftr__top">
        <div class="ftr__brand">
          ${brand()}
          <p class="ftr__about">${site.baseline} Headquartered in ${site.city}.</p>
          <form class="news" data-form="newsletter" ${formEndpoint ? `data-endpoint="${formEndpoint}"` : ''} novalidate>
            <label class="label" for="news-email">Research notes</label>
            <p>Our quarterly analysis of the business of sport. No more than four emails a year.</p>
            <div class="news__field">
              <input id="news-email" name="email" type="email" placeholder="name@organisation.com" autocomplete="email" required>
              <button type="submit" aria-label="Subscribe to research notes">${icon.arrow}</button>
            </div>
            <p class="news__msg" role="status" aria-live="polite"></p>
          </form>
        </div>
        <nav class="ftr__cols" aria-label="Site map">
          ${footerCols.map(
            (col) => html`<div class="ftr__col"><h2 class="label">${col.title}</h2><ul>${col.links.map(([href, l]) => `<li><a href="${href}">${l}</a></li>`)}</ul></div>`
          )}
        </nav>
      </div>
      <div class="ftr__mid">
        ${clockList()}
        <div class="socials">
          <a class="ibtn" href="${site.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon.linkedin}</a>
          <a class="ibtn" href="mailto:${site.email}" aria-label="Email">${icon.mail}</a>
        </div>
      </div>
      <div class="ftr__giant" aria-hidden="true" data-giant>
        <svg viewBox="0 0 1000 214">
          <defs>
            <linearGradient id="ftr-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#b9d3e6" stop-opacity=".2"/>
              <stop offset="1" stop-color="#b9d3e6" stop-opacity="0"/>
            </linearGradient>
            <radialGradient id="ftr-spot" gradientUnits="userSpaceOnUse" cx="500" cy="100" r="230">
              <stop offset="0" stop-color="#a6d4ef" stop-opacity=".55"/>
              <stop offset="1" stop-color="#a6d4ef" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <text x="500" y="196" text-anchor="middle" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="url(#ftr-fade)">FREYA</text>
          <text x="500" y="196" text-anchor="middle" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="url(#ftr-spot)" class="ftr__spot">FREYA</text>
        </svg>
      </div>
      <div class="ftr__bottom">
        <span>© ${site.year} ${site.name}</span>
        <div class="ftr__legal">
          <a href="legal-notice.html">Legal notice</a>
          <a href="privacy.html">Privacy</a>
          <a href="press.html">Press</a>
          <a href="sitemap.html">Sitemap</a>
        </div>
        <a class="totop" href="#top">Back to top ${icon.arrowUp}</a>
      </div>
      <p class="ftr__disc">${disclaimer}</p>
    </div>
  </footer>`;
}

function preloader() {
  return html`
  <div class="pre" data-preloader aria-hidden="true">
    <div class="pre__grid"></div>
    <div class="pre__center">
      <svg class="pre__mark" viewBox="0 0 28 32"><path d="M8 3v26"/><path d="M8 13.5 21 5"/><path d="M8 21.5 21 13"/></svg>
      <span class="pre__word">FREYA</span>
    </div>
    <div class="wrap pre__foot">
      <span class="micro">Freya Sports Partners</span>
      <span class="micro pre__status" data-pre-status>Calibrating models</span>
      <span class="pre__count num" data-pre-count>000</span>
    </div>
    <div class="pre__bar"><i data-pre-bar></i></div>
  </div>`;
}

export function layout(page, body, ctx) {
  const title = page.id === 'index' ? `${site.name} — ${page.title}` : `${page.title} — ${site.name}`;
  const url = `${site.url}/${page.id === 'index' ? '' : page.id + '.html'}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    logo: `${site.url}/assets/brand/freya-mark.svg`,
    description: site.baseline,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'FR' },
  };
  return html`<!doctype html>
<html lang="en" data-page="${page.id}">
<head>
<meta charset="utf-8">
${page.id === '404' ? '<base href="/">' : ''}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="theme-color" content="#06090d">
<meta name="color-scheme" content="dark">
${page.noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${page.image || `${site.url}/assets/img/og.png`}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/GeistMono-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/freya.css?v=${ctx.version}">
<script>(function(d){d.classList.add('js');try{if(${page.preloader ? 'true' : 'false'}&&!sessionStorage.getItem('fsp-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('is-intro')}catch(e){}setTimeout(function(){if(!window.__fsp)d.classList.remove('js','is-intro')},3500)})(document.documentElement)</script>
<script defer src="assets/freya.js?v=${ctx.version}"></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body id="top" class="p-${page.id}">
${page.preloader ? preloader() : ''}
${page.bare ? '' : header(page)}
<main id="main" tabindex="-1">
${body}
</main>
${page.bare ? '' : footer(page)}
<div class="gridview" aria-hidden="true"><div class="wrap grid">${'<i></i>'.repeat(12)}</div></div>
<div class="toast" role="status" aria-live="polite" data-toast></div>
</body>
</html>
`;
}
