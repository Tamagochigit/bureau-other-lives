# Browser module

Follow the [root router](../AGENTS.md) and [local-data rule](../rules/01-local-data.md).

Catalog: [data.mjs](data.mjs). State transitions and backup validation: [core.mjs](core.mjs). Rendering and browser events: [app.mjs](app.mjs). Protected chat UI: [friends.mjs](friends.mjs). Pages chat navigation: [hosted-friends.mjs](hosted-friends.mjs). Deployment/deep links: [runtime-config.mjs](runtime-config.mjs), [links.mjs](links.mjs). Layout: [style.css](style.css).

Personal notes must be escaped before insertion into markup. Keep record titles with entries so removing a catalog item does not erase diary history. Diary modules have no network API. Worker chat uses only the same-origin social API; Pages opens its protected origin through a link. Neither reads diary storage. See [chat access](../rules/02-chat-access.md) and [Pages boundary](../rules/03-pages-boundary.md). The explicit Pages asset whitelist is in [build-pages](../scripts/build-pages.mjs).

For visual changes, read [UX](../docs/ux.md): the owner prioritises readable text and a short start. Avoid reintroducing the removed decorative panels or mobile font reductions as part of unrelated features.

Run `node scripts/verify.mjs` from the repository root. UI event tests prove wiring, not browser layout.
