import test from 'node:test';
import assert from 'node:assert/strict';
import { connectAndroid } from '../public/android.mjs';

test('browser runtime has no Android bridge or document side effects', () => {
  const previous = globalThis.window;
  try { globalThis.window = {}; assert.equal(connectAndroid({}), null); }
  finally { globalThis.window = previous; }
});

test('Android file protocol preserves recovery and shares only an explicit mission id', t => {
  const previous = {window:globalThis.window,document:globalThis.document};
  t.after(() => Object.assign(globalThis, previous));
  const sent=[], imported=[], status=[];
  const channel={postMessage: raw => sent.push(JSON.parse(raw))};
  globalThis.window={BureauAndroid:channel};
  globalThis.document={addEventListener:()=>assert.fail('Native sharing must not intercept unrelated navigation')};
  const bridge=connectAndroid({onImport: raw => imported.push(raw), onStatus: message => status.push(message)});
  bridge.exportDiary('{"note":"личное"}'); bridge.importDiary();
  assert.deepEqual(sent,[{type:'export',text:'{"note":"личное"}'},{type:'import'}]);
  channel.onmessage({data:JSON.stringify({type:'import',text:'{"version":1}',ok:true})});
  channel.onmessage({data:JSON.stringify({type:'import',text:'invalid',ok:false})});
  channel.onmessage({data:JSON.stringify({type:'status',text:'Выбор файла отменён.',ok:false})});
  channel.onmessage({data:'not-json'});
  assert.deepEqual(imported,['{"version":1}']);
  assert.equal(status.length,2);
  bridge.shareMission('quiet-tea');
  assert.deepEqual(sent.at(-1),{type:'share-mission',id:'quiet-tea'});
  assert.equal(typeof bridge.openUrl,'undefined');
});
