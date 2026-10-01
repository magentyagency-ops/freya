// Freya Newsroom — daily women's sport desk (see .github/workflows/news.yml).
//   OPENAI_API_KEY=… node scripts/news.mjs
// 1. Collects publisher RSS feeds and keeps women's sport stories (the "wire").
// 2. One AI call selects the day's most important stories, grouping duplicate coverage.
// 3. One AI call per story writes an original Freya article from the facts in the sources (credited, linked).
// Without a key, only the wire is refreshed (keyword tagging). Output: src/data/news.json
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/news.json');
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const KEY = process.env.OPENAI_API_KEY;
const PER_DAY = Number(process.env.NEWS_PER_DAY || 6); // articles written per run
const KEEP_ARTICLES = 160;
const WIRE_DAYS = 4;

// women: true = dedicated feed; false = mixed feed, women's stories filtered by keywords + AI.
const FEEDS = [
  { source: 'The Guardian', url: 'https://www.theguardian.com/football/womensfootball/rss', women: true },
  { source: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/womens/rss.xml', women: true },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/womens-rugby-union/rss', women: true },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/wnba/rss', women: true },
  { source: 'ESPN', url: 'https://www.espn.com/espn/rss/wnba/news', women: true },
  { source: 'espnW', url: 'https://www.espn.com/espn/rss/espnw/news', women: true },
  { source: 'CBS Sports', url: 'https://www.cbssports.com/rss/headlines/wnba/', women: true },
  { source: 'Front Office Sports', url: 'https://frontofficesports.com/feed/' },
  { source: 'Sportico', url: 'https://www.sportico.com/feed/' },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/tennis/rss' },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/cycling/rss' },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/athletics/rss' },
  { source: 'The Guardian', url: 'https://www.theguardian.com/sport/cricket/rss' },
  { source: 'BBC Sport', url: 'https://www.bbc.co.uk/sport/tennis/rss.xml' },
  { source: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/rugby-union/rss.xml' },
  { source: 'ESPN', url: 'https://www.espn.com/espn/rss/soccer/news' },
];

const SPORTS = ['Football', 'Basketball', 'Rugby', 'Tennis', 'Cricket', 'Cycling', 'Athletics', 'Other'];
const TOPICS = ['Business', 'Media & rights', 'Investment', 'Governance', 'Competition', 'Players'];
const WOMEN = /\b(women|woman|women’s|women's|female|girls|wsl|nwsl|wnba|wta|lionesses|matildas|red roses|black ferns|liga f|arkema|frauen|unrivaled|pwhl|athletes unlimited)\b/i;

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; FreyaNewsroom/1.0; +https://www.freyasportspartners.com)' };
const decode = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;|&#x27;|&#8217;/g, '’')
    .replace(/&#8216;/g, '‘').replace(/&#822[01];/g, '"').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/\s+/g, ' ').trim();
const tag = (xml, t) => (xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) || [])[1] || '';
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

async function readFeed(f) {
  try {
    const res = await fetch(f.url, { headers: UA, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(res.status);
    const xml = await res.text();
    return [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)].map(([it]) => ({
      title: decode(tag(it, 'title')),
      url: decode(tag(it, 'link')),
      date: new Date(decode(tag(it, 'pubDate')) || Date.now()).toISOString(),
      excerpt: decode(tag(it, 'description')).slice(0, 500),
      source: f.source,
      dedicated: !!f.women,
    }));
  } catch (e) {
    console.warn(`⚠ feed ${f.url}: ${e.message}`);
    return [];
  }
}

// Keyword tagging (wire + fallback)
function guess(it) {
  const t = `${it.title} ${it.excerpt}`.toLowerCase();
  const sport = /wnba|basketball|unrivaled/.test(t) ? 'Basketball' : /rugby|red roses|black ferns/.test(t) ? 'Rugby' : /tennis|wta|open\b/.test(t) ? 'Tennis'
    : /cricket/.test(t) ? 'Cricket' : /cycling|tour de france|giro|vuelta/.test(t) ? 'Cycling' : /athletic|marathon|sprint|100m/.test(t) ? 'Athletics'
    : /football|soccer|wsl|nwsl|lionesses|uefa|fifa|league/.test(t) ? 'Football' : 'Other';
  const topic = /invest|stake|takeover|valuation|fund|ownership|owner|expansion/.test(t) ? 'Investment'
    : /broadcast|tv deal|media rights|streaming|viewers|audience|viewership/.test(t) ? 'Media & rights'
    : /sponsor|revenue|commercial|attendance|record crowd|salary|pay|ticket/.test(t) ? 'Business'
    : /federation|governing|board|policy|rule|ban|investigation|cba|union/.test(t) ? 'Governance'
    : /sign|transfer|injur|contract|retire|captain|award|mvp/.test(t) ? 'Players' : 'Competition';
  return { sport, topic };
}

async function ai(messages, max_tokens = 1800) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, temperature: 0.3, max_tokens, response_format: { type: 'json_object' }, messages }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  ai.tokens = (ai.tokens || 0) + (j.usage?.total_tokens || 0);
  return JSON.parse(j.choices[0].message.content);
}

