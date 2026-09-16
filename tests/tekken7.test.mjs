import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { tekken8Stances } from '../src/data/tekken8Stances.js';
import { getTekken7Essentials } from '../src/utils/apiClient.js';

test('every Tekken 8 stance has an entry command that renders and conditions are explicit', () => {
  for (const [slug, stances] of Object.entries(tekken8Stances)) for (const stance of stances) {
    assert.ok(stance.input, `${slug}: ${stance.name}`);
    assert.ok(parseInputNotation(stance.input).every(s => s.kind !== 'text'), `${slug}: ${stance.input}`);
  }
  assert.equal(tekken8Stances['armor-king'].find(s => s.abbreviation === 'BAD').input, 'f+3+4');
  assert.match(tekken8Stances['miary-zo'].find(s => s.abbreviation === 'WAL').notes, /wall/);
  assert.match(tekken8Stances['jack-8'].find(s => s.abbreviation === 'GMC').notes, /absorbing/);
  assert.match(tekken8Stances['fahkumram'][0].notes, /Requires Garuda Force/);
});

test('51 official Tekken 7 roster portraits are real local PNG files', async () => {
  const directory = new URL('../public/images/tekken7/', import.meta.url);
  const images = await readdir(directory);
  assert.equal(images.length, 51);
  for (const image of images) {
    assert.match(image, /^[a-z0-9-]+-card\.png$/);
    const bytes = await readFile(new URL(image, directory));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(bytes.readUInt32BE(16) >= 250 && bytes.readUInt32BE(20) >= 50, image);
  }
});

test('Tekken 7 loader uses the backend, propagates cancellation and rejects wrong-game data', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.match(url, /\/api\/v1\/games\/tekken-7\/essentials$/);
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => ({ gameId: 'tekken-7', characters: [{ slug: 'jin' }] }) };
  });
  assert.equal((await getTekken7Essentials({ signal: controller.signal })).characters[0].slug, 'jin');
  globalThis.fetch.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ gameId: 'tekken-8', characters: [] }) }));
  await assert.rejects(getTekken7Essentials(), /invalid/);
  globalThis.fetch.mock.mockImplementation(async () => ({ ok: false, status: 503, headers: new Headers(), json: async () => ({ message: 'Unavailable' }) }));
  await assert.rejects(getTekken7Essentials(), /Unavailable/);
});
