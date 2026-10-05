# Architecture

The production application is static HTML/CSS/ES modules on GitHub Pages. Browser source is `public/`; the explicit build whitelist is [scripts/build-pages.mjs](../scripts/build-pages.mjs). It rewrites relative .mjs imports to .js and emits HTML, styles, icons, manifest and .nojekyll. Generated output is `out/pages`; no framework, auth injection, database or private API is deployed.

`core.mjs` owns diary v1 transitions, safe backup validation/merge and truthful compass aggregation. `app.mjs` owns rendered views and event handlers. `data.mjs` owns the authored mission/tradition catalog. The unchanged diary key is `other-lives:state:v1`; prior JSON backups remain compatible. Stored record titles survive catalog retirement. Notes are escaped; there is no network data path in these modules.

`contacts.mjs` owns a separate `other-lives:contacts:v1` schema: version 1 plus at most 100 local {name,username} records. Names are bounded and escaped; usernames are canonicalised and constrained to Telegram paths. The friends controller reads/writes only this contact key, merging the latest stored list before a change. Invalid storage is left untouched, and storage failures show a visit-only warning. These shortcuts are not synced or included in diary backups.

`links.mjs` builds fixed HTTPS Telegram username/share links and public mission links using catalog ids. Telegram drafts contain only catalog text/link. Arbitrary URL destinations, reserved Telegram routes and unknown mission ids are rejected. `runtime-config.mjs` holds only the canonical frontend address. Incoming known missions open instructions without starting an experience or writing state; old invite/offer queries are ignored.

Every outgoing messenger link requires a user click. Messages, delivery, account authentication and conversation history belong to Telegram. The product does not embed a messaging client or load Telegram code. Tests validate local flows and link contracts; they do not verify a real Telegram account's username, privacy permissions or delivery.

Historical Worker/D1/auth code was removed from current main on 2026-10-05. Git history is preserved; the old external deployment/database were not deleted or migrated. Current source has no runtime link to them. [Decisions](decisions.md), [rules](../rules/README.md), [operations](operations.md) and [generated facts](../context/application.md). Review when state, sharing, hosts or build boundaries change.
