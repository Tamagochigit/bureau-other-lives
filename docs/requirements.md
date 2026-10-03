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

Append-only history: 2026-10-04 created R01–R07 in the first implementation. Inferred decisions are defaults for this prototype, not separately claimed user instructions.

Review when: the user changes scope, the meaning of data changes or a requirement is accepted/dropped. See [product](product.md) and [testing](testing.md).
