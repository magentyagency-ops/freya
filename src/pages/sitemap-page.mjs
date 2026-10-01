import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { pageHero } from '../lib/ui.mjs';
import { insights, articleHref, categories } from '../data/insights.mjs';

export const meta = {
  id: 'sitemap',
  section: 'legal',
  title: 'Sitemap',
  description: 'Every page of the Freya Sports Partners website.',
  headerTheme: 'void',
};

const groups = [
  ['Firm', [['index.html', 'Home'], ['firm.html', 'The Firm'], ['approach.html', 'Approach'], ['team.html', 'Team'], ['impact.html', 'Impact'], ['careers.html', 'Careers']]],
  ['Strategies', [['strategies.html', 'Overview'], ['womens-sport.html', 'Women’s sport'], ['strategies.html#assets', 'Sports assets'], ['strategies.html#media', 'Media, data & rights'], ['strategies.html#credit', 'Structured credit'], ['advisory.html', 'Advisory']]],
  ['Investors', [['portfolio.html', 'Portfolio'], ['investors.html', 'Investor relations'], ['login.html', 'Investor portal']]],
  ['Resources', [['news.html', 'News'], ['insights.html', 'Insights'], ['press.html', 'Press'], ['contact.html', 'Contact'], ['legal-notice.html', 'Legal notice'], ['privacy.html', 'Privacy']]],
];

export function render() {
  return html`
  ${pageHero({ code: 'L-03 / Sitemap', label: 'Navigation', title: 'Site<br><span class="dim">map.</span>', crumbs: [[null, 'Sitemap']], cls: 'phero--short' })}
  <section class="sec sec--sm" data-theme="void">
    <div class="wrap sitemap">
      ${groups.map(([t, links]) => html`<div class="sitemap__col" data-reveal><h2 class="label label--dot">${t}</h2><ul>${links.map(([h, l]) => `<li><a href="${h}">${l}${icon.arrowUpRight}</a></li>`)}</ul></div>`)}
      <div class="sitemap__col sitemap__col--wide" data-reveal>
        <h2 class="label label--dot">Publications</h2>
        <ul>${insights.map((i) => `<li><a href="${articleHref(i)}"><small>${categories[i.cat]}</small>${i.title}${icon.arrowUpRight}</a></li>`)}</ul>
      </div>
    </div>
  </section>`;
}
