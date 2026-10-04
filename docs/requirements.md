# Requirements register

Source date: 2026-10-04, user: «Давай создадим приложение»; format answer: «Веб-приложение». Earlier in this conversation the user selected all three offered brainstorming strands.

| ID | Status / priority | Requirement | Source / acceptance |
| --- | --- | --- | --- |
| R01 | current / P0 | Deliver a runnable web application | Explicit user format answer; deployed link |
| R02 | current / P0 | Combine missions, traditions and a personal compass | User selected all three themes; all three views reachable |
| R03 | current / P0 | Save a real experience with rating and optional note | Inferred implementation choice; full mission-to-diary flow |
| R04 | current / P0 | Preserve notes and safely merge backups | Inferred data design; round trip, idempotence, invalid input rejection |
| R05 | current / P1 | Offer time/place/mood and favourite filtering | Inferred usability choice; combined filters and empty state |
| R06 | current / P1 | Adapt to phone and desktop screens | Inferred from web format; responsive CSS, manual device acceptance pending |
| R07 | current / P0 | Keep compass values grounded in recorded ratings | Inferred product integrity; empty state and known average tests |
| R08 | current / P0 | Make text larger and darker throughout the application | Explicit owner feedback, 2026-10-04; CSS text sizing and colour calculation, device acceptance pending |
| R09 | current / P0 | Keep the start simple and reduce visual noise | Explicit owner scope; time/place selection or resume, no decorative home panels; later messenger request permits a focused friends view |
| R10 | current / P1 | Provide Git source/history | Latest owner «сделать гит» interpreted literally after an unanswered optional clarification; existing Site repository plus verified portable bundle |
| R11 | current / P0 | Add a friends messenger | Latest owner request; invites, personal messages/reload, catalog mission sharing and blocking; SQLite/API checks and private deployment, two-account UI acceptance pending |
| R12 | current / P0 | Keep diary private and authorise each chat | Implementation constraint supporting R11; isolated chat payloads, member/block checks, safe retries; same private Site audience, friend addresses needed |

Append-only history: 2026-10-04 created R01–R07 in the first implementation. Inferred decisions are defaults for this prototype, not separately claimed user instructions.

2026-10-04 added R08–R09 from «Сделай только важное, остальное не надо. И да читаемость плохая, мелкий шрифт, не контрастный, много шума». The prior brainstorming proposals were not accepted requirements; this update focuses on readable use rather than implementing them.

Review when: the user changes scope, the meaning of data changes or a requirement is accepted/dropped. See [product](product.md) and [testing](testing.md).

2026-10-04: R10–R12 follow «Неплохо бы сделать гит, мессенджер друзей в нет и что ещё посчитаешь нужным». The optional clarification received no answer; literal Git and a messenger inside this app are documented defaults, not claimed answers. Extra scope is limited to invitation links, read counts and blocking.
