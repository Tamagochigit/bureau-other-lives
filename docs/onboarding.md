# Onboarding

Read [product](product.md), [decisions](decisions.md), [architecture](architecture.md), [local-data rule](../rules/01-local-data.md) and [operations](operations.md), then use the [generated context](../context/application.md).

Five anticipated change types for this young repository; the recorded history is too small to establish their actual frequency:

1. Add an activity: edit [data.mjs](../dist/data.mjs), preserving existing ids and entry titles. Three steps, a result, materials and reflection prompt must be actionable. Run verification and regenerate context.
2. Change persistence or import: edit [core.mjs](../dist/core.mjs) and state boundaries in [app.mjs](../dist/app.mjs); preserve old entries or define a migration. Add meaningful invalid-input and round-trip checks. Update the storage decision before adding a network service.
3. Change compass semantics: update core aggregation and known-rating tests, and explicitly revise the [product meaning](product.md) and [decision](decisions.md).
4. Adjust mobile layout: first read [UX](ux.md), then edit [style.css](../dist/style.css); inspect dialogs, fixed bottom navigation and narrow screens through the supported preview when available. The owner requested a readable, quiet interface. Event tests alone do not prove appearance.
5. Publish or recover deployment: follow [operations](operations.md) and the installed Sites skill. Preserve the current project and private access; reuse saved/deployment identifiers after failures.

No installation is required. Run `node scripts/verify.mjs` from the root; inspect actual exit codes. Review when a common change procedure or API boundary changes.
