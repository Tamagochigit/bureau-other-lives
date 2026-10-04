import { MISSIONS, TRADITIONS, CATEGORIES, PLACES } from './data.mjs';
import { STORAGE_KEY, emptyState, decodeState, beginMission, toggleStep, completeMission, editEntry, toggleId, filterMissions, surpriseMission, compass, backup, importBackup, escapeHtml } from './core.mjs';

const $ = selector => document.querySelector(selector);
const e = escapeHtml;
const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
  spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
  book: '<path d="M4 3h13a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V3Zm0 14h16M8 7h8M8 11h6"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3a4 4 0 0 1 0 8"/><circle cx="9" cy="7" r="4"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  arrowUp: '<path d="M6 18 18 6M6 6h12v12"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shuffle: '<path d="m3 5 4 0 10 14h4m-4-3 4 3-4 3M3 19h4l10-14h4m-4-3 4 3-4 3"/>',
  leaf: '<path d="M20 3C7 3 3 7 3 13a7 7 0 0 0 7 7c6 0 10-4 10-17Zm-15 16L16 8"/>',
  pen: '<path d="m4 16 12-12 4 4-12 12-5 1Zm10-10 4 4M3 21h18"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload: '<path d="M12 16V3M7 8l5-5 5 5M4 16v5h16v-5"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="var(--paper)"/><circle cx="15" cy="17" r="2" fill="var(--paper)"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
};
function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
}
let state = emptyState(), storageWritable = true, storageMessage = '';
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = decodeState(saved); } catch (error) { storageWritable = false; storageMessage = error.message || 'Браузер не разрешает сохранение.'; }
const VIEWS = { home: ['Сегодня', 'home'], missions: ['Миссии', 'compass'], traditions: ['Традиции', 'people'], compass: ['Компас', 'spark'], diary: ['Дневник', 'book'] };
let view = Object.hasOwn(VIEWS, location.hash.slice(1)) ? location.hash.slice(1) : 'home';
let filters = { time: '', place: '', category: '', search: '', onlyFavorites: false };
const homeFilters = { time: '15', place: 'home' };
let feedbackEntryId = null, returnFocus = null, installPrompt = null;
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200); }
function storeState(next) {
  if (storageWritable) {
    try {
      const latestText = localStorage.getItem(STORAGE_KEY);
      if (latestText) {
        const latest = decodeState(latestText);
        next = { ...next, entries: importBackup(next, backup(latest)).entries };
      }
    } catch { storageWritable = false; storageMessage = 'Не удалось объединить сохранённые записи. Исходные данные оставлены в браузере.'; }
  }
  state = next;
  if (storageWritable) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { storageWritable = false; storageMessage = 'Браузер не смог сохранить записи.'; }
  render();
}
function update(transform) { try { storeState(transform(state)); return true; } catch(error) { toast(error.message || 'Не получилось выполнить действие.'); return false; } }
function navigate(next) {
  if (!Object.hasOwn(VIEWS, next)) return;
  view = next; location.hash = next; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('hashchange', () => { const next = location.hash.slice(1); if (Object.hasOwn(VIEWS, next) && next !== view) { view = next; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
function dateText(date, withYear = false) { return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', ...(withYear ? { year: 'numeric' } : {}) }); }
function currentFilters() { return { ...filters, favorites: filters.onlyFavorites ? state.favorites : undefined }; }
function tag(category) { return `<span class="category-tag ${category}">${icon(CATEGORIES[category].icon)}${CATEGORIES[category].label}</span>`; }
function card(mission) {
  const saved = state.favorites.includes(mission.id), tried = state.entries.some(entry => entry.missionId === mission.id);
  return `<article class="mission-card">
    <button class="mission-open" data-action="mission" data-id="${mission.id}">
      <div class="card-content">${tag(mission.category)}<h3>${e(mission.title)}</h3><p>${e(mission.subtitle)}</p><div class="card-meta"><span>${icon('clock')}${mission.minutes} мин</span><span>${icon('pin')}${mission.places.map(place => PLACES[place]).join(' / ')}</span>${tried ? '<span class="tried-label">Уже пробовал</span>' : ''}</div></div>
    </button>
    <button class="favorite-button ${saved ? 'saved' : ''}" data-action="favorite" data-id="${mission.id}" aria-label="${saved ? 'Убрать из избранного' : 'Сохранить миссию'}: ${e(mission.title)}" aria-pressed="${saved}">${icon('bookmark')}</button>
  </article>`;
}
function activeBanner() {
  const mission = MISSIONS.find(m => m.id === state.active?.missionId);
  if (!mission) return '';
  return `<section class="active-banner"><div><h2>${e(mission.title)}</h2><p>${state.active.completedSteps.length} из ${mission.steps.length} шагов отмечено</p></div><button class="button button-dark" data-action="mission" data-id="${mission.id}">Продолжить ${icon('arrow')}</button></section>`;
}
function intro(_kicker, title, subtitle, extra = '') {
  return `<section class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${extra}</section>`;
}
function homePage() {
  if (state.active) return `${intro('', 'Продолжим?', 'Твоя начатая миссия — здесь.')}${activeBanner()}<button class="text-button" data-action="navigate" data-view="missions">Выбрать другую миссию ${icon('arrow')}</button>`;
  return `${intro('', 'Что попробуем сегодня?', 'Небольшой опыт, который можно попробовать прямо сейчас.')}
    <section class="home-start" aria-label="Подобрать миссию">
      <div class="home-filters">
        <label class="select-field" for="home-time"><span>Сколько времени?</span><select id="home-time">${[10,15,30,60].map(time => '<option value="' + time + '"' + (homeFilters.time === String(time) ? ' selected' : '') + '>До ' + time + ' минут</option>').join('')}</select></label>
        <label class="select-field" for="home-place"><span>Где?</span><select id="home-place">${Object.entries(PLACES).map(([id,label]) => '<option value="' + id + '"' + (homeFilters.place === id ? ' selected' : '') + '>' + label + '</option>').join('')}</select></label>
      </div>
      <button class="button button-orange home-pick" data-action="surprise">Подобрать миссию ${icon('arrow')}</button>
    </section>
    <button class="text-button" data-action="navigate" data-view="missions">Выбрать самому ${icon('arrow')}</button>`;
}
function missionsPage() {
  const filtered = filters.time || filters.place || filters.category || filters.search || filters.onlyFavorites;
  return `${intro('КОЛЛЕКЦИЯ ВОЗМОЖНЫХ ЖИЗНЕЙ', 'Попробуй новую роль.', 'Выбирай по времени, месту и настроению.', '<button class="button button-orange" data-action="surprise">' + icon('shuffle') + ' Удиви меня</button>')}
    ${activeBanner()}
    <details class="catalog-filters" ${filtered ? 'open' : ''}><summary>Фильтры${filtered ? ' · выбраны' : ''}</summary><section class="catalog-tools" aria-label="Подбор миссий"><div class="search-field">${icon('search')}<label class="sr-only" for="mission-search">Поиск миссии</label><input id="mission-search" type="search" value="${e(filters.search)}" placeholder="Найти роль или настроение" maxlength="100"></div><label class="select-field"><span>Время</span><select id="time-filter"><option value="">Сколько угодно</option>${[10,15,30,60].map(time => '<option value="' + time + '"' + (filters.time === String(time) ? ' selected' : '') + '>До ' + time + ' минут</option>').join('')}</select></label><label class="select-field"><span>Место</span><select id="place-filter"><option value="">Где угодно</option>${Object.entries(PLACES).map(([id,label]) => '<option value="' + id + '"' + (filters.place === id ? ' selected' : '') + '>' + label + '</option>').join('')}</select></label><button class="button favorite-filter ${filters.onlyFavorites ? 'selected' : ''}" data-action="filter-favorites" aria-pressed="${filters.onlyFavorites}">${icon('bookmark')} Избранное</button></section>
    <div class="category-filters" aria-label="Настроение"><button data-action="category" data-id="" class="filter-chip ${!filters.category ? 'selected' : ''}" aria-pressed="${!filters.category}">Любое настроение</button>${Object.entries(CATEGORIES).map(([id,c]) => '<button class="filter-chip ' + (filters.category === id ? 'selected' : '') + '" data-action="category" data-id="' + id + '" aria-pressed="' + (filters.category === id) + '">' + icon(c.icon) + c.verb + '</button>').join('')}</div></details>
    <div id="catalog-results" aria-live="polite">${catalogResults()}</div>`;
}
function catalogResults() {
  const matches = filterMissions(currentFilters());
  return matches.length ? '<div class="results-count">Миссий в подборке: ' + matches.length + '</div><div class="mission-grid catalog-grid">' + matches.map(m => card(m)).join('') + '</div>' : '<div class="empty-state">' + icon('search') + '<h2>Пока нет такой роли.</h2><p>Попробуй другое настроение или чуть больше времени.</p><button class="button button-dark" data-action="reset-filters">Показать все миссии</button></div>';
}
function traditionsPage() {
  return `${intro('ПОВОДЫ БЫТЬ ВМЕСТЕ', 'Хорошее можно повторять.', 'Выбери ритуал для себя или маленькой компании.')}
    <div class="traditions-note">${icon('people')}<p>Сохраняй традиции в свой круг. Внутри каждой — простой сценарий и текст приглашения, которым можно поделиться самому.</p><span>${state.traditions.length} в твоём круге</span></div>
    <div class="tradition-grid">${TRADITIONS.map(t => {
      const saved = state.traditions.includes(t.id);
      return `<article class="tradition-card ${saved ? 'in-circle' : ''}"><span class="tradition-frequency">${t.frequency}</span><div class="tradition-body"><span class="eyebrow">${t.people}</span><h2>${e(t.title)}</h2><p>${e(t.subtitle)}</p><div class="tradition-actions"><button class="text-button" data-action="tradition" data-id="${t.id}">Посмотреть сценарий ${icon('arrow')}</button><button class="circle-button ${saved ? 'selected' : ''}" data-action="circle" data-id="${t.id}" aria-label="${saved ? 'Убрать из своего круга' : 'Добавить в свой круг'}: ${e(t.title)}" aria-pressed="${saved}">${icon(saved ? 'check' : 'bookmark')}</button></div></div></article>`;
    }).join('')}</div>`;
}
function compassPage() {
  const stats = compass(state), most = [...stats].filter(c => c.count).sort((a,b) => b.average-a.average || b.count-a.count)[0];
  const repeated = state.entries.filter(entry => entry.repeat);
  return `${intro('КАРТА ТВОЕГО ИНТЕРЕСА', 'К чему хочется вернуться?', 'Компас складывается из твоих оценок после реальных попыток.')}
    ${!state.entries.length ? '<section class="compass-intro"><div><h2>Твой компас ещё ждёт открытий.</h2><p>Попробуй миссию и оцени, насколько тебе понравился этот опыт. После нескольких попыток здесь появится картина твоих впечатлений.</p><button class="button button-dark" data-action="navigate" data-view="missions">Выбрать первую миссию ' + icon('arrow') + '</button></div></section>' : '<section class="compass-summary"><div class="summary-mark">' + icon('compass') + '</div><div><h2>Самая высокая средняя оценка — «' + most.label.toLocaleLowerCase('ru') + '».</h2><p>Это ориентир для следующей попытки. Всего записей: ' + state.entries.length + '.</p></div></section>'}
    <div class="compass-grid">${(state.entries.length ? stats : []).map(c => '<article class="compass-card ' + c.id + '"><div class="compass-card-top"><span class="compass-category-icon">' + icon(c.icon) + '</span><span class="compass-number">' + (c.count ? c.average.toFixed(1).replace('.', ',') : '—') + '<small> / 5</small></span></div><h2>' + c.label + '</h2><div class="score-track"><span style="width:' + (c.average/5*100) + '%;background:' + c.color + '"></span></div><p>' + (c.count ? 'Опытов: ' + c.count + ' · хочется повторить: ' + c.repeats : 'Пока нет записей') + '</p><button class="text-button" data-action="category-explore" data-id="' + c.id + '">Попробовать ещё ' + icon('arrow') + '</button></article>').join('')}</div>
    <section class="repeat-section" ${state.entries.length ? '' : 'hidden'}><div class="section-heading"><div><h2>Хочется повторить</h2></div><span class="muted">${repeated.length} в дневнике</span></div>${repeated.length ? '<div class="repeat-list">' + repeated.map(entry => '<button data-action="edit-entry" data-id="' + entry.id + '" class="repeat-item"><span class="repeat-item-icon ' + entry.category + '">' + icon(CATEGORIES[entry.category].icon) + '</span><span><strong>' + e(entry.title) + '</strong><small>' + dateText(entry.completedAt) + ' · ' + entry.rating + ' / 5</small></span>' + icon('arrow') + '</button>').join('') + '</div>' : '<p class="quiet-empty">После миссии можно отметить «Хочу повторить». Эти впечатления соберутся здесь.</p>'}</section>`;
}
function diaryPage() {
  return `${intro('МАЛЕНЬКИЕ ИСТОРИИ, КОТОРЫЕ ОСТАЛИСЬ', 'Дневник открытий.', 'Здесь живут твои попытки, впечатления и желание попробовать снова.', '<button class="button button-outline" data-action="export">' + icon('download') + ' Сохранить копию</button>')}
    ${activeBanner()}
    ${!state.entries.length ? '<section class="empty-state diary-empty"><h2>Пока нет записей.</h2><p>Попробуй миссию и сохрани впечатление.</p><button class="button button-orange" data-action="navigate" data-view="missions">Найти первую роль ' + icon('arrow') + '</button></section>' : '<div class="diary-count">Сохранено опытов: ' + state.entries.length + '</div><div class="diary-list">' + state.entries.map(entry => '<article class="diary-entry"><div class="diary-date"><strong>' + new Date(entry.completedAt).getDate() + '</strong><span>' + new Date(entry.completedAt).toLocaleDateString('ru-RU', {month:'short',year:'numeric'}) + '</span></div><div class="entry-content">' + tag(entry.category) + '<h2>' + e(entry.title) + '</h2><p class="entry-note">' + e(entry.note || 'Впечатление сохранено. Можно добавить пару слов о нём.') + '</p><div class="entry-bottom"><span class="entry-rating">' + icon('spark') + ' ' + entry.rating + ' / 5</span>' + (entry.repeat ? '<span class="repeat-badge">' + icon('heart') + ' Хочется повторить</span>' : '') + '<button class="text-button" data-action="edit-entry" data-id="' + entry.id + '">Изменить запись ' + icon('pen') + '</button></div></div></article>').join('') + '</div>'}
    <p class="privacy-note">${icon('book')} Записи хранятся в этом браузере. Резервная копия поможет перенести их на другое устройство.</p>`;
}
function render() {
  $('#navigation').innerHTML = Object.entries(VIEWS).map(([id,[label,name]]) => `<a href="#${id}" class="nav-item ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span></a>`).join('');
  $('#settings-icon').innerHTML = icon('settings');
  $('#page-label').textContent = view === 'home' ? 'Бюро других жизней' : VIEWS[view][0];
  const warning = $('#storage-warning'); warning.hidden = storageWritable;
  if (!storageWritable) warning.innerHTML = e(storageMessage) + ' Новые изменения доступны до закрытия страницы. <button class="text-button" data-action="export">Выгрузить копию</button>';
  const pages = { home: homePage, missions: missionsPage, traditions: traditionsPage, compass: compassPage, diary: diaryPage };
  $('#main').innerHTML = pages[view]();
}
function openDialog(dialog) {
  returnFocus = document.activeElement;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}
function closeDialog(dialog) { dialog.close(); document.body.classList.remove('modal-open'); if (returnFocus?.isConnected) returnFocus.focus(); }
function showMission(id) {
  const mission = MISSIONS.find(m => m.id === id); if (!mission) return;
  const active = state.active?.missionId === id;
  const saved = state.favorites.includes(id);
  $('#dialog-content').innerHTML = `<button class="modal-close icon-button" data-action="close-detail" aria-label="Закрыть миссию">${icon('close')}</button><div class="detail-body">${tag(mission.category)}<h2 id="dialog-title">${e(mission.title)}</h2><p class="detail-subtitle">${e(mission.subtitle)}</p><div class="detail-metadata"><span>${icon('clock')}${mission.minutes} минут</span><span>${icon('pin')}${mission.places.map(p => PLACES[p]).join(' / ')}</span></div><div class="materials"><span class="eyebrow">Что понадобится</span><p>${e(mission.materials)}</p></div><h3 class="detail-section-title">${active ? 'Твои шаги' : 'Три простых шага'}</h3><ol class="mission-steps">${mission.steps.map((step,index) => active ? '<li class="' + (state.active.completedSteps.includes(index) ? 'step-done' : '') + '"><label><input type="checkbox" data-step="' + index + '" ' + (state.active.completedSteps.includes(index) ? 'checked' : '') + '><span>' + e(step) + '</span></label></li>' : '<li><span class="step-index">0' + (index+1) + '</span><p>' + e(step) + '</p></li>').join('')}</ol><div class="mission-result">${icon('spark')}<div><span class="eyebrow">Что останется</span><p>${e(mission.result)}</p></div></div><div class="detail-buttons">${active ? '<button class="button button-orange" data-action="feedback">Сохранить впечатление ' + icon('arrow') + '</button><button class="text-button" data-action="cancel-mission">Отложить миссию</button>' : '<button class="button button-orange" data-action="begin" data-id="' + id + '">Примерить эту роль ' + icon('arrow') + '</button><button class="button button-outline" data-action="favorite-detail" data-id="' + id + '" aria-pressed="' + saved + '">' + icon(saved ? 'check' : 'bookmark') + (saved ? 'Сохранено' : 'На потом') + '</button>'}</div><p class="detail-footnote">Можно менять шаги под себя и идти в своём темпе.</p></div>`;
  openDialog($('#detail-dialog'));
}
function showTradition(id) {
  const tradition = TRADITIONS.find(t => t.id === id); if (!tradition) return;
  const saved = state.traditions.includes(id);
  $('#dialog-content').innerHTML = `<button class="modal-close icon-button" data-action="close-detail" aria-label="Закрыть традицию">${icon('close')}</button><div class="detail-body"><span class="eyebrow">${tradition.frequency} · ${tradition.people}</span><h2 id="dialog-title">${e(tradition.title)}</h2><p class="detail-subtitle">${e(tradition.subtitle)}</p><h3 class="detail-section-title">Простой сценарий</h3><ol class="mission-steps">${tradition.steps.map((step,index) => '<li><span class="step-index">0' + (index+1) + '</span><p>' + e(step) + '</p></li>').join('')}</ol><div class="invite-box"><span class="eyebrow">Приглашение</span><p id="invite-text">${e(tradition.invitation)}</p><button class="text-button" data-action="copy-invite" data-id="${id}">Скопировать приглашение ${icon('arrowUp')}</button></div><div class="detail-buttons"><button class="button button-orange" data-action="circle-detail" data-id="${id}">${icon(saved ? 'check' : 'bookmark')} ${saved ? 'В моём круге' : 'Добавить в мой круг'}</button><button class="button button-outline" data-action="mission" data-id="${tradition.missionId}">Попробовать один раз</button></div><p class="detail-footnote">Выберите время сами. Приглашение отправляешь ты.</p></div>`;
  openDialog($('#detail-dialog'));
}
function showFeedback(entryId = null) {
  const entry = entryId ? state.entries.find(x => x.id === entryId) : null;
  const mission = MISSIONS.find(m => m.id === (entry?.missionId || state.active?.missionId));
  if (!entry && !mission) return;
  feedbackEntryId = entry?.id || null;
  if ($('#detail-dialog').open) closeDialog($('#detail-dialog'));
  $('#feedback-content').innerHTML = `<button class="modal-close icon-button" data-action="close-feedback" aria-label="Закрыть запись">${icon('close')}</button><div class="feedback-body"><h2 id="feedback-title">${entry ? 'Добавим пару слов?' : 'Как тебе эта жизнь?'}</h2><p class="feedback-mission">${e(entry?.title || mission.title)}</p><form id="feedback-form"><fieldset class="rating-fieldset"><legend>Насколько понравился этот опыт?</legend><div class="rating-options">${[1,2,3,4,5].map(rating => '<label><input type="radio" name="rating" value="' + rating + '" required ' + (entry?.rating === rating ? 'checked' : '') + '><span>' + rating + '</span></label>').join('')}</div><div class="rating-labels"><span>Совсем не моё</span><span>Очень понравилось</span></div></fieldset><label class="repeat-checkbox"><input type="checkbox" name="repeat" ${entry?.repeat ? 'checked' : ''}>${icon('heart')}<span>Хочу попробовать ещё раз</span></label><label class="note-label" for="feedback-note">Что хочется запомнить?</label><p class="note-prompt">${e(mission?.prompt || 'Какое впечатление хочется сохранить?')}</p><textarea id="feedback-note" name="note" rows="4" maxlength="1200" placeholder="Пара слов об этом опыте…">${e(entry?.note || '')}</textarea><div class="note-counter"><span>Необязательно</span><span id="note-length">${entry?.note.length || 0} / 1200</span></div><button type="submit" class="button button-orange feedback-submit">${entry ? 'Сохранить изменения' : 'Сохранить в дневник'} ${icon('check')}</button><p class="feedback-privacy">Это твой личный дневник. Достаточно честной оценки.</p></form></div>`;
  openDialog($('#feedback-dialog'));
}
function showAbout(settings = false) {
  const copy = settings ? `<h2 id="dialog-title">Дневник и копия.</h2><p class="detail-subtitle">Записи сохраняются в этом браузере. На другом устройстве будет свой дневник.</p><div class="settings-card"><h3>Резервная копия</h3><p>В JSON-файл попадут завершённые миссии, избранное и твой круг традиций. После импорта записи объединятся с текущими.</p><div class="detail-buttons"><button class="button button-dark" data-action="export">${icon('download')} Скачать копию</button><button class="button button-outline" data-action="import">${icon('upload')} Восстановить</button></div></div><div class="settings-card"><h3>Открывать с главного экрана</h3><p>В меню браузера выбери «Добавить на главный экран» или «Установить приложение», если такой пункт доступен.</p>${installPrompt ? '<button class="button button-outline" data-action="install">Добавить приложение ' + icon('arrow') + '</button>' : ''}</div><p class="detail-footnote">Копия содержит твои заметки. Храни её там, где удобно тебе.</p>` : `<h2 id="dialog-title">Начни с любопытства.</h2><p class="detail-subtitle">Здесь можно примерить новую роль на десять минут или целый вечер.</p><ol class="mission-steps"><li><span class="step-index">01</span><p>Выбери миссию по настроению, месту и свободному времени.</p></li><li><span class="step-index">02</span><p>Примерь роль. Делай шаги в своём темпе и отмечай сделанное.</p></li><li><span class="step-index">03</span><p>Сохрани оценку и впечатление. Компас покажет, к чему хочется вернуться.</p></li></ol><div class="mission-result">${icon('people')}<p>А любимый опыт можно превратить в традицию и пригласить близких.</p></div><button class="button button-orange" data-action="go-missions">Найти первую роль ${icon('arrow')}</button>`;
  $('#dialog-content').innerHTML = '<button class="modal-close icon-button" data-action="close-detail" aria-label="Закрыть">' + icon('close') + '</button><div class="detail-body about-body">' + copy + '</div>';
  openDialog($('#detail-dialog'));
}
function exportDiary() {
  try {
    const url = URL.createObjectURL(new Blob([backup(state)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'bureau-diary-' + new Date().toISOString().slice(0,10) + '.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    toast('Копия дневника подготовлена для скачивания.');
  } catch { toast('Браузер не смог подготовить файл. Попробуй другой браузер.'); }
}
async function copyInvite(id) {
  const text = TRADITIONS.find(t => t.id === id)?.invitation; if (!text) return;
  try { await navigator.clipboard.writeText(text); toast('Приглашение скопировано. Можно отправить его самому.'); } catch {
    const range = document.createRange(); range.selectNodeContents($('#invite-text')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); toast('Выделил приглашение. Скопируй его через меню браузера.');
  }
}
document.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]'); if (!target) return;
  const { action, id } = target.dataset;
  if (action === 'navigate') navigate(target.dataset.view);
  if (action === 'mission') showMission(id);
  if (action === 'tradition') showTradition(id);
  if (action === 'about') showAbout();
  if (action === 'settings') showAbout(true);
  if (action === 'close-detail') closeDialog($('#detail-dialog'));
  if (action === 'close-feedback') closeDialog($('#feedback-dialog'));
  if (action === 'go-missions') { closeDialog($('#detail-dialog')); navigate('missions'); }
  if (action === 'surprise') {
    const mission = surpriseMission(state, view === 'missions' ? currentFilters() : homeFilters);
    if (mission) showMission(mission.id); else toast('Нет подходящей миссии. Попробуй изменить фильтры.');
  }
  if (action === 'favorite' || action === 'favorite-detail') { if (update(s => toggleId(s, 'favorites', id)) && action === 'favorite-detail') showMission(id); }
  if (action === 'circle' || action === 'circle-detail') { if (update(s => toggleId(s, 'traditions', id)) && action === 'circle-detail') showTradition(id); }
  if (action === 'category') { filters.category = id; render(); }
  if (action === 'category-explore') { filters = { time: '', place: '', category: id, search: '', onlyFavorites: false }; navigate('missions'); }
  if (action === 'filter-favorites') { filters.onlyFavorites = !filters.onlyFavorites; render(); }
  if (action === 'reset-filters') { filters = { time: '', place: '', category: '', search: '', onlyFavorites: false }; render(); }
  if (action === 'begin') {
    if (state.active && state.active.missionId !== id) {
      if (!window.confirm('У тебя уже есть начатая миссия. Отложить её и начать эту? Отмеченные шаги предыдущей миссии сбросятся.')) return;
      if (update(s => beginMission({ ...s, active: null }, id))) showMission(id);
    } else if (update(s => beginMission(s, id))) showMission(id);
  }
  if (action === 'cancel-mission' && window.confirm('Отложить миссию? Отмеченные шаги сбросятся. Записи в дневнике останутся.')) { storeState({ ...state, active: null }); closeDialog($('#detail-dialog')); toast('Миссия отложена. Можно вернуться к ней позже.'); }
  if (action === 'feedback') showFeedback();
  if (action === 'edit-entry') showFeedback(id);
  if (action === 'export') exportDiary();
  if (action === 'import') $('#backup-file').click();
  if (action === 'copy-invite') await copyInvite(id);
  if (action === 'install' && installPrompt) { await installPrompt.prompt(); installPrompt = null; showAbout(true); }
});
document.addEventListener('change', event => {
  if (event.target.id === 'home-time') homeFilters.time = event.target.value;
  if (event.target.id === 'home-place') homeFilters.place = event.target.value;
  if (event.target.id === 'time-filter') { filters.time = event.target.value; $('#catalog-results').innerHTML = catalogResults(); }
  if (event.target.id === 'place-filter') { filters.place = event.target.value; $('#catalog-results').innerHTML = catalogResults(); }
  if (event.target.matches('[data-step]')) {
    const id = state.active?.missionId;
    if (update(s => toggleStep(s, Number(event.target.dataset.step)))) showMission(id);
  }
});
document.addEventListener('input', event => {
  if (event.target.id === 'mission-search') { filters.search = event.target.value; $('#catalog-results').innerHTML = catalogResults(); }
  if (event.target.id === 'feedback-note') $('#note-length').textContent = event.target.value.length + ' / 1200';
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'feedback-form') return;
  event.preventDefault();
  const form = new FormData(event.target), feedback = { rating: Number(form.get('rating')), repeat: form.get('repeat') === 'on', note: String(form.get('note') || '') };
  if (update(s => feedbackEntryId ? editEntry(s, feedbackEntryId, feedback) : completeMission(s, feedback))) { closeDialog($('#feedback-dialog')); navigate('diary'); toast(feedbackEntryId ? 'Запись обновлена.' : 'Ещё одна маленькая история в твоём дневнике.'); }
});
$('#backup-file').addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (file.size > 32_000_000) throw new Error('Файл слишком большой. Максимум — 32 МБ.');
    const raw = await file.text(), next = importBackup(state, raw);
    const added = next.entries.length-state.entries.length; storeState(next);
    if ($('#detail-dialog').open) closeDialog($('#detail-dialog'));
    navigate('diary'); toast('Копия восстановлена. Новых записей: ' + added + '.');
  } catch(error) { toast(error.message || 'Не удалось прочитать файл. Текущий дневник сохранён.'); }
  finally { event.target.value = ''; }
});
for (const dialog of [$('#detail-dialog'), $('#feedback-dialog')]) {
  dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog); } });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
}
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY || !event.newValue || !storageWritable) return;
  try {
    const next = decodeState(event.newValue);
    const editing = $('#detail-dialog').open || $('#feedback-dialog').open;
    if (editing) { toast('Дневник изменён в другой вкладке. Закончи эту запись, затем обнови страницу.'); return; }
    state = next; render(); toast('Дневник обновлён из другой вкладки.');
  } catch { toast('Не удалось прочитать изменения из другой вкладки. Твои текущие записи доступны здесь.'); }
});
render();
