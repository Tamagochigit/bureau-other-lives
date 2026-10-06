import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../public/data.mjs';
import { missionDraft, missionLink, missionShareData, incomingLinks } from '../public/links.mjs';
import { createMissionSharing } from '../public/sharing.mjs';
import { createFriendsController } from '../public/friends.mjs';

function harness(options={}) {
  const shown=[],messages=[];
  const sharing=createMissionSharing({navigator:{},toast:text=>messages.push(text),showText:id=>shown.push(id),...options});
  return {sharing,shown,messages};
}

test('public mission links and payloads retain the standalone deep link and reject untrusted input',()=>{
  for(const mission of MISSIONS) {
    const data=missionShareData(mission.id),url=new URL(data.url);
    assert.deepEqual(Object.keys(data).sort(),['text','title','url']);
    assert.equal(data.title,mission.title);
    assert.equal(url.origin,'https://tamagochigit.github.io');
    assert.equal(url.pathname,'/bureau-other-lives/');
    assert.equal(url.searchParams.get('mission'),mission.id);
    assert.equal(url.hash,'#missions');
    assert.equal(missionDraft(mission.id),data.text+'\n'+data.url);
    assert.equal(incomingLinks(url.search).mission,mission.id);
  }
  for(const input of ['unknown','https://evil.example','javascript:alert(1)',{id:'quiet-tea',note:'PRIVATE NOTE'}]) {
    assert.equal(missionShareData(input),null);
    assert.equal(missionLink(input),'');
    assert.equal(missionDraft(input),'');
  }
  assert.equal(incomingLinks('?mission=unknown&join=old').mission,'');
});

test('Android receives only a catalog id without invoking browser share or clipboard',async()=>{
  const calls=[];
  const {sharing,shown,messages}=harness({android:{shareMission:id=>calls.push(id)},navigator:{share:()=>assert.fail('Use native chooser'),clipboard:{writeText:()=>assert.fail('No automatic copy')}}});
  assert.equal(await sharing.share('quiet-tea'),'opened');
  assert.deepEqual(calls,['quiet-tea']);
  assert.deepEqual(shown,[]);assert.deepEqual(messages,[]);
});

test('Web Share receives only the public title, invitation and canonical link',async()=>{
  const calls=[];
  const {sharing,shown,messages}=harness({navigator:{share:async data=>calls.push(data)}});
  assert.equal(await sharing.share('quiet-tea'),'completed');
  assert.deepEqual(calls,[missionShareData('quiet-tea')]);
  assert.deepEqual(shown,[]);assert.deepEqual(messages,[]);
});

test('canceling Web Share does not copy, navigate or claim delivery',async()=>{
  const {sharing,shown,messages}=harness({navigator:{share:async()=>{throw Object.assign(new Error('Canceled'),{name:'AbortError'});},clipboard:{writeText:()=>assert.fail('Cancel is not permission to copy')}}});
  assert.equal(await sharing.share('quiet-tea'),'canceled');
  assert.deepEqual(shown,[]);assert.deepEqual(messages,[]);
});

test('a failed share offers selectable text instead of silently transferring it elsewhere',async()=>{
  const {sharing,shown,messages}=harness({navigator:{share:async()=>{throw new Error('Unavailable');},clipboard:{writeText:()=>assert.fail('Offer explicit copy after a failed share')}}});
  assert.equal(await sharing.share('quiet-tea'),'fallback');
  assert.deepEqual(shown,['quiet-tea']);assert.equal(messages.length,1);
});

test('clipboard fallback confirms only a successful copy and preserves selectable text on denial',async()=>{
  const copied=[];
  const {sharing,shown,messages}=harness({navigator:{clipboard:{writeText:async text=>copied.push(text)}}});
  assert.equal(await sharing.share('quiet-tea'),'copied');
  assert.deepEqual(copied,[missionDraft('quiet-tea')]);
  assert.deepEqual(shown,[]);assert.match(messages[0],/скопирована/);
  const denied=harness({navigator:{clipboard:{writeText:async()=>{throw new Error('Denied');}}}});
  assert.equal(await denied.sharing.copy('quiet-tea'),'fallback');
  assert.deepEqual(denied.shown,['quiet-tea']);assert.doesNotMatch(denied.messages[0],/скопирована/);
});

test('unknown mission ids do not invoke native, browser, clipboard or fallback capabilities',async()=>{
  const {sharing,shown,messages}=harness({android:{shareMission:()=>assert.fail('Unknown native id')},navigator:{share:()=>assert.fail('Unknown share'),clipboard:{writeText:()=>assert.fail('Unknown copy')}}});
  for(const id of ['unknown','PRIVATE NOTE',{id:'quiet-tea',note:'PRIVATE NOTE'}]) {
    assert.equal(await sharing.share(id),'invalid');
    assert.equal(await sharing.copy(id),'invalid');
  }
  assert.deepEqual(shown,[]);assert.deepEqual(messages,[]);
});

test('Friends contains public ideas and a readonly fallback without requesting any contact or diary data',t=>{
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get:()=>assert.fail('Friends has no storage access')});
  t.after(()=>{if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else delete globalThis.localStorage;});
  const friends=createFriendsController();
  assert.doesNotMatch(friends.page(),/textarea|friend-form|username|t\.me|Telegram/i);
  friends.prepareMission('quiet-tea');
  assert.match(friends.page(),/id="share-text"[^>]*readonly/);
  assert.match(friends.page(),/mission=quiet-tea#missions/);
  assert.doesNotMatch(friends.page(),/name="(?:name|username)"|friend-form|Telegram/i);
  friends.prepareMission('unknown');
  assert.doesNotMatch(friends.page(),/id="share-text"/);
});
