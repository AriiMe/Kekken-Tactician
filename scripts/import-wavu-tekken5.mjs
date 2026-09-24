import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseInputNotation } from '../src/utils/inputNotation.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, '.seo-cache/wavu-tekken5');
export const roster = {
  Anna: 'anna-williams', 'Armor King': 'armor-king', Asuka: 'asuka-kazama', Baek: 'baek-doo-san',
  Bruce: 'bruce-irvin', Bryan: 'bryan-fury', Eddy: 'christie-monteiro', 'Devil Jin': 'devil-jin',
  Dragunov: 'dragunov', Feng: 'feng-wei', Ganryu: 'ganryu', Heihachi: 'heihachi-mishima',
  Hwoarang: 'hwoarang', 'Jack-5': 'jack-5', Jin: 'jin-kazama', Jinpachi: 'jinpachi-mishima',
  Julia: 'julia-chang', Kazuya: 'kazuya-mishima', King: 'king', Kuma: 'kuma-panda',
  Lee: 'lee-chaolan', Lei: 'lei-wulong', Lili: 'lili', Xiaoyu: 'ling-xiaoyu', Law: 'marshall-law',
  Marduk: 'craig-marduk', Mokujin: 'mokujin', Nina: 'nina-williams', Paul: 'paul-phoenix',
  Raven: 'raven', 'Roger Jr.': 'roger-jr', Steve: 'steve-fox', Wang: 'wang-jinrei', Yoshimitsu: 'yoshimitsu',
};

