// Assemble toutes les pages + fichiers annexes (sitemap, robots, manifest, marque).
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layout } from './lib/layout.mjs';
import { logoAsset, iconAsset } from './lib/brand.mjs';
import { site } from './config.mjs';

const PAGES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pages');

const brandFiles = () => {
  return {
    'assets/brand/favicon.svg': iconAsset(),
    'assets/brand/freya-mark.svg': logoAsset('#06090d'),
    'assets/brand/freya-mark-light.svg': logoAsset('#e8edf1'),
    'assets/brand/freya-logo-dark.svg': logoAsset('#06090d'),
    'assets/brand/freya-logo-light.svg': logoAsset('#e8edf1'),
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
