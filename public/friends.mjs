import { MISSIONS } from './data.mjs';
import { escapeHtml as e } from './core.mjs';

const dateTime=value=>new Date(value).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
export function renderMessages(messages,friendName) {
  return messages.map(m=>`<article class="chat-message ${m.mine?'mine':''}"><div class="chat-message-meta">${e(m.mine?'Ты':friendName)} · <time datetime="${e(new Date(m.createdAt).toISOString())}">${e(dateTime(m.createdAt))}</time></div>${m.body?'<p>'+e(m.body)+'</p>':''}${m.missionId?'<div class="chat-shared">'+(MISSIONS.some(x=>x.id===m.missionId)?'<button class="text-button" data-action="mission" data-id="'+e(m.missionId)+'">'+e(m.missionTitle)+' — открыть миссию</button>':'<p>'+e(m.missionTitle)+'</p>')+'</div>':''}</article>`).join('');
}
export function createFriendsController({toast}) {
  let active=false, profile=null, contacts=[], selected=null, messages=[], loading=false, sending=false, error='', authError=false, inviteUrl='', pendingMission=null, olderAvailable=false, timer=null;
  let joinToken=new URLSearchParams(location.search || '').get('join') || '', inviter='';
  const drafts=new Map(),attempts=new Map();
  const root=()=>document.querySelector('#friends-root');
  const friend=()=>contacts.find(c=>c.id===selected);
  async function api(path,body) {
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
    try {
      const response=await fetch('/api/social/'+path,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
      if(!response.headers.get('Content-Type')?.includes('application/json')) {const err=new Error('Войди через ChatGPT, чтобы открыть чат.');err.status=401;throw err;}
      const data=await response.json();
      if(!response.ok){const err=new Error(data.error || 'Не удалось выполнить действие.');err.status=response.status;throw err;}
      return data;
    } catch(err) {
      if(err.name==='AbortError')throw new Error('Ответ задерживается. Сообщение осталось в поле — попробуй ещё раз.');
      throw err;
    } finally { clearTimeout(timeout); }
  }
  function failure(err) {error=err.message || 'Нет связи с чатом. Попробуй ещё раз.';authError=err.status===401;}
  function capture() {const field=root()?.querySelector('#chat-message');if(field?.dataset.thread)drafts.set(field.dataset.thread,field.value);}
  function merge(next) {const items=new Map(messages.map(m=>[m.seq,m]));for(const m of next)items.set(m.seq,m);messages=[...items.values()].sort((a,b)=>a.seq-b.seq);}
  function signInLink() {const returnTo='/?'+(joinToken?'join='+encodeURIComponent(joinToken):'')+'#friends';return '/signin-with-chatgpt?return_to='+encodeURIComponent(returnTo);}
  function clearJoin() {joinToken='';inviter='';const url=new URL(location.href);url.searchParams.delete('join');history.replaceState(null,'',url.pathname+url.search+url.hash);}
  function statusContent() {return error?'<p>'+e(error)+'</p>'+(authError?'<a class="button button-dark" href="'+e(signInLink())+'" target="_top">Войти через ChatGPT</a>':'<button class="text-button" data-action="chat-retry">Повторить</button>'):'';}
  function status() {return `<div class="chat-status" id="chat-status" role="status">${statusContent()}</div>`;}
  function html() {
    if(!profile)return `<section class="chat-panel">${loading?'<p>Загружаю чат…</p>':status()}</section>`;
    const current=friend(),available=contacts.filter(c=>!c.blockedByMe),blocked=contacts.filter(c=>c.blockedByMe);
    if(current && !current.blockedByMe) return `<section class="chat-panel"><header class="chat-heading"><button class="text-button" data-action="chat-back">← Друзья</button><h2>${e(current.name)}</h2><details class="chat-options"><summary>Действия</summary><button class="text-button" data-action="chat-block" data-id="${e(current.id)}">Заблокировать</button></details></header>${status()}<button class="text-button" id="chat-older" data-action="chat-older" ${olderAvailable?'':'hidden'}>Показать раньше</button><div class="chat-history" id="chat-history" role="log" aria-label="Сообщения" aria-live="polite" aria-relevant="additions">${messages.length?renderMessages(messages,current.name):'<p class="chat-empty">Здесь начнётся ваш разговор.</p>'}</div><form id="chat-message-form" class="chat-compose">${pendingMission?'<div class="chat-pending"><p>Предложить миссию: <strong>'+e(pendingMission.title)+'</strong></p><button type="button" class="text-button" data-action="chat-cancel-share">Убрать</button></div>':''}<label for="chat-message">Сообщение</label><textarea id="chat-message" data-thread="${e(selected)}" name="message" rows="3" maxlength="2000" ${pendingMission?'':'required'} placeholder="Напиши другу…">${e(drafts.get(selected)||'')}</textarea><button class="button button-orange" type="submit" ${sending?'disabled':''}>${sending?'Отправляю…':'Отправить'}</button><p class="chat-hint">Дневник остаётся личным. В чат отправляется только то, что ты выбрал.</p></form></section>`;
    return `<section class="chat-panel">${status()}${joinToken?'<div class="chat-invite-card"><p>'+(inviter?'<strong>'+e(inviter)+'</strong> предлагает добавить друг друга.':'Проверяю приглашение…')+'</p>'+(inviter?'<button class="button button-dark" data-action="chat-accept">Добавить друга</button>':'')+'<button class="text-button" data-action="chat-dismiss">Закрыть приглашение</button></div>':''}${pendingMission?'<p class="chat-pending">Выбери друга для миссии «'+e(pendingMission.title)+'».</p>':''}<button class="button button-orange" data-action="chat-invite">Пригласить друга</button>${inviteUrl?'<div class="chat-link"><label for="chat-invite-url">Ссылка для одного друга · 7 дней</label><input id="chat-invite-url" value="'+e(inviteUrl)+'" readonly><button class="text-button" data-action="chat-copy">Скопировать ссылку</button><p class="chat-hint">Другу нужен доступ к приложению и вход через ChatGPT.</p></div>':''}<div class="chat-contacts">${available.length?available.map(c=>'<button class="chat-contact" data-action="chat-open" data-id="'+e(c.id)+'"><span><strong>'+e(c.name)+'</strong><small>'+e(c.lastBody.slice(0,90)||'Начать разговор')+'</small></span>'+(c.unread?'<span class="chat-unread" aria-label="Непрочитанных: '+c.unread+'">'+c.unread+'</span>':'')+'</button>').join(''):'<p class="chat-empty">Передай ссылку другу. После принятия приглашения он появится здесь.</p>'}</div><details class="chat-profile"><summary>Моё имя: ${e(profile.name)}</summary><form id="chat-profile-form"><label for="chat-name">Как тебя видят друзья</label><input id="chat-name" name="name" value="${e(profile.name)}" minlength="1" maxlength="40" required><button class="button button-outline" type="submit">Сохранить имя</button></form></details>${blocked.length?'<details class="chat-profile"><summary>Заблокированные · '+blocked.length+'</summary>'+blocked.map(c=>'<div class="chat-blocked"><strong>'+e(c.name)+'</strong><button class="text-button" data-action="chat-unblock" data-id="'+e(c.id)+'">Разблокировать</button></div>').join('')+'</details>':''}</section>`;
  }
  function paint() {
    if(!active)return;const element=root();if(!element)return;
    capture();const previousField=element.querySelector('#chat-message'),focused=previousField && document.activeElement===previousField;
    const start=previousField?.selectionStart,end=previousField?.selectionEnd;
    element.innerHTML=html();
    if(focused){const field=element.querySelector('#chat-message');field?.focus({preventScroll:true});field?.setSelectionRange(start,end);}
  }
  function paintMessages(forceBottom=false) {
    if(!active)return;const pane=root()?.querySelector('#chat-history');if(!pane)return;
    const bottom=forceBottom || pane.scrollHeight-pane.scrollTop-pane.clientHeight<100;
    const value=messages.length?renderMessages(messages,friend()?.name || 'Друг'):'<p class="chat-empty">Здесь начнётся ваш разговор.</p>';
    if(pane.innerHTML!==value)pane.innerHTML=value;
    if(bottom)pane.scrollTop=pane.scrollHeight;
    const older=root()?.querySelector('#chat-older');if(older)older.hidden=!olderAvailable;
    if(bottom && !document.hidden && messages.length)api('friends/'+selected+'/read',{seq:messages.at(-1).seq}).catch(()=>{});
  }
  async function loadContacts() {contacts=(await api('friends')).friends;if(selected && !contacts.some(c=>c.id===selected && !c.blockedByMe)){selected=null;messages=[];}}
  async function loadMessages(initial=false) {
    if(!selected)return;
    const thread=selected,data=await api('friends/'+thread+'/messages'+(initial?'':'?after='+(messages.at(-1)?.seq || 0)));
    if(thread!==selected || !active)return;
    if(initial){messages=data.messages;olderAvailable=data.hasMore;}else merge(data.messages);
    paintMessages(initial);
  }
  function schedule() {clearTimeout(timer);if(!active || document.hidden)return;timer=setTimeout(poll,selected?5000:15000);}
  async function poll() {
    if(!active || document.hidden)return;
    try {
      if(selected)await loadMessages();else {await loadContacts();if(!root()?.querySelector('.chat-profile[open]'))paint();}
      if(error){error='';authError=false;const node=root()?.querySelector('#chat-status');if(node)node.innerHTML='';}
    } catch(err){if(err.status===404 && selected){await loadContacts().catch(()=>{});paint();}failure(err);const node=root()?.querySelector('#chat-status');if(node)node.innerHTML=statusContent();}
    schedule();
  }
  async function mount() {
    active=true;paint();
    if(loading)return;
    loading=true;error='';paint();
    try {
      if(!profile)profile=await api('me');
      await loadContacts();
      if(joinToken && !inviter)inviter=(await api('invites/preview',{token:joinToken})).name;
      paint();if(selected)await loadMessages(true);
    }catch(err){failure(err);}finally{loading=false;paint();paintMessages(true);schedule();}
  }
  function leave() {capture();active=false;clearTimeout(timer);}
  async function handleAction(action,id) {
    capture();error='';authError=false;
    try {
      if(action==='chat-open') {selected=id;messages=[];paint();await loadMessages(true);}
      if(action==='chat-back') {selected=null;messages=[];await loadContacts();paint();}
      if(action==='chat-invite') {inviteUrl=(await api('invites',{})).url;paint();}
      if(action==='chat-copy') {
        try{await navigator.clipboard.writeText(inviteUrl);toast('Ссылка скопирована.');}
        catch{const field=root()?.querySelector('#chat-invite-url');field?.focus();field?.select();toast('Ссылка выделена — скопируй её через меню браузера.');}
      }
      if(action==='chat-accept') {const result=await api('invites/accept',{token:joinToken});clearJoin();await loadContacts();selected=result.id;messages=[];paint();await loadMessages(true);}
      if(action==='chat-dismiss') {clearJoin();paint();}
      if(action==='chat-block' && window.confirm('Заблокировать друга? Он не сможет писать тебе до разблокировки.')) {await api('friends/'+id+'/block',{blocked:true});selected=null;messages=[];await loadContacts();paint();}
      if(action==='chat-unblock') {await api('friends/'+id+'/block',{blocked:false});await loadContacts();paint();}
      if(action==='chat-cancel-share') {pendingMission=null;paint();}
      if(action==='chat-older' && messages.length) {const thread=selected,pane=root()?.querySelector('#chat-history'),height=pane?.scrollHeight || 0,data=await api('friends/'+thread+'/messages?before='+messages[0].seq);if(thread===selected){merge(data.messages);olderAvailable=data.hasMore;paintMessages();if(pane)pane.scrollTop+=pane.scrollHeight-height;}}
      if(action==='chat-retry') await mount();
    }catch(err){failure(err);paint();}finally{schedule();}
  }
  async function submit(form) {
    if(form.id==='chat-profile-form') {
      try{profile=await api('profile',{name:String(new FormData(form).get('name') || '')});error='';paint();toast('Имя сохранено.');}catch(err){failure(err);paint();}
      return;
    }
    if(form.id!=='chat-message-form' || !selected || sending)return;
    const thread=selected,text=String(new FormData(form).get('message') || '').trim(),missionId=pendingMission?.id || null;
    if(!text && !missionId)return;
    const previous=attempts.get(thread),attempt=previous && previous.body===text && previous.missionId===missionId?previous:{body:text,missionId,clientId:crypto.randomUUID()};
    attempts.set(thread,attempt);drafts.set(thread,text);sending=true;error='';paint();
    try {
      const result=await api('friends/'+thread+'/messages',attempt);
      attempts.delete(thread);
      const field=root()?.querySelector('#chat-message');
      if(field?.dataset.thread===thread && field.value.trim()===text)field.value='';
      if((drafts.get(thread)||'').trim()===text)drafts.delete(thread);
      sending=false;
      if(thread===selected){if(pendingMission?.id===missionId)pendingMission=null;merge([result.message]);}
      paint();if(thread===selected)paintMessages(true);
    }catch(err){failure(err);sending=false;paint();}finally{sending=false;schedule();}
  }
  function input(target) {if(target.id==='chat-message' && selected)drafts.set(selected,target.value);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else if(active)poll();});
  return {page:()=>'<div id="friends-root"></div>',mount,leave,handleAction,submit,input,prepareMission:id=>{pendingMission=MISSIONS.find(m=>m.id===id) || null;},hasInvite:()=>Boolean(joinToken)};
}
