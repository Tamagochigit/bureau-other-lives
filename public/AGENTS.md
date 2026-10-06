# Browser module

Follow the [root router](../AGENTS.md), [local-data rule](../rules/01-local-data.md), [messenger boundary](../rules/02-chat-access.md) and [static hosting rule](../rules/03-pages-boundary.md).

Catalog: [data.mjs](data.mjs). Diary/backup/compass: [core.mjs](core.mjs). Rendering/events: [app.mjs](app.mjs). Public friend ideas/selectable fallback: [friends.mjs](friends.mjs). Share/copy/cancel behaviour: [sharing.mjs](sharing.mjs). Validated public mission links/payloads: [links.mjs](links.mjs). Canonical site address: [runtime-config.mjs](runtime-config.mjs). Layout: [style.css](style.css). Build whitelist: [build-pages](../scripts/build-pages.mjs).

Personal text must be escaped. Keep diary v1 compatibility and record titles after catalog retirement. Sharing accepts only known public catalog ids and never reads diary, notes or recipient data. No network data API, login, contact lookup, unread count or fake message history. The retired contacts key is not read, written or deleted. A canceled share has no fallback side effect; availability and delivery belong to the chosen external application/user.

Read [UX](../docs/ux.md) before changing visuals: one surprise start, large opaque text and five primary mobile actions. Run `node scripts/verify.mjs` from the root; event tests do not prove browser layout.

[android.mjs](android.mjs) is the optional, exact-origin native file/share bridge. Keep browser download/file-input fallback and core import validation. Shared source becomes packaged Android assets; rebuild them before Gradle. Preserve home simplicity and diary compatibility. [Android router](../android/AGENTS.md).
