import { MISSIONS } from './data.mjs';
import { escapeHtml as e } from './core.mjs';
import { CONTACTS_KEY, decodeContacts, saveContact } from './contacts.mjs';
import { telegramChatLink, telegramShareLink } from './links.mjs';

// Local shortcuts to an existing messenger. Conversations belong to Telegram.
export function createFriendsController({ toast, storage = globalThis.localStorage }) {
  let contacts = [], warning = '', writable = true;
  try {
    const saved = storage.getItem(CONTACTS_KEY);
    if (saved) contacts = decodeContacts(saved);
  } catch {
    writable = false;
    warning = 'Не удалось прочитать список друзей. Изменения доступны до закрытия страницы.';
  }
  let adding = !contacts.length, editing = '', error = '', draft = {name:'',username:''}, pending = null;
  function page() {
    const form = adding ? `<form id="friend-form" class="friend-form"><h2>${editing ? 'Изменить контакт' : 'Добавить друга'}</h2><label for="friend-name">Имя</label><input id="friend-name" name="name" value="${e(draft.name)}" placeholder="Как зовут друга" maxlength="60" required autocomplete="off"><label for="friend-username">Имя в Telegram</label><input id="friend-username" name="username" value="${e(draft.username)}" placeholder="@username или https://t.me/username" maxlength="100" required autocomplete="off" autocapitalize="none" spellcheck="false"><p class="friend-hint">Имя пользователя можно найти в профиле друга в Telegram.</p>${error ? '<p class="friend-error" role="alert">' + e(error) + '</p>' : ''}<div class="friend-actions"><button type="submit" class="button button-dark">Сохранить контакт</button><button type="button" class="text-button" data-action="friend-cancel">Отмена</button></div></form>` : '<button class="button button-outline" data-action="friend-add">Добавить друга</button>';
    return `<section id="friends-root" class="friends-panel" aria-label="Друзья в Telegram">${warning ? '<p class="friend-warning" role="status">' + e(warning) + '</p>' : ''}${pending ? '<div class="friend-pending"><h2>' + e(pending.title) + '</h2><p>Выбери друга — миссия появится в черновике Telegram.</p><a class="button button-orange" target="_blank" rel="noopener noreferrer" href="' + e(telegramShareLink(pending.id)) + '">Выбрать чат в Telegram</a><button class="text-button" data-action="friend-clear-mission">Убрать миссию</button></div>' : ''}${contacts.length ? '<ul class="friend-list">' + contacts.map(item => '<li class="friend-row"><div class="friend-avatar" aria-hidden="true">' + e(Array.from(item.name)[0].toLocaleUpperCase('ru')) + '</div><div class="friend-info"><h2>' + e(item.name) + '</h2><p>@' + e(item.username) + '</p></div><a class="button ' + (pending ? 'button-orange' : 'button-dark') + '" target="_blank" rel="noopener noreferrer" href="' + e(telegramChatLink(item.username,pending?.id)) + '">' + (pending ? 'Предложить миссию' : 'Написать') + '</a><details class="friend-options"><summary>Контакт</summary><button class="text-button" data-action="friend-edit" data-id="' + item.username + '">Изменить</button><button class="text-button" data-action="friend-remove" data-id="' + item.username + '">Убрать из списка</button></details></li>').join('') + '</ul>' : '<p class="friend-empty">Добавь друга, чтобы открывать его чат отсюда.</p>'}${form}<p class="friend-hint friend-footer">Переписка открывается в Telegram. Контакты сохраняются в этом браузере. Сообщение отправляешь ты.</p></section>`;
  }
  function render() { const root = document.querySelector('#friends-root'); if (root) root.outerHTML = page(); }
  function persist(next) {
    contacts = next;
    if (writable) try { storage.setItem(CONTACTS_KEY, JSON.stringify({version:1,contacts})); } catch {
      writable = false;
      warning = 'Браузер не смог сохранить друзей. Изменения доступны до закрытия страницы.';
    }
  }
  function currentContacts() {
    if (!writable) return contacts;
    try { const latest = storage.getItem(CONTACTS_KEY); return latest ? decodeContacts(latest) : []; } catch {
      writable = false;
      warning = 'Не удалось прочитать список друзей. Изменения доступны до закрытия страницы.';
      return contacts;
    }
  }
  function handleAction(action, username) {
    if (action === 'friend-add') { adding = true; editing = ''; error = ''; draft = {name:'',username:''}; }
    if (action === 'friend-cancel') { adding = false; editing = ''; error = ''; }
    if (action === 'friend-clear-mission') pending = null;
    if (action === 'friend-edit') {
      const item = contacts.find(item => item.username === username);
      if (!item) return;
      adding = true; editing = username; error = ''; draft = {...item};
    }
    if (action === 'friend-remove') {
      const item = contacts.find(item => item.username === username);
      if (!item || !window.confirm(`Убрать ${item.name} из списка? Переписка в Telegram останется.`)) return;
      persist(currentContacts().filter(item => item.username !== username));
      if (editing === username) {adding = false;editing = '';}
      toast(writable ? 'Контакт убран из списка.' : warning);
    }
    render();
    if (action === 'friend-add' || action === 'friend-edit') document.querySelector('#friend-name')?.focus();
  }
  function submit(form) {
    const data = new FormData(form);
    draft = {name:String(data.get('name') || ''),username:String(data.get('username') || '')};
    try {
      persist(saveContact(currentContacts(),draft,editing));
      adding = false; editing = ''; error = ''; draft = {name:'',username:''};
      toast(writable ? 'Контакт сохранён.' : warning);
    } catch (failure) { error = failure.message; }
    render();
  }
  return { page, handleAction, submit, prepareMission(id) { pending = MISSIONS.find(mission => mission.id === id) || null; } };
}
