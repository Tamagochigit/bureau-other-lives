# 02 — Existing messenger boundary

## Purpose

Use a real existing messenger without inventing accounts, conversations, delivery or a private-data transfer.

## Applies to

public/friends.mjs, public/contacts.mjs and public/links.mjs.

## Mandatory rules

- Read/write only the separate contact key; never diary state or notes.
- Validate/bound names and usernames; escape user text. Reject arbitrary destinations and reserved Telegram paths.
- Build fixed HTTPS Telegram links. Drafts contain only known public catalog titles/links, never local notes.
- A click opens Telegram; the user chooses/sends there. No automatic navigation, message-send API, bot token, embedded SDK or contact lookup.
- Explain that contacts are browser-local shortcuts and conversations open in Telegram. Do not fabricate message history/unread counts or verified identities.
- Do not overwrite unreadable contact data; report failed persistence without a saved claim.

## Enforcement

Mechanisms: `public/contacts.mjs`, `public/links.mjs`, `scripts/verify.mjs`, `tests/contacts.test.mjs`, `tests/pages.test.mjs`.

Tests assert validation, separate storage keys, no arbitrary links, encoded catalog drafts, failed-storage truth and no state write/network call during sharing. Real identity, client availability and delivery are Telegram/user acceptance, not claims from unit tests.

## Superseded policy — 2026-10-04

The former custom-chat rule required platform-derived identity, same-origin JSON writes, bound SQL and participant/block checks, hashed expiring invitations and idempotent retries. It addressed a server that owned messages. The owner explicitly rejected building/hosting that messenger on 2026-10-05; its implementation is removed from current main, preserved in Git history. Existing legacy hosted data was not deleted. This change does not authorise transferring that data to Telegram. [Decision](../docs/decisions.md), [operations](../docs/operations.md). Review when messenger, identity or sharing changes.
