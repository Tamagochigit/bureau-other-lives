import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACTS_KEY, telegramUsername, decodeContacts, saveContact } from '../public/contacts.mjs';
import { createFriendsController } from '../public/friends.mjs';
import { telegramChatLink, telegramShareLink, missionLink, incomingLinks } from '../public/links.mjs';

const friend = {name:'Аня',username:'anyafriend'};
test('contact links accept a username but reject injected or unrelated destinations', () => {
  assert.equal(telegramUsername(' @AnyaFriend '),'anyafriend');
  assert.equal(telegramUsername('https://t.me/AnyaFriend/'),'anyafriend');
  for (const value of ['javascript:alert(1)','https://evil.test/anyafriend','https://t.me/share','https://t.me/login','https://t.me/anyafriend?text=private','https://evil.test@t.me/anyafriend','https://t.me/anyafriend/123','anyafriend" onclick="bad','../anyafriend']) assert.throws(()=>telegramUsername(value),value);
});
test('contact edits deduplicate and validate versioned data without accepting another schema', () => {
  let contacts=saveContact([],friend);
  contacts=saveContact(contacts,{name:'Анна',username:'@AnyaFriend'});
  assert.equal(contacts.length,1);
  contacts=saveContact(contacts,{name:'Аня',username:'anyanew'},'anyafriend');
  assert.deepEqual(contacts,[{name:'Аня',username:'anyanew'}]);
  assert.deepEqual(decodeContacts(JSON.stringify({version:1,contacts})),contacts);
  assert.throws(()=>decodeContacts('{broken'));
  assert.throws(()=>decodeContacts(JSON.stringify({version:1,entries:[]})));
  assert.throws(()=>decodeContacts(JSON.stringify({version:1,contacts:[friend,friend]})));
  assert.throws(()=>saveContact(contacts,{name:' ',username:'somefriend'}));
});
test('Telegram links prepare only a catalog mission and preserve the encoded site fragment', () => {
  const chat=new URL(telegramChatLink('@AnyaFriend','quiet-tea'));
  assert.equal(chat.origin,'https://t.me');
  assert.equal(chat.pathname,'/anyafriend');
  assert.ok(chat.searchParams.get('text').endsWith(missionLink('quiet-tea')));
  assert.equal(chat.hash,'');
  const share=new URL(telegramShareLink('quiet-tea'));
  assert.equal(share.pathname,'/share/url');
  assert.equal(share.searchParams.get('url'),missionLink('quiet-tea'));
  assert.equal(new URL(share.searchParams.get('url')).hash,'#missions');
  assert.equal(telegramShareLink('javascript:alert(1)'),'');
  assert.equal(new URL(telegramChatLink('anyafriend','unknown')).search,'');
  assert.deepEqual(incomingLinks('?mission=retired&offer=quiet-tea&join=secret'),{mission:''});
});
function controller(t, storage) {
  const globals=['document','window','FormData'];
  const originals=Object.fromEntries(globals.map(key=>[key,globalThis[key]]));
  t.after(()=>Object.assign(globalThis,originals));
  globalThis.document={querySelector:()=>null};
  globalThis.window={confirm:()=>true};
  globalThis.FormData=class{constructor(form){this.values=form.values;}get(key){return this.values[key] || null;}};
  const messages=[];
  return {friends:createFriendsController({storage,toast:message=>messages.push(message)}),messages};
}
test('friend actions store only contacts, escape names and preserve real chats on removal', t => {
  const saved=new Map();
  const keys=[];
  const {friends}=controller(t,{getItem:key=>{keys.push(key);return saved.get(key) || null;},setItem:(key,value)=>{keys.push(key);saved.set(key,value);}});
  friends.submit({values:{name:'<script>Анна</script>',username:'anyafriend'}});
  assert.match(friends.page(),/&lt;script&gt;/);
  assert.doesNotMatch(friends.page(),/<script>/);
  assert.match(friends.page(),/>Написать<\/a>/);
  friends.prepareMission('quiet-tea');
  assert.match(friends.page(),/Предложить миссию/);
  assert.match(friends.page(),/target="_blank" rel="noopener noreferrer"/);
  friends.handleAction('friend-edit','anyafriend');
  friends.submit({values:{name:'Анна',username:'anyanew'}});
  assert.deepEqual(decodeContacts(saved.get(CONTACTS_KEY)),[{name:'Анна',username:'anyanew'}]);
  friends.handleAction('friend-remove','anyanew');
  assert.deepEqual(decodeContacts(saved.get(CONTACTS_KEY)),[]);
  assert.ok(keys.every(key=>key===CONTACTS_KEY));
});
test('broken or unwritable contact storage reports failure without claiming a saved contact', t => {
  const {friends,messages}=controller(t,{getItem:()=>'{broken',setItem:()=>assert.fail('Do not overwrite unreadable data')});
  friends.submit({values:friend});
  assert.match(friends.page(),/до закрытия страницы/);
  assert.match(friends.page(),/anyafriend/);
  assert.ok(messages.every(message=>!message.includes('Контакт сохранён')));
});
test('quota failure retains the contact for this visit and warns about persistence', t => {
  const {friends,messages}=controller(t,{getItem:()=>null,setItem:()=>{throw new Error('quota');}});
  friends.submit({values:friend});
  assert.match(friends.page(),/Браузер не смог сохранить/);
  assert.match(friends.page(),/anyafriend/);
  assert.ok(messages.every(message=>!message.includes('Контакт сохранён')));
});
