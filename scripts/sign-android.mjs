import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { stat, rm } from 'node:fs/promises';

const flags = new Map();
for (let i=2;i<process.argv.length;i+=2) flags.set(process.argv[i],process.argv[i+1]);
for (const required of ['--input','--output','--sdk','--keystore','--store-pass-file','--key-pass-file']) {
  if (!flags.get(required)) throw new Error('Required option: '+required);
}
const input=resolve(flags.get('--input')),output=resolve(flags.get('--output'));
if (input===output) throw new Error('Signed output must have a separate filename.');
for (const flag of ['--input','--keystore','--store-pass-file','--key-pass-file']) {
  if (!(await stat(resolve(flags.get(flag)))).isFile()) throw new Error('Not a regular file: '+flag);
}
const tools=join(resolve(flags.get('--sdk')),'build-tools','36.0.0');
const aligned=output+'.aligned';
const run=(tool,args) => {
  const result=spawnSync(join(tools,tool),args,{stdio:'inherit'});
  if (result.error || result.status!==0) throw new Error('Android '+tool+' failed.');
};
try {
  run('zipalign',['-p','-f','4',input,aligned]);
  run('apksigner',['sign','--ks',resolve(flags.get('--keystore')),'--ks-key-alias','bureau',
    '--ks-pass','file:'+resolve(flags.get('--store-pass-file')),'--key-pass','file:'+resolve(flags.get('--key-pass-file')),
    '--v1-signing-enabled','true','--v2-signing-enabled','true','--v3-signing-enabled','true','--out',output,aligned]);
  run('apksigner',['verify','--verbose','--print-certs',output]);
} finally { await rm(aligned,{force:true}); }
console.log('Signed Android APK: '+output);
