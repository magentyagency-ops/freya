import { legalPage, todo } from '../lib/legal.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'privacy',
  section: 'legal',
  title: 'Privacy policy',
  description: 'Freya Sports Partners privacy policy: data collected, purposes, retention periods and individual rights.',
  headerTheme: 'void',
};

const rows = [
  ['Responding to contact requests', 'Identity, contact details, message', 'Legitimate interest', '3 years after last contact'],
  ['Sending research notes', 'Email address', 'Consent', 'Until consent is withdrawn'],
  ['Investor relations', 'Identity, contact details, investor profile', 'Pre-contractual steps, legal obligations', 'Duration of relationship + 5 years'],
  ['Recruitment', 'CV, cover letter, correspondence', 'Pre-contractual steps', '2 years after last contact'],
];

export function render() {
  return legalPage({
    code: 'L-02 / Privacy',
    label: 'Personal data',
    title: 'Privacy<br><span class="dim">policy.</span>',
    lead: 'We collect the minimum data, for specific purposes, and never sell it.',
    updated: 'October 1, 2026',
    crumb: 'Privacy',
    sections: [
      { id: 'controller', h: 'Data controller', html: `<p>The data controller is <strong>${site.name}</strong>, ${todo('legal form, registered address')}. For any question: <a class="inline-link" href="mailto:${site.email}?subject=Personal%20data">${site.email}</a>.</p>` },
      { id: 'purposes', h: 'Data, purposes and retention', html: `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Purpose</th><th scope="col">Data</th><th scope="col">Legal basis</th><th scope="col">Retention</th></tr></thead><tbody>${rows.map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join('')}</tbody></table></div>` },
      { id: 'recipients', h: 'Recipients', html: `<p>Data is shared only with authorised ${site.name} staff and with our technical processors (hosting, email), who are bound by confidentiality and security commitments. No data is sold or transferred for commercial purposes.</p>` },
      { id: 'transfers', h: 'Transfers outside the European Union', html: `<p>Data is hosted in the European Union. Should a transfer occur, it would be covered by the safeguards provided by the General Data Protection Regulation (European Commission standard contractual clauses).</p>` },
      { id: 'rights', h: 'Your rights', html: `<p>You have the right to access, rectify, erase, restrict, object to and port your data, and to withdraw your consent at any time.</p><p>To exercise these rights, write to <a class="inline-link" href="mailto:${site.email}?subject=Data%20rights%20request">${site.email}</a>. You may also lodge a complaint with the French data protection authority (CNIL).</p>` },
      { id: 'cookies', h: 'Cookies and local storage', html: `<p>The website sets no advertising cookies and no third-party analytics. It only uses the browser’s session storage to remember two strictly necessary preferences: whether the intro animation has played and your investor profile confirmation. This information is deleted when you close the browser.</p><p>Fonts are self-hosted: no data is sent to third parties when you visit.</p>` },
      { id: 'security', h: 'Security', html: `<p>We apply appropriate technical and organisational measures: encrypted communications, access control, logging, staff training. Access to the investor portal is named and protected by two-factor authentication.</p>` },
      { id: 'changes', h: 'Changes to this policy', html: `<p>This policy may be updated to reflect changes in our practices or regulation. The date of the latest update appears at the top of the page.</p>` },
    ],
  });
}
