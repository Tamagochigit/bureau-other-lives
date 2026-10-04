# Decisions

## 2026-10-04 — First format

User chose web over Android APK in the optional format question. A responsive static application is the quickest reviewable implementation and works without installing an APK. Revisit when the user requests native Android capabilities.

## 2026-10-04 — Local diary

Agent implementation choice: browser-local storage with explicit export/import, rather than a server database. This keeps a small personal experiment simple and avoids sending notes to an external service. Cost: device-specific data and possible browser quota/clearing loss. Revisit when users need multi-device continuity; first specify identity, permissions and conflict behaviour.

## 2026-10-04 — Compass semantics

Agent choice: arithmetic means of 1–5 self-ratings by activity category. Avoid invented profile scores or pseudo-scientific certainty. Sparse categories stay visibly sparse. Revisit if the user asks for a different measure with a clear meaning.

## 2026-10-04 — Runtime tooling

Agent choice: authored HTML/CSS/ES modules, native dialogs and a curated catalog. A framework, backend and generated activity feed would add dependencies before this concept is tried. Revisit if server behaviour or substantial shared state becomes necessary.

## 2026-10-04 — Readability before feature expansion

The owner requested only important work and reported poor readability and visual noise. Codex chose a coherent typography/layout replacement and a short start over adding the proposed personalisation, journeys and new compass measures. Merely scaling the old CSS would retain conflicting mobile reductions and competing home panels.

The existing mission filters now serve the home selector; active progress has precedence. Native catalog disclosure keeps optional controls available without showing them all initially. Diary schema and aggregation stay unchanged. Revisit the feature scope only with a new user request; inspect actual phone layout before claiming visual acceptance.

See [requirements](requirements.md), [architecture](architecture.md) and [changes](changes.md). Review when an alternative is adopted; record a new decision rather than rewriting old reasoning.

## 2026-10-04 — Git and friends, after the new request

The owner requested «гит» and a messenger. Optional clarification returned no answer. Agent defaults: literal Git source/history, friends messaging inside this app. The existing Sites repository already has history; a portable Git bundle provides handoff without inventing a GitHub destination. Revisit if the owner meant a guide or supplies an external Git target.

Messaging needs shared durable state, so this request activates the earlier tooling reversal condition: migrate hosting to the supported Sites Vinext Worker/D1 starter while preserving the authored browser interface and the local diary key/schema. Alternatives: a local fake chat would not connect friends; third-party messaging would introduce credentials/services beyond the request. D1 stores only chat data; no diary synchronisation or end-to-end encryption is implied. Schema migrations are generated and packaged through Sites.

Invite links are random, stored as hashes, expire in seven days and can be accepted by one signed-in user. A friendship is separate from Site access. The audience stays owner-private because no named friend/address or request to make the Site public was supplied. Friends onboarding can proceed when the intended addresses arrive. Review if the owner explicitly changes the audience or asks for multi-device diary sync.

Five primary navigation actions remain; traditions move into the catalog so friends does not expand the fixed mobile bar. Only personal messages, mission cards, unread counts and blocking are added. Revisit scope with actual use, keeping the readability preference.