// Extract readable paragraphs from an article page (facts for the rewrite)
async function pageData(url) {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { text: '', image: null };
    const h = await res.text();
    const paras = [...h.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => decode(m[1])).filter((p) => p.length > 60 && !/cookie|subscribe|newsletter|sign up|©/i.test(p));
    const ogImg = h.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) || h.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
    let image = ogImg ? ogImg[1] : null;
    if (!image) {
      const img = h.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (img && img[1].startsWith('http')) image = img[1];
    }
    return { text: paras.join('\n').slice(0, 3500), image };
  } catch {
    return { text: '', image: null };
  }
}

const DESK = `You are the editorial desk of Freya Sports Partners, an investment firm that publishes a women's sport newsroom. House style: British English, precise, sober, factual, no hype, no emojis.`;

async function selectStories(cands, recentTitles) {
  const list = cands.map((c, i) => `${i}. [${c.source}] ${c.title} — ${c.excerpt.slice(0, 160)}`).join('\n');
  const out = await ai([
    { role: 'system', content: `${DESK} Select today's most newsworthy WOMEN'S sport stories. Prefer variety across sports and favour business, media, investment and governance stories alongside major results. Group items covering the same story. Skip stories already covered: ${JSON.stringify(recentTitles.slice(0, 40))}. Return JSON {"stories":[{"items":[indices],"sport":one of ${JSON.stringify(SPORTS)},"topic":one of ${JSON.stringify(TOPICS)}}]} with at most ${PER_DAY} stories, most important first. Exclude anything not about women's sport.` },
    { role: 'user', content: list },
  ], 800);
  return (out.stories || []).filter((s) => Array.isArray(s.items) && s.items.length);
}

async function writeArticle(story, cands) {
  const srcs = story.items.map((i) => cands[i]).filter(Boolean).slice(0, 3);
  const pageDataList = await Promise.all(srcs.map((s) => pageData(s.url)));
  const texts = pageDataList.map((d, i) => `SOURCE: ${srcs[i].source} — ${srcs[i].title}\n${d.text || srcs[i].excerpt}`);
  const image = pageDataList.find((d) => d.image)?.image || null;
  const out = await ai([
    { role: 'system', content: `${DESK} Write an ORIGINAL article in your own words from the facts in the sources below. Rules: use only facts present in the sources; never invent figures, names or quotes; do not copy sentences; quotes only if verbatim in a source and attributed to the speaker. Return JSON {"headline": max 90 chars, sentence case (capitalise only the first word and proper nouns), "standfirst": one sentence max 30 words, "body": [3 to 5 paragraphs, 220-320 words total], "why": "2 sentences: why it matters for the business of women's sport", "facts": [2 to 4 short key facts with figures when available], "sport": one of ${JSON.stringify(SPORTS)}, "topic": one of ${JSON.stringify(TOPICS)}}` },
    { role: 'user', content: texts.join('\n\n---\n\n') },
  ], 1400);
  if (!out.headline || !Array.isArray(out.body)) throw new Error('incomplete article');
  const date = srcs.map((s) => s.date).sort().pop();
  return {
    slug: `${date.slice(0, 10)}-${slugify(out.headline)}`,
    date,
    headline: out.headline,
    standfirst: out.standfirst || '',
    body: out.body,
    why: out.why || '',
    facts: (out.facts || []).slice(0, 4),
    sport: SPORTS.includes(out.sport) ? out.sport : story.sport || 'Other',
    topic: TOPICS.includes(out.topic) ? out.topic : story.topic || 'Competition',
    image,
    sources: srcs.map((s) => ({ name: s.source, title: s.title, url: s.url })),
  };
}

async function main() {
  let prev = { articles: [], wire: [] };
  try { prev = { articles: [], wire: [], ...JSON.parse(await readFile(OUT, 'utf8')) }; } catch {}
  const used = new Set(prev.articles.flatMap((a) => a.sources.map((s) => s.url)));

  const raw = (await Promise.all(FEEDS.map(readFeed))).flat();
  const seen = new Set();
  const women = raw
    .filter((i) => i.title && i.url && Date.now() - new Date(i.date) < WIRE_DAYS * 864e5)
    .filter((i) => i.dedicated || WOMEN.test(`${i.title} ${i.excerpt}`))
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((i) => { const k = norm(i.title); if (seen.has(k)) return false; seen.add(k); return true; });

  const wire = women.slice(0, 60).map((i) => ({ title: i.title, url: i.url, source: i.source, date: i.date, ...guess(i) }));

  let articles = prev.articles;
  if (KEY) {
    const cands = women.filter((i) => !used.has(i.url)).slice(0, 120);
    if (cands.length) {
      try {
        const stories = await selectStories(cands, prev.articles.map((a) => a.headline));
        const written = [];
        for (const s of stories.slice(0, PER_DAY)) {
          try {
            const a = await writeArticle(s, cands);
            if (!articles.some((x) => x.slug === a.slug)) written.push(a);
            console.log(`  ✎ ${a.headline}`);
          } catch (e) {
            console.warn('  ⚠ article skipped:', e.message);
          }
        }
        articles = [...written, ...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, KEEP_ARTICLES);
        console.log(`AI ${MODEL}: ${written.length} articles, ${ai.tokens} tokens`);
      } catch (e) {
        console.warn('⚠ AI desk failed, keeping previous articles:', e.message);
      }
    }
  } else {
    console.log('No OPENAI_API_KEY: wire refreshed, no new articles written.');
  }

  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), articles, wire }, null, 1) + '\n');
  console.log(`✓ newsroom — ${articles.length} articles · ${wire.length} wire items from ${FEEDS.length} feeds`);
}

main();
