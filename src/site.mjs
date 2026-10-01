// Assemble toutes les pages + fichiers annexes (sitemap, robots, manifest, marque).
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layout } from './lib/layout.mjs';
import { markPaths } from './lib/icons.mjs';
import { wordmark } from './lib/wordmark.mjs';
import { site } from './config.mjs';

const PAGES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pages');

const brandFiles = () => {
  const markSvg = (stroke, bg = null, size = 28) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" width="${size}" height="${Math.round((size * 32) / 28)}">${bg ? `<rect x="-2" y="0" width="32" height="32" fill="${bg}"/>` : ''}<g fill="none" stroke="${stroke}" stroke-width="2.6">${markPaths}</g></svg>`;
  const logo = (fg, sub) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordmark.width} 40" width="${wordmark.width * 2}" height="80"><g fill="none" stroke="${fg}" stroke-width="2.6" transform="translate(2 4)">${markPaths}</g><path fill="${fg}" d="${wordmark.word}"/><path d="M${wordmark.ruleX} 9V31" stroke="${sub}" stroke-opacity=".5"/><path fill="${sub}" d="${wordmark.sports}${wordmark.partners}"/></svg>`;
  return {
    'assets/brand/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#06090d"/><g fill="none" stroke="#e8edf1" stroke-width="2.6" transform="translate(4 0)">${markPaths}</g></svg>`,
    'assets/brand/freya-mark.svg': markSvg('#06090d', null, 112),
    'assets/brand/freya-mark-light.svg': markSvg('#e8edf1', null, 112),
    'assets/brand/freya-logo-dark.svg': logo('#06090d', '#4a5664'),
    'assets/brand/freya-logo-light.svg': logo('#e8edf1', '#84909e'),
  };
};

export async function renderSite(ctx) {
  const files = {};
  const mods = (await readdir(PAGES)).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort();
  const sitemap = [];

  for (const file of mods) {
    const mod = await import(pathToFileURL(path.join(PAGES, file)).href + `?v=${ctx.version}-${Date.now()}`);
    const entries = mod.pages ? await mod.pages(ctx) : [{ meta: mod.meta, body: await mod.render(ctx) }];
    for (const { meta, body } of entries) {
      files[`${meta.id}.html`] = layout(meta, body, ctx);
      if (!meta.noindex) sitemap.push(meta.id === 'index' ? '' : `${meta.id}.html`);
    }
  }

  files['sitemap.xml'] =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap.map((u) => `  <url><loc>${site.url}/${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  files['robots.txt'] = `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;
  files['site.webmanifest'] = JSON.stringify(
    {
      name: site.name,
      short_name: site.short,
      start_url: './',
      display: 'standalone',
      background_color: '#06090d',
      theme_color: '#06090d',
      icons: [{ src: 'assets/brand/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: 'assets/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    null,
    2
  );
  Object.assign(files, brandFiles());
  return files;
}
