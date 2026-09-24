// Cache public T6/BR reference pages. No source HTML is shipped with the app.
import fs from 'node:fs/promises';
const directory = new URL('../.seo-cache/tekken6/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
async function cache(name, url) {
  try { return await fs.readFile(new URL(name, directory), 'utf8'); } catch { /* first import */ }
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(50000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      const body = await response.text();
      await fs.writeFile(new URL(name, directory), body);
      console.log(`${name}: ${body.length} characters`);
      return body;
    } catch (error) { last = error; }
  }
  throw last;
}
async function batch(tasks) {
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < tasks.length) { const [name, url] = tasks[next++]; await cache(name, url); }
  }));
}
const tz = 'https://web.archive.org/web/20201206040751id_/http://www.tekkenzaibatsu.com/tekken6/';
const index = await cache('index.html', `${tz}_movelist.php`);
const roster = [...index.matchAll(/movelist\.php\?id=([^"]+)"><img[^>]+alt="([^"]+)/g)]
  .map(match => ({ id: match[1], name: match[2] }));
if (roster.length !== 40) throw new Error('Unexpected T6 roster; review archive before importing.');
await fs.writeFile(new URL('roster.json', directory), JSON.stringify(roster, null, 2));
await batch(roster.map(character => [`${character.id}.html`, `${tz}movelist.php?id=${character.id}`]));
await batch([
  ['hidden.txt', 'https://web.archive.org/web/20201206044531id_/http://www.tekkenzaibatsu.com/tekken6/faq/gen-hidden-01.txt'],
  ['combos.txt', 'https://web.archive.org/web/20201206044532id_/http://www.tekkenzaibatsu.com/tekken6/faq/gen-combo-01.txt'],
  ['atp.html', 'https://web.archive.org/web/20140626115612id_/http://www.avoidingthepuddle.com/tekken-6-frame-data/'],
  ['sd.html', 'https://sdtekken.com/tekken-6/frame-data/'],
  ['punishers.html', 'https://www.tekkenzone.net/tekken6/punishers/'],
]);
const atp = await fs.readFile(new URL('atp.html', directory), 'utf8');
const frames = [...atp.matchAll(/href="([^"]+)"><img src="\/storage\/images\/website\/character-select\/tekken6\/([^".]+)\.jpg/g)];
await batch(frames.map(match => [`frame-${match[2]}.html`, `https://web.archive.org/web/20140626115612id_/http://www.avoidingthepuddle.com${match[1]}/`]));
await batch(['alisa', 'lars', 'leo', 'miguel', 'lili', 'feng', 'asuka', 'jack-6', 'hwoarang']
  .map(slug => [`sd-${slug}-frame-data.html`, `https://sdtekken.com/tekken-6/${slug}-frame-data/`]));
await batch(['1b', '1c', '1d', '2b', '2c', '2d', '3b', '3c', '3d']
  .map(page => [`gamewatch-${page}.html`, `https://game.watch.impress.co.jp/docs/20090311/tk6_br${page}.htm`]));
