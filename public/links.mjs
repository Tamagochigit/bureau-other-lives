import { MISSIONS } from './data.mjs';
import { FRONTEND_URL } from './runtime-config.mjs';
import { telegramUsername } from './contacts.mjs';

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

export function telegramChatLink(username, id = '') {
  const url = new URL('https://t.me/' + telegramUsername(username));
  const draft = missionDraft(id);
  if (draft) url.searchParams.set('text', draft);
  return url.href;
}

export function telegramShareLink(id) {
  const mission = MISSIONS.find(item => item.id === id);
  if (!mission) return '';
  const url = new URL('https://t.me/share/url');
  url.searchParams.set('url', missionLink(id));
  url.searchParams.set('text', `Давай попробуем «${mission.title}» вместе!`);
  return url.href;
}
