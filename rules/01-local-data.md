# 01 — Local data and truthful compass

## Purpose

Avoid sending personal notes to an unexpected service, erasing existing diary entries during recovery, or presenting fabricated profile metrics.

## Applies to

Runtime modules in dist; development and hosting credentials are handled separately by the Sites workflow.

## Mandatory rules

- Personal text is escaped before HTML insertion.
- Backup import validates schema and merges records; it does not clear existing entries.
- A category with no recorded ratings has no inferred score.
- Runtime code has no application data network API.

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

Run [scripts/verify.mjs](../scripts/verify.mjs), including [core tests](../tests/core.test.mjs) and [UI event tests](../tests/ui.test.mjs). The checker rejects application network APIs; tests assert safe rendering, invalid-file preservation, merge behaviour and actual-score semantics. No Git hook is installed.

Concrete mechanism paths: `scripts/verify.mjs`, `tests/core.test.mjs`, `tests/ui.test.mjs`.

## Exceptions

A cloud diary or new network capability needs an explicit storage/access decision, an updated rule and appropriate checks before implementation.

## Related

[Architecture](../docs/architecture.md), [decisions](../docs/decisions.md), [testing](../docs/testing.md).

Review when storage, import or compass contracts change.
