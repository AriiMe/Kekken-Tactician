import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-4.json', import.meta.url), 'utf8'));
const character = slug => data.characters.find(row => row.slug === slug);

test('alternate motion notation does not duplicate move entries', () => {
  const canonical = input => input.replace(/qcf/gi, 'd,df,f').replace(/qcb/gi, 'd,db,b')
    .replace(/hcf/gi, 'b,db,d,df,f').replace(/hcb/gi, 'f,df,d,db,b').replace(/[\/\s[\]]/g, '');
  for (const fighter of data.characters) {
    const seen = new Set();
    for (const section of ['throws', 'moves', 'unblockables', 'strings']) {
      for (const row of fighter.sections[section] || []) {
        const key = canonical(row.input);
        assert.ok(!seen.has(key), `${fighter.name}: duplicate ${row.input}`);
        seen.add(key);
      }
    }
  }
});

test('Tekken 4 routes render, remain unique and cover each independent fighter', () => {
  for (const fighter of data.characters) {
    if (fighter.mimic || fighter.sharedGuide) continue;
    assert.ok(fighter.sections.combos.length, fighter.name);
    const seen = new Set();
    for (const section of ['combos', 'wallCombos', 'setups']) {
      for (const row of fighter.sections[section] || []) {
        for (const input of row.launchers?.map(launcher => `${launcher} > ${row.input}`) || [row.input]) {
          const tokens = parseInputNotation(input);
          assert.deepEqual(tokens.filter(token => token.kind === 'text'), [], `${fighter.name}: ${input}`);
          const key = tokens.filter(token => token.kind !== 'space')
            .map(token => token.normalized === 'into' ? ',' : token.normalized || token.raw).join('|');
          assert.ok(!seen.has(key), `${fighter.name}: duplicate ${input}`);
          seen.add(key);
        }
      }
    }
  }
});

test('archive frame data preserves per-hit and crouching-hit distinctions', () => {
  const move = (slug, input) => character(slug).sections.moves.find(row => row.input === input);
  assert.deepEqual(move('jin-kazama', 'd/f+2').frameData, {
    startup: '15', block: '-7', hit: '+4', crouchingHit: '+4', counterHit: 'KD',
  });
  assert.equal(move('paul-phoenix', '1,2').frameData.block, '+2 0');
  assert.equal(move('paul-phoenix', '1,2').frameData.crouchingHit, 'x x');
  assert.equal(move('kazuya-mishima', 'd/f+2').frameData.hit, '+5');
  assert.equal(move('kazuya-mishima', 'd/f+2').frameData.crouchingHit, '-2');
  for (const fighter of data.characters) {
    for (const row of Object.values(fighter.sections).flat()) {
      for (const [key, value] of Object.entries(row.frameData || {})) {
        assert.ok(['startup', 'block', 'hit', 'crouchingHit', 'counterHit'].includes(key));
        assert.match(value, /^[+\-\d~ xKD]+$/);
      }
    }
  }
});

test('conditional traps and shared costumes do not masquerade as independent combos', () => {
  assert.equal(character('eddy-gordo').sharedGuide, 'christie-monteiro');
  for (const slug of ['paul-phoenix', 'yoshimitsu', 'marshall-law']) {
    assert.ok(character(slug).sections.setups.every(row => /not guaranteed/.test(row.notes)));
  }
  const charged = character('jin-kazama').sections.unblockables.find(row => row.name === 'Charged Laser Scraper');
  assert.match(charged.notes, /escapable/);
  const acidRain = character('lee-chaolan').sections.combos.find(row => row.name === 'Acid Rain follow-up');
  assert.deepEqual(acidRain.launchers, ['f+3:3:3']);
});
