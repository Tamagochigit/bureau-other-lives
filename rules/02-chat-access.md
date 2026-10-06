# 02 — Universal sharing boundary

## Purpose and scope

Use existing applications without owning accounts/conversations/delivery or transferring private records. Applies to public/friends.mjs, links.mjs, sharing.mjs, android.mjs and MainActivity.

## Mandatory rules

- Accept only a known authored mission id. Share public title/invitation/canonical link; never diary/notes/contacts, arbitrary text/URLs, recipient or account data.
- Require a user action. Native Android uses ACTION_SEND/text/plain and a system chooser without a fixed provider. Browser uses Web Share when supported; clipboard/selectable-text fallback is truthful.
- Canceling Web Share does not copy, navigate or report sending. Failed/unavailable sharing offers selectable public text; only successful clipboard writes claim copying.
- No address book, contact lookup, messaging SDK/API, automatic send, fake inbox/unread count or delivery claim. Leave retired contact storage untouched.
- Native origin/main-frame checks stay enforced; only the mission id crosses the share bridge. Host payload comes from bounded generated bundled catalog data.

## Enforcement

Mechanisms: `public/links.mjs`, `public/sharing.mjs`, `public/friends.mjs`, `scripts/verify.mjs`, `tests/sharing.test.mjs`, `tests/pages.test.mjs`, `tests/android.test.mjs` and `android/app/src/androidTest/java/ru/bureau/otherlives/OfflineSmokeTest.java`. Tests cover unknown inputs, exact public payloads, silent cancellation, denied copy/selectable fallback, untouched diary/legacy contacts, id-only protocol and native chooser extras. Actual app availability/delivery stays outside these test claims. Review when data, chooser, providers or recipients change.

## Superseded Telegram default — 2026-10-07

Owner explicitly selected universal sharing without a separate contact list. The previous fixed t.me/contact CRUD implementation and tests describe an earlier contract and are replaced by sharing/privacy/cancel tests. Git history retains the retired implementation; existing stored contact bytes are not modified. No message was sent or recipient selected during verification.

## Superseded policy — 2026-10-04

The former custom-chat rule required platform-derived identity, same-origin JSON writes, bound SQL and participant/block checks, hashed expiring invitations and idempotent retries. It addressed a server that owned messages. The owner explicitly rejected building/hosting that messenger on 2026-10-05; its implementation is removed from current main, preserved in Git history. Existing legacy hosted data was not deleted. This change does not authorise transferring that data to Telegram. [Decision](../docs/decisions.md), [operations](../docs/operations.md). Review when messenger, identity or sharing changes.
