import { MISSIONS } from './data.mjs';
import { FRONTEND_URL } from './runtime-config.mjs';

export function incomingLinks(search = '') {
  const params = new URLSearchParams(search);
  return { mission: MISSIONS.find(item => item.id === params.get('mission'))?.id || '' };
}

export function missionLink(id) {
  if (!MISSIONS.some(item => item.id === id)) return '';
  const url = new URL(FRONTEND_URL);
  url.searchParams.set('mission', id);
  url.hash = 'missions';
  return url.href;
}

export function missionDraft(id) {
  const mission = MISSIONS.find(item => item.id === id);
  return mission ? `Давай попробуем «${mission.title}» вместе!\n${missionLink(id)}` : '';
}

export function missionShareData(id) {
  const mission = MISSIONS.find(item => item.id === id);
  return mission ? { title: mission.title, text: `Давай попробуем «${mission.title}» вместе!`, url: missionLink(id) } : null;
}
