import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildPages } from '../scripts/build-pages.mjs';
import { STORAGE_KEY, emptyState, beginMission, completeMission } from '../public/core.mjs';

// Tests the assembled, deployable graph, not just the source whitelist.
test('the static build has complete relative assets and no former auth/server dependency', async t => {
  const output=await mkdtemp(join(tmpdir(),'bureau-pages-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  await buildPages(output);
  const files=await readdir(output), references=[];
  assert.ok(files.includes('.nojekyll'));
  assert.ok(!files.some(file=>/AGENTS|server|schema|hosting|\.mjs$/.test(file)));
  for (const file of files.filter(file=>/\.(js|html|css|webmanifest)$/.test(file))) {
    const content=await readFile(join(output,file),'utf8');
    assert.doesNotMatch(content,/chatgpt|signin-with|neurozona|CHAT_SERVICE_URL|\/api\/social/i);
    if (file.endsWith('.js')) for (const match of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) references.push(match[1]);
    if (file==='index.html') {
      assert.match(content,/src="\.\/app\.js"/);
      for (const match of content.matchAll(/(?:src|href)="([^"#]+)"/g)) references.push(match[1]);
    }
  }
  const manifest=JSON.parse(await readFile(join(output,'manifest.webmanifest'),'utf8'));
  references.push(...manifest.icons.map(icon=>icon.src));
  assert.equal(manifest.start_url,'./#home');
  assert.equal(manifest.scope,'./');
  for (const reference of references) {
    assert.ok(reference.startsWith('./'),reference);
    assert.ok(new URL(reference,'https://tamagochigit.github.io/bureau-other-lives/').pathname.startsWith('/bureau-other-lives/'));
    await stat(join(output,reference));
  }
});

test('the published app opens and shares instructions without changing or leaking the existing diary', async t => {
  const output=await mkdtemp(join(tmpdir(),'bureau-pages-ui-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const keys=['document','location','window','localStorage','setTimeout','clearTimeout','fetch','navigator'];
  const navigatorDescriptor=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  const originals=Object.fromEntries(keys.map(key=>[key,globalThis[key]]));
  t.after(()=>{for(const key of keys.filter(key=>key!=='navigator'))globalThis[key]=originals[key];if(navigatorDescriptor)Object.defineProperty(globalThis,'navigator',navigatorDescriptor);else delete globalThis.navigator;});
  await buildPages(output);
  const handlers={},elements=new Map();
  class Element {
    constructor(){this.innerHTML='';this.textContent='';this.open=false;this.hidden=false;this.listeners={};this.classList={add(){},remove(){}};}
    addEventListener(name,handler){this.listeners[name]=handler;}
    showModal(){this.open=true;}
    close(){this.open=false;this.listeners.close?.();}
  }
  const element=selector=>{if(!elements.has(selector))elements.set(selector,new Element());return elements.get(selector);};
  globalThis.document={activeElement:null,body:new Element(),querySelector:element,addEventListener:(name,handler)=>{handlers[name]=handler;}};
  globalThis.window={addEventListener(){},scrollTo(){}};
  globalThis.location={search:'?mission=quiet-tea',hash:'#missions'};
  const diary=completeMission(beginMission(emptyState(),'detail-hunter'),{rating:4,repeat:false,note:'PRIVATE NOTE'},'2026-10-04T11:00:00Z','saved-note');
  const saved=JSON.stringify(diary);
  const reads=[];
  const contacts=JSON.stringify({version:1,contacts:[{name:'PRIVATE CONTACT',username:'privatecontact'}]});
  const stored=new Map([[STORAGE_KEY,saved],['other-lives:contacts:v1',contacts]]);
  globalThis.localStorage={getItem:key=>{reads.push(key);return stored.get(key)||null;},setItem(){assert.fail('Opening/sharing must not change diary or contacts');},removeItem(){assert.fail('Retired contact data must be left untouched');}};
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{}});
  globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};
  globalThis.fetch=()=>assert.fail('No application-data request is allowed');
  const appUrl=pathToFileURL(join(output,'app.js')).href;
  await import(appUrl+'?shared-mission');
  assert.equal(element('#detail-dialog').open,true);
  assert.match(element('#dialog-content').innerHTML,/data-id="quiet-tea"/);
  await handlers.click({target:{closest:()=>({dataset:{action:'share-mission',id:'quiet-tea'}})}});
  assert.equal(element('#detail-dialog').open,false);
  const friends=element('#main').innerHTML;
  assert.match(friends,/id="share-text"[^>]*readonly/);
  assert.match(friends,/https:\/\/tamagochigit.github.io\/bureau-other-lives\/\?mission=quiet-tea#missions/);
  assert.match(friends,/Скопировать текст/);
  assert.doesNotMatch(friends,/Telegram|t\.me|friend-form|PRIVATE CONTACT|privatecontact/i);
  assert.ok(!friends.includes('PRIVATE NOTE'));
  assert.ok(!friends.includes('chat-message-form'));
  assert.deepEqual([...new Set(reads)],[STORAGE_KEY]);
  assert.equal(stored.get('other-lives:contacts:v1'),contacts);
  assert.equal(stored.get(STORAGE_KEY),saved);
  const nativeRequests=[];
  globalThis.window.BureauAndroid={postMessage:raw=>nativeRequests.push(JSON.parse(raw))};
  globalThis.location={search:'?mission=quiet-tea',hash:'#missions'};
  await import(appUrl+'?native-share');
  await handlers.click({target:{closest:()=>({dataset:{action:'share-mission',id:'quiet-tea'}})}});
  assert.deepEqual(nativeRequests,[{type:'share-mission',id:'quiet-tea'}]);
  assert.equal(element('#detail-dialog').open,true);
  assert.equal(globalThis.location.hash,'#missions');
  await handlers.click({target:{closest:()=>({dataset:{action:'settings'}})}});
  assert.doesNotMatch(element('#dialog-content').innerHTML,/chatgpt|прежнем сайте/i);
  element('#detail-dialog').close();
  delete globalThis.window.BureauAndroid;
  globalThis.location={search:'?mission=javascript:alert(1)&offer=unknown&join=old',hash:''};
  await import(appUrl+'?invalid-mission');
  assert.equal(element('#detail-dialog').open,false);
  assert.match(element('#main').innerHTML,/Удиви меня/);
  assert.doesNotMatch(element('#main').innerHTML,/home-time|home-place/);
});
