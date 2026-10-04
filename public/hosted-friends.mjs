import { MISSIONS } from './data.mjs';
import { escapeHtml as e } from './core.mjs';
import { chatLink, incomingLinks } from './links.mjs';

// Pages opens the protected chat in its own origin. No cross-origin API requests.
export function createHostedFriendsController() {
  const incoming = incomingLinks(location.search || '');
  let pendingMission = MISSIONS.find(mission => mission.id === incoming.offer) || null;
  return {
    page() {
      return `<section class="chat-panel"><h2>Личные чаты</h2><p>Чаты открываются в защищённом разделе через ChatGPT. Другу нужен доступ к этому разделу.</p>${pendingMission ? '<p class="chat-pending">Предложить миссию: <strong>' + e(pendingMission.title) + '</strong></p>' : ''}<a class="button button-orange" href="${e(chatLink({ offer: pendingMission?.id, join: incoming.join }))}">${incoming.join ? 'Открыть приглашение' : 'Открыть личные чаты'}</a><p class="chat-hint">Дневник остаётся здесь. Миссия отправится только после выбора друга и нажатия «Отправить».</p></section>`;
    },
    mount() {}, leave() {}, handleAction() {}, submit() {}, input() {},
    prepareMission(id) { pendingMission = MISSIONS.find(mission => mission.id === id) || null; },
    hasInvite: () => Boolean(incoming.join),
  };
}
