// Deloitte, Game changers: Unlocking the potential of women's sports (2026),
// figure 1, printed page 4. Annual global elite women's sports revenue in USDm.
// Historical numbers are market estimates; 2026 is a forecast, not a result.
// Includes matchday, broadcast and commercial revenue. Bundled men's/women's
// broadcast arrangements are excluded (printed page 5). Not asset valuations.
export const womensSportSource = 'https://www.deloitte.com/content/dam/assets-shared/docs/industries/technology-media-telecommunications/2026/game-changers-unlocking-potential-womens-sports.pdf';
export const womensSportRevenue = {
  x: [2022, 2023, 2024, 2025, 2026],
  series: [{ name: 'Revenue', hi: true, values: [692, 981, 1880, 2410, 3040] }],
  projFrom: 2026,
  yMax: 3500,
  yStep: 500,
  unit: 'USDm',
  source: `<a href="${womensSportSource}" target="_blank" rel="noopener noreferrer">Deloitte · Game changers (2026), Fig. 1, p. 4 ↗</a><br>USD millions · global elite women’s sport · 2022–2025: estimates; 2026: forecast. Matchday, broadcast and commercial revenue; excludes bundled men’s/women’s broadcast deals. Revenue growth does not demonstrate undervaluation.`,
};
