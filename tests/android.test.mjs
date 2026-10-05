import test from 'node:test';
import assert from 'node:assert/strict';
import { connectAndroid } from '../public/android.mjs';

test('browser runtime has no Android bridge or document side effects', () => {
  const previous = globalThis.window;
  try { globalThis.window = {}; assert.equal(connectAndroid({}), null); }
  finally { globalThis.window = previous; }
});

test('Android file protocol handles success, invalid messages and explicit Telegram clicks', t => {
  const previous = {window:globalThis.window,document:globalThis.document};
  t.after(() => Object.assign(globalThis, previous));
  const sent=[], imported=[], status=[]; let click;
  const channel={postMessage: raw => sent.push(JSON.parse(raw))};
  globalThis.window={BureauAndroid:channel};
  globalThis.document={addEventListener:(name,handler,capture) => {assert.equal(name,'click');assert.equal(capture,true);click=handler;}};
  const bridge=connectAndroid({onImport: raw => imported.push(raw), onStatus: message => status.push(message)});
  bridge.exportDiary('{"note":"личное"}'); bridge.importDiary();
  assert.deepEqual(sent,[{type:'export',text:'{"note":"личное"}'},{type:'import'}]);
  channel.onmessage({data:JSON.stringify({type:'import',text:'{"version":1}',ok:true})});
  channel.onmessage({data:JSON.stringify({type:'import',text:'invalid',ok:false})});
  channel.onmessage({data:JSON.stringify({type:'status',text:'Выбор файла отменён.',ok:false})});
  channel.onmessage({data:'not-json'});
  assert.deepEqual(imported,['{"version":1}']);
  assert.equal(status.length,2);
  let prevented=false;
  click({target:{closest:()=>({href:'https://t.me/friend_name?text=hello'})},preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);assert.deepEqual(sent.at(-1),{type:'open-url',url:'https://t.me/friend_name?text=hello'});
  const length=sent.length;
  for (const href of ['#home','https://example.com','javascript:alert(1)','http://t.me/friend_name','https://t.me.evil.example/friend']) {
    click({target:{closest:()=>({href})},preventDefault:()=>assert.fail('Unrelated links stay outside the protocol')});
  }
  assert.equal(sent.length,length);
});
