import fs from 'node:fs/promises';
import { liveGames } from '../src/data/games.js';
import { getCharacters, getTekken7Essentials, getTekkenTag2Essentials } from '../src/utils/apiClient.js';
import { characterPath } from '../src/utils/seo.js';

// Build from public guide data; fail the deployment if a source is unavailable.
// This avoids publishing empty rosters or dropping working URLs from the sitemap.
const [tekken8, tekken7, tag2, tekken1, tekken2] = await Promise.all([
  getCharacters({ view: 'full', signal: AbortSignal.timeout(60000) }),
  getTekken7Essentials({ signal: AbortSignal.timeout(60000) }),
  getTekkenTag2Essentials({ signal: AbortSignal.timeout(60000) }),
  fs.readFile('public/data/tekken-1.json', 'utf8').then(JSON.parse),
  fs.readFile('public/data/tekken-2.json', 'utf8').then(JSON.parse),
]);
if (tekken8.length < 30) throw new Error('Incomplete Tekken 8 roster');
const datasets = { 'tekken-8': tekken8, 'tekken-7': tekken7, 'tekken-tag-2': tag2, 'tekken-1': tekken1, 'tekken-2': tekken2 };
for (const id of ['tekken-3', 'tekken-tag-1', 'tekken-4', 'tekken-5', 'tekken-6']) datasets[id] = JSON.parse(await fs.readFile(`public/data/${id}.json`, 'utf8'));
const catalog = [];
const seeds = {};
const rosterEntry = c => ({ id: c.id, _id: c._id, name: c.name, image: c.image, slug: c.slug, gameId: c.gameId, hasCounterGuide: Boolean(c.counterSchema?.length) });
const add = (path, title, description, options = {}, data = null) => {
  catalog.push({ path, title: `${title} | TEKKTICIAN`, description, ...options });
  if (data) seeds[path] = data;
};
add('/', 'Tekken Combos & Character Guides', 'Tekken 1–8, Dark Resurrection and Tag Tournament combos and character guides. TEKKTICIAN, formerly known as Tekken Tactician.', { collection: true });
const features = {
  'tekken-3': 'classic combo routes, moves, throws and 10 hit combos',
  'tekken-4': 'combo routes, moves, throws and 10 hit combos',
  'tekken-tag-1': 'moves, frame data, high-damage juggles and tag combos',
  'tekken-5': 'Tekken 5 and Dark Resurrection moves, throws and combo routes',
  'tekken-6': 'Bloodline Rebellion moves, frame data, punishers and bound combo routes',
  'tekken-8': 'combo routes, wall combos, Heat moves, punishers and throw breaks',
  'tekken-7': 'combo routes, wall combos, punishment frames and throw breaks',
  'tekken-tag-2': 'solo and team combos, punishment frames, bound moves and tag launchers',
  'tekken-1': 'combo routes, moves, throws and attack strings in clear button notation',
  'tekken-2': 'combo routes, key moves, throws and attack strings in clear button notation',
};
for (const game of liveGames) {
  const data = datasets[game.id];
  if (!data) throw new Error(`No SEO source for ${game.id}`);
  const characters = game.id === 'tekken-8' ? data : data.characters;
  const breadcrumbs = [{ name: 'Games', path: '/' }, { name: game.title, path: game.route }];
  const options = { game: game.title, image: game.artwork, breadcrumbs };
  add(game.route, `${game.title} Combos & Character Guides`, `Find ${game.title} ${features[game.id]}. Choose a character and practice with readable inputs on TEKKTICIAN.`, { ...options, collection: true }, game.id === 'tekken-8' ? data.map(rosterEntry) : data);
  for (const c of characters) {
    const path = game.id === 'tekken-8' ? characterPath(c) : `${game.route}/${c.slug}`;
    const mimic = c.mimic ? 'Learn how this fighter’s copied or equipped moveset works and find the original character guides.' : `Learn ${features[game.id]} with readable inputs.`;
    add(path, `${game.title} ${c.name} Combos & Guide`, `${c.name} in ${game.title}: ${mimic}`, { ...options, breadcrumbs: [...breadcrumbs, { name: c.name, path }] }, game.id === 'tekken-8' ? c : { ...data, characters: [c] });
    // Shared roster/detail components also need the full roster for client navigation.
    if (game.id !== 'tekken-8') seeds[path] = data;
  }
}
const antiCharacters = tekken8.filter(c => c.counterSchema?.length);
add('/anti-guide', 'Tekken 8 Matchup & Punishment Guides', 'Learn how to fight Tekken 8 characters: punish unsafe moves, find defensive options and plan your matchup with concise anti-guides.', { game: 'Tekken 8', collection: true }, antiCharacters.map(rosterEntry));
for (const c of antiCharacters) {
  const path = `/anti-guide/character/${c.id || c._id}`;
  add(path, `Tekken 8 ${c.name} Matchup & Counter Guide`, `How to fight ${c.name} in Tekken 8: moves to punish, defensive options and matchup strategy. Learn the key situations in this focused anti-guide.`, { game: 'Tekken 8', breadcrumbs: [{ name: 'Games', path: '/' }, { name: 'Tekken 8 anti-guides', path: '/anti-guide' }, { name: c.name, path }] }, c);
}
for (const [path, title, description, noindex = false] of [
  ['/combo-generator', 'Tekken Combo Maker & Input Notation Tool', 'Build Tekken combo routes with direction and attack icons. Save your custom combos locally and export an image to share your practice notes.'],
  ['/strat-roulette', 'Tekken 8 Strategy Roulette', 'Try a random Tekken 8 strategy challenge for your next match. Pick a fighter, change your approach and add variety to practice.'],
  ['/strat-content', 'Tekken 8 Strategy Challenges', 'Browse Tekken 8 strategy roulette challenges by character and difficulty to find a new approach for your next practice session.'],
  ['/about', 'About TEKKTICIAN — Formerly Tekken Tactician', 'Meet TEKKTICIAN, formerly Tekken Tactician: a community project for readable Tekken combos, character guides and practical fighting-game tools.'],
  ['/credits', 'Credits & Guide Sources', 'The community creators, frame-data resources and artwork sources behind TEKKTICIAN’s Tekken character guides and combo tools.'],
  ['/faqu', 'Tekken Guide & Input Notation FAQ', 'Answers to common questions about TEKKTICIAN, Tekken combo notation, character guides, practice and community contributions.'],
  ['/update-request', 'Request a Tekken Guide Update', 'Report a missing move, suggest a combo correction or request an update to a TEKKTICIAN character guide through our community channels.'],
  ['/privacy-policy', 'Privacy Policy', 'How TEKKTICIAN uses analytics, performance measurements and local browser preferences, plus where to contact us with privacy questions.'],
  ['/stats', 'Tekken 8 Player Replay Stats', 'Look up Tekken 8 replay statistics by player ID and review the available match data.', true],
  ['/nothing-here/for-sure/no-easter-egg', 'Nothing to See Here', 'A hidden corner of TEKKTICIAN.', true],
  ['/404', 'Page Not Found', 'This page could not be found. Browse the TEKKTICIAN game library for Tekken combos, character guides and practice tools.', true],
]) add(path, title, description, { noindex });
await fs.mkdir('.seo-cache', { recursive: true });
await fs.writeFile('.seo-cache/pages.json', JSON.stringify(seeds));
await fs.writeFile('src/data/seoCatalog.json', JSON.stringify(catalog, null, 2) + '\n');
const redirects = liveGames.map(game => ({ source: `/${game.id}`, destination: game.route, permanent: true }));
redirects.push({ source: '/faq', destination: '/faqu', permanent: true });
for (const c of tekken8) {
  const destination = characterPath(c);
  const expectedName = destination.split('/')[3];
  const id = c.id || c._id;
  // Consolidate old capitalized/name-only URLs without redirecting the canonical itself.
  redirects.push({ source: `/character/combos/:name((?!${expectedName}(?:/|$))[^/]+)/${id}`, destination, permanent: true });
  if (c._id && c._id !== id) redirects.push({ source: `/character/combos/:name/${c._id}`, destination, permanent: true });
  for (const alias of new Set([c.slug, c.name.toLowerCase().replace(/\s+/g, '-')].filter(value => value && value !== id))) {
    redirects.push({ source: `/character/combos/:name/${alias}`, destination, permanent: true });
    if (c.counterSchema?.length) redirects.push({ source: `/anti-guide/character/${alias}`, destination: `/anti-guide/character/${id}`, permanent: true });
  }
}
await fs.writeFile('vercel.json', JSON.stringify({ cleanUrls: true, trailingSlash: false, redirects, headers: [{ source: '/sitemap.xml', headers: [{ key: 'Content-Type', value: 'application/xml; charset=utf-8' }] }] }, null, 2) + '\n');
console.log(`Prepared ${catalog.length} pages from current public guide data.`);
