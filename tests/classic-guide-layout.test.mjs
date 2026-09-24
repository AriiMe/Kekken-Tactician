import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { classicSectionTitles, getClassicPunishers } from '../src/utils/classicGuideLayout.js';

const character = moves => ({ sections: { moves } });
test('guide prioritizes combos and punishment, with moves last', () => {
  const keys = Object.keys(classicSectionTitles);
  assert.deepEqual(keys.slice(0, 2), ['combos', 'punishers']);
  assert.equal(keys.at(-1), 'moves');
});
test('punishment excludes defensive moves, conditional entries and slow non-launchers', () => {
  const rows = [
    { name: 'Parry', input: 'b+1+2', frameData: { startup: '3' } },
    { name: 'Slow attack', input: 'b+2', frameData: { startup: '20' } },
    { name: 'Stance attack', input: 'BT 1', frameData: { startup: '10' } },
    { name: 'Follow-up', input: '1,2', frameScope: 'Follow-up only', frameData: { startup: '12' } },
    { name: 'Launcher', input: 'u/f+4', notes: 'Launches on hit.', frameData: { startup: '20' } },
    { name: 'Jab string', input: '1,2', frameData: { startup: '8' } },
    { name: 'Another jab string', input: '1,1,2', frameData: { startup: '8' } },
    { name: 'Rising kick', input: 'WS+4', frameData: { startup: '11~12' } },
  ];
  const result = getClassicPunishers(character(rows));
  assert.deepEqual(result.standing.map(r => [r.input, r.frames]), [['1', 8], ['u/f+4', 20]]);
  assert.deepEqual(result.crouching.map(r => [r.input, r.frames]), [['WS+4', 12]]);
});
test('vanilla timings are never silently attributed to DR', () => {
  const result = getClassicPunishers(character([{ name: 'Upper', input: 'd/f+2', versions: [
    { edition: 'tekken5', frameData: { startup: '15' } }, { edition: 'dr', notes: 'Changed' },
  ] }]));
  assert.equal(result.standing.length, 1);
  assert.equal(result.standing[0].edition, 'tekken5');
});
test('reference frames remain labeled and absent frames remain absent', () => {
  assert.equal(getClassicPunishers(character([{ name: 'Jab', input: '1', referenceFrameData: { startup: '10' } }])).standing[0].reference, true);
  assert.deepEqual(getClassicPunishers(character([{ name: 'Jab', input: '1' }])), { standing: [], crouching: [] });
});
test('sourced DR punishers replace inferred DR candidates without removing vanilla timings', () => {
  const fighter = character([{ name: 'Jab string', input: '1,2', versions: [
    { edition: 'tekken5', frameData: { startup: '8' } }, { edition: 'dr', frameData: { startup: '10' } },
  ] }]);
  fighter.sections.punishers = [{ name: 'Jab punish', input: '1,2', startupFrames: 10, position: 'standing', edition: 'dr', notes: 'Guaranteed string.' }];
  assert.deepEqual(getClassicPunishers(fighter).standing.map(r => [r.input, r.frames, r.edition]), [['1', 8, 'tekken5'], ['1,2', 10, 'dr']]);
  assert.equal(getClassicPunishers(fighter).standing[1].notes, 'Guaranteed string.');
});
test('all classic roster results are ordered and retain only slower launchers', () => {
  for (const id of ['1', '2', '3', '4', '5', '6', 'tag-1']) {
    const data = JSON.parse(fs.readFileSync(`public/data/tekken-${id}.json`));
    for (const fighter of data.characters) for (const rows of Object.values(getClassicPunishers(fighter))) {
      assert.ok(rows.every((r, i) => !i || rows[i - 1].frames <= r.frames));
      assert.ok(rows.every(r => r.frames <= 18 || r.launcher));
    }
  }
});
