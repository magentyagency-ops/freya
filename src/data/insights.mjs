// Publications — research notes, data, interviews, press releases (editorial examples).
export const categories = {
  research: 'Research note',
  method: 'Methodology',
  data: 'Data',
  interview: 'Interview',
  letter: 'Investor letter',
  release: 'Press release',
};

export const insights = [
  {
    slug: 'womens-sport-anatomy-of-a-market',
    cat: 'research', date: '2026-09-18', read: 14, cover: 'ridges', featured: true,
    title: 'Women’s sport: anatomy of an accelerating market',
    excerpt: 'Audiences, sponsorship, rights, valuations: four curves moving at different speeds. The gap between them is the best opportunity in the sports economy.',
    points: ['Audiences lead revenues by one to three rights cycles.', 'Sponsorship captures growth faster than ticketing.', 'Valuations remain anchored to historical comparables.'],
    full: true,
  },
  {
    slug: 'media-rights-the-end-of-exclusivity',
    cat: 'research', date: '2026-07-02', read: 11, cover: 'bars',
    title: 'Media rights: the end of exclusivity?',
    excerpt: 'Fragmented distribution is redistributing value between leagues, platforms and legacy broadcasters. What it means for rights holders.',
    points: ['Tenders are being split by territory, format and platform.', 'Direct-to-consumer becomes a credible option for mid-sized leagues.', 'Audience data becomes a tradable asset in its own right.'],
  },
  {
    slug: 'valuing-a-club-beyond-multiples',
    cat: 'method', date: '2026-05-21', read: 9, cover: 'scatter',
    title: 'Valuing a club: beyond revenue multiples',
    excerpt: 'The revenue multiple remains the market benchmark. Yet it ignores what matters most: revenue quality, sensitivity to results and the value of physical assets.',
    points: ['Separate recurring revenue from results-dependent revenue.', 'Treat the squad as an amortisable asset.', 'Value real estate, academy and brand separately.'],
  },
  {
    slug: 'credit-backed-by-tv-rights',
    cat: 'research', date: '2026-04-08', read: 12, cover: 'contours',
    title: 'Credit backed by TV rights, an asset class of its own',
    excerpt: 'Solid counterparties, contracted cash flows, a still-narrow market: anatomy of a financing segment that is professionalising.',
    points: ['Risk sits with the broadcaster as much as the club.', 'Documentation makes the difference in a relegation.', 'Short maturities limit exposure to rights renegotiations.'],
  },
  {
    slug: 'performance-data-from-pitch-to-balance-sheet',
    cat: 'data', date: '2026-03-12', read: 8, cover: 'field',
    title: 'Performance data: from the pitch to the balance sheet',
    excerpt: 'Optical tracking, event data, training load: how sports data becomes financial information.',
    points: ['A squad’s value shows in its progression data.', 'Injury risk is a balance-sheet risk.', 'Scouting models reduce transfer dispersion.'],
  },
  {
    slug: 'club-governance-what-our-models-measure',
    cat: 'method', date: '2026-02-05', read: 7, cover: 'rings',
    title: 'Club governance: what our models measure',
    excerpt: 'Board independence, separation of roles, control of staff costs: the criteria that precede financial performance.',
    points: ['Governance explains a major share of margin dispersion.', 'Wage bill to revenue remains the first warning sign.', 'Clubs with an independent audit committee withstand shocks better.'],
  },
  {
    slug: 'investor-letter-q3-2026',
    cat: 'letter', date: '2026-10-01', read: 6, cover: 'bars', gated: true,
    title: 'Investor letter — third quarter 2026',
    excerpt: 'Quarterly activity, portfolio developments and outlook. Restricted to Freya Sports Partners investors.',
    points: ['Summary of the quarter’s investment activity.', 'Portfolio KPIs and impact commitments.', 'Outlook and timetable of upcoming transactions.'],
  },
  {
    slug: 'launch-of-the-advisory-practice',
    cat: 'release', date: '2026-01-14', read: 3, cover: 'rings',
    title: 'Freya Sports Partners launches its Advisory practice',
    excerpt: 'Strategy, partnerships, brand and transactions: the firm brings its advisory activities together in a practice dedicated to sports organisations.',
    points: ['A practice dedicated to clubs, leagues, athletes and brands.', 'An approach grounded in an investor’s depth of analysis.', 'A multidisciplinary team based in Paris.'],
  },
  {
    slug: 'interview-building-a-professional-league',
    cat: 'interview', date: '2025-11-27', read: 10, cover: 'contours',
    title: 'Interview: building a professional league',
    excerpt: 'Calendar, competitive balance, pooled rights: the structural choices that determine a league’s value over ten years.',
    points: ['Competitive balance is an economic asset.', 'Pooled rights protect the smallest clubs.', 'A clear calendar drives audiences.'],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmtDate = (iso, long = false) => {
  const [y, m, d] = iso.split('-').map(Number);
  return long ? `${MONTHS_LONG[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`;
};
export const articleHref = (i) => `article-${i.slug}.html`;
