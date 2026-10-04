import { MISSIONS } from '../public/data.mjs';

const missionMap = new Map(MISSIONS.map(m => [m.id,m]));
const MAX_BODY_BYTES=8192, MAX_MESSAGE=2000, INVITE_TTL=7*24*60*60*1000;
const clientIdPattern=/^[a-zA-Z0-9_-]{8,80}$/;
const tokenPattern=/^[a-f0-9]{48}$/;
const securityHeaders={ 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer' };
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,message)=>{throw new HttpError(status,message);};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:securityHeaders});
const first=(db,sql,...values)=>db.prepare(sql).bind(...values).first();
const run=(db,sql,...values)=>db.prepare(sql).bind(...values).run();
const all=async(db,sql,...values)=>(await db.prepare(sql).bind(...values).all()).results;

export function requestIdentity(request) {
  const id=request.headers.get('oai-authenticated-user-id');
  if(!id || id.length>200) fail(401,'Войди через ChatGPT, чтобы общаться с друзьями.');
  let name=request.headers.get('oai-authenticated-user-full-name') || '';
  if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8') {
    try{name=decodeURIComponent(name);}catch{name='';}
  }
  name=name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,40) || 'Участник';
  return {id,name};
}
async function readJson(request) {
  const origin=new URL(request.url).origin;
  if(request.headers.get('Origin')!==origin || request.headers.get('Sec-Fetch-Site')==='cross-site') fail(403,'Открой приложение и повтори действие.');
  if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) fail(415,'Нужен запрос JSON.');
  if(Number(request.headers.get('Content-Length'))>MAX_BODY_BYTES) fail(413,'Слишком большой запрос.');
  const reader=request.body?.getReader();
  if(!reader) fail(400,'Пустой запрос.');
  const decoder=new TextDecoder();let size=0,text='';
  while(true) {
    const {done,value}=await reader.read();if(done)break;
    size+=value.byteLength;
    if(size>MAX_BODY_BYTES){await reader.cancel();fail(413,'Слишком большой запрос.');}
    text+=decoder.decode(value,{stream:true});
  }
  text+=decoder.decode();
  let value;try{value=JSON.parse(text);}catch{fail(400,'Не удалось прочитать запрос.');}
  if(!value || typeof value!=='object' || Array.isArray(value))fail(400,'Не удалось прочитать запрос.');
  return value;
}
const ensureProfile=async(db,user,now)=>{
  await run(db,'INSERT INTO social_users(id,name,created_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING',user.id,user.name,now);
  return first(db,'SELECT name FROM social_users WHERE id=?',user.id);
};
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const newToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,'0')).join('');
async function inviteRecord(db,token,now,userId) {
  if(typeof token!=='string' || !tokenPattern.test(token))fail(404,'Приглашение не найдено.');
  const hash=await digest(token);
  const invite=await first(db,'SELECT i.*,u.name AS inviter_name FROM social_invites i JOIN social_users u ON u.id=i.created_by WHERE token_hash=?',hash);
  if(!invite)fail(404,'Приглашение не найдено.');
  if(invite.expires_at<=now)fail(410,'Срок приглашения истёк. Попроси новую ссылку.');
  if(invite.created_by===userId)fail(409,'Это твоя ссылка. Передай её другу.');
  if(invite.claimed_by && invite.claimed_by!==userId)fail(409,'Это приглашение уже использовано.');
  return invite;
}
async function friendship(db,id,userId,allowOwnBlock=false) {
  if(typeof id!=='string' || !/^[a-f0-9-]{36}$/.test(id))fail(404,'Диалог не найден.');
  const row=await first(db,'SELECT * FROM social_friendships WHERE id=? AND (left_id=? OR right_id=?)',id,userId,userId);
  if(!row || (row.blocked_by && !(allowOwnBlock && row.blocked_by===userId)))fail(404,'Диалог недоступен.');
  return row;
}
const publicMessage=(row,userId)=>({seq:row.seq,body:row.body,missionId:row.mission_id,missionTitle:row.mission_title,createdAt:row.created_at,mine:row.sender_id===userId});
const positiveInteger=(value,max=Number.MAX_SAFE_INTEGER)=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<0||n>max)fail(422,'Неверный номер сообщения.');return n;};

