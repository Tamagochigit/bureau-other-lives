# Browser module

Follow the [root router](../AGENTS.md), [local-data rule](../rules/01-local-data.md), [messenger boundary](../rules/02-chat-access.md) and [static hosting rule](../rules/03-pages-boundary.md).

Catalog: [data.mjs](data.mjs). Diary/backup/compass: [core.mjs](core.mjs). Rendering/events: [app.mjs](app.mjs). Telegram contact UI: [friends.mjs](friends.mjs). Separate contact schema: [contacts.mjs](contacts.mjs). Validated mission/Telegram links: [links.mjs](links.mjs). Canonical site address: [runtime-config.mjs](runtime-config.mjs). Layout: [style.css](style.css). Build whitelist: [build-pages](../scripts/build-pages.mjs).

Personal text must be escaped. Keep diary v1 compatibility and record titles after catalog retirement. All application state stays local; only known public catalog missions enter explicit Telegram drafts. No network data API, login, contact lookup, unread count or fake message history. The contact store cannot read diary state. Telegram resolves the supplied username; a shortcut is not verification of the person's identity.

Read [UX](../docs/ux.md) before changing visuals: one surprise start, large opaque text and five primary mobile actions. Run `node scripts/verify.mjs` from the root; event tests do not prove browser layout.
