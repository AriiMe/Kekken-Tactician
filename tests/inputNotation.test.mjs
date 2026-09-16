import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInputNotation } from '../src/utils/inputNotation.js';
import { getCharacterStances, getStanceLabels } from '../src/data/tekken8Stances.js';
import { getTekken8Portrait } from '../src/data/tekken8Portraits.js';

const inputs = value => parseInputNotation(value).filter(s => s.kind === 'input').map(s => s.normalized);

test('rapid presses produce separate icons while keeping simultaneous button chords', () => {
  assert.deepEqual(inputs('f f f 2~1+2'), ['f','f','f','2','1+2']);
  assert.deepEqual(inputs('3~4 4~3 2~1'), ['3','4','4','3','2','1']);
  assert.equal(parseInputNotation('2~1+2').find(s => s.kind === 'separator').raw, '~');
  assert.deepEqual(inputs('~F ~df+4 f~n'), ['holdf','holddf','4','f','n']);
});

test('parentheses preserve grouping and render the inputs inside them', () => {
  for (const [value, expected] of [['CH (df 3) 3', ['ch','df','3','3']], ['CH (df 1) 4', ['ch','df','1','4']], ['(df1,2) 3', ['df','1','2','3']]]) {
    const parsed = parseInputNotation(value);
    assert.deepEqual(inputs(value), expected);
    assert.deepEqual(parsed.filter(s => s.kind === 'group').map(s => s.raw), ['(',')']);
    assert.equal(parsed.filter(s => s.kind === 'text').length, 0);
    assert.equal(new Set(parsed.map(s => s.key)).size, parsed.length);
  }
});

test('instructions stay separate from executable notation and timing survives', () => {
  for (const note of ['(tap up)', '(turn around)', '(delay last hit)', '(hold)', '(perfect)']) {
    const parsed = parseInputNotation(`${note} DES f 3 1+2`);
    assert.equal(parsed[0].kind, 'annotation');
    assert.equal(parsed[0].raw, note);
    assert.deepEqual(inputs(`${note} DES f 3 1+2`), ['f','3','1+2']);
  }
  assert.deepEqual(inputs('b:2,1:3:3'), ['b','2','1','3','3']);
  assert.equal(parseInputNotation('b:2').find(s => s.kind === 'separator').raw, ':');
  assert.equal(parseInputNotation('unknown~notation')[0].raw, 'unknown~notation');
});

test('stances show full names and resolve imported aliases in character context', () => {
  const heihachi = getCharacterStances({ name:'Heihachi Mishima' });
  assert.equal(getStanceLabels(heihachi).FUJ, 'Fujin');
  assert.ok(heihachi.every(s => !/[1-4]/.test(s.abbreviation)));
  assert.equal(getStanceLabels(getCharacterStances({name:'Anna Williams'})).HCS, 'Hammer Chance');
  assert.equal(getStanceLabels(getCharacterStances({name:'Clive Rosfield'})).BHT, 'Wings of Light');
  assert.equal(getStanceLabels(getCharacterStances({name:'Zafina'})).MNT, 'Mantis');
  assert.deepEqual(getCharacterStances({name:'Asuka Kazama'}), []);
});

test('portrait corrections only affect the specific imported images', () => {
  const imported = 'https://p325k7wa.twic.pics/high/tekken/tekken-8/02-characters/new-gallery/Thumbnail/Thumbnail-Clive.png';
  assert.equal(getTekken8Portrait(imported).src, '/images/tekken-8/clive-rosfield.png');
  assert.equal(getTekken8Portrait('https://drive.google.com/existing-portrait'), null);
  assert.equal(getTekken8Portrait('/custom/clive.png'), null);
});
