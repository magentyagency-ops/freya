// Central site configuration.
// ⚠ Values marked "TO CONFIRM" are placeholders to replace before going live.
export const site = {
  name: 'Freya Sports Partners',
  short: 'Freya',
  url: 'https://www.freyasportspartners.com', // TO CONFIRM: production domain (canonical / Open Graph tags)
  email: 'contact@freyasportspartners.com',
  city: 'Paris',
  coords: '48.8566° N · 2.3522° E',
  linkedin: 'https://www.linkedin.com/', // TO CONFIRM: company LinkedIn page
  year: 2026,
  asOf: '30 Sep 2026', // reference date for displayed data
  baseline: 'An independent investment firm dedicated to the business of sport.',
};

// Optional form endpoint (Formspree, Basin, custom API…). Empty = forms open a pre-filled email to site.email.
export const formEndpoint = '';

export const clocks = [
  { city: 'Paris', tz: 'Europe/Paris', open: [9, 19] },
  { city: 'London', tz: 'Europe/London', open: [9, 18] },
  { city: 'New York', tz: 'America/New_York', open: [9, 18] },
];

// Main navigation (header) — children feed the mega menus.
export const nav = [
  {
    id: 'firm',
    label: 'Firm',
    intro: { title: 'An independent firm,<br>built for the long run.', text: 'Governance, method and people: what underpins our decisions.' },
    children: [
      { href: 'firm.html', label: 'The Firm', desc: 'Independence, principles, governance.', code: 'F-01' },
      { href: 'approach.html', label: 'Approach', desc: 'From data to conviction.', code: 'F-02' },
      { href: 'team.html', label: 'Team', desc: 'Investors, operators, athletes.', code: 'F-03' },
      { href: 'impact.html', label: 'Impact', desc: 'Measuring what really matters.', code: 'F-04' },
      { href: 'careers.html', label: 'Careers', desc: 'Join the firm.', code: 'F-05' },
    ],
  },
  { id: 'strategies', label: 'Strategies', mega: 'strategies' },
  { id: 'advisory', label: 'Advisory', href: 'advisory.html' },
  { id: 'portfolio', label: 'Portfolio', href: 'portfolio.html' },
  { id: 'news', label: 'News', href: 'news.html' },
  { id: 'insights', label: 'Insights', href: 'insights.html' },
  { id: 'investors', label: 'Investors', href: 'investors.html' },
];

// Full-screen menu
export const menu = [
  { href: 'index.html', label: 'Home', id: 'index' },
  { href: 'firm.html', label: 'The Firm', id: 'firm' },
  { href: 'strategies.html', label: 'Strategies', id: 'strategies' },
  { href: 'womens-sport.html', label: 'Women’s sport', id: 'womens-sport' },
  { href: 'advisory.html', label: 'Advisory', id: 'advisory' },
  { href: 'approach.html', label: 'Approach', id: 'approach' },
  { href: 'portfolio.html', label: 'Portfolio', id: 'portfolio' },
  { href: 'news.html', label: 'News', id: 'news' },
  { href: 'insights.html', label: 'Insights', id: 'insights' },
  { href: 'team.html', label: 'Team', id: 'team' },
  { href: 'investors.html', label: 'Investors', id: 'investors' },
  { href: 'contact.html', label: 'Contact', id: 'contact' },
];

export const footerCols = [
  {
    title: 'Firm',
    links: [['firm.html', 'The Firm'], ['approach.html', 'Approach'], ['team.html', 'Team'], ['impact.html', 'Impact'], ['careers.html', 'Careers']],
  },
  {
    title: 'Strategies',
    links: [['womens-sport.html', 'Women’s sport'], ['strategies.html#assets', 'Sports assets'], ['strategies.html#media', 'Media & data'], ['strategies.html#credit', 'Structured credit'], ['advisory.html', 'Advisory']],
  },
  {
    title: 'Resources',
    links: [['news.html', 'News'], ['insights.html', 'Insights'], ['portfolio.html', 'Portfolio'], ['press.html', 'Press'], ['investors.html', 'Investors'], ['login.html', 'Portal']],
  },
  {
    title: 'Contact',
    links: [['contact.html', 'Write to us'], ['contact.html#office', 'Paris'], ['careers.html#roles', 'Open roles'], ['legal-notice.html', 'Legal notice'], ['privacy.html', 'Privacy']],
  },
];

export const disclaimer =
  'The information published on this website is provided for information purposes only. It does not constitute an offer, a solicitation or an investment recommendation, and shall not bind Freya Sports Partners. Figures shown are illustrative; past performance is not indicative of future results. All investments carry a risk of capital loss. Access to managed vehicles is restricted to professional investors within the meaning of Directive 2014/65/EU (MiFID II).';
