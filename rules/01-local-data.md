# 01 — Local diary and truthful compass

## Purpose

Prevent diary uploads, lost records during recovery and fabricated profile metrics.

## Applies to

Diary modules public/app.mjs, public/core.mjs and public/data.mjs; chat follows rule 02. Hosting credentials follow Sites.

## Mandatory rules

- Escape personal text before HTML insertion.
- Validate backup schema and merge records without clearing existing entries.
- A category without recorded ratings has no inferred score.
- Diary modules have no application-data network API. The chat module must not read localStorage or receive diary entries/notes.

## Prohibited patterns

```js
element.innerHTML = entry.note;
state.entries = JSON.parse(file).entries;
```

## Correct pattern

```js
element.innerHTML = escapeHtml(entry.note);
const next = importBackup(state, fileText);
```

## Enforcement

[scripts/verify.mjs](../scripts/verify.mjs) rejects network calls in diary modules and diary-storage access in friends.mjs. [Core](../tests/core.test.mjs), [UI](../tests/ui.test.mjs) and [social](../tests/social.test.mjs) tests exercise safe rendering, invalid-file preservation, merging, real averages and chat payloads. No Git hook is installed.

Concrete mechanism paths: `scripts/verify.mjs`, `tests/core.test.mjs`, `tests/ui.test.mjs`, `tests/social.test.mjs`.

## Exceptions and history

The previous all-runtime no-network constraint was narrowed on 2026-10-04 after the owner requested messaging. That revision permits only the isolated chat API; it does not authorise cloud diary sync. A diary network capability requires a new storage/access decision and checks.

[Architecture](../docs/architecture.md), [decisions](../docs/decisions.md), [testing](../docs/testing.md). Review when storage, import or compass contracts change.
