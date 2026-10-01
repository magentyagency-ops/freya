// Générateur statique Freya — aucune dépendance.
// src/pages/*.mjs  →  dist/*.html   ·   src/assets/{css,js}  →  dist/assets/freya.{css,js}
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const DEV = process.argv.includes('--dev');

const exists = (p) => stat(p).then(() => true, () => false);

async function bundle(dir, ext) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(ext)).sort();
  const parts = await Promise.all(files.map(async (f) => `/* ${f} */\n` + (await readFile(path.join(dir, f), 'utf8')).trim()));
  return parts.join('\n\n') + '\n';
}

// Minification prudente : commentaires + espaces autour de { } ; , uniquement
// (les espaces avant « : » sont significatifs dans les sélecteurs descendants).
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

async function build() {
  const t0 = performance.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, 'assets'), { recursive: true });

  for (const dir of ['fonts', 'brand', 'img']) {
    const from = path.join(SRC, 'assets', dir);
    if (await exists(from)) await cp(from, path.join(DIST, 'assets', dir), { recursive: true });
  }

  const cssRaw = await bundle(path.join(SRC, 'assets/css'), '.css');
  const css = DEV ? cssRaw : minifyCss(cssRaw);
  const js = await bundle(path.join(SRC, 'assets/js'), '.js');
  const version = createHash('sha1').update(css + js).digest('hex').slice(0, 8);
  await writeFile(path.join(DIST, 'assets/freya.css'), css);
  await writeFile(path.join(DIST, 'assets/freya.js'), `/*! Freya Sports Partners — ${version} */\n` + js);

  const { renderSite } = await import(pathToFileURL(path.join(SRC, 'site.mjs')).href + `?v=${Date.now()}`);
  const files = await renderSite({ version, dev: DEV });
  for (const [file, content] of Object.entries(files)) {
    const out = path.join(DIST, file);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, content);
  }

  const pages = Object.keys(files).filter((f) => f.endsWith('.html')).length;
  console.log(`✓ build ${version} — ${pages} pages · css ${(css.length / 1024).toFixed(1)} ko · js ${(js.length / 1024).toFixed(1)} ko · ${Math.round(performance.now() - t0)} ms`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
