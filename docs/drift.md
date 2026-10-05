# Drift

2026-10-04: brainstorming became an implementation after the user requested an application. The optional format question selected web over APK. No existing product or requirement was reversed.

Future reversals of platform, storage or compass semantics must be appended here and linked to the affected requirement and decision.

2026-10-04 — UX, decided by the owner. Before: an illustrated home introduction, fixed featured cards, statistics and tradition promotion, with many mobile text sizes below 13 px. After: time/place selection or one resume action, large opaque text and plain cards. Why: explicit feedback about small text, low contrast and noise. Impact: fewer competing start actions; no schema, billing, audience or runtime-dependency change. Sources: R08–R09 in [requirements](requirements.md), [readability decision](decisions.md) and [UX](ux.md). Feature expansion proposed in conversation is outside this batch, not a shipped promise.

Review when an intended direction changes. See [requirements](requirements.md) and [decisions](decisions.md).

2026-10-04 — New owner scope: add Git and friends messaging. Before: a static personal application with no data API. After: supported Worker/D1 chat, preserved local diary and same private audience. Shared message storage activates the earlier framework/backend reversal condition. No pricing, public access or cloud diary promise is introduced. Sources: R10–R12 and the new [decision](decisions.md).

2026-10-04 — Owner clarified GitHub and created a public repository. The main frontend/source move to GitHub/Pages; the chat runtime remains the existing private Worker/D1. This supersedes the earlier unspecified external Git target and private-only frontend default, without changing the protected chat audience or granting friends access. R10/R13–R14 and the [migration decision](decisions.md) own the scope. No multi-device diary sync or full backend hosting on Pages is claimed.

2026-10-05 — Explicit owner reversal of the previous defaults. Home time/place selection becomes an unfiltered surprise button with preserved active progress. The owner rejects the platform dependency and developing a custom messenger: current main becomes a zero-dependency static GitHub product with local Telegram contacts/explicit drafts. Earlier backend/access/invite requirements are historical, not current operations. R09/R11–R16 and the standalone decision own this direction. Source history/legacy hosted data are preserved; no data deletion or new service purchase. Optional messenger-placement clarification was unanswered, so external Telegram links are a stated default.
