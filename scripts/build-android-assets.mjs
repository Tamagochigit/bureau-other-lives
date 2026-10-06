import { buildPages } from './build-pages.mjs';
import { copyFile, writeFile } from 'node:fs/promises';
import { MISSIONS } from '../public/data.mjs';
import { missionShareData } from '../public/links.mjs';
await buildPages(new URL('../out/android-assets/', import.meta.url).pathname);
await copyFile(new URL('../android/THIRD_PARTY_NOTICES.txt', import.meta.url), new URL('../out/android-assets/THIRD_PARTY_NOTICES.txt', import.meta.url));
await writeFile(new URL('../out/android-assets/share-missions.json', import.meta.url), JSON.stringify(MISSIONS.map(mission => ({id:mission.id, ...missionShareData(mission.id)}))));
console.log('Offline Android assets prepared.');
