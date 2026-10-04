import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { FRONTEND_URL, CHAT_SERVICE_URL } from '../public/runtime-config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function buildPages(output = join(root, 'out/pages')) {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const modules = ['app', 'core', 'data', 'friends', 'hosted-friends', 'links'];
  for (const name of modules) {
    const source = await readFile(join(root, 'public', name + '.mjs'), 'utf8');
    await writeFile(join(output, name + '.js'), source.replace(/(from\s+['"]\.\/[^'"]+)\.mjs(['"])/g, '$1.js$2'));
  }
  const config = `export const DEPLOYMENT_MODE = 'pages';\nexport const FRONTEND_URL = ${JSON.stringify(FRONTEND_URL)};\nexport const CHAT_SERVICE_URL = ${JSON.stringify(CHAT_SERVICE_URL)};\n`;
  await writeFile(join(output, 'runtime-config.js'), config);
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  await writeFile(join(output, 'index.html'), html.replace('./app.mjs', './app.js'));
  for (const asset of ['style.css', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png']) {
    await copyFile(join(root, 'public', asset), join(output, asset));
  }
  await writeFile(join(output, '.nojekyll'), '');
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('GitHub Pages output: ' + await buildPages());
}
