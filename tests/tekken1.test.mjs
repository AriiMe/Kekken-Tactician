import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { getTekken1Guides } from '../src/utils/tekken1.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-1.json', import.meta.url), 'utf8'));
const bySlug = Object.fromEntries(data.characters.map(c => [c.slug, c]));

test('all 17 supplied Tekken 1 fighters have unique routes and populated moves and throws', () => {
  assert.deepEqual(Object.keys(bySlug).sort(), ['anna-williams', 'armor-king', 'ganryu', 'heihachi-mishima',
    'jack', 'kazuya-mishima', 'king', 'kuma', 'kunimitsu', 'lee-chaolan', 'marshall-law',
    'michelle-chang', 'nina-williams', 'paul-phoenix', 'prototype-jack', 'wang-jinrei', 'yoshimitsu']);
  assert.equal(data.characters.length, 17);
  for (const c of data.characters) {
    assert.ok(c.sections.moves.length && c.sections.throws.length, c.name);
    for (const rows of Object.values(c.sections)) for (const row of rows) {
      assert.doesNotMatch(row.name + row.input + (row.notes || ''), /\b(?:LP|RP|LK|RK)\b/);
      assert.ok(row.input.trim(), `${c.name}: ${row.name}`);
      assert.equal(row.status, undefined, `${c.name}: ${row.name}`);
      assert.doesNotMatch(row.notes || '', /verification|unverified|no input|supplied|source typo|may whiff/i);
      assert.equal(parseInputNotation(row.input).filter(s => s.kind === 'text').length, 0, `${c.name}: ${row.input}`);
    }
  }
});

test('button chords, held directions, tap conditions and throw-chain context survive conversion', () => {
  const kazuya = bySlug['kazuya-mishima'];
  assert.equal(kazuya.sections.throws[0].input, '1+3');
  assert.equal(kazuya.sections.throws[1].input, '2+4');
  assert.equal(kazuya.sections.throws[2].input, 'f, f+1+2');
  assert.ok(kazuya.sections.moves.some(r => r.input.includes('~df+4')));
  assert.ok(kazuya.sections.moves.some(r => r.notes?.includes('Tap uf')));
  for (const slug of ['anna-williams', 'nina-williams']) {
    assert.equal(bySlug[slug].sections.chains.length, 4);
    assert.equal(bySlug[slug].sections.chains[0].input, '3, 4, 3, 1+2');
    assert.match(bySlug[slug].sections.chains[2].notes, /During Sidestep Arm Snap/);
  }
  assert.match(bySlug['armor-king'].sections.chains[0].notes, /During Suplex/);
});

test('questionable entries are corrected from references or removed', () => {
  assert.ok(bySlug.kunimitsu.sections.combos.every(r => r.input.startsWith('df+2 >')));
  assert.ok(!bySlug['armor-king'].sections.moves.some(r => r.name === 'Multi Slide Kicks'));
  for (const slug of ['kuma', 'prototype-jack']) {
    assert.equal(bySlug[slug].sections.moves.find(r => r.name === 'Triple Uppercut').input, 'FC df+1,2,1');
  }
  for (const slug of ['kazuya-mishima', 'heihachi-mishima']) {
    assert.equal(bySlug[slug].sections.combos.find(r => r.name === 'Power uppercut into double axe kick').input, 'f,d,df+2 > f,d,df,n+4,4');
  }
});

test('every fighter has distinct sourced juggle routes and correctly sized long combos', () => {
  const sources = new Set(data.source.references.map(r => r.id));
  for (const c of data.characters) {
    assert.ok(c.sections.combos.length >= 2, c.name);
    assert.equal(new Set(c.sections.combos.map(r => r.input)).size, c.sections.combos.length);
    for (const row of c.sections.combos) {
      assert.ok(sources.has(row.sourceId), `${c.name}: ${row.name}`);
      assert.ok(row.input.includes(' > '), `${c.name}: ${row.name}`);
    }
    for (const row of c.sections.strings || []) {
      assert.equal(row.hits, c.slug === 'kunimitsu' ? 7 : 10);
      assert.equal(row.name, `${row.hits} Hit Combo`);
      const attacks = parseInputNotation(row.input).filter(s => s.kind === 'input' && /^[1-4]/.test(s.normalized));
      assert.equal(attacks.length, row.hits, c.name);
    }
  }
});

test('all portrait regions fit the actual locally stored sheet', async () => {
  const png = await readFile(new URL('../public/characters/tekken-1/portraits.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), data.portraits.width);
  assert.equal(png.readUInt32BE(20), data.portraits.height);
  for (const c of data.characters) {
    const { x, y, width, height } = c.portrait;
    assert.ok(x >= 0 && y >= 0 && x + width <= data.portraits.width && y + height <= data.portraits.height, c.name);
  }
  assert.deepEqual(bySlug.kunimitsu.portrait, bySlug.yoshimitsu.portrait);
});

test('static loader uses only the public JSON file and propagates cancellation', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/data/tekken-1.json');
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => data };
  });
  assert.equal((await getTekken1Guides({ signal: controller.signal })).characters.length, 17);
});

test('static loader rejects missing files and wrong-game payloads', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
  await assert.rejects(getTekken1Guides(), /could not be loaded/);
  mock.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ gameId: 'tekken-8', characters: [{}] }) }));
  await assert.rejects(getTekken1Guides(), /invalid/);
});
