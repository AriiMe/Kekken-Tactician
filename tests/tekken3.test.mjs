import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-3.json', import.meta.url), 'utf8'));

test('Tekken 3 combo routes render and do not repeat across grouped launchers', () => {
  for (const character of data.characters) {
    const seen = new Set();
    for (const row of character.sections.combos || []) {
      for (const input of row.launchers?.map(launcher => `${launcher} > ${row.input}`) || [row.input]) {
        const tokens = parseInputNotation(input);
        assert.deepEqual(tokens.filter(token => token.kind === 'text'), [], `${character.name}: ${input}`);
        const key = tokens.filter(token => token.kind !== 'space')
          .map(token => token.normalized || token.raw).join('|');
        assert.ok(!seen.has(key), `${character.name}: duplicate ${input}`);
        seen.add(key);
      }
    }
  }
});

test('Tekken 3 unblockables are not repeated in the move list', () => {
  for (const character of data.characters) {
    const unblockables = new Set(character.sections.unblockables?.map(row => row.input));
    for (const row of character.sections.moves || []) {
      assert.ok(!unblockables.has(row.input), `${character.name}: ${row.input}`);
    }
  }
});
