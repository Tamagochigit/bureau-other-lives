import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, decodeState, backup, emptyState, beginMission, completeMission } from '../dist/core.mjs';

// Lightweight event harness: tests application wiring, not layout or browser compatibility.
test('the real UI handlers connect selection, progress, reflection, diary and compass', async () => {
  const events = {}, windowEvents = {}, elements = new Map(), saved = new Map();
  let failStorage = false;
  class Element {
    constructor() { this.innerHTML=''; this.textContent=''; this.open=false; this.hidden=false; this.value=''; this.dataset={}; this.listeners={}; this.isConnected=true; this.classList={add(){},remove(){}}; }
    addEventListener(name, handler) { this.listeners[name]=handler; }
    showModal(){this.open=true;}
    close(){this.open=false;this.listeners.close?.();}
    focus(){}
    append(){}
    remove(){}
    click(){}
  }
  for (const id of ['navigation','settings-icon','page-label','storage-warning','main','toast','detail-dialog','feedback-dialog','dialog-content','feedback-content','backup-file','catalog-results','note-length']) elements.set('#'+id,new Element());
  const body = new Element();
  globalThis.document = { activeElement:null, body, querySelector:id => { assert.ok(elements.has(id),'Known test element: '+id); return elements.get(id); }, addEventListener:(name,handler) => { events[name]=handler; }, createElement:()=>new Element() };
  globalThis.location={hash:''};
  globalThis.window={scrollTo(){},confirm:()=>true,addEventListener:(name,handler)=>{windowEvents[name]=handler;}};
  globalThis.localStorage={getItem:key=>saved.get(key) || null,setItem:(key,value)=>{if(failStorage) throw new Error('quota');saved.set(key,value);}};
  globalThis.setTimeout=()=>0;
  globalThis.clearTimeout=()=>{};
  globalThis.FormData=class{constructor(form){this.values=form.values;}get(key){return this.values[key] ?? null;}};
  await import('../dist/app.mjs?ui-test');
  assert.match(elements.get('#main').innerHTML,/Что попробуем сегодня/);
  const click = (action,id,extra={}) => events.click({target:{closest:()=>({dataset:{action,id,...extra}})}});
  events.change({target:{id:'home-time',value:'10',matches:()=>false}});
  events.change({target:{id:'home-place',value:'home',matches:()=>false}});
  await click('surprise');
  assert.match(elements.get('#dialog-content').innerHTML,/10 минут/);
  assert.match(elements.get('#dialog-content').innerHTML,/Дома/);
  await click('close-detail');
  await click('mission','detail-hunter');
  assert.ok(elements.get('#detail-dialog').open);
  await click('begin','detail-hunter');
  events.change({target:{id:'',dataset:{step:'0'},matches:selector=>selector==='[data-step]'}});
  assert.deepEqual(decodeState(saved.get(STORAGE_KEY)).active.completedSteps,[0]);
  await click('feedback');
  assert.ok(elements.get('#feedback-dialog').open);
  events.submit({preventDefault(){},target:{id:'feedback-form',values:{rating:'5',repeat:'on',note:'<script>личная заметка</script>'}}});
  const diary=decodeState(saved.get(STORAGE_KEY));
  assert.equal(diary.entries.length,1);
  assert.equal(diary.entries[0].rating,5);
  assert.equal(diary.active,null);
  assert.match(elements.get('#main').innerHTML,/Дневник открытий/);
  assert.match(elements.get('#main').innerHTML,/&lt;script&gt;/);
  assert.ok(!elements.get('#main').innerHTML.includes('<script>личная'));
  await click('navigate',null,{view:'compass'});
  assert.match(elements.get('#main').innerHTML,/5,0/);
  await click('favorite','home-radio');
  assert.ok(decodeState(saved.get(STORAGE_KEY)).favorites.includes('home-radio'));
  await click('circle','first-times');
  assert.ok(decodeState(saved.get(STORAGE_KEY)).traditions.includes('first-times'));
  await click('navigate',null,{view:'missions'});
  await click('category','create');
  assert.match(elements.get('#main').innerHTML,/Радио на одну ночь/);
  assert.ok(!elements.get('#main').innerHTML.includes('data-id="detail-hunter"'));
  // A concurrent completed entry must survive a subsequent write from this tab.
  const other=completeMission(beginMission(emptyState(),'quiet-tea'),{rating:3,repeat:false,note:'Другая вкладка'},'2026-10-03T18:00:00Z','other-tab');
  const before=decodeState(saved.get(STORAGE_KEY));
  saved.set(STORAGE_KEY,JSON.stringify({...before,entries:[...before.entries,...other.entries]}));
  await click('favorite','quiet-tea');
  assert.ok(decodeState(saved.get(STORAGE_KEY)).entries.some(e=>e.id==='other-tab'));
  // Failed persistence must produce a visible warning, not a false save claim.
  failStorage=true;
  await click('favorite','sound-map');
  assert.equal(elements.get('#storage-warning').hidden,false);
  assert.match(elements.get('#storage-warning').innerHTML,/до закрытия страницы/);
  assert.ok(backup(decodeState(saved.get(STORAGE_KEY))).includes('Другая вкладка'));
});
