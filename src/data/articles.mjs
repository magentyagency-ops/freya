// Publication bodies. "full" notes are public; others are partially restricted.
// ⚠ Demo editorial content (illustrative figures) — review before publication.
export const authors = {
  lob: { name: 'Léa Okoye-Brunel', role: 'Partner, Women’s Sport' },
  hl: { name: 'Hugo Lindqvist', role: 'Director, Data & Modelling' },
  th: { name: 'Thomas Hallé', role: 'Partner, Chief Investment Officer' },
  jm: { name: 'Julien Mercadier', role: 'Partner, Advisory' },
  iv: { name: 'Inès Varenne', role: 'Founding Partner, Chair' },
  sb: { name: 'Sarah Benali', role: 'Director, Structured Credit' },
  ir: { name: 'Investor Relations', role: 'Freya Sports Partners' },
  fsp: { name: 'Freya Sports Partners', role: 'Communications' },
};

export const bodies = {
  'womens-sport-anatomy-of-a-market': {
    authors: ['lob', 'hl'],
    sections: [
      {
        id: 'four-curves',
        h: 'A growing market, measured in revenue',
        p: [
          'Deloitte’s 2026 Game changers report estimates global elite women’s sports revenue at US$1.88 billion in 2024 and US$2.41 billion in 2025. It forecasts US$3.04 billion for 2026.',
          'These are market-wide revenue estimates, not a valuation index or an investment performance record. Freya’s investment conviction is separate from the published data.',
        ],
        figures: true,
      },
      {
        id: 'audience',
        h: 'Published estimates and a forecast',
        p: [
          'The chart reproduces Deloitte’s annual revenue series: US$692 million in 2022, US$981 million in 2023, US$1.88 billion in 2024 and US$2.41 billion in 2025. Its scope is global elite women’s sport, not all women’s sports activity.',
          'The dashed segment shows Deloitte’s US$3.04 billion forecast for 2026. Historical values are estimates based on publicly available information. No audience or valuation series is inferred from these numbers.',
        ],
        chart: 'asym',
      },
      {
        id: 'sponsorship',
        h: 'Three sources of revenue',
        p: [
          'Deloitte estimates the 2025 revenue mix at 46% commercial, 31% matchday and 23% broadcast. Commercial revenue includes sponsorship, merchandising and licensing.',
          'These percentages describe revenue composition, not growth rates. Venue capacity, pricing, partnerships and distribution remain organisation-specific questions for investment due diligence.',
        ],
        chart: 'bars',
      },
      {
        id: 'rights',
        h: 'Understanding the scope',
        p: [
          'The report separates matchday, broadcast and commercial income. Broadcast deals that bundle men’s and women’s sports, such as tennis grand slams, are excluded from its data analysis.',
          'This perimeter matters when comparing figures with other studies. A market total cannot replace an assessment of a club’s own contracted income, costs and distribution arrangements.',
        ],
        quote: 'Market growth is context. Investment value still has to be demonstrated asset by asset.',
      },
      {
        id: 'valuations',
        h: 'Growth is not proof of undervaluation',
        p: [
          'This revenue series does not measure transaction prices, profitability, audience growth or valuations. It cannot establish that women’s sport is the most undervalued market in global sport.',
          'An investment assessment must consider the entry price, quality of cash flows, costs, governance and downside scenarios. The possibility of value creation is an investment thesis, not a conclusion demonstrated by this chart.',
        ],
      },
      {
        id: 'conclusions',
        h: 'What we conclude',
        p: [
          'Our conviction is to support organisations with patient capital and operational expertise. Published market data informs that work, but neither market growth nor a forecast guarantees an investment return.',
          'Women’s sport does not need patrons. It needs demanding investors who treat it as an asset in its own right.',
        ],
      },
    ],
    method: 'Source: Deloitte, Game changers: Unlocking the potential of women’s sports (2026), Figure 1, printed page 4. Global elite women’s sports revenue: 2022–2025 estimates; 2026 forecast. USD, nominal published values; no inflation adjustment. Revenue composition percentages are rounded. No Freya audience or valuation index is presented. This note is not investment advice.',
  },
  'media-rights-the-end-of-exclusivity': {
    authors: ['jm', 'hl'],
    intro: [
      'For twenty years, the value of sports rights rested on a simple model: one broadcaster, one territory, one exclusivity. That model is fragmenting. Streaming platforms, social networks and direct-to-consumer distribution are redistributing value between rights holders and broadcasters.',
      'For leagues, the challenge is no longer just maximising the price of a package, but arbitrating between revenue, exposure and ownership of the fan relationship. This note examines the emerging models and their implications for asset valuation.',
    ],
  },
  'valuing-a-club-beyond-multiples': {
    authors: ['th'],
    intro: [
      'The revenue multiple remains the benchmark for club transactions. It is simple — and it treats revenues of very different quality as equal: a multi-year broadcast contract and a European qualification bonus are not worth the same.',
      'Here we present the sum-of-the-parts valuation method used in our analyses: recurring revenue, results-dependent revenue, squad value, real estate and brand.',
    ],
  },
  'credit-backed-by-tv-rights': {
    authors: ['sb', 'th'],
    intro: [
      'Professional clubs hold solid receivables — broadcast rights, sponsorship contracts, transfer instalments — that are often illiquid. Financing them has become an asset class of its own, still narrow and poorly documented.',
      'This note describes the most common structures, the specific risks (relegation, rights renegotiation, broadcaster default) and the documentary protections that make the difference in a downturn.',
    ],
  },
  'performance-data-from-pitch-to-balance-sheet': {
    authors: ['hl'],
    intro: [
      'Optical tracking, event data, training load: clubs now produce more data than they use. Yet part of that data is financial information: a squad’s value, its injury risk, its capacity to progress.',
      'We show how this data feeds our valuation and risk models, and why data quality is becoming a due diligence criterion in its own right.',
    ],
  },
  'club-governance-what-our-models-measure': {
    authors: ['iv'],
    intro: [
      'Before analysing a club’s financial results, we analyse its governance. Experience shows it explains a large share of margin dispersion between clubs of comparable size.',
      'This note details the governance criteria built into the Freya model: board independence, separation of roles, wage-bill control, quality of internal control.',
    ],
  },
  'investor-letter-q3-2026': {
    authors: ['ir'],
    intro: [
      'The quarterly letter covers investment activity, portfolio developments, impact commitments and the outlook for the coming period.',
      'It is intended exclusively for Freya Sports Partners investors and is available in the secure data room.',
    ],
  },
  'launch-of-the-advisory-practice': {
    authors: ['fsp'],
    intro: [
      'Freya Sports Partners announces the launch of its Advisory practice, bringing together its strategy, partnerships, brand and transaction advisory work for sports organisations.',
      'Led by partner Julien Mercadier, the practice draws on the firm’s data platform and analytical methods. It works with clubs, leagues, federations, athletes and brands.',
    ],
    open: true,
  },
  'interview-building-a-professional-league': {
    authors: ['lob'],
    intro: [
      'Calendar, competitive balance, pooled rights, financial rules: the structural choices of a professional league determine its value over ten years.',
      'In this interview, Léa Okoye-Brunel discusses the decisions that separate leagues that grow from those that stall, and the role investors can play.',
    ],
  },
};
