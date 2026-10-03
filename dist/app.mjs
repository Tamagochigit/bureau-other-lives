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
function art(name, category = 'curiosity', className = '') {
  const colors = { curiosity: ['#eee5d6', '#a96536', '#dba777'], create: ['#eeedf3', '#6c779b', '#b5b9ce'], connect: ['#f2e5e6', '#a05f74', '#cf9eae'], slow: ['#e5ece5', '#58836e', '#a1bca6'] };
  const [bg, ink, light] = colors[category] || colors.curiosity;
  const motifs = {
    arch: `<path d="M100 150V84a60 60 0 0 1 120 0v66" fill="${light}" stroke="${ink}"/><path d="M114 150V84a46 46 0 0 1 92 0v66" fill="${bg}" stroke="${ink}"/><path d="M101 152h119M84 153H61m198 0h-25M114 115h92M130 150l60-35m-44 35 44-35" stroke="${ink}"/><circle cx="182" cy="70" r="13" fill="${light}"/><path d="M64 79v14m-7-7h14m170-44v15m-8-7h16" stroke="${ink}"/>`,
    radio: `<rect x="86" y="70" width="148" height="82" rx="12" fill="${light}" stroke="${ink}"/><rect x="98" y="85" width="67" height="50" rx="5" fill="${bg}" stroke="${ink}"/><path d="M107 94h49m-49 9h49m-49 9h49m-49 9h49m23-51 19-34" stroke="${ink}"/><circle cx="204" cy="108" r="15" fill="${bg}" stroke="${ink}"/><circle cx="204" cy="108" r="4" fill="${ink}"/><path d="M244 73c9 7 9 25 0 32m10-41c17 12 17 37 0 50" stroke="${ink}"/>`,
    worlds: `<circle cx="126" cy="97" r="46" fill="${light}" stroke="${ink}"/><circle cx="194" cy="97" r="46" fill="${bg}" stroke="${ink}"/><path d="M148 58a46 46 0 0 1 0 78m-48-39h53m-27-45c-25 26-25 64 0 91m59-38 9 9 18-26" stroke="${ink}"/><path d="M78 151h166m-84-117v14m-7-7h14" stroke="${ink}"/>`,
    cup: `<path d="M106 89h94v19c0 33-16 45-47 45s-47-12-47-45Z" fill="${light}" stroke="${ink}"/><path d="M200 94h12a20 20 0 0 1 0 40h-16M95 154h124M133 70c-16-19 14-20 0-39m24 39c-16-19 14-20 0-39m24 39c-16-19 14-20 0-39" stroke="${ink}"/>`,
    museum: `<path d="M80 68h160l-80-37Z" fill="${light}" stroke="${ink}"/><path d="M74 147h172v10H74Zm14-10h144M100 79v58m30-58v58m60-58v58m30-58v58" stroke="${ink}" stroke-width="6"/><circle cx="160" cy="56" r="4" fill="${ink}"/>`,
    pen: `<path d="m124 130 63-83 18 14-63 83-24 10Z" fill="${light}" stroke="${ink}"/><path d="m179 58 18 14m-73 58 18 14m-24 10 7-22m-29 23h128M75 80h37m-37 12h26" stroke="${ink}"/><path d="M240 74v16m-8-8h16" stroke="${ink}"/>`,
    palette: `<path d="M221 59c-16-28-66-34-101-15-31 17-50 47-45 70 6 29 45 44 77 41 12-1 12-11 8-19-9-16 16-27 31-18 20 12 44-34 30-59Z" fill="${light}" stroke="${ink}"/><circle cx="112" cy="86" r="12" fill="${bg}" stroke="${ink}"/><circle cx="146" cy="64" r="12" fill="${bg}" stroke="${ink}"/><circle cx="184" cy="65" r="12" fill="${bg}" stroke="${ink}"/><circle cx="111" cy="121" r="12" fill="${bg}" stroke="${ink}"/>`,
    waves: `<path d="M70 92c18-50 36-50 54 0s36 50 54 0 36-50 54 0m-162 0c18-24 36-24 54 0s36 24 54 0 36-24 54 0" stroke="${ink}" stroke-width="3"/><circle cx="151" cy="93" r="4" fill="${ink}"/><path d="M66 146h176M151 38v14m-7-7h14" stroke="${ink}"/>`,
    letter: `<rect x="114" y="29" width="105" height="107" rx="3" fill="${bg}" stroke="${ink}"/><path d="M130 49h68m-68 13h55m-55 13h68m-68 13h42" stroke="${ink}"/><path d="M88 89h144v65H88Z" fill="${light}" stroke="${ink}"/><path d="m88 89 72 44 72-44m-144 65 49-39m95 39-49-39" stroke="${ink}"/>`,
    people: `<circle cx="120" cy="73" r="24" fill="${light}" stroke="${ink}"/><circle cx="201" cy="73" r="24" fill="${bg}" stroke="${ink}"/><path d="M80 153v-19a40 40 0 0 1 80 0v19m1 0v-19a40 40 0 0 1 80 0v19m-73-112v14m-7-7h14" stroke="${ink}"/>`,
    plate: `<ellipse cx="160" cy="105" rx="65" ry="48" fill="${light}" stroke="${ink}"/><ellipse cx="160" cy="105" rx="47" ry="34" fill="${bg}" stroke="${ink}"/><path d="M70 57v42m-8-42v21a8 8 0 0 0 16 0V57m-8 42v53m182-95v95m0-95c-17 7-17 34 0 38" stroke="${ink}"/><path d="m148 112 15-28 22 24Z" fill="${light}" stroke="${ink}"/>`,
    spark: `<path d="m160 35 19 49 53 21-53 18-19 42-20-42-52-18 52-21Z" fill="${light}" stroke="${ink}"/><path d="M76 39v18m-9-9h18m159 88v18m-9-9h18" stroke="${ink}"/><circle cx="240" cy="47" r="5" fill="${ink}"/>`,
    sky: `<circle cx="187" cy="61" r="26" fill="${light}" stroke="${ink}"/><path d="M70 112h179m-150 0a20 20 0 0 1 4-38 29 29 0 0 1 54-10 21 21 0 0 1 29 29m-81 46h93m-77 15h51" fill="${bg}" stroke="${ink}"/>`,
  };
  return `<svg class="mission-art ${className}" viewBox="0 0 320 180" aria-hidden="true" focusable="false"><rect width="320" height="180" fill="${bg}"/><g stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${motifs[name] || motifs.spark}</g></svg>`;
}
function heroArt() {
  return `<svg class="hero-illustration" viewBox="0 0 430 320" aria-hidden="true" focusable="false">
  <circle cx="245" cy="158" r="126" fill="#e9ddcd"/><circle cx="245" cy="158" r="106" fill="none" stroke="#d5c6b4" stroke-dasharray="3 6"/>
  <path d="M145 282V119a80 80 0 0 1 160 0v163" fill="#f4ece0" stroke="#393f35" stroke-width="2"/><path d="M160 282V119a65 65 0 0 1 130 0v163" fill="#c0cbbb" stroke="#393f35" stroke-width="2"/>
  <path d="M160 182h130v100H160Z" fill="#e1d6c3"/><circle cx="249" cy="105" r="22" fill="#ed7448"/><path d="m160 201 43-56 30 42 18-25 39 39" fill="#8fa490" stroke="#393f35" stroke-width="1.5"/><path d="m160 242 130-31m-102 71 67-51m-36 51 43-58" stroke="#a49179" stroke-width="1.4"/>
  <path d="m160 61 71 30v191l-71-10Z" fill="#b77e59" stroke="#393f35" stroke-width="2"/><path d="m171 88 47 20v129l-47-10Z" fill="#cb946e" stroke="#9b6845" stroke-width="1.5"/><circle cx="218" cy="180" r="3" fill="#f4ecdb"/><path d="M135 283h179m-197 7h216" stroke="#393f35" stroke-width="2"/>
  <path d="m344 55 5 15 16 5-16 5-5 15-5-15-16-5 16-5Z" fill="#ed7448"/><path d="M98 145v18m-9-9h18M324 198v12m-6-6h12" stroke="#777762" stroke-width="2"/><circle cx="110" cy="65" r="4" fill="#b8b8a3"/>
  <rect x="305" y="228" width="68" height="49" rx="3" fill="#f7f4ec" stroke="#6d7163" transform="rotate(9 339 252)"/><path d="m322 253 11 7 18-18" stroke="#ed7448" stroke-width="3" fill="none"/>
  </svg>`;
}