export async function handleSocialRequest(request,env,{now=Date.now()}={}) {
  try {
    const url=new URL(request.url), path=url.pathname.replace(/^\/api\/social\/?/,'').split('/').filter(Boolean), method=request.method;
    const db=env.DB;
    if(!db)fail(503,'Чат пока недоступен. Попробуй позже.');
    if(method==='GET' && path.join('/')==='health') {
      const row=await first(db,"SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table' AND name IN('social_users','social_invites','social_friendships','social_messages')");
      if(row?.count!==4)fail(503,'Чат пока недоступен.');
      return json({ok:true});
    }
    const user=requestIdentity(request);
    const body=method==='POST'?await readJson(request):null;
    if(method==='GET' && path.join('/')==='me') {
      const profile=await ensureProfile(db,user,now);return json({name:profile.name});
    }
    if(method==='POST' && path.join('/')==='profile') {
      const name=body.name;
      if(typeof name!=='string' || !name.trim() || name.trim().length>40 || /[\u0000-\u001f\u007f]/.test(name))fail(422,'Имя должно быть от 1 до 40 символов.');
      await run(db,'INSERT INTO social_users(id,name,created_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name',user.id,name.trim(),now);
      return json({name:name.trim()});
    }
    if(method==='POST' && path.join('/')==='invites') {
      await ensureProfile(db,user,now);
      const token=newToken(),hash=await digest(token),expiresAt=now+INVITE_TTL;
      const r=await run(db,'INSERT INTO social_invites(token_hash,created_by,created_at,expires_at) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM social_invites WHERE created_by=? AND created_at>?)<20',hash,user.id,now,expiresAt,user.id,now-24*60*60*1000);
      if(!r.meta.changes)fail(429,'Сегодня создано достаточно приглашений. Попробуй завтра.');
      return json({url:url.origin+'/?join='+token+'#friends',expiresAt},201);
    }
    if(method==='POST' && path.join('/')==='invites/preview') {
      const invite=await inviteRecord(db,body.token,now,user.id);return json({name:invite.inviter_name});
    }
    if(method==='POST' && path.join('/')==='invites/accept') {
      const invite=await inviteRecord(db,body.token,now,user.id);
      await ensureProfile(db,user,now);
      const [left,right]=[user.id,invite.created_by].sort();
      const existing=await first(db,'SELECT * FROM social_friendships WHERE left_id=? AND right_id=?',left,right);
      if(existing?.blocked_by)fail(409,'Добавить этого друга сейчас нельзя.');
      const capacity='(SELECT COUNT(*) FROM social_friendships WHERE (left_id=? OR right_id=?) AND blocked_by IS NULL)<100';
      await db.batch([
        db.prepare('UPDATE social_invites SET claimed_by=?,claimed_at=? WHERE token_hash=? AND claimed_by IS NULL AND expires_at>? AND '+capacity+' AND '+capacity).bind(user.id,now,invite.token_hash,now,user.id,user.id,invite.created_by,invite.created_by),
        db.prepare('INSERT INTO social_friendships(id,left_id,right_id,created_at) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM social_invites WHERE token_hash=? AND claimed_by=?) ON CONFLICT(left_id,right_id) DO NOTHING').bind(crypto.randomUUID(),left,right,now,invite.token_hash,user.id)
      ]);
      const claimed=await first(db,'SELECT claimed_by FROM social_invites WHERE token_hash=?',invite.token_hash);
      if(claimed?.claimed_by!==user.id)fail(409,'Это приглашение уже использовано или достигнут лимит друзей.');
      const friend=await first(db,'SELECT * FROM social_friendships WHERE left_id=? AND right_id=?',left,right);
      if(!friend || friend.blocked_by)fail(409,'Не удалось принять приглашение. Возможно, достигнут лимит друзей.');
      return json({id:friend.id,name:invite.inviter_name});
    }
    if(method==='GET' && path.join('/')==='friends') {
      const rows=await all(db,`SELECT f.id,f.blocked_by,u.name,
        (SELECT MAX(seq) FROM social_messages WHERE friendship_id=f.id) AS last_seq,
        (SELECT body FROM social_messages WHERE friendship_id=f.id ORDER BY seq DESC LIMIT 1) AS last_body,
        (SELECT mission_title FROM social_messages WHERE friendship_id=f.id ORDER BY seq DESC LIMIT 1) AS last_mission,
        (SELECT created_at FROM social_messages WHERE friendship_id=f.id ORDER BY seq DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*) FROM social_messages WHERE friendship_id=f.id AND sender_id<>? AND seq>CASE WHEN f.left_id=? THEN f.left_read ELSE f.right_read END) AS unread
        FROM social_friendships f JOIN social_users u ON u.id=CASE WHEN f.left_id=? THEN f.right_id ELSE f.left_id END
        WHERE (f.left_id=? OR f.right_id=?) AND (f.blocked_by IS NULL OR f.blocked_by=?) ORDER BY last_at DESC,f.created_at DESC LIMIT 200`,user.id,user.id,user.id,user.id,user.id,user.id);
      return json({friends:rows.map(r=>({id:r.id,name:r.name,lastBody:r.last_body || r.last_mission || '',lastAt:r.last_at,unread:r.blocked_by?0:r.unread,blockedByMe:r.blocked_by===user.id}))});
    }
    if(path[0]==='friends' && path.length===3) {
      const row=await friendship(db,path[1],user.id,path[2]==='block');
      if(method==='POST' && path[2]==='block') {
        if(typeof body.blocked!=='boolean')fail(422,'Выбери действие.');
        if(body.blocked)await run(db,'UPDATE social_friendships SET blocked_by=? WHERE id=? AND (blocked_by IS NULL OR blocked_by=?)',user.id,row.id,user.id);
        else await run(db,'UPDATE social_friendships SET blocked_by=NULL WHERE id=? AND blocked_by=?',row.id,user.id);
        return json({ok:true});
      }
      if(method==='GET' && path[2]==='messages') {
        const after=url.searchParams.get('after'),before=url.searchParams.get('before');
        if(after!==null && before!==null)fail(422,'Неверный запрос истории.');
        const access=' AND EXISTS(SELECT 1 FROM social_friendships WHERE id=? AND blocked_by IS NULL AND (left_id=? OR right_id=?))';
        let rows;
        if(after!==null)rows=await all(db,'SELECT * FROM social_messages WHERE friendship_id=? AND seq>?'+access+' ORDER BY seq ASC LIMIT 100',row.id,positiveInteger(after),row.id,user.id,user.id);
        else if(before!==null)rows=(await all(db,'SELECT * FROM social_messages WHERE friendship_id=? AND seq<?'+access+' ORDER BY seq DESC LIMIT 50',row.id,positiveInteger(before),row.id,user.id,user.id)).reverse();
        else rows=(await all(db,'SELECT * FROM social_messages WHERE friendship_id=?'+access+' ORDER BY seq DESC LIMIT 50',row.id,row.id,user.id,user.id)).reverse();
        return json({messages:rows.map(m=>publicMessage(m,user.id)),hasMore:rows.length===(after!==null?100:50)});
      }
      if(method==='POST' && path[2]==='messages') {
        const text=body.body,clientId=body.clientId,missionId=body.missionId || null;
        if(typeof text!=='string' || text.trim().length>MAX_MESSAGE || (!text.trim() && !missionId))fail(422,'Напиши сообщение до 2000 символов.');
        if(typeof clientId!=='string' || !clientIdPattern.test(clientId))fail(422,'Не удалось проверить сообщение.');
        const mission=missionId?missionMap.get(missionId):null;
        if(missionId && !mission)fail(422,'Миссия не найдена.');
        const previous=await first(db,'SELECT * FROM social_messages WHERE friendship_id=? AND sender_id=? AND client_id=?',row.id,user.id,clientId);
        if(previous) {
          if(previous.body!==text.trim() || previous.mission_id!==missionId)fail(409,'Повторный запрос отличается от сохранённого сообщения.');
          return json({message:publicMessage(previous,user.id)});
        }
        const result=await run(db,`INSERT INTO social_messages(friendship_id,sender_id,client_id,body,mission_id,mission_title,created_at)
          SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM social_friendships WHERE id=? AND blocked_by IS NULL AND (left_id=? OR right_id=?))
          AND (SELECT COUNT(*) FROM social_messages WHERE sender_id=? AND created_at>?)<30
          ON CONFLICT(friendship_id,sender_id,client_id) DO NOTHING`,row.id,user.id,clientId,text.trim(),missionId,mission?.title || null,now,row.id,user.id,user.id,user.id,now-60_000);
        const message=await first(db,'SELECT * FROM social_messages WHERE friendship_id=? AND sender_id=? AND client_id=?',row.id,user.id,clientId);
        if(!message) {
          await friendship(db,row.id,user.id);
          fail(429,'Слишком много сообщений. Подожди минуту.');
        }
        if(message.body!==text.trim() || message.mission_id!==missionId)fail(409,'Повторный запрос отличается от сохранённого сообщения.');
        return json({message:publicMessage(message,user.id)},result.meta.changes?201:200);
      }
      if(method==='POST' && path[2]==='read') {
        const seq=positiveInteger(body.seq),last=await first(db,'SELECT MAX(seq) AS seq FROM social_messages WHERE friendship_id=?',row.id);
        const column=row.left_id===user.id?'left_read':'right_read';
        await run(db,'UPDATE social_friendships SET '+column+'=max('+column+',?) WHERE id=? AND blocked_by IS NULL',Math.min(seq,last.seq || 0),row.id);
        return json({ok:true});
      }
    }
    fail(404,'Такого действия нет.');
  }catch(error){
    if(error instanceof HttpError)return json({error:error.message},error.status);
    console.error('Social API failed',error?.name || 'Error');
    return json({error:'Не удалось выполнить действие. Попробуй позже.'},503);
  }
}
