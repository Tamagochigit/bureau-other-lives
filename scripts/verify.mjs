import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { MISSIONS, TRADITIONS } from '../dist/data.mjs';

const run = args => {
  const result = spawnSync(process.execPath,args,{stdio:'inherit'});
  if (result.status !== 0) process.exit(result.status || 1);
};
for (const file of ['dist/app.mjs','dist/core.mjs','dist/data.mjs']) run(['--check',file]);
run(['--test','--test-concurrency=1','tests/core.test.mjs','tests/ui.test.mjs']);
const html=await readFile('dist/index.html','utf8');
for (const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) await stat('dist/'+match[1]);
const manifest=JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
for (const icon of manifest.icons) await stat('dist/'+icon.src.replace('./',''));
const idSet=new Set(MISSIONS.map(m=>m.id));
for (const tradition of TRADITIONS) if (!idSet.has(tradition.missionId)) throw new Error('Missing linked mission: '+tradition.id);
const app=await readFile('dist/app.mjs','utf8');
if (/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(app)) throw new Error('Diary network access requires a new data decision.');
if (/[\u00A7\u00A4]/.test(app)) throw new Error('Template placeholders remained in source.');
console.log('Verified syntax, experience flows, backup integrity, asset references and local data boundary.');
