import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseMoves, parsePunishers, parseCombos, notation } from '../scripts/import-wavu-tekken5.mjs';

const data = JSON.parse(await readFile(new URL('../public/data/tekken-5.json', import.meta.url), 'utf8'));
const character = slug => data.characters.find(c => c.slug === slug);

test('Wavu strings use opening-hit punishment speed and retain follow-up measurements', () => {
  const moves = parseMoves(`{{Move5|id=Test-1|input=1|damage=4|target=h|startup=i8}}
    {{Move5|id=Test-1,2|parent=Test-1|input=,2|damage=10|target=,h|startup=i12|block=-2}}`);
  assert.equal(moves[1].fullInput, '1,2');
  assert.equal(moves[1].fullDamage, '4,10');
  assert.equal(moves[1].startup, 'i12');
  assert.equal(parseMoves('{{Move5|id=Test-3+4,3|inputLead=3+4|input=,3|startup=i12}}')[0].fullInput, '3+4,3');
  const punishers = parsePunishers('{{PunisherTable5|standing={{o|{{o|moveId=Test-1,2}}}}}}', moves);
  assert.equal(punishers[0].startupFrames, 8);
  const anna = character('anna-williams');
  const jab = anna.sections.moves.find(row => row.input === '1,2');
  assert.equal(jab.versions.find(v => v.edition === 'dr').frameScope, 'Follow-up only');
  assert.equal(jab.versions.find(v => v.edition === 'dr').frameData.startup, '10');
  assert.equal(anna.sections.punishers.find(row => row.input === '1,2').startupFrames, 8);
});

test('all DR movesets have edition-scoped punishment, including longer launchers', () => {
  for (const c of data.characters.filter(c => c.slug !== 'mokujin' && !c.sharedGuide)) {
    const rows = c.sections.punishers;
    assert.ok(rows.some(r => r.position === 'standing'), c.name);
    assert.ok(rows.some(r => r.position === 'crouching'), c.name);
    for (const row of rows) {
      assert.equal(row.edition, 'dr');
      assert.ok(row.startupFrames <= 18 || row.launcher, `${c.name}: ${row.input}`);
    }
  }
  const kazuya = character('kazuya-mishima');
  assert.ok(kazuya.sections.punishers.some(r => r.input === 'WS 1,2' && r.startupFrames === 12 && r.launcher));
  assert.ok(kazuya.sections.punishers.some(r => r.input === 'u/f,n+4' && r.startupFrames === 23 && r.launcher));
});

test('combos omit fake and placeholder routes and retain conditional execution notes', () => {
  const rows = parseCombos(`== Staples ==
; [16] df+2
: [+40] df+1, 1, f+1+2<ref>Only on large characters.</ref>
== Fake Combos ==
; CH qcf+2
: df+1, 1, f+1+2
== Float ==
; 1
: combo when you anti-air with jab here`);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].row.edition, 'dr');
  assert.deepEqual(rows[0].row.launchers, ['d/f+2']);
  assert.match(rows[0].row.notes, /Only on large characters/);
  assert.match(rows[0].row.notes, /Follow-up damage: 40/);
});

test('Wavu notation retains holds and just frames, and removes wiki markup', () => {
  assert.equal(notation('CD.df#2'), 'f,n,d,d/f:2');
  assert.equal(notation('UF+4'), '~uf+4');
  assert.notEqual(notation('UF+4'), notation('uf+4'));
  assert.equal(notation('df+1,&ZeroWidthSpace;2'), 'd/f+1,2');
  assert.equal(notation('b+1&#58;1'), 'b+1:1');
});

test('Baek stance-loop execution is concise and restricted to DR', () => {
  const loop = character('baek-doo-san').sections.techniques.find(r => r.name === 'Flamingo 3+4 loops');
  assert.equal(loop.edition, 'dr');
  assert.match(loop.notes, /Keep 3 held/);
  assert.match(loop.notes, /release it before the next 4/);
});
