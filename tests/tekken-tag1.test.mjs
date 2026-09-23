import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { gameTitles } from '../src/utils/classicTekken.js';
import { liveGames } from '../src/data/games.js';

const load = async id => JSON.parse(await readFile(new URL(`../public/data/${id}.json`, import.meta.url), 'utf8'));
const data = await load('tekken-tag-1');
const t3 = await load('tekken-3');
const character = slug => data.characters.find(c => c.slug === slug);
const canonical = input => input.replace(/qcf/gi, 'd,df,f').replace(/qcb/gi, 'd,db,b')
  .replace(/hcf/gi, 'b,db,d,df,f').replace(/hcb/gi, 'f,df,d,db,b')
  .replace(/\b(?:D\/F|D\/B|U\/F|U\/B|DF|DB|UF|UB|F|B|D|U)\b/g, value => `~${value.toLowerCase().replace('/', '')}`)
  .replace(/~~/g, '~').replace(/\bN\b/g, 'n')
  .replace(/\b(WS|FC|BT|HSP|RLX|AOP|RDS|RFF|LFF|LFS|RFS|HMS)[+,]/g, '$1 ')
  .replace(/^LFF /, '').replace(/[\/\s[\]]/g, '').replace(/>/g, ',');

test('Tag 1 is reachable and every independent fighter has moves and combos', () => {
  assert.equal(gameTitles[data.gameId], data.title);
  assert.equal(liveGames.find(g => g.id === data.gameId).route, '/games/tekken-tag-1');
  assert.equal(data.characters.length, 39);
  assert.equal(new Set(data.characters.map(c => c.slug)).size, 39);
  for (const c of data.characters) {
    if (c.sharedGuide) assert.ok(character(c.sharedGuide), c.slug);
    else if (c.mimic) assert.ok(c.notes.length, c.slug);
    else {
      assert.ok(c.sections.moves.length, c.slug);
      assert.ok(c.sections.combos.length, c.slug);
    }
  }
});

test('all Tag 1 commands render and complete combo routes are not repeated', () => {
  for (const c of data.characters) {
    const seen = new Set();
    for (const [section, rows] of Object.entries(c.sections)) {
      for (const row of rows) {
        for (const input of [row.input, ...(row.launchers || []), ...(row.alternateInputs || [])]) {
          assert.deepEqual(parseInputNotation(input).filter(t => t.kind === 'text'), [], `${c.slug}: ${input}`);
        }
        if (!['combos', 'setups', 'teamCombos'].includes(section)) continue;
        for (const route of row.launchers?.map(l => `${l},${row.input}`) || [row.input]) {
          const key = `${row.partners?.join('|') || ''}:${canonical(route)}`;
          assert.ok(!seen.has(key), `${c.slug}: duplicate ${route}`);
          seen.add(key);
        }
      }
    }
  }
});

test('damage conditions, partner requirements and version limits remain explicit', () => {
  const jack = character('jack-2').sections.setups.find(r => r.input === 'CH f+3,d+1+2');
  assert.equal(jack.reportedDamage, 71);
  assert.match(jack.notes, /Not guaranteed.*escape/);
  assert.ok(!character('hwoarang').sections.combos.some(r => r.input === 'd+1+2,2,f+2,1+2'));
  assert.match(character('armor-king').sections.setups[0].notes, /fixed on PS2/);
  const rainbow = character('paul-phoenix').sections.tagMoves.find(r => r.name === 'Rainbow Kick');
  assert.deepEqual(rainbow.partners, ['Forest Law']);
  assert.match(rainbow.notes, /one second/);
  for (const c of data.characters) for (const row of c.sections.teamCombos || []) {
    assert.ok(row.partners.every(name => data.characters.some(c => c.name === name)), c.slug);
    assert.match(row.input, /5/);
  }
});

test('Tekken 3 receives labeled references rather than asserted Tag frame values', () => {
  const jin = character('jin-kazama').sections.moves.find(r => r.input === 'd/f+2');
  assert.deepEqual(jin.frameData, { startup: '15', block: '-2', hit: '+9', counterHit: 'KD' });
  let count = 0;
  for (const c of t3.characters) for (const row of Object.values(c.sections).flat()) {
    if (!row.referenceFrameData) continue;
    count++;
    assert.equal(row.frameData, undefined);
    const tag = character(c.slug === 'kuma-panda' ? 'kuma' : c.slug);
    const match = Object.values(tag.sections).flat().find(r => [r.input, ...(r.alternateInputs || [])].some(input => canonical(input) === canonical(row.input)) && r.frameData);
    assert.deepEqual(row.referenceFrameData, match?.frameData, `${c.slug}: ${row.input}`);
  }
  assert.ok(count > 0);
});
