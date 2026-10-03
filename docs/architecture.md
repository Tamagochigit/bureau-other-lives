# Architecture

Use a static shell and browser ES modules to make the first experiment immediately usable without a build toolchain or a model key. [core.mjs](../dist/core.mjs) owns state transitions and strict import validation; [app.mjs](../dist/app.mjs) owns rendering, events and storage; [data.mjs](../dist/data.mjs) owns authored activities.

The diary is held in memory and persisted in browser localStorage. On persistence failure, the UI warns that new changes last until the page closes and still permits export. Corrupted original localStorage is left untouched; new session changes stay in memory. This is not encrypted or account-synchronised storage.

Backups merge entries by id, keeping the newer updatedAt, and preserve the current active mission. Record titles survive a retired catalog item. Before persisting a write, UI code merges diary entries already stored by another tab; selections are last-write-wins. The app is not a collaborative editor.

No service worker is included. This avoids caching a private hosted HTML response or accidentally caching sign-in redirects; offline reopening is not promised. Manifest and icons support browser home-screen options when the browser exposes them.

This design is wrong for multi-user sharing, reliable background reminders or automatic multi-device sync. Add a new storage and access decision before implementing those.

Structural facts: [context](../context/application.md). Review when persistence, auth or application module boundaries change.
