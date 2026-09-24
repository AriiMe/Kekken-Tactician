import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { getClassicPunishers } from '../src/utils/classicGuideLayout.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-6.json', import.meta.url), 'utf8'));
const character = slug => data.characters.find(c => c.slug === slug);
const move = (slug, input) => character(slug).sections.moves.find(r => r.input === input);
const canonical = input => input.toLowerCase().replace(/[ /+]/g, '').replace(/>/g, ',').replace(/bound/g, '');

test('T6 console/BR roster has real moves, frames, juggles and punishment for every non-mimic', async () => {
  assert.equal(data.characters.length, 41);
  assert.match(data.edition, /Bloodline Rebellion/);
  assert.equal(character('mokujin').mimic, true);
  for (const c of data.characters) {
    await access(new URL(`../public${c.portrait.image}`, import.meta.url));
    if (c.mimic) continue;
    assert.ok(c.sections.moves.length >= 60, c.name);
    assert.ok(c.sections.moves.some(r => r.frameData?.startup), c.name);
    assert.ok(c.sections.combos.some(r => r.launchers?.length), c.name);
    assert.ok(c.sections.wallCombos.length, c.name);
    assert.ok(c.sections.punishers.some(r => r.position === 'standing'), c.name);
    assert.ok(c.sections.punishers.some(r => r.position === 'crouching'), c.name);
  }
});

test('startup values remain T6 measurements, with missing values and source disagreements explicit', () => {
  assert.equal(move('alisa-bosconovitch', 'd/f+2').frameData.startup, '16');
  assert.equal(move('kazuya-mishima', 'd/f+2').frameData.startup, '14~15');
  assert.equal(move('yoshimitsu', '1+4').frameData.startup, '6');
  assert.equal(move('alisa-bosconovitch', 'WS 4').frameData.startup, '11');
  assert.deepEqual(move('alisa-bosconovitch', 'WS 1').startupAlternatives, ['14', '15']);
  assert.equal(character('alisa-bosconovitch').sections.punishers.find(r => r.input === 'WS 1').startupFrames, 15);
  assert.ok(data.characters.some(c => c.sections.moves?.some(r => !r.frameData?.startup)));
});

test('punishment chart windows do not manufacture duplicate or slower startup labels', () => {
  const alisa = character('alisa-bosconovitch').sections.punishers;
  assert.equal(alisa.find(r => r.input === '1,1').startupFrames, 10);
  assert.equal(alisa.filter(r => r.input === '1,1').length, 1); // Also listed at the -12 window by TekkenZone.
  assert.equal(alisa.find(r => r.input === '3,2').startupFrames, 14);
  for (const c of data.characters) {
    const rows = getClassicPunishers(c);
    for (const position of ['standing', 'crouching']) {
      assert.deepEqual(rows[position].map(r => r.frames), [...rows[position].map(r => r.frames)].sort((a, b) => a - b));
    }
    for (const r of c.sections.punishers || []) {
      assert.ok(r.startupFrames <= 18 || r.launcher, `${c.name}: ${r.input}`);
      assert.doesNotMatch(r.input, /CH|\(counter/i);
    }
  }
  assert.match(character('yoshimitsu').sections.punishers.find(r => r.input === '1+4').notes, /short range/);
});

test('Japanese button translation preserves stance names, side-specific cancels and timing conditions', () => {
  const steve = character('steve-fox').sections.combos.find(r => r.launchers.includes('b+1,b (CH)'));
  assert.match(steve.input, /FLK f\+3/);
  assert.doesNotMatch(steve.input, /F3/);
  const nina = character('nina-williams').sections.combos.find(r => r.name === 'Basic juggle' && r.launchers.includes('d/f+2'));
  assert.match(nina.input, /SSR: down on P1, up on P2/);
  assert.doesNotMatch(nina.input, /uord|8or2/);
  assert.ok(character('leo').sections.combos.some(r => r.input.includes('(during crouch dash) u/f+1')));
  assert.ok(character('jin-kazama').sections.combos.some(r => r.input.includes('f+1,3~3')));
  assert.ok(character('eddy-gordo').sections.combos.some(r => /less reliable with Eddy/.test(r.notes || '')));
  assert.ok(character('alisa-bosconovitch').sections.wallCombos.some(r => /allows a tech roll/.test(r.notes || '')));
});

test('hidden moves keep mandatory stance context and the full movelist keeps throw context', () => {
  const boot = character('alisa-bosconovitch').sections.techniques.find(r => r.name === 'Boot stop');
  assert.equal(boot.input, 'f+3+4~b');
  assert.deepEqual(boot.alternateInputs, ['DES f+3+4~b', 'DES f,f~b']);
  assert.ok(character('king').sections.throws.some(r => r.input.startsWith('(left throw)')));
  assert.ok(character('king').sections.chains.some(r => r.input.includes(',')));
});

test('every move and combo renders without unknown notation or broken brackets', () => {
  for (const c of data.characters) for (const rows of Object.values(c.sections)) for (const row of rows) {
    for (const input of [row.input, ...(row.alternateInputs || []), ...(row.launchers || [])]) {
      assert.deepEqual(parseInputNotation(input).filter(t => t.kind === 'text'), [], `${c.name}: ${input}`);
      assert.equal((input.match(/\(/g) || []).length, (input.match(/\)/g) || []).length, input);
      assert.doesNotMatch(input, /^[,>+]/);
    }
    assert.doesNotMatch(row.name, /NOTES|Coming soon/i);
  }
});

test('shared launchers do not repeat complete routes across combo and wall sections', () => {
  for (const c of data.characters) {
    const seen = new Set();
    for (const row of [...c.sections.combos || [], ...c.sections.wallCombos || []]) {
      assert.ok(row.launchers?.length, c.name);
      for (const launcher of row.launchers) {
        const key = canonical(`${launcher}>${row.input}`);
        assert.ok(!seen.has(key), `${c.name}: duplicate ${key}`);
        seen.add(key);
      }
    }
  }
});
