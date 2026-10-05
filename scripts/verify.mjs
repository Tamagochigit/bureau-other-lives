import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { MISSIONS, TRADITIONS } from '../public/data.mjs';

const run = args => {
  const result = spawnSync(process.execPath,args,{stdio:'inherit'});
  if (result.status !== 0) process.exit(result.status || 1);
};
for (const directory of ['public','scripts']) for (const file of await readdir(directory)) if (file.endsWith('.mjs')) run(['--check',directory + '/' + file]);
const tests = (await readdir('tests')).filter(file => file.endsWith('.test.mjs')).sort().map(file => 'tests/' + file);
run(['--test','--test-concurrency=1',...tests]);
const html = await readFile('public/index.html','utf8');
for (const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) await stat('public/' + match[1]);
const manifest = JSON.parse(await readFile('public/manifest.webmanifest','utf8'));
for (const icon of manifest.icons) await stat('public/' + icon.src.replace('./',''));
const ids = new Set(MISSIONS.map(mission => mission.id));
for (const tradition of TRADITIONS) if (!ids.has(tradition.missionId)) throw new Error('Missing linked mission: ' + tradition.id);
for (const file of await readdir('public')) {
  if (!/\.(mjs|html|css|webmanifest)$/.test(file)) continue;
  const source = await readFile('public/' + file,'utf8');
  if (/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(source)) throw new Error('No application-data network API is authorised: ' + file);
  if (/chatgpt|neurozona|signin-with|\/api\/social|CHAT_SERVICE_URL|DEPLOYMENT_MODE/i.test(source)) throw new Error('Removed hosting/auth dependency remains: ' + file);
}
for (const file of ['friends','contacts','links']) {
  const source = await readFile('public/' + file + '.mjs','utf8');
  if (/\b(?:STORAGE_KEY|decodeState|backup|importBackup)\b/.test(source) || /other-lives:state:v1/.test(source)) throw new Error('Messenger shortcuts must not read diary storage: ' + file);
}
const app = await readFile('public/app.mjs','utf8');
if (/[\u00A7\u00A4]/.test(app)) throw new Error('Template placeholders remained in source.');
const pkg = JSON.parse(await readFile('package.json','utf8'));
if (Object.keys(pkg.dependencies || {}).length || Object.keys(pkg.devDependencies || {}).length) throw new Error('Standalone build has no runtime/package dependencies.');
console.log('Verified syntax, diary/recovery, surprise start, Telegram contact links, explicit sharing and standalone assets.');
