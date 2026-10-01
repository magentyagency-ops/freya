import { legalPage, todo } from '../lib/legal.mjs';
import { site, disclaimer } from '../config.mjs';

export const meta = {
  id: 'legal-notice',
  section: 'legal',
  title: 'Legal notice',
  description: 'Legal notice and regulatory information for the Freya Sports Partners website.',
  headerTheme: 'void',
};

export function render() {
  return legalPage({
    code: 'L-01 / Legal notice',
    label: 'Legal information',
    title: 'Legal<br><span class="dim">notice.</span>',
    lead: 'Information about the website publisher, its hosting and the regulatory framework of our activities.',
    updated: 'October 1, 2026',
    crumb: 'Legal notice',
    sections: [
      { id: 'publisher', h: 'Website publisher', html: `<p>The website ${site.url.replace('https://', '')} is published by <strong>${site.name}</strong>, a ${todo('legal form')} with a share capital of ${todo('amount')} euros, registered with the ${todo('city')} Trade and Companies Register under number ${todo('RCS / SIREN')}, with its registered office at ${todo('registered address')}, ${site.city}.</p>
        <ul class="ticks"><li>EU VAT number: ${todo('FR00 000000000')}</li><li>Publication director: ${todo('name, title')}</li><li>Contact: <a class="inline-link" href="mailto:${site.email}">${site.email}</a></li></ul>` },
      { id: 'hosting', h: 'Hosting', html: `<p>The website is hosted by ${todo('hosting provider')}, ${todo('address')}, ${todo('phone')}.</p>` },
      { id: 'regulatory', h: 'Regulatory framework', html: `<p>Third-party asset management activities are carried out by ${todo('portfolio management company')}, authorised by the Autorité des marchés financiers under number ${todo('GP-00000000')}. The activities of the Advisory practice do not constitute an investment service.</p><p>${disclaimer}</p>` },
      { id: 'ip', h: 'Intellectual property', html: `<p>All elements of the website — text, generative visuals, logotypes, the Fehu mark, charts and code — are the exclusive property of ${site.name} or its partners. Any reproduction, representation or adaptation, in whole or in part, without prior written consent is prohibited.</p><p>Media kit assets may be used unaltered to illustrate an article about ${site.name}.</p>` },
      { id: 'liability', h: 'Liability', html: `<p>${site.name} strives to ensure the accuracy of published information but cannot guarantee its completeness. Figures are shown for illustration purposes. ${site.name} shall not be liable for any decision made on the basis of information on this website.</p><p>Links to third-party websites are provided for convenience; ${site.name} has no control over their content.</p>` },
      { id: 'data', h: 'Personal data and cookies', html: `<p>The processing of personal data is described in our <a class="inline-link" href="privacy.html">privacy policy</a>. The website sets no advertising cookies and no third-party analytics.</p>` },
      { id: 'credits', h: 'Credits', html: `<p>Design and development: ${todo('agency / team')}. Geist and Geist Mono typefaces, distributed under the SIL Open Font License 1.1. Generative visuals and data visualisations created for ${site.name}.</p>` },
      { id: 'law', h: 'Governing law', html: `<p>This notice is governed by French law. Any dispute relating to the use of the website falls within the jurisdiction of the courts of ${site.city}.</p>` },
    ],
  });
}
