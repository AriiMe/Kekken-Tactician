import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseInputNotation } from '../src/utils/inputNotation.js';

test('classic combo inputs and every alternative launcher render without unknown text', async () => {
  for (const id of ['tekken-1', 'tekken-2', 'tekken-3']) {
    const data = JSON.parse(await readFile(new URL(`../public/data/${id}.json`, import.meta.url), 'utf8'));
    assert.equal(data.source.references, undefined);
    for (const character of data.characters) {
      const routes = new Set();
      for (const row of character.sections.combos) {
        assert.equal(row.sourceId, undefined);
        assert.equal(row.sourceTimestamps, undefined);
        for (const input of [row.input, ...(row.launchers || [])]) {
          assert.ok(input.trim());
          assert.deepEqual(parseInputNotation(input).filter(token => token.kind === 'text'), [], `${id}: ${character.name}: ${input}`);
        }
        for (const input of row.launchers?.map(launcher => `${launcher} > ${row.input}`) || [row.input]) {
          assert.ok(!routes.has(input), `${id}: ${character.name}: duplicate route ${input}`);
          routes.add(input);
        }
      }
    }
  }
});
