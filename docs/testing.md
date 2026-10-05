# Testing

Run `node scripts/verify.mjs` once after a coherent change. It syntax-checks browser/tool modules, runs all tests, checks asset/catalog references, prohibits application-data network calls and retired auth/hosting paths in public assets, and rejects diary-state access from contacts/friends/links. Zero package dependencies are an explicit standalone constraint.

Core tests exercise real state transitions, recent-mission selection, partial completion, ratings, safe invalid-backup rejection, merges/idempotence and truthful compass values. UI tests dispatch the real handlers: unfiltered home surprise, preserved active progress, steps/reflection, escaped notes, favourites/traditions, concurrent diary records and persistence warnings.

Contacts tests exercise validation/deduplication/edit/remove, escaping, separate storage access, unreadable/quota failures and fixed Telegram links. They decode outgoing query values to prove the public mission URL/fragment survives encoding and that unknown ids/arbitrary destinations do not enter drafts. Tests never send real messages.

Pages tests build a temporary deployment directory and inspect its relative asset graph; rendered output must have no retired auth/server dependency. They import the assembled app and open/share a known mission with an existing private diary, asserting no state writes, no data request and no note in friend markup. Unknown and legacy queries are ignored.

`node scripts/build-pages.mjs` produces the artifact separately. CI runs the same verifier/build and then deploys. Production proof requires the exact Actions run, HTTP/MIME and live-byte comparison, recorded in [changes](changes.md). Knowledge gates and a fresh knowledge-only reviewer check instructions/claims separately.

Manual limits: event harnesses are not a browser, responsive/device or accessibility audit. Real Telegram account availability, username ownership, existing-client draft behaviour and delivery remain manual acceptance; the app cannot verify them. No accounts were created and no message sent during development. [UX](ux.md), [operations](operations.md). Review when user flows, storage, integration or test evidence changes.

Observed 2026-10-05: 19/19 local and fresh CI tests pass; standalone build and exact live-byte/MIME checks pass. Desktop Chrome visibly verified the home surprise, mission dialog and public-mission Telegram chooser transition without starting an experience, writing a contact or sending a message. Phone layout and actual Telegram account/delivery remain manual acceptance. Full commit/run receipt is in changes.
