import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { SITE_URL, safeJson, characterPath } from '../src/utils/seo.js';
import { getTag2TeamRoutes } from '../src/utils/tag2Teams.js';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { tekkenTag2StanceLabels } from '../src/data/tekkenTag2Notation.js';

const pages = JSON.parse(await fs.readFile('src/data/seoCatalog.json', 'utf8'));
const documentFor = page => fs.readFile(page.path === '/' ? 'dist/index.html' : page.path === '/404' ? 'dist/404.html' : `dist${page.path}/index.html`, 'utf8');
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&#39;', "'");

test('Tag 2 ships the expanded partner routes as HTML with help only on the roster', async () => {
  for (const page of pages.filter(p=>p.path.startsWith('/games/tekken-tag-2'))) {
    const html = await documentFor(page);
    const visible = html.split('<script id="page-data"')[0].split('</head>')[1];
    const {data} = JSON.parse(html.match(/<script id="page-data" type="application\/json">(.*?)<\/script>/s)[1]);
    const teams = data.characters.flatMap(c=>c.teamCombos);
    assert.ok(teams.length>=180,'Do not prerender stale backend data');
    if(page.collection) {
      assert.ok(visible.includes('<summary>Input key</summary>'));
      assert.ok(visible.includes('Tag controls &amp; bound'));
      for(const route of teams.filter(c=>c.id?.startsWith('kage-'))) for(const step of route.steps) {
        for(const token of parseInputNotation(step.input)) {
          assert.notEqual(token.kind,'text',`${route.id}: ${token.raw}`);
          if(token.kind==='stance' && token.normalized!=='FC') assert.ok(tekkenTag2StanceLabels[token.normalized],`${route.id}: ${token.raw}`);
        }
      }
    } else {
      assert.ok(!visible.includes('<summary>Input key</summary>'));
      assert.ok(!visible.includes('Tag controls &amp; bound'));
      const routes = getTag2TeamRoutes(data.characters,page.path.split('/').at(-1));
      assert.equal((visible.match(/<details class="tag2-team"/g)||[]).length,routes.length,page.path);
    }
  }
});

test('every route has unique metadata in the initial HTML and one canonical', async () => {
  assert.ok(pages.length > 200);
  assert.equal(new Set(pages.map(p => p.path)).size, pages.length);
  assert.equal(new Set(pages.map(p => p.title)).size, pages.length);
  assert.equal(new Set(pages.map(p => p.description)).size, pages.length);
  for (const page of pages) {
    const html = await documentFor(page);
    const head = html.split('</head>')[0];
    assert.equal((head.match(/<title\b/g) || []).length, 1, page.path);
    assert.equal(decode(head.match(/<title[^>]*>(.*?)<\/title>/s)[1]), page.title, page.path);
    assert.equal((head.match(/name="description"/g) || []).length, 1, page.path);
    assert.equal((head.match(/rel="canonical"/g) || []).length, 1, page.path);
    assert.ok(head.includes(`href="${SITE_URL}${page.path}"`), page.path);
    for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:title', 'twitter:description']) assert.ok(head.includes(`="${tag}"`), `${page.path}: ${tag}`);
    assert.ok(head.includes(page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'), page.path);
    if (!page.noindex) {
      const json = head.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
      assert.ok(json, page.path);
      const data = JSON.parse(json[1]);
      assert.equal(data['@graph'][1].url, SITE_URL + page.path);
      assert.ok(!json[1].includes('GameCharacter'));
    }
  }
});

test('sitemap contains precisely the indexable canonical routes and robots advertises it', async () => {
  const xml = await fs.readFile('dist/sitemap.xml', 'utf8');
  assert.ok(xml.startsWith('<?xml'));
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
  assert.deepEqual(urls.sort(), pages.filter(p => !p.noindex).map(p => SITE_URL + p.path).sort());
  assert.ok((await fs.readFile('dist/robots.txt', 'utf8')).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
});

test('guides have visible rendered content, real roster links, and safe seed data', async () => {
  for (const page of pages.filter(p => p.game)) {
    const html = await documentFor(page);
    const visible = html.split('<script id="page-data"')[0].split('</head>')[1];
    assert.ok(visible.includes('<h1'), page.path);
    assert.ok(!visible.includes('Loading the lab') && !visible.includes('Loading please wait'), page.path);
    if (page.path.startsWith('/character/combos/')) assert.ok(visible.includes('Main Combos') || visible.includes('Beginner Combos'), page.path);
    if (page.path.startsWith('/games/') && !page.collection) assert.ok(visible.includes('Combo') || visible.includes('copied fighting style') || visible.includes('equipped moves'), page.path);
    if (page.collection) assert.ok((visible.match(/<a /g) || []).length > 20, page.path);
    const seed = JSON.parse(html.match(/<script id="page-data" type="application\/json">(.*?)<\/script>/s)[1]);
    assert.equal(seed.path, page.path);
    assert.ok(seed.data, page.path);
  }
  assert.equal(safeJson({ s: '</script><script>alert(1)</script>' }).includes('</script>'), false);
  assert.equal(characterPath({ name: 'Armor King', id: 'armor-king' }), '/character/combos/armor-king-combos/armor-king');
});

test('privacy, navigation cues and unknown-route handling match the release', async () => {
  const home = await documentFor(pages.find(p => p.path === '/'));
  const privacy = await documentFor(pages.find(p => p.path === '/privacy-policy'));
  assert.ok(!home.includes('game-card__open-icon'));
  assert.ok(home.includes('View character guides'));
  assert.ok(!privacy.includes('AdSense') && !privacy.includes('adsbygoogle') && !privacy.includes('Google advertising'));
  const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
  assert.equal(config.rewrites, undefined, 'No homepage fallback that turns missing pages into soft 404s');
  assert.equal(config.cleanUrls, true);
  assert.ok(config.redirects.some(r => r.source === '/tekken-8' && r.destination === '/games/tekken-8'));
  assert.ok((await documentFor(pages.find(p => p.path === '/404'))).includes('noindex, follow'));
});

test('legacy character names and slug IDs redirect without matching canonical URLs', async () => {
  const { redirects } = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
  const rules = redirects.filter(r => r.source.startsWith('/character/combos/'));
  const asRegex = source => new RegExp(`^${source.replace(':name(', '(').replace(':name', '[^/]+')}$`);
  for (const page of pages.filter(p => p.path.startsWith('/character/combos/'))) {
    assert.ok(!rules.some(r => asRegex(r.source).test(page.path)), `Redirect loop: ${page.path}`);
    const legacy = page.path.replace(/\/combos\/[^/]+\//, '/combos/Old-Character-Name/');
    assert.ok(rules.some(r => asRegex(r.source).test(legacy) && r.destination === page.path), legacy);
  }
  assert.ok(rules.some(r => asRegex(r.source).test('/character/combos/Armor-King/armor-king')));
});
