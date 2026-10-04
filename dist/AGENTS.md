# Browser module

Follow the [root router](../AGENTS.md) and [local-data rule](../rules/01-local-data.md).

Catalog: [data.mjs](data.mjs). State transitions and backup validation: [core.mjs](core.mjs). Rendering and browser events: [app.mjs](app.mjs). Layout: [style.css](style.css).

Personal notes must be escaped before insertion into markup. Keep record titles with entries so removing a catalog item does not erase diary history. Runtime assets are same-origin and have no application data API.

For visual changes, read [UX](../docs/ux.md): the owner prioritises readable text and a short start. Avoid reintroducing the removed decorative panels or mobile font reductions as part of unrelated features.

Run `node scripts/verify.mjs` from the repository root. UI event tests prove wiring, not browser layout.
