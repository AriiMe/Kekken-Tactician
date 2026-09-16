import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parseInputNotation, getInputLabel } from '../src/utils/inputNotation.js';
import { getTekkenTag2Essentials } from '../src/utils/apiClient.js';
import { getTag2TeamRoutes } from '../src/utils/tag2Teams.js';

const inputs = value => parseInputNotation(value).filter(s => s.kind === 'input').map(s => s.normalized);
test('Tag 2 distinguishes tag, bound and move boundaries without changing back or tornado', () => {
  assert.deepEqual(inputs('df+2 ~5 into 1+2+5 B!'), ['df','2','tag','into','1+2','tag','bound']);
  assert.deepEqual(inputs('df+1+2+5 into b+2+3+TAG'), ['df','1+2','tag','into','b','2+3','tag']);
  assert.deepEqual(inputs('b B! (B!) T S! 2+TAG'), ['b','bound','bound','t','screw','2','tag']);
  assert.equal(getInputLabel('bound'), 'Bound / ground bounce');
  assert.equal(getInputLabel('tag'), 'Tag button (5)');
  assert.deepEqual(parseInputNotation('MTS f+1 into FLA b+3').filter(s=>s.kind==='stance').map(s=>s.normalized), ['MTS','FLA']);
});

test('team routes remain complete on either fighter page and identify the other partner', () => {
  const kingRoute = { id:'king-ak', partner:'armor-king', steps:[{fighter:'king',input:'uf+4 into b+2,1+2 tag bound'},{fighter:'armor-king',input:'3+4,2'},{fighter:'king',input:'WR 2+4'}] };
  const akRoute = { id:'ak-king', partner:'king', steps:[{fighter:'armor-king',input:'CD 2 into d+2 tag bound'},{fighter:'king',input:'f+2,2,1'},{fighter:'armor-king',input:'WR 2+4'}] };
  const characters = [{slug:'king',teamCombos:[kingRoute]},{slug:'armor-king',teamCombos:[akRoute]},{slug:'paul',teamCombos:[]}];
  const king = getTag2TeamRoutes(characters,'king');
  const armorKing = getTag2TeamRoutes(characters,'armor-king');
  assert.equal(king.length,2);
  assert.equal(armorKing.length,2);
  assert.deepEqual(new Set(king.map(c=>c.id)),new Set(armorKing.map(c=>c.id)));
  assert.ok(king.every(c=>c.teammate==='armor-king'));
  assert.ok(armorKing.every(c=>c.teammate==='king'));
  assert.deepEqual(king.find(c=>c.id==='ak-king').steps,akRoute.steps);
  assert.deepEqual(getTag2TeamRoutes(characters,'paul'),[]);
});

test('all 59 Tag 2 roster images are local WebP files', async () => {
  const directory = new URL('../public/characters/tekken-tag-2/', import.meta.url);
  const files = await readdir(directory);
  assert.equal(files.length, 59);
  for (const name of files) {
    assert.match(name, /^[a-z0-9-]+\.webp$/);
    const bytes = await readFile(new URL(name, directory));
    assert.equal(bytes.subarray(0,4).toString(), 'RIFF', name);
    assert.equal(bytes.subarray(8,12).toString(), 'WEBP', name);
  }
});

test('Tag 2 loader uses its own backend route, keeps cancellation and rejects other games', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.match(url, /\/api\/v1\/games\/tekken-tag-2\/essentials$/);
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => ({ gameId:'tekken-tag-2', characters:[{slug:'jin'}] }) };
  });
  assert.equal((await getTekkenTag2Essentials({signal:controller.signal})).characters[0].slug, 'jin');
  globalThis.fetch.mock.mockImplementation(async () => ({ok:true,json:async()=>({gameId:'tekken-7',characters:[{slug:'jin'}]})}));
  await assert.rejects(getTekkenTag2Essentials(), /invalid/);
});
