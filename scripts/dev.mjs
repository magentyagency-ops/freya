// Serveur local : sert dist/, reconstruit à chaque modification de src/ et recharge le navigateur.
//   npm run dev            → http://localhost:4321
//   npm run serve          → sert dist/ tel quel (sans reconstruction)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;
const WATCH = !process.argv.includes('--no-watch');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
};

const clients = new Set();
const RELOAD = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;

async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/index';
  for (const candidate of [clean, clean + '.html', path.join(clean, 'index.html')]) {
    const file = path.join(DIST, candidate);
    if (!file.startsWith(DIST)) return null;
    try { if ((await stat(file)).isFile()) return file; } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  if (req.url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(':ok\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  const file = await resolve(req.url);
  const target = file || path.join(DIST, '404.html');
  try {
    let body = await readFile(target);
    const type = TYPES[path.extname(target)] || 'application/octet-stream';
    if (WATCH && type.startsWith('text/html')) body = Buffer.from(body.toString().replace('</body>', RELOAD + '</body>'));
    res.writeHead(file ? 200 : 404, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404).end('404');
  }
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}`));

if (WATCH) {
  let timer, running = false, queued = false;
  const rebuild = () => {
    if (running) { queued = true; return; }
    running = true;
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), '--dev'], { stdio: 'inherit' });
    child.on('exit', (code) => {
      running = false;
      if (code === 0) for (const c of clients) c.write('data: reload\n\n');
      if (queued) { queued = false; rebuild(); }
    });
  };
  rebuild();
  watch(path.join(ROOT, 'src'), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 120); });
}
