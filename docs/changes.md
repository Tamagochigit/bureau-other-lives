# Change provenance

## 2026-10-04 — First application

Actor: Codex implementing the user's «Давай создадим приложение» request and explicit web-format answer. Before: conversation concepts and an empty project. Change: created a Russian personal web app, authored catalog, mission/checklist/reflection flow, tradition scenarios, diary, favourites, category compass and JSON recovery.

Why: make the idea concrete so the owner can try one real experience. Static browser-local modules were chosen over native packaging, a framework and a database for the first experiment. The alternatives and reversal conditions are in [decisions](decisions.md).

Source: initially dist/, now [public](../public/) after the messaging migration. The scoped verification evidence is below; publication result follows the native Sites deployment. Neither browser layout acceptance nor demand validation is claimed.

Observed verification: `node scripts/verify.mjs` exited 0 on 2026-10-04. All 11 tests passed; JS syntax, asset references, linked tradition missions and the local-data boundary passed. Browser screenshots and device acceptance remain unverified.

Knowledge review: strict Akinator coverage, wiki consistency and ledger validation exited 0. A fresh agent read only the knowledge layer and returned PASS for all five anticipated change types, then librarian CLEAR after category-index and ledger-link fixes. No implementation hints or code were provided to that review.

Compatibility: local state schema version 1; record titles survive catalog retirement. No earlier user data migration. Risks: device-local storage can be cleared, and installation depends on browser support. Rollback and recovery: [operations](operations.md).

Knowledge delta: README and routers, this docs index and all relevant category homes, generated application context, local-data rule, tests and the question ledger. SKILLIFY: no new skill, because Sites already covers deployment. MEMOIZE: no duplicate memory page; durable choices live in decisions. Newcomer review is recorded below when returned.

Stale when: scope, schema, hosting or verification evidence changes. Future: owner tries a first mission; any demand or native/cloud programme requires a new decision.

## 2026-10-04 — Readability and a short start

Actor: Codex, following the owner's explicit request for only important changes and feedback about small, pale text and visual noise. Before: decorative introduction, fixed featured cards, statistics, promotional panels and mobile type as small as 8–12 px. Change: removed those panels and large in-app illustrations, replaced conflicting responsive typography, and reused time/place filters for a short home selector. Active progress takes priority; optional catalog controls are behind a native disclosure.

Why: let the owner read instructions and begin an experience without competing panels. Adding the brainstormed features would not address that immediate problem. The alternative of scaling the old CSS was rejected because its mobile overrides and visual hierarchy would remain. Scope and reversal conditions: [UX](ux.md), [requirements](requirements.md), [decision](decisions.md).

Compatibility: all five views, authored activities, ratings and backups remain; state schema and storage key are unchanged. No migration is needed. Publication uses the same owner-private Site and ordinary static archive workflow. Rollback follows [operations](operations.md).

Knowledge delta: UX, requirements R08–R09, product start, decision, drift, this provenance, testing limits, README, both routers, onboarding, project status and generated context/brief/wiki. Reviewed unaffected areas: business and market have no new pricing, demand or positioning claim; architecture, dependencies, stack and infrastructure have no new API, package, hosting or identity boundary; glossary and existing rules remain valid. SKILLIFY: no new procedure beyond the existing Sites workflow. RULE: no new enforcement rule; the local-data checker remains applicable. MEMOIZE: the preference and its reversal condition live in the decision, not a duplicate memory page.

Observed verification: node scripts/verify.mjs exited 0; all 11 existing tests passed, including the added home-selection assertions. Declared-colour and font-size checks exited 0: main text 14.66:1, secondary text 7.74:1, orange links 7.62:1, and text declarations no smaller than 14 px at the default browser base. The first colour check found 6.89:1 for orange links and the token was darkened; only that failed check was repeated. CSS block balance was checked, but no CSS parser, browser layout or device acceptance is claimed. Browser QA is unavailable because the required control-browser skill is absent.

Knowledge review: strict coverage, wiki consistency, ledger validation, rule conflict/evolution checks and whitespace inspection exited 0. An unaided fresh agent returned PASS for all five anticipated change types and found one stale onboarding premise about absent history. That premise was corrected and its closure recheck returned librarian CLEAR.

Next: owner acceptance on an actual phone. Stale when layout, colour tokens, home selection, storage compatibility or verification evidence changes.

## 2026-10-04 — Git and focused friends messenger

Actor: Codex following the owner's new Git/messenger request, with literal Git and in-app messaging as stated defaults after an unanswered optional clarification. Before: owner-private static Site and local diary. Change: supported Vinext Worker/D1 chat, one-use invite links, personal messages, catalog mission sharing, chosen names, unread counts, blocking and a portable Git history handoff. Browser source moved from dist/ to public/; dist/ is generated output. The diary key/schema, ratings and backup semantics remain unchanged.

Why: actual friend communication requires shared server storage. A local imitation would not meet the request; the supported starter preserves Sites identity/build/migration contracts. Chat friendship does not grant Site access, and no unnamed friend or public audience was added. No external AI, payments, groups, attachments, notifications or diary upload. Risks: server-stored messages are not end-to-end encrypted, drafts are tab-local, and two real account/device acceptance is pending.

Knowledge delta: root/browser/server/db routers; README/Git instructions; architecture, dependencies, product, UX, operations, onboarding, project, R10–R12, decisions/drift, testing, this provenance; revised local-data rule plus chat-access rule; generated application context/brief/wiki; scope ledger. Business wording was updated for explicitly composed friend messages; there is no new monetisation or demand claim. Market and glossary meanings are unchanged. SKILLIFY: Sites already covers the only recurring deployment procedure. MEMOIZE: assumptions and reversals live in decisions; no duplicate memory artifact.

Observed verification: node scripts/verify.mjs exited 0 with 18/18 tests; npm run lint and tsc --noEmit exited 0; the supported Sites build helper exited 0, producing the root and social API Worker routes. Schema-only migrations were generated and inspected, then executed by SQLite tests. Declared colour/font checks exited 0: body 18 px, smallest declaration 14 px, main contrast 14.66:1 and secondary 7.74:1. Strict coverage, wiki consistency, ledger and rule checks exited 0. A fresh knowledge-only agent returned PASS for five anticipated change types; it found stale business/stack claims and a missing incoming wiki link. Those claims, category labels and routing were corrected; the closure recheck returned librarian CLEAR. All 43 knowledge files were reachable from the root router and 190 local links resolved; the review read knowledge only, not code or a browser. Deployment/Git bundle are not claimed complete before native results.

Review when identity, SQL access, retries, migrations, audience, UI or build profile changes. Recovery: [operations](operations.md).
