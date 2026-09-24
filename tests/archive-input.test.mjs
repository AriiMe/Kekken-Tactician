import test from 'node:test';
import assert from 'node:assert/strict';
import { needsArchiveText, normalizeArchiveHolds } from '../src/utils/archiveInput.js';
import { parseInputNotation } from '../src/utils/inputNotation.js';

test('archive capital directions retain held-input meaning in icons', () => {
  const input = normalizeArchiveHolds('f,f,F+2 into D/F+1');
  assert.deepEqual(parseInputNotation(input).filter(token => token.kind === 'input').map(token => token.normalized), ['f', 'f', 'holdf', '2', 'into', 'holddf', '1']);
});

test('delayed strings and bracketed hold cancels keep their archive notation', () => {
  for (const input of ['F+2>2>1', 'u+1+2 [~B]', 'b+3~F']) {
    assert.equal(needsArchiveText(normalizeArchiveHolds(input)), true, input);
  }
  assert.equal(needsArchiveText(normalizeArchiveHolds('f,F+2 into df+1,2 B!')), false);
});

test('existing holds and stance names remain intact', () => {
  assert.ok(parseInputNotation(normalizeArchiveHolds('b+3~F into RFF 1 into WS+4')).some(token => token.kind === 'text'), 'Immediate held transitions must use the original-text fallback rather than a tap icon');
  assert.deepEqual(parseInputNotation(normalizeArchiveHolds('~F+2')).filter(token => token.kind === 'input').map(token => token.normalized), ['holdf', '2']);
  assert.equal(normalizeArchiveHolds('BT d+1 (CH, 15F delay)'), 'BT d+1 (CH, 15F delay)');
  assert.equal(normalizeArchiveHolds('df+1,2 B! into ~D/F+1'), 'df+1,2 B! into ~df+1');
});
