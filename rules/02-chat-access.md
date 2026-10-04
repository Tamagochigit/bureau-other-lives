# 02 — Chat access

## Purpose

Keep personal conversations visible only to their participants and make retries safe.

## Applies to

server/social.mjs and the social route; Sites controls the outer signed-in Site audience.

## Mandatory rules

- Derive identity from the Sites request context, never a posted sender/user id.
- Require same-origin JSON writes, bound SQL values and membership checks.
- Guard message reads/inserts against a concurrent block in SQL.
- Store only invite hashes; expire invitations and allow one recipient.
- Deduplicate sends by thread, sender and client id; reject altered retry contents.
- Keep the Site private until specific friends are authorised; chat links never grant Site access.

## Enforcement

Mechanisms: `server/social.mjs`, `db/schema.ts`, `tests/social.test.mjs`, `scripts/verify.mjs`.

The tests run actual migration/query SQL on SQLite and exercise outsider reads/writes, identity spoofing in bodies, invitation races/expiry, block transitions, retries, bounded inputs and rate limits. Hosted Sites identity injection and two-account UI acceptance still need the platform/manual check; unit tests do not prove that outer boundary.

No exception for sharing a mission: only the catalog id/title and explicit message are sent. See [operations](../docs/operations.md) for named viewer onboarding and [architecture](../docs/architecture.md).

Review when identity, membership, blocking, invite or send contracts change.
