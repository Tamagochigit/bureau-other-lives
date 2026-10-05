# 01 — Local diary and truthful compass

## Purpose

Prevent diary uploads, lost recovery records and fabricated profile metrics.

## Applies to

public/app.mjs, public/core.mjs and public/data.mjs; contacts/messenger links follow rule 02.

## Mandatory rules

- Escape personal text before HTML insertion.
- Validate backup schema and merge records without clearing current entries.
- A category without recorded ratings has no inferred score.
- All application state stays local. No browser application-data network API is authorised.
- Contacts/friends/links cannot read diary state or receive notes/entries. Only an explicitly selected public catalog id may be shared.

## Enforcement

Mechanisms: `scripts/verify.mjs`, `tests/core.test.mjs`, `tests/ui.test.mjs`, `tests/contacts.test.mjs`, `tests/pages.test.mjs`.

The verifier prohibits network calls and diary-state imports in messenger modules. Tests exercise invalid-input preservation, merge integrity, known averages, escaped text, separate contact keys and no diary leakage in the assembled sharing flow. No Git hook.

## History

The first all-runtime no-network boundary was narrowed on 2026-10-04 for an isolated custom chat API. The owner retired that backend on 2026-10-05; the current product again has no application-data network API. A future upload requires a new storage/access decision and meaningful checks. [Architecture](../docs/architecture.md), [decisions](../docs/decisions.md). Review when storage, import or compass changes.
