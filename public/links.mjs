import { MISSIONS } from './data.mjs';
import { FRONTEND_URL, CHAT_SERVICE_URL } from './runtime-config.mjs';

export function incomingLinks(search = '') {
  const params = new URLSearchParams(search);
  const mission = key => MISSIONS.find(item => item.id === params.get(key))?.id || '';
  const join = params.get('join') || '';
  return { mission: mission('mission'), offer: mission('offer'), join: /^[a-f0-9]{48}$/.test(join) ? join : '' };
}

export function chatLink({ offer = '', join = '' } = {}) {
  const url = new URL(CHAT_SERVICE_URL);
  if (MISSIONS.some(item => item.id === offer)) url.searchParams.set('offer', offer);
  if (/^[a-f0-9]{48}$/.test(join)) url.searchParams.set('join', join);
  url.hash = 'friends';
  return url.href;
}

export function missionLink(id) {
  if (!MISSIONS.some(item => item.id === id)) return '';
  const url = new URL(FRONTEND_URL);
  url.searchParams.set('mission', id);
  url.hash = 'missions';
  return url.href;
}