export async function fetchPages() {
  await mkdir(cache, { recursive: true });
  const titles = [...Object.keys(roster).flatMap(name => ['', ' movelist', ' punishers', ' combos', ' tech', ' strategy'].map(kind => `${name}${kind} (Tekken 5)`)), 'Generic movelist (Tekken 5)'];
  const pages = {};
  for (let i = 0; i < titles.length; i += 40) {
    const url = new URL('https://wavu.wiki/w/api.php');
    url.search = new URLSearchParams({ action: 'query', prop: 'revisions', rvprop: 'content|ids', rvslots: 'main', titles: titles.slice(i, i + 40).join('|'), format: 'json' });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Wavu HTTP ${response.status}`);
    const result = await response.json();
    for (const page of Object.values(result.query.pages)) {
      pages[page.title] = { revision: page.revisions?.[0].revid, content: page.revisions?.[0].slots.main['*'] || '', missing: 'missing' in page };
    }
    console.log(`Read ${Math.min(i + 40, titles.length)}/${titles.length} DR pages`);
  }
  const fallback = Object.entries(pages).filter(([title, page]) => page.missing && ['Baek', 'Bruce', 'Jack-5', 'Jinpachi', 'Mokujin', 'Roger Jr.', 'Wang'].some(name => title.startsWith(name))).map(([title]) => title.replace(' (Tekken 5)', ''));
  for (let i = 0; i < fallback.length; i += 40) {
    const url = new URL('https://wavu.wiki/w/api.php');
    url.search = new URLSearchParams({ action: 'query', prop: 'revisions', rvprop: 'content|ids', rvslots: 'main', titles: fallback.slice(i, i + 40).join('|'), format: 'json' });
    const result = await (await fetch(url)).json();
    for (const page of Object.values(result.query.pages)) pages[page.title] = { revision: page.revisions?.[0].revid, content: page.revisions?.[0].slots.main['*'] || '', missing: 'missing' in page };
  }
  await writeFile(path.join(cache, 'pages.json'), JSON.stringify(pages, null, 2) + '\n');
  return pages;
}

// Nested templates contain pipes too: split only at the current template depth.
export function splitWiki(value, separator = '|') {
  const result = []; let start = 0, braces = 0, links = 0;
  for (let i = 0; i < value.length; i++) {
    const pair = value.slice(i, i + 2);
    if (pair === '{{') { braces++; i++; }
    else if (pair === '}}') { braces--; i++; }
    else if (pair === '[[') { links++; i++; }
    else if (pair === ']]') { links--; i++; }
    else if (!braces && !links && value[i] === separator) { result.push(value.slice(start, i)); start = i + 1; }
  }
  result.push(value.slice(start)); return result;
}

export function templates(text, name) {
  const result = []; const pattern = new RegExp(`\\{\\{${name}(?=[|\\s}])`, 'g');
  for (const match of text.matchAll(pattern)) {
    let depth = 1, end = match.index + 2;
    for (; end < text.length && depth; end++) {
      if (text.slice(end, end + 2) === '{{') { depth++; end++; }
      else if (text.slice(end, end + 2) === '}}') { depth--; end++; }
    }
    if (depth) continue;
    const parts = splitWiki(text.slice(match.index + 2, end - 2));
    const fields = {};
    for (const part of parts.slice(1)) {
      const eq = part.indexOf('=');
      if (eq >= 0) fields[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
    }
    result.push({ fields, raw: text.slice(match.index, end), index: match.index });
  }
  return result;
}

export function plain(text = '') {
  return text.replace(/<!--[^]*?-->/g, '').replace(/<ref\b[^>]*\/>/gi, '').replace(/<ref\b[^>]*>([^]*?)<\/ref>/gi, ' $1 ')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1').replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/\{\{(?:Plainlist|Dotlist)\|([^]*?)\}\}/g, '$1').replace(/\{\{(Elbow|Knee)\}\}/g, '$1')
    .replace(/\{\{colon\}\}/g, ':').replace(/\{\{[^]*?\}\}/g, '').replace(/<[^>]*>/g, ' ')
    .replace(/'{2,}/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&ZeroWidthSpace;/g, '').replace(/&#58;/g, ':').replace(/&amp;/g, '&').replace(/[\u200b-\u200d\uFEFF]/g, '')
    .replace(/\s*\n\*+\s*/g, '. ').replace(/^\s*\*+\s*/, '').replace(/\s+/g, ' ').replace(/^\.\s*/, '').trim();
}

export function notation(source) {
  const aliases = { SNA: '(Snake stance)', DRG: '(Dragon stance)', PAN: '(Panther stance)', TGR: '(Tiger stance)', DRU: '(Drunken stance)',
    FLA: '(Flamingo)', PHX: 'CRA', STC: '(Shifting clouds)', KNP: '(Kenpo step)', TNT: '(Taunt)', RAI: '(Raijin stance)',
    SWS: '(Evasive spin)', CES: '(Evasive spin)', ROL: '(Roll stance)', ROC: '(Rocket stance)', MNT: '(Mount)', VTS: 'VTS',
    FUFT: '(Face up feet towards)', FUFA: '(Face up feet away)', FDFA: '(Face down feet away)', FDFT: '(Face down feet towards)',
    FUFL: '(Face up feet left)', FUFR: '(Face up feet right)', FDFL: '(Face down feet left)', FDFR: '(Face down feet right)',
    AIR: '(air throw)', EXD: 'EXT DCK', LWV: '(Left weave)', RWV: '(Right weave)', SR: '(Soul omen)', PS: '(Parry stance)',
    UT: '(During tackle)', Tackle: '(During tackle)', FS: '(Fake step)', DFS: '(Dragon fake step)', MS: '(Mist step)',
    RAB: '(Rabbit stance)', AP: '(Astral projection)', CHG: '(Charged stance)', BDS: '(Bad stomach stance)' };
  let value = plain(source).replace(/\bCD\.df/g, 'f,n,d,df').replace(/\bCD\.([1-4])/g, 'f,n,d,df+$1');
  value = value.replace(/\b([A-Za-z]+)\./g, (whole, stance) => aliases[stance] ? `${aliases[stance]} ` : whole);
  return value.replace(/\bf,F/g, 'f,f').replace(/\bb,B/g, 'b,b')
    .replace(/\b(UF|UB|DF|DB|F|B|U|D)(?=[+,])/g, s => `~${s.toLowerCase()}`)
    .replace(/\bN(?=[+,])/g, 'n').replace(/\b(df|db|uf|ub)(?=[+,#:])/g, (s, _, offset, all) => all[offset - 1] === '~' ? s : `${s[0]}/${s[1]}`)
    .replace(/\bws(?=[1-4])/gi, 'WS ').replace(/\biws(?=[1-4])/gi, '(instant while standing) WS ')
    .replace(/\b(FC|CJM|CD|CDS|RFS|LFS|RFF|LFF|BT|SS|SSL|SSR|WR|AOP|HYP|DSS|DCK|EXT DCK|PAB|SWY|PKB|ALB|FLK|SIT|HBS|RLX|HSP|DGF|FLY|FLE|IND|MED|KIN|NSS|BOK|KEN|SDW|SNK|CRA|PLD|FCD|KND|HMS|JGS)\./g, '$1 ')
    .replace(/\bOTG\./g, '(grounded opponent) ').replace(/\bdl\./g, '(delay) ')
    .replace(/\bdash\s+/g, 'f,f > ').replace(/\bEWHF\b/g, 'f,n,d,d/f:2').replace(/\bEWGF\b/g, 'f,n,d,d/f:2')
    .replace(/#/g, ':').replace(/\)\./g, ') ').replace(/\*+/g, s => ` (charge level ${s.length})`).replace(/~~/g, '~')
    .replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').trim();
}

export const canonical = input => input.replace(/qcf/gi, 'd,df,f').replace(/qcb/gi, 'd,db,b')
  .replace(/hcf/gi, 'b,db,d,df,f').replace(/hcb/gi, 'f,df,d,db,b').replace(/[ /]/g, '').toLowerCase();
const validInput = input => Boolean(input && !/^[,:]/.test(input) && /[1-4]/.test(input) && !parseInputNotation(input).some(t => t.kind === 'text'));

export function parseMoves(text) {
  const moves = templates(text, 'Move5').map(t => t.fields);
  const map = new Map(moves.map(m => [m.id, m]));
  function inherited(move, field, visited = new Set()) {
    if (visited.has(move.id)) return ''; visited.add(move.id);
    const parent = map.get(move.parent);
    const own = move[field] || '';
    if (!parent) return own;
    const prefix = inherited(parent, field, visited);
    return prefix + (field !== 'input' && own && !own.startsWith(',') && prefix ? ',' : '') + own;
  }
  for (const move of moves) {
    move.fullInput = (move.inputLead || '') + inherited(move, 'input');
    move.fullDamage = inherited(move, 'damage');
    move.fullTarget = inherited(move, 'target');
    let first = move; const seen = new Set();
    while (map.has(first.parent) && !seen.has(first.id)) { seen.add(first.id); first = map.get(first.parent); }
    move.initialStartup = first.startup;
  }
  return moves;
}

function frameValue(value) { return plain(value).replace(/\bi(?=\d)/g, ''); }
function movePayload(move) {
  const input = notation(move.fullInput), frameData = {};
  for (const [source, target] of Object.entries({ startup: 'startup', block: 'block', hit: 'hit', ch: 'counterHit' })) {
    const value = frameValue(move[source]);
    if (value && !value.includes('?')) frameData[target] = value;
  }
  const target = plain(move.fullTarget).replace(/^,/, '').split(',').map(t => {
    const lower = t.trim().toLowerCase();
    return ({ h: 'High', m: 'Mid', l: 'Low', sm: 'Special mid', sl: 'Special low', sp: 'Special', t: 'Throw', th: 'Throw', '!': 'Unblockable',
      'm!': 'Unblockable mid', 'h!': 'Unblockable high', 'l!': 'Unblockable low', 't(m)': 'Mid throw', 't(c)': 'Crouch throw', 't(g)': 'Ground throw', 't(a)': 'Air throw' })[lower] || t;
  }).join(' / ');
  const result = { name: plain(move.name) || input, input, edition: 'dr' };
  if (Object.keys(frameData).length) result.frameData = frameData;
  if (move.parent || move.inputLead) result.frameScope = 'Follow-up only';
  if (move.fullDamage) result.damage = plain(move.fullDamage).replace(/^,/, '');
  if (target) result.hitLevel = target;
  const notes = plain(move.notes);
  if (notes) result.notes = notes;
  return result;
}

function mergeMove(character, move, stats) {
  const added = movePayload(move);
  if (!validInput(added.input)) { stats.skippedMoves.push(move.id); return; }
  const sections = ['moves', 'throws', 'chains', 'stances', 'unblockables', 'techniques'];
  let existing;
  for (const section of sections) {
    existing = (character.sections[section] || []).find(row => [row.input, ...(row.alternateInputs || []), ...(row.versions || []).flatMap(v => [v.input, ...(v.alternateInputs || [])])].filter(Boolean).some(i => canonical(i) === canonical(added.input)));
    if (existing) break;
  }
  if (!existing) {
    const section = /throw/i.test(added.hitLevel || '') ? 'throws' : 'moves';
    (character.sections[section] ||= []).push(added); stats.newMoves++; return;
  }
  let destination;
  if (existing.edition === 'dr' && !existing.versions) destination = existing;
  else {
    if (!existing.versions) {
      existing.versions = [];
      if (existing.edition || existing.frameData) {
        const version = { edition: existing.edition || 'tekken5' };
        for (const key of ['frameData', 'frameScope']) if (existing[key]) { version[key] = existing[key]; delete existing[key]; }
        existing.versions.push(version); delete existing.edition;
      }
    }
    destination = existing.versions.find(v => v.edition === 'dr');
    if (!destination) { destination = { edition: 'dr' }; existing.versions.push(destination); }
    existing.versions.sort((a, b) => a.edition === 'tekken5' ? -1 : b.edition === 'tekken5' ? 1 : 0);
  }
  if (added.frameData) { destination.frameData = { ...destination.frameData, ...added.frameData }; stats.enrichedFrames++; }
  if (added.frameScope) destination.frameScope = added.frameScope;
  for (const key of ['damage', 'hitLevel']) if (added[key] && added[key] !== (destination[key] || existing[key])) destination[key] = added[key];
  // Preserve archive wording and add new properties only to the DR version.
  if (added.notes && !(destination.notes || existing.notes || '').includes(added.notes)) destination.notes = [destination.notes, added.notes].filter(Boolean).join(' ');
}

export function parsePunishers(text, moves) {
  const table = templates(text, 'PunisherTable5')[0]?.fields || {};
  const result = [], map = new Map(moves.map(m => [m.id, m]));
  for (const position of ['standing', 'crouching']) for (const { fields } of templates(table[position] || '', 'o')) {
    const move = map.get(fields.moveId); if (!move) continue;
    const frames = fields.enemy ? Math.abs(Number(fields.enemy)) : Number(move.initialStartup?.match(/i(\d+)/)?.[1]);
    const launcher = Boolean(fields.staple);
    if (!Number.isFinite(frames) || (frames > 18 && !launcher)) continue;
    const input = notation(move.fullInput); if (!validInput(input)) continue;
    const row = { name: plain(move.name) || input, input, startupFrames: frames, position, edition: 'dr' };
    if (launcher) row.launcher = true;
    const notes = plain(fields.moveNote);
    if (notes) row.notes = notes;
    if (/^(?:f,f|f,n|b,b|qcf|qcb|CD|u\/f,n)/.test(input)) row.motion = true;
    result.push(row);
  }
  return result.filter((row, index, all) => all.findIndex(other => other.position === row.position && other.input === row.input) === index)
    .sort((a, b) => a.startupFrames - b.startupFrames || a.input.localeCompare(b.input));
}

function readRefs(text) {
  const refs = new Map();
  for (const match of text.matchAll(/<ref\s+name=(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>([^]*?)<\/ref>/g)) refs.set(match[1] || match[2] || match[3], plain(match[4]));
  return text.replace(/<ref\s+name=(?:"([^"]+)"|'([^']+)'|([^\s/>]+))\s*\/>/g, (_, a, b, c) => `<ref>${refs.get(a || b || c) || ''}</ref>`);
}

export function parseCombos(text) {
  const result = []; text = readRefs(text);
  let section = '', launchers = [], used = 0, hadFollowup = false;
  for (const line of text.split('\n')) {
    const heading = line.match(/^==\s*(.+?)\s*==$/);
    if (heading) { section = heading[1]; launchers = []; used = 0; hadFollowup = false; continue; }
    if (!/^(Bread n' butter|Staples|Mini-combos|Wall|Extras)$/.test(section)) continue;
    const starter = line.match(/^;\s*(.+)/);
    if (starter) {
      if (hadFollowup) { launchers = []; used = 0; hadFollowup = false; }
      let raw = starter[1].replace(/^\[[^\]]+\]\s*/, '');
      const example = raw.match(/Regular launch \(e\.g\. (.+)\)/); if (example) raw = example[1];
      const notes = [...raw.matchAll(/<ref\b[^>]*>([^]*?)<\/ref>/g)].map(m => plain(m[1]));
      raw = raw.replace(/<ref\b[^>]*>[^]*?<\/ref>/g, '');
      launchers.push({ input: notation(raw), notes, raw }); continue;
    }
    const followup = line.match(/^:\s*(.+)/); if (!followup || !launchers.length) continue;
    hadFollowup = true;
    // Keep compact staples and useful alternatives, instead of every small damage permutation.
    const limit = section === 'Mini-combos' ? 2 : section === 'Wall' ? 4 : 3;
    if (used >= limit) continue;
    let raw = followup[1];
    const extra = raw.match(/^\[\+([^\]]+)\]/)?.[1];
    raw = raw.replace(/^\[[^\]]+\]\s*/, '');
    const notes = [...raw.matchAll(/<ref\b[^>]*>([^]*?)<\/ref>/g)].map(m => plain(m[1]));
    raw = raw.replace(/<ref\b[^>]*>[^]*?<\/ref>/g, '');
    if (/\s\/\s|\[f\+\]|\b(?:combo when|here|etc\.)\b/i.test(raw)) continue;
    const input = notation(raw); if (!validInput(input)) continue;
    const wall = section === 'Wall';
    const starters = launchers.filter(l => validInput(l.input));
    if (!wall && !starters.length) continue;
    const sharedNotes = [...new Set([...notes, ...starters.flatMap(l => l.notes)])];
    if (/(?:^|[, ])\([^)]*[1-4][^)]*\)/.test(raw) || starters.some(s => /\([^)]*[1-4][^)]*\)/.test(s.raw))) sharedNotes.push('Parenthesized hits must miss.');
    if (extra) sharedNotes.push(`Follow-up damage: ${extra}.`);
    if (wall) sharedNotes.unshift(plain(launchers[0].raw));
    result.push({ section: wall ? 'wallCombos' : section === 'Mini-combos' ? 'setups' : 'combos',
      row: { name: wall ? 'Wall follow-up' : section === 'Mini-combos' ? 'Guaranteed follow-up' : 'Juggle follow-up',
        input, ...(wall ? {} : { launchers: starters.map(l => l.input) }), edition: 'dr', ...(sharedNotes.length ? { notes: sharedNotes.join(' ') } : {}) } });
    used++;
  }
  return result;
}

function comboKey(launcher, input) { return canonical(`${launcher}>${input}`).replace(/>/g, ','); }
function mergeCombos(character, imported, stats) {
  const seen = new Set();
  for (const section of ['combos', 'wallCombos', 'setups']) for (const row of character.sections[section] || []) {
    for (const version of row.versions || [row]) {
      if (version.edition && version.edition !== 'dr') continue;
      for (const launcher of row.launchers || ['']) seen.add(`${section}|${comboKey(launcher, version.input || row.input)}`);
    }
  }
  for (const { section, row } of imported) {
    const launchers = (row.launchers || ['']).filter(launcher => !seen.has(`${section}|${comboKey(launcher, row.input)}`));
    if (!launchers.length) continue;
    if (row.launchers) row.launchers = [...new Set(launchers)];
    for (const launcher of launchers) seen.add(`${section}|${comboKey(launcher, row.input)}`);
    const siblings = character.sections[section] ||= [];
    const same = row.launchers && siblings.find(r => r.edition === 'dr' && r.launchers && r.input === row.input && r.notes === row.notes);
    if (same) same.launchers.push(...row.launchers); else { siblings.push(row); stats.combos++; }
  }
}

async function importData() {
  const pages = JSON.parse(await readFile(path.join(cache, 'pages.json'), 'utf8'));
  const dataPath = path.join(root, 'public/data/tekken-5.json');
  const inputPath = process.argv.includes('--baseline') ? path.join(cache, 'baseline.json') : dataPath;
  const data = JSON.parse(await readFile(inputPath, 'utf8'));
  const report = { edition: 'Tekken 5: Dark Resurrection', characters: [] };
  const generic = parseMoves(pages['Generic movelist (Tekken 5)']?.content || '');
  for (const [name, slug] of Object.entries(roster)) {
    const page = kind => pages[`${name}${kind} (Tekken 5)`]?.content ? `${name}${kind} (Tekken 5)` : `${name}${kind}`;
    const character = data.characters.find(c => c.slug === slug);
    const stats = { character: slug, newMoves: 0, enrichedFrames: 0, punishers: 0, combos: 0, skippedMoves: [], sources: [] };
    const moves = parseMoves(pages[page(' movelist')]?.content || '');
    for (const move of moves) mergeMove(character, move, stats);
    const punishers = parsePunishers(pages[page(' punishers')]?.content || '', [...moves, ...generic]);
    if (punishers.length) {
      const existing = character.sections.punishers ||= [];
      for (const row of punishers) if (!existing.some(r => r.input === row.input && r.edition === 'dr' && r.position === row.position)) { existing.push(row); stats.punishers++; }
    }
    mergeCombos(character, parseCombos(pages[page(' combos')]?.content || ''), stats);
    if (name === 'Baek' && pages['Baek tech']?.content) {
      const techniques = [
        { name: 'Flamingo cancel pressure', input: '1,2,3~f > d/f+1', edition: 'dr',
          notes: 'Cancel the string into Flamingo and use d/f+1 for a quick mid. d/f+4,4,3~f gives another Flamingo cancel opportunity.' },
        { name: 'Flamingo 3+4 loops', input: '3+4~f > (keep holding 3; release forward) 4~f', edition: 'dr',
          notes: 'Keep 3 held, release forward, then press 4 to buffer another 3+4 from Flamingo. Hold forward briefly to re-enter Flamingo, then release it before the next 4; holding forward too long gives Flamingo f+4. Mix 1,2,3~f with the loops for easier wall carry.' },
      ];
      const existing = character.sections.techniques ||= [];
      for (const row of techniques) if (!existing.some(r => r.input === row.input)) existing.push(row);
      stats.techniques = techniques.length;
    }
    for (const kind of ['', ' movelist', ' punishers', ' combos', ' tech', ' strategy']) {
      const title = page(kind), source = pages[title];
      stats.sources.push({ title, revision: source?.revision || null, available: Boolean(source?.content), url: `https://wavu.wiki/t/${title.replace(/ /g, '_')}` });
    }
    report.characters.push(stats);
  }
  await writeFile(dataPath, JSON.stringify(data, null, 2) + '\n');
  await mkdir(path.join(root, 'docs/research'), { recursive: true });
  await writeFile(path.join(root, 'docs/research/wavu-tekken5-import.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report.characters.map(({ character, newMoves, enrichedFrames, punishers, combos, skippedMoves }) => ({ character, newMoves, enrichedFrames, punishers, combos, skipped: skippedMoves.length })), null, 2));
}

if (process.argv.includes('--fetch')) await fetchPages();
if (process.argv.includes('--import')) await importData();
