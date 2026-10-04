import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { handleSocialRequest } from '../server/social.mjs';
import { createFriendsController, renderMessages } from '../public/friends.mjs';

const migration=readdirSync(new URL('../drizzle/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort().map(n=>readFileSync(new URL('../drizzle/'+n,import.meta.url),'utf8')).join('\n');
const origin='https://bureau.test',baseTime=Date.parse('2026-10-04T10:00:00Z');
// Execute the real migration and query text. This adapter models D1 results and
// atomic batches; it does not substitute a hand-written in-memory chat model.
function database(t) {
  const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');sqlite.exec(migration);t.after(()=>sqlite.close());
  const db={sqlite,beforeExecute:null,prepare(sql){
    let values=[];
    const execute=kind=>{
      db.beforeExecute?.(sql,values,kind);
      const statement=sqlite.prepare(sql);
      if(kind==='first')return statement.get(...values) || null;
      if(kind==='all')return {results:statement.all(...values)};
      const result=statement.run(...values);return {meta:{changes:Number(result.changes)}};
    };
    return {bind(...v){values=v;return this;},first:async()=>execute('first'),all:async()=>execute('all'),run:async()=>execute('run'),execute};
  },async batch(statements){
    sqlite.exec('BEGIN');try{const results=statements.map(s=>s.execute('run'));sqlite.exec('COMMIT');return results;}catch(error){sqlite.exec('ROLLBACK');throw error;}
  }};
  return db;
}
async function call(db,user,path,body,options={}) {
  const headers={'oai-authenticated-user-full-name':encodeURIComponent(user==='alice'?'Аня':'Боря'),'oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8',...options.headers};
  if(user)headers['oai-authenticated-user-id']=user;
  if(body!==undefined){headers.Origin=options.origin || origin;headers['Content-Type']='application/json';}
  const response=await handleSocialRequest(new Request(origin+'/api/social/'+path,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body)}),{DB:db},{now:options.now ?? baseTime});
  return {status:response.status,headers:response.headers,data:await response.json()};
}
async function connect(db,a='alice',b='bob') {
  const invited=await call(db,a,'invites',{});assert.equal(invited.status,201);
  const token=new URL(invited.data.url).searchParams.get('join');
  const accepted=await call(db,b,'invites/accept',{token});assert.equal(accepted.status,200);
  return {id:accepted.data.id,token};
}
const message=(body,clientId='message-0001',missionId=null)=>({body,clientId,missionId});

