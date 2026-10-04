import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildPages } from '../scripts/build-pages.mjs';
import { incomingLinks, chatLink, missionLink } from '../public/links.mjs';
import { renderMessages } from '../public/friends.mjs';
import { STORAGE_KEY, emptyState, beginMission, completeMission } from '../public/core.mjs';

test('Pages emits a complete relative asset graph and excludes server/project files', async t => {
  const output = await mkdtemp(join(tmpdir(), 'bureau-pages-'));
  t.after(() => rm(output, { recursive: true, force: true }));
  await buildPages(output);
  const files = await readdir(output);
  assert.equal(files.length, 15);
  assert.ok(files.includes('.nojekyll'));
  assert.ok(!files.some(file => /AGENTS|server|schema|hosting|\.mjs$/.test(file)));
  const base = new URL('https://tamagochigit.github.io/bureau-other-lives/');
  const references = [];
  for (const file of files) {
    const content = await readFile(join(output, file), 'utf8');
    if (file.endsWith('.js')) {
      for (const match of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) references.push(match[1]);
    }
    if (file === 'index.html') {
      assert.match(content, /src="\.\/app\.js"/);
      for (const match of content.matchAll(/(?:src|href)="([^"#]+)"/g)) references.push(match[1]);
    }
  }
  const manifest = JSON.parse(await readFile(join(output, 'manifest.webmanifest'), 'utf8'));
  references.push(...manifest.icons.map(icon => icon.src));
  assert.equal(manifest.start_url, './#home');
  assert.equal(manifest.scope, './');
  for (const reference of references) {
    assert.ok(reference.startsWith('./'), reference);
    assert.ok(new URL(reference, base).pathname.startsWith('/bureau-other-lives/'));
    await stat(join(output, reference));
  }
});

test('links accept catalog missions and one-use invite tokens, never an arbitrary destination', () => {
  const token = 'a'.repeat(48);
  assert.deepEqual(incomingLinks('?mission=quiet-tea&offer=home-radio&join=' + token), {mission:'quiet-tea', offer:'home-radio', join:token});
  assert.deepEqual(incomingLinks('?mission=retired&offer=https://bad.invalid/&join=%22onclick%3D'), {mission:'', offer:'', join:''});
  const chat = new URL(chatLink({ offer:'quiet-tea', join:token }));
  assert.equal(chat.origin, 'https://bureau-of-other-lives.neurozona.chatgpt.site');
  assert.equal(chat.searchParams.get('offer'), 'quiet-tea');
  assert.equal(chat.hash, '#friends');
  assert.equal(new URL(chatLink({ offer:'javascript:alert(1)', join:'secret' })).search, '');
  assert.equal(missionLink('retired'), '');
  const card = renderMessages([{body:'',mine:true,createdAt:'2026-10-04T12:00:00Z',missionId:'quiet-tea',missionTitle:'<script>title</script>'}], 'Друг');
  assert.match(card, /https:\/\/tamagochigit.github.io\/bureau-other-lives\/\?mission=quiet-tea#missions/);
  assert.ok(!card.includes('<script>'));
});

test('the built Pages app opens a shared mission without starting it or calling the chat API', async t => {
  const output = await mkdtemp(join(tmpdir(), 'bureau-pages-ui-'));
  t.after(() => rm(output, { recursive: true, force: true }));
  const keys = ['document','location','window','localStorage','setTimeout','clearTimeout','fetch'];
  const originals = Object.fromEntries(keys.map(key => [key,globalThis[key]]));
  t.after(() => Object.assign(globalThis, originals));
  await buildPages(output);
  const handlers = {}, elements = new Map();
  class Element {
    constructor() { this.innerHTML='';this.textContent='';this.open=false;this.hidden=false;this.listeners={};this.classList={add(){},remove(){}}; }
    addEventListener(name, handler) { this.listeners[name]=handler; }
    showModal() { this.open=true; }
    close() { this.open=false;this.listeners.close?.(); }
  }
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector,new Element());
    return elements.get(selector);
  };
  globalThis.document = {activeElement:null,body:new Element(),querySelector:element,addEventListener:(name,handler) => {handlers[name]=handler;}};
  globalThis.window = {addEventListener(){},scrollTo(){}};
  globalThis.location = {search:'?mission=quiet-tea',hash:'#missions'};
  const diary = completeMission(beginMission(emptyState(),'detail-hunter'),{rating:4,repeat:false,note:'PRIVATE NOTE'},'2026-10-04T11:00:00Z','saved-note');
  const saved = JSON.stringify(diary);
  globalThis.localStorage = {getItem:key => key === STORAGE_KEY ? saved : null,setItem() {assert.fail('A deep link must not change diary state');}};
  globalThis.setTimeout = () => 0;globalThis.clearTimeout = () => {};
  globalThis.fetch = () => assert.fail('Pages must not call a private cross-origin or missing social API');
  const appUrl = pathToFileURL(join(output, 'app.js')).href;
  await import(appUrl + '?shared-mission');
  assert.equal(element('#detail-dialog').open, true);
  assert.match(element('#dialog-content').innerHTML, /data-id="quiet-tea"/);
  await handlers.click({target:{closest:() => ({dataset:{action:'chat-share',id:'quiet-tea'}})}});
  assert.equal(element('#detail-dialog').open, false);
  const friends = element('#main').innerHTML;
  assert.match(friends, /offer=quiet-tea#friends/);
  assert.ok(!friends.includes('PRIVATE NOTE'));
  assert.ok(!friends.includes('chat-message-form'));
  await handlers.click({target:{closest:() => ({dataset:{action:'settings'}})}});
  assert.match(element('#dialog-content').innerHTML, /Дневник с прежнего адреса/);
  element('#detail-dialog').close();
  globalThis.location = {search:'?mission=javascript:alert(1)&offer=unknown',hash:''};
  await import(appUrl + '?invalid-mission');
  assert.equal(element('#detail-dialog').open, false);
  assert.match(element('#main').innerHTML, /Что попробуем сегодня/);
});
