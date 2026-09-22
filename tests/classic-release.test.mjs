import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { liveGames } from '../src/data/games.js';
import { parseInputNotation } from '../src/utils/inputNotation.js';

test('released classic rosters have local artwork, working shared guides and readable combo inputs', async () => {
  for (const id of ['tekken-3', 'tekken-4', 'tekken-5']) {
    const data = JSON.parse(await fs.readFile(`public/data/${id}.json`, 'utf8'));
    assert.equal(data.gameId, id);
    assert.ok(liveGames.some(game => game.id === id));
    assert.equal(new Set(data.characters.map(c => c.slug)).size, data.characters.length);
    for (const character of data.characters) {
      assert.ok((await fs.stat(`public${character.portrait.image}`)).size > 1000);
      if (character.sharedGuide) assert.ok(data.characters.some(c => c.slug === character.sharedGuide));
      assert.ok(character.mimic || character.sharedGuide || Object.values(character.sections).some(rows => rows.length));
      for (const combo of character.sections.combos || []) {
        for (const input of [combo.input, ...(combo.launchers || [])]) {
          assert.deepEqual(parseInputNotation(input).filter(t => t.kind === 'text'), [], `${id}: ${character.slug}: ${input}`);
        }
      }
    }
  }
});

test('classic diagonal and rapid inputs retain icons', () => {
  for (const input of ['d/f+2', 'u/f+3+4', 'f+[2~1]', '~f+1~1', 'dash', 'ff', 'sprint']) {
    assert.deepEqual(parseInputNotation(input).filter(t => t.kind === 'text'), [], input);
  }
});