let state = emptyState(), storageWritable = true, storageMessage = '';
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = decodeState(saved); } catch (error) { storageWritable = false; storageMessage = error.message || 'Браузер не разрешает сохранение.'; }
const VIEWS = { home: ['Обзор', 'home'], missions: ['Все миссии', 'compass'], traditions: ['Традиции', 'people'], compass: ['Мой компас', 'spark'], diary: ['Дневник', 'book'] };
let view = Object.hasOwn(VIEWS, location.hash.slice(1)) ? location.hash.slice(1) : 'home';
let filters = { time: '', place: '', category: '', search: '', onlyFavorites: false };
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
function card(mission, compact = false) {
  const saved = state.favorites.includes(mission.id), tried = state.entries.some(entry => entry.missionId === mission.id);
  return `<article class="mission-card ${compact ? 'compact' : ''}">
    <button class="mission-open" data-action="mission" data-id="${mission.id}">
      <div class="card-image">${art(mission.art, mission.category)}${tried ? '<span class="tried-label">' + icon('check') + ' Уже пробовал</span>' : ''}</div>
      <div class="card-content">${tag(mission.category)}<h3>${e(mission.title)}</h3><p>${e(mission.subtitle)}</p><div class="card-meta"><span>${icon('clock')}${mission.minutes} мин</span><span>${icon('pin')}${mission.places.map(place => PLACES[place]).join(' / ')}</span><span class="card-arrow">${icon('arrow')}</span></div></div>
    </button>
    <button class="favorite-button ${saved ? 'saved' : ''}" data-action="favorite" data-id="${mission.id}" aria-label="${saved ? 'Убрать из избранного' : 'Сохранить миссию'}: ${e(mission.title)}" aria-pressed="${saved}">${icon('bookmark')}</button>
  </article>`;
}
function activeBanner() {
  const mission = MISSIONS.find(m => m.id === state.active?.missionId);
  if (!mission) return '';
  return `<section class="active-banner"><div class="active-symbol">${icon('compass')}</div><div><span class="eyebrow">ТВОЯ МИССИЯ ПРОДОЛЖАЕТСЯ</span><h3>${e(mission.title)}</h3><p>${state.active.completedSteps.length} из ${mission.steps.length} шагов отмечено</p></div><button class="button button-dark" data-action="mission" data-id="${mission.id}">Продолжить ${icon('arrow')}</button></section>`;
}
function intro(kicker, title, subtitle, extra = '') {
  return `<section class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${subtitle}</p></div>${extra}</section>`;
}
function homePage() {
  const featured = ['detail-hunter', 'home-radio', 'world-exchange'].map(id => MISSIONS.find(m => m.id === id));
  const repeatCount = state.entries.filter(entry => entry.repeat).length;
  const recent = state.entries[0];
  return `${intro('ОДИН НОВЫЙ ОПЫТ ЗА РАЗ', 'Сегодня можно<br>пожить иначе.', 'Маленькие приключения. Настоящие впечатления.', '<div class="date-chip">' + icon('circle') + e(dateText(new Date())) + '</div>')}
    ${activeBanner()}
    <section class="hero">
      <div class="hero-copy"><span class="hero-kicker"><span></span> ЛЮБОПЫТСТВО — ХОРОШЕЕ НАЧАЛО</span><h2>Примерь роль.<br>Открой что-то<br><em>своё.</em></h2><p>Стань исследователем, автором или<br class="desktop-break"> просто внимательным наблюдателем.<br class="desktop-break"> Тебе хватит даже десяти минут.</p><button class="button button-orange" data-action="surprise">${icon('shuffle')} Подобрать приключение ${icon('arrow')}</button><span class="hero-footnote">${MISSIONS.length} миссий · дома, на улице и с близкими</span></div>
      <div class="hero-art">${heroArt()}<span class="art-caption">ДВЕРЬ В ДРУГУЮ ЖИЗНЬ<br><b>ОТКРЫВАЕТСЯ ИЗНУТРИ</b></span></div>
    </section>
    <div class="home-bottom">
      <section class="discover"><div class="section-heading"><div><span class="eyebrow">НАЧНИ С МАЛЕНЬКОГО</span><h2>Кем побудешь сегодня?</h2></div><button class="text-button" data-action="navigate" data-view="missions">Все миссии ${icon('arrow')}</button></div><div class="mission-grid featured-grid">${featured.map(m => card(m, true)).join('')}</div></section>
      <aside class="passport"><div class="passport-head"><span class="eyebrow">ЛИЧНЫЙ ПАСПОРТ</span>${icon('compass')}<h2>Твои открытия</h2><p>Каждая попытка оставляет след.</p></div><div class="passport-stats"><div><strong>${state.entries.length}</strong><span>опытов<br>в дневнике</span></div><div><strong>${repeatCount}</strong><span>хочется<br>повторить</span></div></div>${recent ? '<div class="last-memory"><span class="eyebrow">ПОСЛЕДНИЙ ОПЫТ</span><strong>' + e(recent.title) + '</strong><p>' + e(recent.note || 'Впечатление сохранено. Можно добавить заметку в дневнике.') + '</p></div>' : '<div class="passport-empty"><span class="small-star">' + icon('spark') + '</span><p>Твоя первая история<br>ещё впереди.</p></div>'}<button class="text-button" data-action="navigate" data-view="compass">Открыть мой компас ${icon('arrow')}</button></aside>
    </div>
    <section class="tradition-strip"><div class="strip-icon">${icon('people')}</div><div><span class="eyebrow">ХОРОШЕЕ ХОЧЕТСЯ ПОВТОРЯТЬ</span><h3>А что, если это станет традицией?</h3><p>Маленькие поводы собираться и делиться открытиями.</p></div><button class="button button-outline" data-action="navigate" data-view="traditions">Найти свой повод ${icon('arrow')}</button></section>`;
}
function missionsPage() {
  return `${intro('КОЛЛЕКЦИЯ ВОЗМОЖНЫХ ЖИЗНЕЙ', 'Попробуй новую роль.', 'Выбирай по времени, месту и настроению.', '<button class="button button-orange" data-action="surprise">' + icon('shuffle') + ' Удиви меня</button>')}
    ${activeBanner()}
    <section class="catalog-tools" aria-label="Подбор миссий"><div class="search-field">${icon('search')}<label class="sr-only" for="mission-search">Поиск миссии</label><input id="mission-search" type="search" value="${e(filters.search)}" placeholder="Найти роль или настроение" maxlength="100"></div><label class="select-field"><span>Время</span><select id="time-filter"><option value="">Сколько угодно</option>${[10,15,30,60].map(time => '<option value="' + time + '"' + (filters.time === String(time) ? ' selected' : '') + '>До ' + time + ' минут</option>').join('')}</select></label><label class="select-field"><span>Место</span><select id="place-filter"><option value="">Где угодно</option>${Object.entries(PLACES).map(([id,label]) => '<option value="' + id + '"' + (filters.place === id ? ' selected' : '') + '>' + label + '</option>').join('')}</select></label><button class="button favorite-filter ${filters.onlyFavorites ? 'selected' : ''}" data-action="filter-favorites" aria-pressed="${filters.onlyFavorites}">${icon('bookmark')} Избранное</button></section>
    <div class="category-filters" aria-label="Настроение"><button data-action="category" data-id="" class="filter-chip ${!filters.category ? 'selected' : ''}" aria-pressed="${!filters.category}">Любое настроение</button>${Object.entries(CATEGORIES).map(([id,c]) => '<button class="filter-chip ' + (filters.category === id ? 'selected' : '') + '" data-action="category" data-id="' + id + '" aria-pressed="' + (filters.category === id) + '">' + icon(c.icon) + c.verb + '</button>').join('')}</div>
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
      return `<article class="tradition-card ${saved ? 'in-circle' : ''}"><div class="tradition-image">${art(t.art, t.category)}<span class="tradition-frequency">${t.frequency}</span></div><div class="tradition-body"><span class="eyebrow">${t.people}</span><h2>${e(t.title)}</h2><p>${e(t.subtitle)}</p><div class="tradition-actions"><button class="text-button" data-action="tradition" data-id="${t.id}">Посмотреть сценарий ${icon('arrow')}</button><button class="circle-button ${saved ? 'selected' : ''}" data-action="circle" data-id="${t.id}" aria-label="${saved ? 'Убрать из своего круга' : 'Добавить в свой круг'}: ${e(t.title)}" aria-pressed="${saved}">${icon(saved ? 'check' : 'bookmark')}</button></div></div></article>`;
    }).join('')}</div>`;
}
function compassPage() {
  const stats = compass(state), most = [...stats].filter(c => c.count).sort((a,b) => b.average-a.average || b.count-a.count)[0];
  const repeated = state.entries.filter(entry => entry.repeat);
  return `${intro('КАРТА ТВОЕГО ИНТЕРЕСА', 'К чему хочется вернуться?', 'Компас складывается из твоих оценок после реальных попыток.')}
    ${!state.entries.length ? '<section class="compass-intro"><div class="compass-empty-art">' + art('worlds', 'slow') + '</div><div><span class="eyebrow">ПЕРВЫЕ КООРДИНАТЫ</span><h2>Твой компас ещё ждёт открытий.</h2><p>Попробуй миссию и оцени, насколько тебе понравился этот опыт. После нескольких попыток здесь появится картина твоих впечатлений.</p><button class="button button-dark" data-action="navigate" data-view="missions">Выбрать первую миссию ' + icon('arrow') + '</button></div></section>' : '<section class="compass-summary"><div class="summary-mark">' + icon('compass') + '</div><div><span class="eyebrow">ПО ТВОИМ ЗАПИСЯМ</span><h2>Самая высокая средняя оценка — «' + most.label.toLocaleLowerCase('ru') + '».</h2><p>Это ориентир для следующей попытки. Всего записей: ' + state.entries.length + '.</p></div></section>'}
    <div class="compass-grid">${stats.map(c => '<article class="compass-card ' + c.id + '"><div class="compass-card-top"><span class="compass-category-icon">' + icon(c.icon) + '</span><span class="compass-number">' + (c.count ? c.average.toFixed(1).replace('.', ',') : '—') + '<small> / 5</small></span></div><h2>' + c.label + '</h2><div class="score-track"><span style="width:' + (c.average/5*100) + '%;background:' + c.color + '"></span></div><p>' + (c.count ? 'Опытов: ' + c.count + ' · хочется повторить: ' + c.repeats : 'Пока нет записей') + '</p><button class="text-button" data-action="category-explore" data-id="' + c.id + '">Попробовать ещё ' + icon('arrow') + '</button></article>').join('')}</div>
    <section class="repeat-section"><div class="section-heading"><div><span class="eyebrow">ТВОИ ЛИЧНЫЕ «ДА»</span><h2>Хочется повторить</h2></div><span class="muted">${repeated.length} в дневнике</span></div>${repeated.length ? '<div class="repeat-list">' + repeated.map(entry => '<button data-action="edit-entry" data-id="' + entry.id + '" class="repeat-item"><span class="repeat-item-icon ' + entry.category + '">' + icon(CATEGORIES[entry.category].icon) + '</span><span><strong>' + e(entry.title) + '</strong><small>' + dateText(entry.completedAt) + ' · ' + entry.rating + ' / 5</small></span>' + icon('arrow') + '</button>').join('') + '</div>' : '<p class="quiet-empty">После миссии можно отметить «Хочу повторить». Эти впечатления соберутся здесь.</p>'}</section>`;
}
function diaryPage() {
  return `${intro('МАЛЕНЬКИЕ ИСТОРИИ, КОТОРЫЕ ОСТАЛИСЬ', 'Дневник открытий.', 'Здесь живут твои попытки, впечатления и желание попробовать снова.', '<button class="button button-outline" data-action="export">' + icon('download') + ' Сохранить копию</button>')}
    ${activeBanner()}
    ${!state.entries.length ? '<section class="empty-state diary-empty"><div class="empty-art">' + art('letter', 'create') + '</div><span class="eyebrow">ПЕРВАЯ СТРАНИЦА</span><h2>У этой истории ещё нет начала.</h2><p>Пройди одну миссию и сохрани впечатление.<br>Даже десять новых минут заслуживают своей страницы.</p><button class="button button-orange" data-action="navigate" data-view="missions">Найти первую роль ' + icon('arrow') + '</button></section>' : '<div class="diary-count">Сохранено опытов: ' + state.entries.length + '</div><div class="diary-list">' + state.entries.map(entry => '<article class="diary-entry"><div class="diary-date"><strong>' + new Date(entry.completedAt).getDate() + '</strong><span>' + new Date(entry.completedAt).toLocaleDateString('ru-RU', {month:'short',year:'numeric'}) + '</span></div><div class="entry-content">' + tag(entry.category) + '<h2>' + e(entry.title) + '</h2><p class="entry-note">' + e(entry.note || 'Впечатление сохранено. Можно добавить пару слов о нём.') + '</p><div class="entry-bottom"><span class="entry-rating">' + icon('spark') + ' ' + entry.rating + ' / 5</span>' + (entry.repeat ? '<span class="repeat-badge">' + icon('heart') + ' Хочется повторить</span>' : '') + '<button class="text-button" data-action="edit-entry" data-id="' + entry.id + '">Изменить запись ' + icon('pen') + '</button></div></div></article>').join('') + '</div>'}
    <p class="privacy-note">${icon('book')} Записи хранятся в этом браузере. Резервная копия поможет перенести их на другое устройство.</p>`;
}
function render() {
  $('#navigation').innerHTML = Object.entries(VIEWS).map(([id,[label,name]]) => `<a href="#${id}" class="nav-item ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span>${id === 'diary' && state.entries.length ? '<span class="nav-count">' + state.entries.length + '</span>' : ''}</a>`).join('');
  $('#settings-icon').innerHTML = icon('settings');
  $('#page-label').textContent = view === 'home' ? 'Личное бюро открытий' : VIEWS[view][0];
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
  $('#dialog-content').innerHTML = `<button class="modal-close icon-button" data-action="close-detail" aria-label="Закрыть миссию">${icon('close')}</button><div class="detail-art">${art(mission.art, mission.category)}</div><div class="detail-body">${tag(mission.category)}<h2 id="dialog-title">${e(mission.title)}</h2><p class="detail-subtitle">${e(mission.subtitle)}</p><div class="detail-metadata"><span>${icon('clock')}${mission.minutes} минут</span><span>${icon('pin')}${mission.places.map(p => PLACES[p]).join(' / ')}</span></div><div class="materials"><span class="eyebrow">ЧТО ПОНАДОБИТСЯ</span><p>${e(mission.materials)}</p></div><h3 class="detail-section-title">${active ? 'Твои шаги' : 'Три простых шага'}</h3><ol class="mission-steps">${mission.steps.map((step,index) => active ? '<li class="' + (state.active.completedSteps.includes(index) ? 'step-done' : '') + '"><label><input type="checkbox" data-step="' + index + '" ' + (state.active.completedSteps.includes(index) ? 'checked' : '') + '><span>' + e(step) + '</span></label></li>' : '<li><span class="step-index">0' + (index+1) + '</span><p>' + e(step) + '</p></li>').join('')}</ol><div class="mission-result">${icon('spark')}<div><span class="eyebrow">ЧТО ОСТАНЕТСЯ</span><p>${e(mission.result)}</p></div></div><div class="detail-buttons">${active ? '<button class="button button-orange" data-action="feedback">Сохранить впечатление ' + icon('arrow') + '</button><button class="text-button" data-action="cancel-mission">Отложить миссию</button>' : '<button class="button button-orange" data-action="begin" data-id="' + id + '">Примерить эту роль ' + icon('arrow') + '</button><button class="button button-outline" data-action="favorite-detail" data-id="' + id + '" aria-pressed="' + saved + '">' + icon(saved ? 'check' : 'bookmark') + (saved ? 'Сохранено' : 'На потом') + '</button>'}</div><p class="detail-footnote">Можно менять шаги под себя и идти в своём темпе.</p></div>`;
  openDialog($('#detail-dialog'));
}
function showTradition(id) {
  const tradition = TRADITIONS.find(t => t.id === id); if (!tradition) return;
  const saved = state.traditions.includes(id);
  $('#dialog-content').innerHTML = `<button class="modal-close icon-button" data-action="close-detail" aria-label="Закрыть традицию">${icon('close')}</button><div class="detail-art">${art(tradition.art, tradition.category)}</div><div class="detail-body"><span class="eyebrow">${tradition.frequency} · ${tradition.people}</span><h2 id="dialog-title">${e(tradition.title)}</h2><p class="detail-subtitle">${e(tradition.subtitle)}</p><h3 class="detail-section-title">Простой сценарий</h3><ol class="mission-steps">${tradition.steps.map((step,index) => '<li><span class="step-index">0' + (index+1) + '</span><p>' + e(step) + '</p></li>').join('')}</ol><div class="invite-box"><span class="eyebrow">ПРИГЛАШЕНИЕ СВОИМИ СЛОВАМИ</span><p id="invite-text">${e(tradition.invitation)}</p><button class="text-button" data-action="copy-invite" data-id="${id}">Скопировать приглашение ${icon('arrowUp')}</button></div><div class="detail-buttons"><button class="button button-orange" data-action="circle-detail" data-id="${id}">${icon(saved ? 'check' : 'bookmark')} ${saved ? 'В моём круге' : 'Добавить в мой круг'}</button><button class="button button-outline" data-action="mission" data-id="${tradition.missionId}">Попробовать один раз</button></div><p class="detail-footnote">Выберите время сами. Приглашение отправляешь ты.</p></div>`;
  openDialog($('#detail-dialog'));
}
function showFeedback(entryId = null) {
  const entry = entryId ? state.entries.find(x => x.id === entryId) : null;
  const mission = MISSIONS.find(m => m.id === (entry?.missionId || state.active?.missionId));
  if (!entry && !mission) return;
  feedbackEntryId = entry?.id || null;
  if ($('#detail-dialog').open) closeDialog($('#detail-dialog'));
  $('#feedback-content').innerHTML = `<button class="modal-close icon-button" data-action="close-feedback" aria-label="Закрыть запись">${icon('close')}</button><div class="feedback-body"><span class="eyebrow">${entry ? 'ТВОЯ ЗАПИСЬ' : 'ОДИН ОПЫТ В КОПИЛКУ'}</span><h2 id="feedback-title">${entry ? 'Добавим пару слов?' : 'Как тебе эта жизнь?'}</h2><p class="feedback-mission">${e(entry?.title || mission.title)}</p><form id="feedback-form"><fieldset class="rating-fieldset"><legend>Насколько понравился этот опыт?</legend><div class="rating-options">${[1,2,3,4,5].map(rating => '<label><input type="radio" name="rating" value="' + rating + '" required ' + (entry?.rating === rating ? 'checked' : '') + '><span>' + rating + '</span></label>').join('')}</div><div class="rating-labels"><span>Совсем не моё</span><span>Очень понравилось</span></div></fieldset><label class="repeat-checkbox"><input type="checkbox" name="repeat" ${entry?.repeat ? 'checked' : ''}>${icon('heart')}<span>Хочу попробовать ещё раз</span></label><label class="note-label" for="feedback-note">Что хочется запомнить?</label><p class="note-prompt">${e(mission?.prompt || 'Какое впечатление хочется сохранить?')}</p><textarea id="feedback-note" name="note" rows="4" maxlength="1200" placeholder="Пара слов об этом опыте…">${e(entry?.note || '')}</textarea><div class="note-counter"><span>Необязательно</span><span id="note-length">${entry?.note.length || 0} / 1200</span></div><button type="submit" class="button button-orange feedback-submit">${entry ? 'Сохранить изменения' : 'Сохранить в дневник'} ${icon('check')}</button><p class="feedback-privacy">Это твой личный дневник. Достаточно честной оценки.</p></form></div>`;
  openDialog($('#feedback-dialog'));
}
function showAbout(settings = false) {
  const copy = settings ? `<span class="eyebrow">ТВОЯ ИСТОРИЯ ПОД РУКОЙ</span><h2 id="dialog-title">Дневник и копия.</h2><p class="detail-subtitle">Записи сохраняются в этом браузере. На другом устройстве будет свой дневник.</p><div class="settings-card"><h3>Резервная копия</h3><p>В JSON-файл попадут завершённые миссии, избранное и твой круг традиций. После импорта записи объединятся с текущими.</p><div class="detail-buttons"><button class="button button-dark" data-action="export">${icon('download')} Скачать копию</button><button class="button button-outline" data-action="import">${icon('upload')} Восстановить</button></div></div><div class="settings-card"><h3>Открывать с главного экрана</h3><p>В меню браузера выбери «Добавить на главный экран» или «Установить приложение», если такой пункт доступен.</p>${installPrompt ? '<button class="button button-outline" data-action="install">Добавить приложение ' + icon('arrow') + '</button>' : ''}</div><p class="detail-footnote">Копия содержит твои заметки. Храни её там, где удобно тебе.</p>` : `<span class="eyebrow">БЮРО ДРУГИХ ЖИЗНЕЙ</span><h2 id="dialog-title">Начни с любопытства.</h2><p class="detail-subtitle">Здесь можно примерить новую роль на десять минут или целый вечер.</p><ol class="mission-steps"><li><span class="step-index">01</span><p>Выбери миссию по настроению, месту и свободному времени.</p></li><li><span class="step-index">02</span><p>Примерь роль. Делай шаги в своём темпе и отмечай сделанное.</p></li><li><span class="step-index">03</span><p>Сохрани оценку и впечатление. Компас покажет, к чему хочется вернуться.</p></li></ol><div class="mission-result">${icon('people')}<p>А любимый опыт можно превратить в традицию и пригласить близких.</p></div><button class="button button-orange" data-action="go-missions">Найти первую роль ${icon('arrow')}</button>`;
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
    const mission = surpriseMission(state, view === 'missions' ? currentFilters() : {});
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
