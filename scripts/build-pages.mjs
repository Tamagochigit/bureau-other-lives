import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const MODULES = ['app','core','data','contacts','friends','links','runtime-config','android'];
export const ASSETS = ['style.css','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable.png'];
export async function buildPages(output = join(root, 'out/pages')) {
  await rm(output, { recursive:true, force:true });
  await mkdir(output, { recursive:true });
  for (const name of MODULES) {
    const source = await readFile(join(root,'public',name + '.mjs'),'utf8');
    await writeFile(join(output,name + '.js'),source.replace(/(from\s+['"]\.\/[^'"]+)\.mjs(['"])/g,'$1.js$2'));
  }
  const html = await readFile(join(root,'public/index.html'),'utf8');
  await writeFile(join(output,'index.html'),html.replace('./app.mjs','./app.js'));
  for (const asset of ASSETS) await copyFile(join(root,'public',asset),join(output,asset));
  await writeFile(join(output,'.nojekyll'),'');
  return output;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log('Static website: ' + await buildPages());
