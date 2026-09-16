import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { getClassicTekkenGuides } from '../src/utils/classicTekken.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-2.json', import.meta.url), 'utf8'));
const bySlug = Object.fromEntries(data.characters.map(c => [c.slug, c]));

test('Tekken 2 has all 25 selectable fighters, including alternate characters', () => {
  assert.equal(data.characters.length, 25);
  assert.deepEqual(Object.keys(bySlug).sort(), ['alex', 'angel', 'anna-williams', 'armor-king',
    'baek-doo-san', 'bruce-irvin', 'devil', 'ganryu', 'heihachi-mishima', 'jack-2',
    'jun-kazama', 'kazuya-mishima', 'king', 'kuma', 'kunimitsu', 'lee-chaolan', 'lei-wulong',
    'marshall-law', 'michelle-chang', 'nina-williams', 'paul-phoenix', 'prototype-jack',
    'roger', 'wang-jinrei', 'yoshimitsu']);
  assert.deepEqual(bySlug.alex.sections, bySlug.roger.sections);
  assert.deepEqual(bySlug.angel.sections, bySlug.devil.sections);
  assert.notEqual(bySlug.alex.portrait.image, bySlug.roger.portrait.image);
  assert.notEqual(bySlug.angel.portrait.image, bySlug.devil.portrait.image);
});

test('every command renders and every fighter has four distinct routes', () => {
  for (const c of data.characters) {
    assert.ok(c.sections.moves.length >= 10 && c.sections.throws.length >= 2, c.name);
    assert.ok(c.sections.combos.length >= 4, c.name);
    assert.equal(new Set(c.sections.combos.map(r => r.input)).size, c.sections.combos.length);
    for (const rows of Object.values(c.sections)) for (const row of rows) {
      assert.ok(row.name && row.input.trim(), c.name);
      assert.equal(row.status, undefined);
      assert.doesNotMatch(row.notes || '', /verification|unverified|no input|supplied|source typo|may whiff/i);
      assert.equal(parseInputNotation(row.input).filter(s => s.kind === 'text').length, 0, `${c.name}: ${row.input}`);
    }
  }
});

test('Tekken 2-specific strings and launcher conditions are preserved', () => {
  assert.equal(bySlug.kunimitsu.sections.strings[0].input, '1,2,1,4,4,4,1,2,3,2');
  assert.equal(bySlug.kunimitsu.sections.strings[0].hits, 10);
  // Jun's final command strikes twice: ten hits do not always mean ten button presses.
  assert.equal(bySlug['jun-kazama'].sections.strings[0].input, 'WS 2,1,1,1,2,1,4,3,3+4');
  for (const slug of ['alex', 'roger', 'bruce-irvin', 'ganryu']) assert.equal(bySlug[slug].sections.strings, undefined);
  assert.match(bySlug['michelle-chang'].sections.combos.find(r => r.input.startsWith('CH')).notes, /counter hit/);
  assert.match(bySlug['baek-doo-san'].sections.combos[2].notes, /Wing Blade/);
  for (const slug of ['king', 'armor-king', 'alex', 'roger']) {
    assert.ok(bySlug[slug].sections.combos.every(r => !r.input.startsWith('df+2 >')));
    assert.ok(bySlug[slug].sections.moves.some(r => r.input === 'FC ~df+2'));
  }
});

test('all official character artwork is stored locally as valid GIF images', async () => {
  for (const c of data.characters) {
    assert.match(c.portrait.image, /^\/characters\/tekken-2\/[a-z0-9-]+\.gif$/);
    const bytes = await readFile(new URL(`../public${c.portrait.image}`, import.meta.url));
    assert.match(bytes.subarray(0,6).toString(), /^GIF8[79]a$/);
    assert.equal(bytes.readUInt16LE(6), c.portrait.width);
    assert.equal(bytes.readUInt16LE(8), c.portrait.height);
  }
});

test('archive loader keeps Tekken 2 local and forwards cancellation', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/data/tekken-2.json');
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => data };
  });
  assert.equal((await getClassicTekkenGuides('tekken-2', { signal: controller.signal })).characters.length, 25);
});

test('archive loader rejects unsupported games, HTTP errors and cross-game data', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
  await assert.rejects(getClassicTekkenGuides('../private'), /Unsupported/);
  assert.equal(mock.mock.callCount(), 0);
  await assert.rejects(getClassicTekkenGuides('tekken-2'), /could not be loaded/);
  mock.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ ...data, gameId: 'tekken-1' }) }));
  await assert.rejects(getClassicTekkenGuides('tekken-2'), /invalid/);
});