test('chat requires Sites identity, same-origin writes and bounded JSON',async t=>{
  const db=database(t);
  assert.equal((await call(db,null,'me')).status,401);
  assert.equal((await call(db,'alice','profile',{name:'Имя'},{origin:'https://outsider.test'})).status,403);
  assert.equal((await call(db,'alice','profile',{name:'Имя'},{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  assert.equal((await call(db,'alice','profile',{name:'x'.repeat(9000)})).status,413);
  assert.equal((await call(db,'alice','profile',{name:'x'.repeat(41)})).status,422);
  assert.equal((await call(db,'alice','profile',{name:'Новое имя',id:'bob',senderId:'bob'})).status,200);
  assert.equal((await call(db,'alice','me')).data.name,'Новое имя');
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) AS n FROM social_users WHERE id=?').get('bob').n,0);
  assert.equal((await call(db,'alice','me')).headers.get('Cache-Control'),'private, no-store');
});

test('invites are hashed, expire, have one recipient and accept idempotently',async t=>{
  const db=database(t),invited=await call(db,'alice','invites',{}),token=new URL(invited.data.url).searchParams.get('join');
  const record=db.sqlite.prepare('SELECT * FROM social_invites').get();
  assert.notEqual(record.token_hash,token);assert.match(record.token_hash,/^[a-f0-9]{64}$/);
  assert.equal((await call(db,'alice','invites/accept',{token})).status,409);
  assert.equal((await call(db,'bob','invites/preview',{token})).data.name,'Аня');
  assert.equal((await call(db,'bob','invites/accept',{token})).status,200);
  assert.equal((await call(db,'bob','invites/accept',{token})).status,200);
  assert.equal((await call(db,'eve','invites/accept',{token})).status,409);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) AS n FROM social_friendships').get().n,1);
  const next=new URL((await call(db,'alice','invites',{})).data.url).searchParams.get('join');
  assert.equal((await call(db,'eve','invites/accept',{token:next},{now:baseTime+7*86400000})).status,410);
  const race=new URL((await call(db,'alice','invites',{})).data.url).searchParams.get('join');
  const results=await Promise.all(['charlie','dave'].map(user=>call(db,user,'invites/accept',{token:race})));
  assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
});

test('only participants can retrieve, send or read messages; reloads and retries preserve a single message',async t=>{
  const db=database(t),{id}=await connect(db),path='friends/'+id+'/messages';
  const sent=await call(db,'alice',path,{...message('Привет, друг!'),senderId:'eve'});assert.equal(sent.status,201);
  assert.equal((await call(db,'alice',path,message('Привет, друг!'))).status,200);
  assert.equal((await call(db,'alice',path,message('Другой текст'))).status,409);
  for(const body of [undefined,message('Чужое сообщение','intruder-0001')])assert.equal((await call(db,'eve',path,body)).status,404);
  assert.equal((await call(db,'eve','friends/'+id+'/read',{seq:999})).status,404);
  const reopened=await call(db,'bob',path);assert.equal(reopened.data.messages[0].body,'Привет, друг!');assert.equal(reopened.data.messages[0].mine,false);
  assert.deepEqual(Object.keys(reopened.data.messages[0]).sort(),['body','createdAt','mine','missionId','missionTitle','seq']);
  assert.equal(db.sqlite.prepare('SELECT sender_id FROM social_messages').get().sender_id,'alice');
  assert.equal((await call(db,'bob','friends')).data.friends[0].unread,1);
  assert.equal((await call(db,'bob','friends/'+id+'/read',{seq:999})).status,200);
  assert.equal((await call(db,'bob','friends')).data.friends[0].unread,0);
  await call(db,'bob','friends/'+id+'/read',{seq:0});
  assert.equal((await call(db,'bob','friends')).data.friends[0].unread,0);
  assert.deepEqual((await call(db,'bob',path+'?after='+sent.data.message.seq)).data.messages,[]);
  assert.equal((await call(db,'bob',path+'?after=-1')).status,422);
});

test('blocking closes reads and sends, including a block between membership check and history query',async t=>{
  const db=database(t),{id}=await connect(db),path='friends/'+id+'/messages';
  await call(db,'alice',path,message('Личный разговор'));
  assert.equal((await call(db,'bob','friends/'+id+'/block',{blocked:true})).status,200);
  assert.equal((await call(db,'alice',path)).status,404);
  assert.equal((await call(db,'bob',path)).status,404);
  assert.equal((await call(db,'alice',path,message('Новое','message-0002'))).status,404);
  assert.equal((await call(db,'alice','friends/'+id+'/block',{blocked:false})).status,404);
  assert.deepEqual((await call(db,'alice','friends')).data.friends,[]);
  assert.equal((await call(db,'bob','friends')).data.friends[0].blockedByMe,true);
  await call(db,'bob','friends/'+id+'/block',{blocked:false});
  assert.equal((await call(db,'alice',path)).data.messages.length,1);
  db.beforeExecute=sql=>{
    if(sql.startsWith('SELECT * FROM social_messages WHERE friendship_id=? AND EXISTS')){
      db.beforeExecute=null;db.sqlite.prepare('UPDATE social_friendships SET blocked_by=? WHERE id=?').run('bob',id);
    }
  };
  assert.deepEqual((await call(db,'alice',path)).data.messages,[]);
});

test('message limits, pagination and mission cards use real catalog titles',async t=>{
  const db=database(t),{id}=await connect(db),path='friends/'+id+'/messages';
  assert.equal((await call(db,'alice',path,message('x'.repeat(2001)))).status,422);
  assert.equal((await call(db,'alice',path,message('','empty-0001'))).status,422);
  assert.equal((await call(db,'alice',path,message('','mission-001','unknown'))).status,422);
  const shared=await call(db,'alice',path,message('','mission-001','quiet-tea'));assert.equal(shared.status,201);assert.ok(shared.data.message.missionTitle);
  for(let i=0;i<29;i++)assert.equal((await call(db,'alice',path,message('Сообщение '+i,'message-'+i.toString().padStart(4,'0')))).status,201);
  assert.equal((await call(db,'alice',path,message('Лимит','rate-test-01'))).status,429);
  for(let i=30;i<60;i++)await call(db,'alice',path,message('Сообщение '+i,'message-'+i),{now:baseTime+60001});
  const recent=(await call(db,'bob',path)).data;assert.equal(recent.messages.length,50);assert.equal(recent.hasMore,true);
  const older=(await call(db,'bob',path+'?before='+recent.messages[0].seq)).data;assert.equal(older.messages.length,10);
  assert.ok(older.messages.at(-1).seq<recent.messages[0].seq);
  for(let i=1;i<20;i++)assert.equal((await call(db,'alice','invites',{})).status,201);
  assert.equal((await call(db,'alice','invites',{})).status,429);
});

test('chat renders user text as text, including names and retired mission titles',()=>{
  const html=renderMessages([{seq:1,body:'<img src=x onerror=alert(1)>',mine:false,createdAt:baseTime,missionId:'retired',missionTitle:'<script>title</script>'}],'<svg onload=alert(1)>');
  assert.ok(!html.includes('<img'));assert.ok(!html.includes('<svg'));assert.ok(!html.includes('<script>'));
  assert.match(html,/&lt;img/);assert.match(html,/&lt;svg/);assert.match(html,/&lt;script/);
});

test('the chat controller preserves per-friend drafts and retries without duplicate sends',async t=>{
  const db=database(t),first=await connect(db),second=await connect(db,'alice','charlie');
  const originals=Object.fromEntries(['document','location','window','fetch','FormData','setTimeout','clearTimeout'].map(k=>[k,globalThis[k]]));
  t.after(()=>Object.assign(globalThis,originals));
  const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
  let field=null,html='',failReply=false,requests=[];
  const historyPane={innerHTML:'',scrollHeight:100,scrollTop:0,clientHeight:100};
  const root={querySelector(selector){return selector==='#chat-message'?field:selector==='#chat-history'?historyPane:null;},get innerHTML(){return html;},set innerHTML(value){html=value;const match=value.match(/<textarea[^>]*data-thread="([^"]+)"[^>]*>([\s\S]*?)<\/textarea>/);field=match?{id:'chat-message',dataset:{thread:match[1]},value:decode(match[2]),focus(){},setSelectionRange(){}}:null;}};
  globalThis.document={hidden:false,activeElement:null,querySelector:()=>root,addEventListener(){}};
  globalThis.location={search:'',href:origin+'/#friends'};globalThis.window={confirm:()=>true};
  globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};
  globalThis.FormData=class{constructor(form){this.form=form;}get(key){return this.form.values[key];}};
  globalThis.fetch=async(path,options)=>{
    const body=options.body===undefined?undefined:JSON.parse(options.body),route=path.replace('/api/social/','');
    const result=await call(db,'alice',route,body);requests.push({route,body});
    if(failReply && body?.clientId){failReply=false;throw new TypeError('Ответ потерян');}
    return new Response(JSON.stringify(result.data),{status:result.status,headers:result.headers});
  };
  const controller=createFriendsController({toast(){}});await controller.mount();
  await controller.handleAction('chat-open',first.id);field.value='Черновик для Бори';controller.input(field);
  await controller.handleAction('chat-back');await controller.handleAction('chat-open',second.id);assert.equal(field.value,'');
  field.value='Для другого друга';controller.input(field);
  await controller.handleAction('chat-back');await controller.handleAction('chat-open',first.id);assert.equal(field.value,'Черновик для Бори');
  failReply=true;await controller.submit({id:'chat-message-form',values:{message:field.value}});assert.equal(field.value,'Черновик для Бори');
  await controller.submit({id:'chat-message-form',values:{message:field.value}});assert.equal(field.value,'');
  const sends=requests.filter(r=>r.body?.clientId);assert.equal(sends[0].body.clientId,sends[1].body.clientId);
  assert.equal((await call(db,'bob','friends/'+first.id+'/messages')).data.messages.length,1);
  assert.ok(requests.every(r=>!('note' in (r.body || {})) && !('entries' in (r.body || {}))));
  controller.leave();
});
