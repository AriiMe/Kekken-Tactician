import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

// Preview the static directory/404 behavior instead of Vite's SPA fallback.
const root = path.resolve('dist');
const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.woff2': 'font/woff2' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost:5173');
    const pathname = decodeURIComponent(url.pathname);
    const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const rule = config.redirects.find(r => new RegExp(`^${r.source.replace(':name(', '(').replace(':name', '[^/]+')}$`).test(normalized));
    if (rule || normalized !== pathname) { res.writeHead(308, { Location: (rule?.destination || normalized) + url.search }); res.end(); return; }
    const base = path.resolve(root, '.' + pathname);
    if (base !== root && !base.startsWith(root + path.sep)) { res.writeHead(400); res.end(); return; }
    const candidates = [base, path.join(base, 'index.html')];
    if (!path.extname(base)) candidates.push(base + '.html');
    let file;
    for (const candidate of candidates) {
      try { if ((await fs.stat(candidate)).isFile()) { file = candidate; break; } } catch { /* try next static path */ }
    }
    const status = file ? 200 : 404;
    file ||= path.join(root, '404.html');
    res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(await fs.readFile(file));
  } catch { res.writeHead(500); res.end('Preview error'); }
}).listen(5173, '127.0.0.1', () => console.log('Static SEO preview: http://localhost:5173'));
