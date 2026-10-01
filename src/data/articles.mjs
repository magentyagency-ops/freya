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
        h: 'Four curves, four speeds',
        p: [
          'Women’s sport is often described as a single trend: “women’s sport is taking off.” Reality is more interesting. Four curves — audience, sponsorship, media rights and valuations — are moving at very different speeds.',
          'That lag is not a market failure. It is the signature of a market in transition, and it is precisely where a patient investor finds opportunity: buying the revenue trajectory before it is priced in.',
        ],
        figures: true,
      },
      {
        id: 'audience',
        h: 'Audience, the leading indicator',
        p: [
          'Audience always leads revenue. Record attendance, rising broadcast hours, younger and more engaged digital communities: attention moves faster than money.',
          'In our models, audience is the first detection factor. A sustained rise in attendance and broadcast over at least two seasons precedes, on average, the repricing of contracts by one to three rights cycles.',
        ],
        chart: 'asym',
      },
      {
        id: 'sponsorship',
        h: 'Sponsorship captures growth first',
        p: [
          'Of all revenue sources, sponsorship reacts fastest. Brands seek engaged audiences, clear values and a still-reasonable entry price. They now sign longer contracts, often with activation commitments.',
          'Ticketing follows, but more slowly: it depends on venue capacity, pricing policy and the fan experience — all operational levers an active shareholder can pull.',
        ],
        chart: 'bars',
      },
      {
        id: 'rights',
        h: 'Media rights catch up in cycles',
        p: [
          'Broadcast rights are renegotiated in three-to-five-year cycles, so their value rises in steps, at each tender. Selling women’s competitions separately — long sold as an “add-on” — has changed the game.',
          'Fragmented distribution also opens new options: dedicated platforms, direct-to-consumer, rights split by territory. For a mid-sized league, the trade-off between exposure and revenue becomes a modelling exercise in its own right.',
        ],
        quote: 'The price of a right reflects yesterday’s audience. Our job is to anticipate tomorrow’s.',
      },
      {
        id: 'valuations',
        h: 'Valuations still anchored in the past',
        p: [
          'Recent transactions are still valued on historical comparables and revenue multiples. These methods ignore trajectory: they apply the benchmarks of a market that was not growing to an asset that is growing fast.',
          'That is the asymmetry we look for: a measurable gap between an asset’s value based on its probable future revenue and the price at which the market is willing to trade it today.',
        ],
      },
      {
        id: 'conclusions',
        h: 'What we conclude',
        p: [
          'Three implications guide our strategy. First, invest ahead of the rights cycle: value creation concentrates around renegotiations. Second, governance first: a club or league only captures growth if it is structured to convert it into revenue. Finally, patience: a seven-to-ten-year horizon spans two full rights cycles.',
          'Women’s sport does not need patrons. It needs demanding investors who treat it as an asset in its own right.',
        ],
      },
    ],
    method: 'The indices shown are built by Freya Sports Partners from public and proprietary data. They are illustrative, do not constitute a forecast and should not form the basis of any investment decision.',
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
