# Change provenance

## 2026-10-04 — First application

Actor: Codex implementing the user's «Давай создадим приложение» request and explicit web-format answer. Before: conversation concepts and an empty project. Change: created a Russian personal web app, authored catalog, mission/checklist/reflection flow, tradition scenarios, diary, favourites, category compass and JSON recovery.

Why: make the idea concrete so the owner can try one real experience. Static browser-local modules were chosen over native packaging, a framework and a database for the first experiment. The alternatives and reversal conditions are in [decisions](decisions.md).

Now: implementation is in [dist](../dist/). The scoped verification evidence is below; publication result follows the native Sites deployment. Neither browser layout acceptance nor demand validation is claimed.

Observed verification: `node scripts/verify.mjs` exited 0 on 2026-10-04. All 11 tests passed; JS syntax, asset references, linked tradition missions and the local-data boundary passed. Browser screenshots and device acceptance remain unverified.

Knowledge review: strict Akinator coverage, wiki consistency and ledger validation exited 0. A fresh agent read only the knowledge layer and returned PASS for all five anticipated change types, then librarian CLEAR after category-index and ledger-link fixes. No implementation hints or code were provided to that review.

Compatibility: local state schema version 1; record titles survive catalog retirement. No earlier user data migration. Risks: device-local storage can be cleared, and installation depends on browser support. Rollback and recovery: [operations](operations.md).

Knowledge delta: README and routers, this docs index and all relevant category homes, generated application context, local-data rule, tests and the question ledger. SKILLIFY: no new skill, because Sites already covers deployment. MEMOIZE: no duplicate memory page; durable choices live in decisions. Newcomer review is recorded below when returned.

Stale when: scope, schema, hosting or verification evidence changes. Future: owner tries a first mission; any demand or native/cloud programme requires a new decision.
