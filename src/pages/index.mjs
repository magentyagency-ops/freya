import { html, esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { glyph, cover } from '../lib/glyphs.mjs';
import { btn, link, gl, regs, sh, stat } from '../lib/ui.mjs';
import { lineChart } from '../lib/charts.mjs';
import { strategies, affaires } from '../data/strategies.mjs';
import { insights } from '../data/insights.mjs';
import { insightCard } from '../lib/cards.mjs';
import { figures } from '../data/metrics.mjs';
import { womensSportRevenue } from '../data/womens-sport.mjs';
import { site } from '../config.mjs';
import { loadNews, newsCard } from './news.mjs';

export const meta = {
  id: 'index',
  title: 'Winning Takes a Team',
  description:
    'Freya Sports Partners is an independent investment firm dedicated to the business of sport: women’s sport, sports assets, media and structured credit.',
  preloader: true,
  headerTheme: 'void',
};

const sports = ['Football', 'Basketball', 'Rugby', 'Handball', 'Volleyball', 'Tennis', 'Cycling', 'Athletics', 'Swimming', 'Sailing', 'Golf', 'Combat sports'];

function hero() {
  const today = loadNews().articles[0];
  return html`
  <section class="hero hero--nice" data-theme="void" data-hero>
    <canvas class="hero__gl" data-gl="surface" data-nice="1" aria-hidden="true"></canvas>
    <div class="hero__veil" aria-hidden="true"></div>
    ${gl(false)}
    <div class="wrap hero__hud" aria-hidden="true">
      <div class="hud">
        <span class="micro">Nice / Promenade des Anglais</span>
        <span class="micro dim">A coastline in motion</span>
      </div>
      <div class="hud hud--r">
        <span class="micro num" data-hud-coords>X 0.000 · Y 0.000</span>
        <span class="micro dim">${site.coords}</span>
      </div>
    </div>
    ${today ? html`<a class="hero-news" href="news-${esc(today.slug)}.html" aria-label="Latest story: ${esc(today.headline)}">
      <img class="hero-news__image" src="${esc(today.image || '')}" alt="" loading="eager" decoding="async">
      <span class="hero-news__copy"><span class="hero-news__top"><span class="hero-news__label"><i aria-hidden="true"></i> Freya newsroom</span><span class="hero-news__date">Today</span></span><span class="hero-news__title">${esc(today.headline)}</span><span class="hero-news__bottom"><span>${esc(today.sport)} · Read story</span><span class="hero-news__arrow" aria-hidden="true">↗</span></span></span>
    </a>` : ''}
    <div class="wrap hero__inner">
      <h1 class="display hero__title" data-split>
        <span class="hero__line">Winning</span>
        <span class="hero__line dim">Takes a Team.</span>
      </h1>
      <div class="hero__bottom">
        <div class="hero__left">
          <p class="hero__lead" data-reveal>Freya Sports Partners invests in the organisations, rights and assets shaping the business of sport — with a core conviction: building long-term value in women’s sport.</p>
          <div class="btns hero__ctas" data-reveal style="--d:1">
            ${btn('strategies.html', 'Our strategies', { variant: 'solid' })}
            ${link('investors.html', 'Investor centre')}
          </div>
        </div>
      </div>
    </div>
    <a class="hero__scroll" href="#thesis" aria-label="Scroll to the thesis"><span class="micro">Scroll</span><i></i></a>
  </section>`;
}

function ticker() {
  const items = sports.map((s, i) => `<li><span class="ticker__k">S/${String(i + 1).padStart(2, '0')}</span>${s}</li>`).join('');
  return html`
  <div class="ticker" data-theme="void" aria-label="Sports tracked by our models">
    <div class="ticker__track"><ul>${items}</ul><ul aria-hidden="true">${items}</ul></div>
  </div>`;
}

function thesis() {
  return html`
  <section class="sec thesis" id="thesis" data-theme="void">
    ${gl()}
    <div class="wrap">
      <div class="thesis__grid">
        <div class="thesis__meta">
          <span class="idx" data-scramble>01</span>
          <span class="label">Thesis</span>
        </div>
        <p class="statement thesis__text" data-highlight>Sport has become an asset class in its own right. Yet much of its value remains poorly measured, poorly financed, poorly understood. Freya exists to close that gap — with the discipline of a fund and the culture of the pitch.</p>
      </div>
      <div class="principles">
        ${[
          ['P/01', 'Measure before you believe.', 'Every conviction goes through our models: performance, audience, revenue, governance. An unmeasured intuition is just an intuition.'],
          ['P/02', 'Invest where the market isn’t looking.', 'The best asymmetries emerge in segments in transition. Women’s sport is the clearest example today.'],
          ['P/03', 'Build for the long run.', 'We back projects over seven to ten years, at the pace of seasons, rights cycles and generations of athletes.'],
        ].map(
          ([k, t, p], i) => html`
          <article class="principle" data-reveal style="--d:${i}">
            <span class="idx">${k}</span>
            <h3 class="h4">${t}</h3>
            <p class="body-sm">${p}</p>
          </article>`
        )}
      </div>
    </div>
  </section>`;
}

function numbers() {
  return html`
  <section class="sec sec--sm figures" data-theme="dark">
    <div class="wrap">
      <div class="figures__head">
        <span class="label"><span class="idx">02</span>&nbsp;&nbsp;The platform in numbers</span>
        <span class="ill">Illustrative data as of ${site.asOf}</span>
      </div>
      <div class="figures__grid">
        ${figures.map((f) => stat(f))}
      </div>
    </div>
  </section>`;
}

function strategiesScroll() {
  const cards = [...strategies, affaires];
  const photos = [
    { src: 'assets/img/ogc-nice-women-squad.jpg', alt: 'Les joueuses de l’OGC Nice féminin réunies sur le terrain', credit: 'OGC Nice Féminin', position: '50% 38%' },
    { src: 'assets/img/strategies/sports-assets.jpg', alt: 'Aerial view of a football stadium and its pitch', credit: 'Sérgio Souza · Pexels', position: '50% 50%' },
    { src: 'assets/img/strategies/media-data.jpg', alt: 'A camera operator filming a football match', credit: 'Aslam Jawaid · Pexels', position: '50% 48%' },
    { src: 'assets/img/strategies/structured-credit.jpg', alt: 'Outdoor tennis courts and sports facilities', credit: 'Ceren Büşra Sevtekin · Pexels', position: '50% 42%' },
    { src: 'assets/img/strategies/advisory.jpg', alt: 'A coach discussing tactics with football players', credit: 'Quyn Phạm · Pexels', position: '50% 42%' },
  ];
  return html`
  <section class="hs" data-theme="dark" data-hscroll aria-labelledby="hs-title">
    <div class="hs__sticky">
      <div class="wrap hs__head">
        <div class="hs__meta"><span class="idx" data-scramble>03</span><span class="label">Strategies</span></div>
        <h2 class="h2 hs__title" id="hs-title" data-split>Four strategies.<br><span class="dim">One discipline.</span></h2>
        <div class="hs__nav">
          <div class="hs__progress" aria-hidden="true"><span class="num" data-hs-current>01</span><i><b data-hs-bar></b></i><span class="num">${String(cards.length).padStart(2, '0')}</span></div>
          ${link('strategies.html', 'Overview')}
        </div>
      </div>
      <div class="hs__viewport">
        <ul class="hs__track" data-hs-track>
          ${cards.map(
            (s, i) => html`
            <li class="scard" data-spotlight>
              <a class="scard__a" href="${s.href}">
                <div class="scard__top">
                  <span class="scard__code">${s.code}</span>
                  ${s.tag ? `<span class="tag${i === 0 ? ' tag--accent' : ''}">${s.tag}</span>` : ''}
                </div>
                <div class="scard__visual scard__visual--photo" style="--photo-position:${photos[i].position}">
                  <img src="${photos[i].src}" alt="${photos[i].alt}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">
                  <span class="scard__credit">${photos[i].credit}</span>
                </div>
                <div class="scard__body">
                  <h3 class="h3">${s.name}</h3>
                  <p class="scard__text">${s.summary}</p>
                </div>
                <span class="scard__cta"><span>${s.horizon ? 'Explore the strategy' : 'Discover the practice'}</span>${icon.arrow}</span>
              </a>
            </li>`
          )}
        </ul>
      </div>
    </div>
  </section>`;
}

function feature() {
  return html`
  <section class="sec feature" id="womens-sport-data" data-theme="ice">
    <div class="wrap">
      ${sh({
        idx: '04',
        label: 'Women’s sport — Core thesis',
        title: 'Women’s sport.<br>A market gaining scale.',
        lead: 'Published revenue estimates show a growing global market. Our conviction is to help build its next chapter — not to confuse market growth with a guarantee of investment returns.',
      })}
      <div class="feature__grid">
        ${lineChart({
          id: 'fig-asymetrie',
          fig: 'Fig. 01',
          title: 'Global elite women’s sport — annual revenue (USD millions)',
          ...womensSportRevenue,
        })}
        <div class="feature__signals">
          ${[
            ['Σ/01', '$2.41bn in 2025', 'Deloitte’s estimate of global elite women’s sports revenue, across matchday, broadcast and commercial income.'],
            ['Σ/02', '$3.04bn forecast', 'Deloitte’s projection for 2026. A forecast, not a realised result or an investment return.'],
            ['Σ/03', 'Our conviction', 'Support clubs and organisations with patient capital and operational expertise. Each investment needs its own valuation analysis.'],
          ].map(
            ([k, t, p], i) => html`
            <div class="signal" data-reveal style="--d:${i}">
              <span class="idx">${k}</span>
              <div><h3 class="h4">${t}</h3><p class="body-sm">${p}</p></div>
            </div>`
          )}
          <div class="feature__cta" data-reveal>${btn('womens-sport.html', 'Read the thesis', { variant: 'solid' })}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function flagship() {
  return html`
  <section class="sec home-flagship" data-theme="dark" aria-labelledby="home-flagship-title">
    <div class="wrap home-flagship__grid">
      <div class="home-flagship__copy">
        <div class="home-flagship__meta"><span class="idx">05</span><span class="label">Our flagship investment</span></div>
        <p class="home-flagship__eyebrow">Women’s football · Nice, Côte d’Azur</p>
        <h2 class="h1" id="home-flagship-title" data-reveal>OGC Nice<br><span class="dim">Féminines.</span></h2>
        <p class="lead" data-reveal>Les Aiglonnes are at the heart of Freya’s conviction in women’s sport. Our principal investment backs the team’s ambition, its players and the next chapter of football in Nice.</p>
      </div>
      <figure class="home-flagship__visual" aria-label="OGC Nice Féminines celebrating together">
        <span class="home-flagship__backdrop" aria-hidden="true">NICE</span>
        <span class="home-flagship__orbit" aria-hidden="true"></span>
        <img src="assets/img/ogc-nice-women-squad-cutout.png" alt="OGC Nice Féminines, the team celebrating together." width="1672" height="941" loading="lazy" decoding="async">
        <figcaption><span class="idx">OGC / 01</span><span class="label">Les Aiglonnes</span></figcaption>
      </figure>
      <div class="home-flagship__foot" data-reveal>
        <span class="home-flagship__signature">Long-term capital. Sporting conviction.</span>
        ${btn('portfolio.html', 'Discover OGC Nice Women', { variant: 'solid', size: 'lg', ico: 'arrowUpRight', cls: 'home-flagship__cta', magnetic: false })}
      </div>
    </div>
  </section>`;
}

function affairesTeaser() {
  const services = [
    ['A/01', 'Strategy & development', 'Strategic plans, business models, growth roadmaps.'],
    ['A/02', 'Partnerships & sponsorship', 'Partnership architecture, inventory valuation, negotiation.'],
    ['A/03', 'Brand & positioning', 'Brand platforms for clubs, leagues and athletes.'],
    ['A/04', 'Transactions', 'Fundraising, disposals, equity investments, due diligence.'],
    ['A/05', 'Structured financing', 'Solutions backed by rights, sponsorship and infrastructure.'],
  ];
  return html`
  <section class="sec at" data-theme="void">
    <div class="wrap at__grid">
      <div class="at__left">
        <div class="at__meta"><span class="idx" data-scramble>06</span><span class="label">Advisory</span></div>
        <h2 class="h2" data-split>Advice,<br><span class="dim">with the depth of an investor.</span></h2>
        <p class="lead" data-reveal>Our Advisory practice puts the Freya method to work for clubs, leagues, athletes and brands as they scale.</p>
        <div data-reveal>${btn('advisory.html', 'Discover Advisory', { variant: 'ghost' })}</div>
        <div class="at__glyph" aria-hidden="true" data-reveal>${glyph('network')}</div>
      </div>
      <ul class="rows at__list">
        ${services.map(
          ([k, t, p], i) => html`
          <li data-reveal style="--d:${i}">
            <a class="row" href="advisory.html#services">
              <span class="idx">${k}</span>
              <span class="row__title">${t}</span>
              <span class="row__desc">${p}</span>
              <span class="row__icon">${icon.arrowUpRight}</span>
            </a>
          </li>`
        )}
      </ul>
    </div>
  </section>`;
}

function latest() {
  const list = insights.filter((i) => !i.gated && i.cat !== 'communique').slice(0, 3);
  return html`
  <section class="sec insights" data-theme="ice">
    <div class="wrap">
      ${sh({
        idx: '07',
        label: 'Insights',
        title: 'Research<br><span class="dim">& convictions.</span>',
        lead: 'Research notes, methodology and data: we publish what we learn about the business of sport.',
        split: true,
      })}
      <div class="icards">${list.map((i) => insightCard(i))}</div>
      <div class="insights__foot" data-reveal>${link('insights.html', 'All publications')}</div>
    </div>
  </section>`;
}

function newsTeaser() {
  const d = loadNews();
  if (!d.articles.length) return '';
  return html`
  <section class="sec nwteaser" data-theme="dark">
    <div class="wrap nwteaser__grid">
      <div class="nwteaser__head">
        <div class="investors__meta"><span class="idx" data-scramble>08</span><span class="label nwteaser__live">Live · updated daily</span></div>
        <h2 class="h2" data-split>Freya<br><span class="dim">Newsroom.</span></h2>
        <p class="lead" data-reveal>Women’s sport, every morning: results, money, media and power — written by our desk.</p>
        <div data-reveal>${btn('news.html', 'Open the newsroom', { variant: 'ghost' })}</div>
      </div>
      <div class="ngrid ngrid--teaser" data-reveal>${d.articles.slice(0, 3).map((a, i) => newsCard(a, { size: i ? 'ncard--sm' : 'ncard--big' }))}</div>
    </div>
  </section>`;
}

function investors() {
  return html`
  <section class="sec investors" data-theme="void">
    <div class="investors__bg" aria-hidden="true">${cover('contours', 'freya-investors', 'investors__contours')}</div>
    ${regs(['tl', 'tr'])}
    <div class="wrap investors__grid">
      <div class="investors__main">
        <div class="investors__meta"><span class="idx" data-scramble>09</span><span class="label">Investors</span></div>
        <h2 class="h1" data-split>Access built<br><span class="dim">on trust.</span></h2>
        <p class="lead" data-reveal>Freya opens a direct dialogue with investors who share its vision of sport: patient, demanding and grounded in projects with real value.</p>
        <div class="btns" data-reveal>
          ${btn('investors.html', 'Investor centre', { variant: 'solid' })}
          ${btn(`mailto:${site.email}?subject=${encodeURIComponent('Investor presentation')}`, 'Request the presentation', { variant: 'ghost', ico: 'arrowUpRight' })}
        </div>
      </div>
      <ul class="investors__list">
        ${[
          ['Quarterly reporting', 'Financial, non-financial and sporting KPIs for every holding.'],
          ['Annual letter', 'A candid account of our decisions, our mistakes and our convictions.'],
          ['Secure data room', 'Legal documentation, models and minutes, named access.'],
          ['Advisory committee', 'Anchor investors sit alongside the team.'],
        ].map(
          ([t, p], i) => html`<li data-reveal style="--d:${i}"><span class="idx">${String(i + 1).padStart(2, '0')}</span><div><h3 class="h4">${t}</h3><p class="body-sm">${p}</p></div></li>`
        )}
      </ul>
    </div>
  </section>`;
}

export function render() {
  return [hero(), ticker(), thesis(), /* numbers(), */ strategiesScroll(), feature(), flagship(), newsTeaser(), affairesTeaser(), latest(), investors()].join('\n');
}
