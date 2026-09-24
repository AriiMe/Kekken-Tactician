import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findTagPartner, tagPartnerSearch, resolveSharedTagGuide } from '../src/utils/tagPairing.js';

const roster = JSON.parse(readFileSync(new URL('../public/data/tekken-tag-1.json', import.meta.url), 'utf8')).characters;
const fighter = slug => roster.find(row => row.slug === slug);

test('any different roster fighter can be selected without requiring tag routes', () => {
  for (const primary of roster) for (const partner of roster) {
    assert.equal(findTagPartner(primary, roster, `partner=${partner.slug}`), primary === partner ? null : partner);
  }
});

test('missing, invalid and self partners remain a single-fighter view', () => {
  for (const query of ['', 'partner=', 'partner=not-a-fighter', 'partner=mokujin']) {
    assert.equal(findTagPartner(fighter('mokujin'), roster, query), null);
  }
  assert.equal(findTagPartner(undefined, roster, 'partner=jin-kazama'), null);
  assert.equal(findTagPartner(fighter('mokujin'), undefined, 'partner=jin-kazama'), null);
});

test('changing and clearing partners preserve unrelated search state without mutating history snapshots', () => {
  const original = new URLSearchParams('input=text&partner=jin-kazama');
  const changed = tagPartnerSearch(original, 'paul-phoenix');
  assert.equal(changed.get('input'), 'text');
  assert.equal(findTagPartner(fighter('mokujin'), roster, changed), fighter('paul-phoenix'));
  assert.equal(findTagPartner(fighter('mokujin'), roster, original), fighter('jin-kazama'));
  const cleared = tagPartnerSearch(changed, '');
  assert.equal(cleared.toString(), 'input=text');
  assert.equal(findTagPartner(fighter('mokujin'), roster, cleared), null);
  assert.equal(changed.get('partner'), 'paul-phoenix');
});

test('costume aliases resolve to their actual shared moveset while mimics keep no fixed style', () => {
  for (const [alias, source] of [['panda', 'kuma'], ['angel', 'devil'], ['alex', 'roger'], ['tiger-jackson', 'eddy-gordo']]) {
    const resolved = resolveSharedTagGuide(fighter(alias), roster);
    assert.equal(resolved, fighter(source));
    assert.ok(resolved.sections.combos.length);
    assert.deepEqual(fighter(alias).sections, {});
  }
  for (const slug of ['mokujin', 'tetsujin', 'unknown']) {
    assert.equal(resolveSharedTagGuide(fighter(slug), roster), fighter(slug));
    assert.deepEqual(fighter(slug).sections, {});
  }
});

test('an absent or circular shared-guide target never loses the selected fighter or loops', () => {
  const a = { slug: 'a', sharedGuide: 'b' }, b = { slug: 'b', sharedGuide: 'a' };
  assert.equal(resolveSharedTagGuide(a, [a]), a);
  assert.equal(resolveSharedTagGuide(a, [a, b]), b);
  assert.equal(resolveSharedTagGuide(undefined, roster), undefined);
});
