import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, extname, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..',process.argv[2] || 'public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const server = createServer(async (request,response) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405);response.end();return; }
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const path = resolve(root,'.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!path.startsWith(root + sep) || !(await stat(path)).isFile()) throw new Error('not found');
    const content = await readFile(path);
    response.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream','Content-Length':content.length,'Cache-Control':'no-store'});
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404);response.end('Not found'); }
});
server.listen(3000,'127.0.0.1',() => console.log('Website: http://127.0.0.1:3000'));
