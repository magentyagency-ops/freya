import { html } from '../lib/html.mjs';
import { btn, link } from '../lib/ui.mjs';

export const meta = {
  id: '404',
  title: 'Page not found',
  description: 'The requested page does not exist or has moved.',
  headerTheme: 'void',
  noindex: true,
};

export function render() {
  return html`
  <section class="nf" data-theme="void" data-hero>
    <canvas class="hero__gl" data-gl="surface" data-cam-y="5.2" data-iso="0.6" aria-hidden="true"></canvas>
    <div class="hero__veil" aria-hidden="true"></div>
    <div class="wrap nf__inner">
      <span class="label label--dot" data-scramble>Error 404 — Offside position</span>
      <p class="nf__code" aria-hidden="true">404</p>
      <h1 class="h1" data-split>Offside.<br><span class="dim">This page doesn’t exist.</span></h1>
      <p class="lead" data-reveal>The page you requested has moved, been renamed, or never existed. Get back in the game from one of the pages below.</p>
      <div class="btns" data-reveal>
        ${btn('index.html', 'Back to home', { variant: 'solid' })}
        ${btn('contact.html', 'Report a link', { variant: 'ghost' })}
      </div>
      <nav class="nf__links" aria-label="Main pages" data-reveal>
        ${[['strategies.html', 'Strategies'], ['womens-sport.html', 'Women’s sport'], ['portfolio.html', 'Portfolio'], ['insights.html', 'Insights'], ['investors.html', 'Investors']].map(([h, l]) => link(h, l))}
      </nav>
    </div>
  </section>`;
}
