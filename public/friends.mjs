import { MISSIONS, TRADITIONS } from './data.mjs';
import { escapeHtml as e } from './core.mjs';
import { missionDraft } from './links.mjs';

// The operating system chooses recipients. This view has no address book or storage.
export function createFriendsController() {
  let pending = null;
  return {
    prepareMission(id) { pending = MISSIONS.find(mission => mission.id === id) || null; },
    page() {
      const selected = pending ? `<section class="friend-pending" aria-label="Миссия для друга"><h2>${e(pending.title)}</h2><p>Выбери удобное приложение и получателя. Отправку подтверждаешь ты.</p><button class="button button-orange" data-action="share-mission" data-id="${pending.id}">Поделиться</button><label class="share-label" for="share-text">Текст для отправки</label><textarea id="share-text" class="share-text" readonly rows="3">${e(missionDraft(pending.id))}</textarea><button class="text-button" data-action="copy-mission" data-id="${pending.id}">Скопировать текст</button></section>` : '';
      return `<section id="friends-root" class="friends-panel" aria-label="Идеи для друзей">${selected}<div class="friend-pending"><h2>Попробуйте что-нибудь вместе</h2><p>Открой миссию и нажми «Поделиться». Мессенджер, SMS или почту выберешь в обычном меню устройства.</p><a class="button button-dark" href="#missions">Выбрать миссию</a></div><h2 class="friends-ideas-title">Поводы встретиться</h2><div class="tradition-grid">${TRADITIONS.filter(tradition => tradition.category === 'connect').map(tradition => `<article class="tradition-card"><div class="tradition-body"><h3>${e(tradition.title)}</h3><p>${e(tradition.subtitle)}</p><button class="text-button" data-action="share-mission" data-id="${tradition.missionId}">Поделиться миссией</button></div></article>`).join('')}</div><p class="friend-hint friend-footer">Дневник и заметки остаются у тебя. Передаётся только выбранная готовая миссия со ссылкой.</p></section>`;
    },
  };
}
