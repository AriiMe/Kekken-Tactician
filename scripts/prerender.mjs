import fs from 'node:fs/promises';
import path from 'node:path';
import { SITE_URL, safeJson } from '../src/utils/seo.js';

process.env.NODE_ENV ||= 'production';
const { render } = await import('../dist-ssr/entry-server.js');

const catalog = JSON.parse(await fs.readFile('src/data/seoCatalog.json', 'utf8'));
const seeds = JSON.parse(await fs.readFile('.seo-cache/pages.json', 'utf8'));
const template = await fs.readFile('dist/index.html', 'utf8');
// Include the current route's styles and preload its script, without leaking
// unrelated pages' global CSS into the first paint.
const manifest = JSON.parse(await fs.readFile('dist/.vite/manifest.json', 'utf8'));
const staticPages = { '/about': 'About', '/credits': 'Credits', '/privacy-policy': 'Privacy', '/faqu': 'FAQ', '/update-request': 'UpdateRequest', '/combo-generator': 'CustomComboPage', '/strat-roulette': 'StratRoulette', '/strat-content': 'StratConent', '/stats': 'StatsPage', '/nothing-here/for-sure/no-easter-egg': 'KomradEasterEgg', '/404': 'NotFoundPage', '/anti-guide': 'AntiGuideSelect' };
function routeAssets(url) {
  let component = staticPages[url];
  if (/^\/games\/tekken-(?:[1-6]|tag-1)(?:\/|$)/.test(url)) component = 'ClassicTekken';
  if (url.startsWith('/games/tekken-7')) component = 'Tekken7';
  if (url.startsWith('/games/tekken-tag-2')) component = 'TekkenTag2';
  if (url === '/games/tekken-8') component = 'CharacterSelect';
  if (url.startsWith('/character/combos/')) component = 'CharacterDetails';
  if (url.startsWith('/anti-guide/character/')) component = 'AntiCharDetails';
  const css = new Set(), js = new Set(), seen = new Set();
  function collect(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const entry = manifest[key];
    if (!entry) return;
    entry.css?.forEach(file => css.add(file));
    if (entry.file.endsWith('.js')) js.add(entry.file);
    entry.imports?.forEach(collect);
  }
  if (component) collect(`src/pages/${component}.jsx`);
  return [...css].filter(file => !template.includes(`/${file}`)).map(file => `<link rel="stylesheet" href="/${file}" />`).join('')
    + [...js].map(file => `<link rel="modulepreload" href="/${file}" />`).join('');
}
for (const page of catalog) {
  const data = seeds[page.path] || null;
  const result = await render(page.path, data);
  if (!result.html || !result.head.includes(page.title.replaceAll('&', '&amp;'))) throw new Error(`Failed to render ${page.path}`);
  const document = template.replace('<!--page-head-->', result.head + routeAssets(page.path))
    .replace('<div id="root"></div>', `<div id="root">${result.html}</div><script id="page-data" type="application/json">${safeJson({ path: page.path, data })}</script>`);
  const file = page.path === '/' ? 'dist/index.html' : page.path === '/404' ? 'dist/404.html' : path.join('dist', page.path.slice(1), 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, document);
}
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
await fs.writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${catalog.filter(p => !p.noindex).map(p => `  <url><loc>${escapeXml(SITE_URL + p.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Rendered ${catalog.length} full HTML pages and sitemap.xml.`);
