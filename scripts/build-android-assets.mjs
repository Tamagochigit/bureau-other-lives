import { buildPages } from './build-pages.mjs';
import { copyFile } from 'node:fs/promises';
await buildPages(new URL('../out/android-assets/', import.meta.url).pathname);
await copyFile(new URL('../android/THIRD_PARTY_NOTICES.txt', import.meta.url), new URL('../out/android-assets/THIRD_PARTY_NOTICES.txt', import.meta.url));
console.log('Offline Android assets prepared.');
