import { MISSIONS, CATEGORIES } from './data.mjs';

export const STORAGE_KEY = 'other-lives:state:v1';
export const MAX_ENTRIES = 5000;
export const emptyState = () => ({ version: 1, active: null, entries: [], favorites: [], traditions: [] });
const now = () => new Date().toISOString();
const makeId = () => globalThis.crypto?.randomUUID?.() || String(Date.now()) + '-' + Math.random().toString(36).slice(2);
const isId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const isDate = value => typeof value === 'string' && value.length <= 40 && Number.isFinite(Date.parse(value));
const missionById = id => MISSIONS.find(m => m.id === id);

export function validEntry(entry) {
  return !!entry && isId(entry.id) && isId(entry.missionId) && typeof entry.title === 'string' && entry.title.length > 0 && entry.title.length <= 150 && Object.hasOwn(CATEGORIES, entry.category) && isDate(entry.completedAt) && (!entry.updatedAt || isDate(entry.updatedAt)) && Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5 && typeof entry.repeat === 'boolean' && typeof entry.note === 'string' && entry.note.length <= 1200;
}
function validIds(ids) { return Array.isArray(ids) && ids.length <= 5000 && ids.every(isId); }
export function decodeState(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.entries) || parsed.entries.length > MAX_ENTRIES || !parsed.entries.every(validEntry) || !validIds(parsed.favorites) || !validIds(parsed.traditions)) throw new Error('Не удалось прочитать сохранённый дневник. Исходные данные оставлены в браузере.');
  if (parsed.active !== null) {
    const active = parsed.active, mission = missionById(active?.missionId);
    if (!mission || !isDate(active.startedAt) || !Array.isArray(active.completedSteps) || !active.completedSteps.every(i => Number.isInteger(i) && i >= 0 && i < mission.steps.length)) throw new Error('Не удалось прочитать текущую миссию. Исходные данные оставлены в браузере.');
  }
  return { version: 1, active: parsed.active === null ? null : { missionId: parsed.active.missionId, startedAt: parsed.active.startedAt, completedSteps: [...new Set(parsed.active.completedSteps)] }, entries: parsed.entries.map(e => ({ id: e.id, missionId: e.missionId, title: e.title, category: e.category, completedAt: e.completedAt, updatedAt: e.updatedAt || e.completedAt, rating: e.rating, repeat: e.repeat, note: e.note })), favorites: [...new Set(parsed.favorites)], traditions: [...new Set(parsed.traditions)] };
}
export function beginMission(state, missionId, startedAt = now()) {
  if (!missionById(missionId)) throw new Error('Этой миссии нет в каталоге.');
  if (state.active?.missionId === missionId) return state;
  if (state.active) throw new Error('У тебя уже есть начатая миссия.');
  return { ...state, active: { missionId, startedAt, completedSteps: [] } };
}
export function toggleStep(state, index) {
  const mission = missionById(state.active?.missionId);
  if (!mission || !Number.isInteger(index) || index < 0 || index >= mission.steps.length) throw new Error('Такого шага нет.');
  const selected = new Set(state.active.completedSteps);
  if (selected.has(index)) selected.delete(index); else selected.add(index);
  return { ...state, active: { ...state.active, completedSteps: [...selected].sort((a,b) => a-b) } };
}
export function completeMission(state, feedback, completedAt = now(), id = makeId()) {
  const mission = missionById(state.active?.missionId);
  if (!mission) throw new Error('Сначала начни миссию.');
  const entry = { id, missionId: mission.id, title: mission.title, category: mission.category, completedAt, updatedAt: completedAt, rating: feedback.rating, repeat: feedback.repeat, note: (feedback.note || '').trim() };
  if (!validEntry(entry)) throw new Error('Выбери оценку от 1 до 5. Заметка — до 1200 символов.');
  if (state.entries.length >= MAX_ENTRIES) throw new Error('Дневник заполнен. Сначала выгрузи резервную копию.');
  return { ...state, active: null, entries: [entry, ...state.entries] };
}
export function editEntry(state, id, feedback) {
  const entry = state.entries.find(e => e.id === id);
  if (!entry) throw new Error('Эта запись не найдена.');
  const updatedAt = new Date(Math.max(Date.now(), Date.parse(entry.updatedAt || entry.completedAt) + 1)).toISOString();
  const updated = { ...entry, rating: feedback.rating, repeat: feedback.repeat, note: (feedback.note || '').trim(), updatedAt };
  if (!validEntry(updated)) throw new Error('Проверь оценку и длину заметки.');
  return { ...state, entries: state.entries.map(e => e.id === id ? updated : e) };
}
export function toggleId(state, key, id) {
  if (!['favorites', 'traditions'].includes(key) || !isId(id)) throw new Error('Неверный выбор.');
  return { ...state, [key]: state[key].includes(id) ? state[key].filter(x => x !== id) : [...state[key], id] };
}
export function filterMissions(filters = {}) {
  const query = (filters.search || '').trim().toLocaleLowerCase('ru');
  return MISSIONS.filter(m => (!filters.time || m.minutes <= Number(filters.time)) && (!filters.place || m.places.includes(filters.place)) && (!filters.category || m.category === filters.category) && (!filters.favorites || filters.favorites.includes(m.id)) && (!query || (m.title + ' ' + m.subtitle + ' ' + CATEGORIES[m.category].label).toLocaleLowerCase('ru').includes(query)));
}
export function surpriseMission(state, filters = {}, random = Math.random) {
  const pool = filterMissions(filters).filter(m => m.id !== state.active?.missionId);
  const recent = new Set(state.entries.slice(0, 5).map(e => e.missionId));
  const fresh = pool.filter(m => !recent.has(m.id));
  const choices = fresh.length ? fresh : pool;
  return choices.length ? choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))] : null;
}
export function compass(state) {
  return Object.entries(CATEGORIES).map(([id, category]) => {
    const entries = state.entries.filter(e => e.category === id);
    return { id, ...category, count: entries.length, average: entries.length ? entries.reduce((sum,e) => sum+e.rating,0)/entries.length : 0, repeats: entries.filter(e => e.repeat).length };
  });
}
export function backup(state) {
  return JSON.stringify({ app: 'other-lives', version: 1, exportedAt: now(), entries: state.entries, favorites: state.favorites, traditions: state.traditions }, null, 2);
}
export function importBackup(state, raw) {
  if (typeof raw !== 'string' || raw.length > 32_000_000) throw new Error('Файл слишком большой. Максимум — 32 МБ текста.');
  let data; try { data = JSON.parse(raw); } catch { throw new Error('Этот файл не похож на резервную копию JSON.'); }
  if (!data || data.app !== 'other-lives' || data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > MAX_ENTRIES || !data.entries.every(validEntry) || !validIds(data.favorites) || !validIds(data.traditions)) throw new Error('Не удалось проверить файл. Нужна резервная копия этого приложения.');
  const merged = new Map(state.entries.map(e => [e.id, e]));
  for (const entry of data.entries) {
    const previous = merged.get(entry.id);
    if (!previous || Date.parse(entry.updatedAt || entry.completedAt) > Date.parse(previous.updatedAt || previous.completedAt)) merged.set(entry.id, { id: entry.id, missionId: entry.missionId, title: entry.title, category: entry.category, completedAt: entry.completedAt, updatedAt: entry.updatedAt || entry.completedAt, rating: entry.rating, repeat: entry.repeat, note: entry.note });
  }
  if (merged.size > MAX_ENTRIES) throw new Error('В объединённом дневнике больше 5000 записей. Текущие записи сохранены.');
  return { ...state, entries: [...merged.values()].sort((a,b) => Date.parse(b.completedAt)-Date.parse(a.completedAt)), favorites: [...new Set([...state.favorites, ...data.favorites])], traditions: [...new Set([...state.traditions, ...data.traditions])] };
}
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
