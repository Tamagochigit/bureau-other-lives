import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { MISSIONS, TRADITIONS } from '../public/data.mjs';

const run = args => {
  const result = spawnSync(process.execPath,args,{stdio:'inherit'});
  if (result.status !== 0) process.exit(result.status || 1);
};
for (const file of ['public/app.mjs','public/core.mjs','public/data.mjs','public/friends.mjs','public/hosted-friends.mjs','public/links.mjs','public/runtime-config.mjs','scripts/build-pages.mjs','server/social.mjs']) run(['--check',file]);
run(['--test','--test-concurrency=1','tests/core.test.mjs','tests/ui.test.mjs','tests/social.test.mjs','tests/pages.test.mjs']);
const html=await readFile('public/index.html','utf8');
for (const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) await stat('public/'+match[1]);
const manifest=JSON.parse(await readFile('public/manifest.webmanifest','utf8'));
for (const icon of manifest.icons) await stat('public/'+icon.src.replace('./',''));
const idSet=new Set(MISSIONS.map(m=>m.id));
for (const tradition of TRADITIONS) if (!idSet.has(tradition.missionId)) throw new Error('Missing linked mission: '+tradition.id);
const app=await readFile('public/app.mjs','utf8');
for(const file of ['public/app.mjs','public/core.mjs','public/data.mjs']) {
  if (/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(await readFile(file,'utf8'))) throw new Error('Diary network access requires a new data decision: '+file);
}
const chat=await readFile('public/friends.mjs','utf8');
if(/\b(?:localStorage|STORAGE_KEY)\b/.test(chat))throw new Error('Chat must not read the local diary.');
if(!chat.includes("fetch('/api/social/'+path"))throw new Error('Chat requests must use the same-origin social API.');
if (/[\u00A7\u00A4]/.test(app)) throw new Error('Template placeholders remained in source.');
console.log('Verified syntax, experience flows, chat access/retries, backup integrity, asset references and the diary boundary.');
