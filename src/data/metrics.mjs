// Figures displayed on the site.
// ⚠ ALL ILLUSTRATIVE — replace with real (or sourced) data before publication.

// Index 2018 = 100 — audience vs revenue of elite women's sport (schematic trajectory)
export const asymmetry = {
  x: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
  series: [
    { name: 'Audience', hi: true, values: [100, 118, 106, 146, 198, 252, 318, 390, 466, 546, 628, 712, 790] },
    { name: 'Revenue', values: [100, 108, 94, 112, 134, 161, 196, 236, 284, 340, 404, 476, 556] },
  ],
  projFrom: 2027,
  yMax: 800,
  yStep: 200,
  unit: 'index',
};

// Cumulative selection funnel since inception
export const selection = [
  { name: 'Sourcing', value: 1200, text: 'Opportunities logged in our systems: clubs, leagues, rights, platforms.' },
  { name: 'Modelling', value: 340, text: 'Opportunities screened through the 6-factor Freya model.' },
  { name: 'Due diligence', value: 64, text: 'In-depth reviews: financial, legal, sporting, reputational.' },
  { name: 'Committee', value: 18, text: 'Cases presented to the investment committee.' },
  { name: 'Investment', value: 9, text: 'Positions opened, structured and supported.' },
];

// Platform figures (home)
export const figures = [
  { value: 1200, unit: '+', label: 'Opportunities analysed', note: 'Since the platform’s inception.' },
  { value: 0.75, decimals: 2, unit: '%', label: 'Selection rate', note: 'From sourcing to investment.' },
  { value: 38, unit: '', label: 'Data sources', note: 'Performance, audience, finance, governance.' },
  { value: 12, unit: '', label: 'Sports tracked', note: 'Modelled continuously.' },
];
