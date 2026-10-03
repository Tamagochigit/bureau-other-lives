import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../dist/data.mjs';
import { emptyState, beginMission, toggleStep, completeMission, editEntry, filterMissions, surpriseMission, compass, backup, importBackup, decodeState, escapeHtml } from '../dist/core.mjs';

const created = (id = 'entry-1', mission = 'detail-hunter', rating = 5, repeat = true, note = 'Заметил новый узор') =>
  completeMission(beginMission(emptyState(), mission, '2026-10-03T17:00:00Z'), { rating, repeat, note }, '2026-10-03T17:30:00Z', id);

test('an experience survives start, checklist, reflection and reload without mutating previous state', () => {
  const blank = emptyState();
  const active = beginMission(blank, 'detail-hunter', '2026-10-03T17:00:00Z');
  const step1 = toggleStep(active, 0), step2 = toggleStep(step1, 2);
  assert.deepEqual(active.active.completedSteps, []);
  assert.deepEqual(step2.active.completedSteps, [0, 2]);
  assert.deepEqual(toggleStep(step2, 0).active.completedSteps, [2]);
  const completed = completeMission(step2, { rating: 4, repeat: true, note: '  Оранжевая дверь  ' }, '2026-10-03T17:30:00Z', 'entry-flow');
  assert.equal(completed.active, null);
  assert.equal(completed.entries[0].note, 'Оранжевая дверь');
  assert.deepEqual(decodeState(JSON.stringify(completed)), completed);
  assert.equal(blank.active, null);
  assert.equal(blank.entries.length, 0);
});
test('starting another mission requires a deliberate cancellation and ratings are required', () => {
  const active = beginMission(emptyState(), 'detail-hunter');
  assert.throws(() => beginMission(active, 'home-radio'), /уже есть/);
  assert.throws(() => completeMission(active, { rating: 0, repeat: true }), /оценку/);
  assert.throws(() => toggleStep(active, 20), /шага/);
  assert.equal(active.active.missionId, 'detail-hunter');
  assert.equal(beginMission(active, 'detail-hunter'), active);
});
test('time, place, mood, search and favorite filters work together', () => {
  const matches = filterMissions({ time: '15', place: 'home', category: 'slow' });
  assert.ok(matches.length > 0);
  assert.ok(matches.every(m => m.minutes <= 15 && m.places.includes('home') && m.category === 'slow'));
  assert.deepEqual(filterMissions({ search: '  РАДИО  ' }).map(m => m.id), ['home-radio']);
  assert.equal(filterMissions({ favorites: [] }).length, 0);
  assert.equal(filterMissions({ time: '10', place: 'company' }).length, 0);
  assert.ok(filterMissions({ favorites: ['detail-hunter'] }).length === 1);
});
test('surprise honors constraints and avoids recent experiences where alternatives exist', () => {
  const state = created();
  const mission = surpriseMission(state, { category: 'curiosity' }, () => 0);
  assert.ok(mission);
  assert.equal(mission.category, 'curiosity');
  assert.notEqual(mission.id, 'detail-hunter');
  assert.equal(surpriseMission(state, { time: '10', place: 'company' }), null);
});
test('compass reflects recorded evaluations rather than invented sample data', () => {
  const state = { ...emptyState(), entries: [...created('a','detail-hunter',5,true).entries, ...created('b','ordinary-museum',1,false).entries, ...created('c','home-radio',4,false).entries] };
  const stats = compass(state);
  assert.deepEqual(stats.find(x => x.id === 'curiosity'), { ...compass(created())[0], count: 2, average: 3, repeats: 1 });
  assert.equal(stats.find(x => x.id === 'create').average, 4);
  assert.equal(stats.find(x => x.id === 'connect').count, 0);
  assert.equal(stats.find(x => x.id === 'connect').average, 0);
});
test('restore merges backups without duplicate entries or losing an active mission', () => {
  const source = created();
  const target = beginMission(created('entry-local','home-radio'), 'quiet-tea');
  const once = importBackup(target, backup(source));
  const twice = importBackup(once, backup(source));
  assert.equal(twice.entries.length, 2);
  assert.deepEqual(twice.active, target.active);
  const edited = editEntry(twice, 'entry-1', { rating: 2, repeat: false, note: 'Новая оценка' });
  const restored = importBackup(edited, backup(source));
  assert.equal(restored.entries.find(x => x.id === 'entry-1').note, 'Новая оценка');
});
test('invalid imports leave the existing diary untouched and reject unsafe or malformed data', () => {
  const state = created(), before = JSON.stringify(state);
  const invalid = JSON.parse(backup(state)); invalid.entries[0].category = '__proto__';
  for (const value of ['not json', '{}', JSON.stringify(invalid)]) assert.throws(() => importBackup(state, value));
  assert.equal(JSON.stringify(state), before);
  assert.throws(() => decodeState('{"version":5}'));
  const raw = JSON.stringify({ ...emptyState(), active: { missionId:'detail-hunter', startedAt:'bad', completedSteps:[] } });
  assert.throws(() => decodeState(raw));
});
test('personal text round trips as text and is escaped before rendering', () => {
  const note = '<img src=x onerror=alert(1)> & "личное"';
  const state = created('note-entry','home-radio',3,false,note);
  assert.equal(importBackup(emptyState(), backup(state)).entries[0].note, note);
  assert.ok(!escapeHtml(note).includes('<img'));
  assert.ok(escapeHtml(note).includes('&lt;img'));
});
test('old mission titles remain in the diary even if a catalog item is retired', () => {
  const source = created();
  source.entries[0].missionId = 'retired-role';
  source.entries[0].title = 'Прошлая роль';
  const loaded = importBackup(emptyState(), backup(source));
  assert.equal(loaded.entries[0].title, 'Прошлая роль');
  assert.equal(loaded.entries.length, 1);
});
test('catalog provides complete actionable instructions for every mission', () => {
  assert.equal(new Set(MISSIONS.map(m => m.id)).size, MISSIONS.length);
  for (const mission of MISSIONS) {
    assert.equal(mission.steps.length, 3);
    assert.ok(mission.materials && mission.result && mission.prompt);
    assert.ok(mission.minutes > 0 && mission.places.length > 0);
  }
});
