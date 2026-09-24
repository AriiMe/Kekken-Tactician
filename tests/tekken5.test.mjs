import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-5.json', import.meta.url), 'utf8'));
const character = slug => data.characters.find(c => c.slug === slug);
const rows = c => Object.values(c.sections).flat();
const move = (slug, input) => rows(character(slug)).find(r => r.input === input && !r.launchers);
const canonical = input => input.replace(/qcf/gi, 'd,df,f').replace(/qcb/gi, 'd,db,b')
  .replace(/hcf/gi, 'b,db,d,df,f').replace(/hcb/gi, 'f,df,d,db,b').replace(/[ /]/g, '').toLowerCase();

test('edition differences retain vanilla first without falsely declaring the command DR-only', () => {
  const anna = move('anna-williams', 'd/f+3,2,1,4');
  assert.deepEqual(anna.versions.map(v => v.edition), ['tekken5', 'dr']);
  assert.equal(anna.versions[0].hitLevel, 'Mid / High / High / Low');
  assert.equal(anna.versions[1].hitLevel, 'Mid / High / High / High');
  assert.equal(anna.availability, undefined);
  assert.equal(move('anna-williams', 'u/f+3+4').availability, 'dr-only');
  for (const c of data.characters) for (const row of rows(c)) {
    if (row.versions?.some(v => v.edition === 'tekken5')) {
      assert.equal(row.versions[0].edition, 'tekken5');
      assert.notEqual(row.availability, 'dr-only');
    }
  }
});

test('frame measurements stay scoped to their edition and follow-up', () => {
  const steve = move('steve-fox', 'd/f+2');
  assert.equal(steve.frameData, undefined);
  assert.equal(steve.versions[0].frameData.startup, '15');
  assert.match(steve.versions[1].notes, /only on counter hit/);
  assert.equal(steve.versions[1].frameData, undefined);
  const raven = move('raven', 'd/f+2');
  assert.deepEqual(raven.versions[1].frameData, { startup: '16' });
  assert.equal(raven.versions[0].frameData.block, '-5');
  assert.equal(move('anna-williams', 'd/f+3,2,1,4').versions[0].frameScope, 'Follow-up only');
  assert.equal(move('anna-williams', '1,2,1,4').damage, '4,10,6,21');
  for (const c of data.characters) for (const row of rows(c)) {
    if (row.frameData) assert.ok(['tekken5', 'dr'].includes(row.edition));
  }
});

test('all commands and version alternatives render without unrecognized notation', () => {
  for (const c of data.characters) for (const row of rows(c)) {
    for (const value of [row, ...(row.versions || [])]) {
      for (const input of [value.input, ...(value.alternateInputs || []), ...(value.launchers || [])].filter(Boolean)) {
        assert.deepEqual(parseInputNotation(input).filter(t => t.kind === 'text'), [], `${c.name}: ${input}`);
      }
    }
  }
});

test('move commands are unique while side throws and stance contexts remain distinct', () => {
  for (const c of data.characters) {
    const seen = new Map();
    for (const section of ['throws', 'moves', 'unblockables', 'stances', 'techniques']) {
      for (const row of c.sections[section] || []) {
        const variants = row.versions?.some(v => v.input) ? row.versions : [row];
        for (const variant of variants) {
          for (const input of [variant.input || row.input, ...(variant.alternateInputs || [])].filter(Boolean)) {
            const key = canonical(input);
            assert.ok(!seen.has(key) || seen.get(key) === row, `${c.name}: duplicate ${input}`);
            seen.set(key, row);
          }
        }
      }
    }
  }
  assert.ok(character('anna-williams').sections.throws.some(r => r.input.startsWith('(left throw)')));
  assert.ok(character('anna-williams').sections.throws.some(r => r.input.startsWith('(right throw)')));
  assert.ok(character('king').sections.throws.some(r => r.input === '(air throw) d+1+3,1+2,1+2'));
});

test('combo versions, DR characters, and shared costume guides retain their scope', () => {
  const combo = character('steve-fox').sections.combos.find(r => r.versions);
  assert.deepEqual(combo.versions.map(v => v.edition), ['tekken5', 'dr']);
  assert.ok(combo.launchers.length);
  assert.notEqual(combo.versions[0].input, combo.versions[1].input);
  for (const slug of ['armor-king', 'dragunov', 'lili']) {
    const c = character(slug);
    assert.equal(c.availability, 'dr-only');
    assert.ok(c.sections.combos.filter(r => r.edition === 'dr').length > 5);
    assert.ok(rows(c).every(r => r.edition !== 'tekken5'));
  }
  assert.equal(character('eddy-gordo').sharedGuide, 'christie-monteiro');
  assert.equal(rows(character('eddy-gordo')).length, 0);
  assert.match(character('jinpachi-mishima').notes.join(' '), /PlayStation 3/);
});

test('grouped launchers do not repeat a complete combo route in the same edition', () => {
  for (const c of data.characters) {
    const seen = new Set();
    for (const row of c.sections.combos || []) {
      for (const version of row.versions || [row]) {
        for (const launcher of row.launchers || ['']) {
          const route = `${launcher ? `${launcher}>` : ''}${version.input || row.input}`;
          const key = `${version.edition || row.edition || 'both'}|${canonical(route).replace(/>/g, ',')}`;
          assert.ok(!seen.has(key), `${c.name}: duplicate ${route}`);
          seen.add(key);
        }
      }
    }
  }
});
