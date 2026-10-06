# Decisions

Dated earlier sections describe superseded releases. The 2026-10-05 standalone decision below governs current runtime.

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

## 2026-10-04 — GitHub project and Pages frontend

The owner clarified GitHub, created the public Tamagochigit/bureau-other-lives repository and authorised moving the entire project and website there. GitHub becomes the canonical source location; Pages hosts the browser interface. The optional question about moving the chat server had no answer, so Codex retains the current protected Sites Worker/D1 as the recommended default. All server/schema code is included in GitHub, but runtime messages and identity stay on the existing server. Pages is static hosting and cannot execute that backend. Revisit when the owner supplies a new backend host and an identity/access migration plan.

An ordinary navigation link connects Pages to protected chat. Only a catalog mission id and a validated invitation token cross it; no diary note, bearer, CORS bridge or automatic send is introduced. Received mission cards point to the main frontend; an incoming mission opens its instructions and does not begin/replace an active experience. The old diary remains on its origin; explicit backup export/import makes the domain transfer reviewable and avoids pretending cross-origin storage follows automatically.

Alternative Git API imports recreate commits and change their SHA/author/date. A verified Git bundle and one-time Actions import preserve original objects, adding one merge commit with the GitHub bootstrap parent. An ordinary fast-forward push fails on concurrent repository changes. The import uses the runner's short-lived GITHUB_TOKEN, not a stored personal token. Subsequent Pages builds use read-only source permission and deployment-only Pages permissions. Revisit if branch protection or host policy blocks the one-time import; never discard unrelated history to repair it.

## 2026-10-05 — Standalone GitHub product, surprise and an existing messenger

Owner: «главный экран, который удиви меня лучше ... выбор по времени не надо», «не создавая свой мессенджер» and «полностью убрать ChatGPT ... отдельный продукт на гитхаб». This overrides the previously assumed home selector and retained platform chat server. One unfiltered home surprise with visible active progress replaces the form; catalog filtering remains optional. Browsing never replaces progress.

Choose local shortcuts to Telegram and its official username/draft/share links. The optional external-versus-embedded question returned no answer; this is the stated working default. [Telegram public username links](https://core.telegram.org/api/links#public-username-links) accept optional draft text; [sharing](https://core.telegram.org/widgets/share) lets the user choose a chat and edit/send. Only catalog title/id/link enters that draft. No user message was sent during development.

Alternatives considered: embedding [Converse/XMPP](https://conversejs.org/docs/quickstart/) requires provider accounts and a working production WebSocket/BOSH endpoint; Matrix likewise needs service/account onboarding. A test/demo endpoint is unsuitable for production. Telegram's [documented widgets](https://core.telegram.org/widgets) are not a ready private-conversation iframe. A custom backend would repeat the rejected messenger work. Revisit if the owner requires conversations inside this site and selects a verified provider/account flow.

Remove the former framework/auth/database/connector starter, custom chat code, generated schema and import-only workflow from current main. package.json/lock now have no dependencies; Node built-ins verify/build/preview. Keep the complete original Git history and unchanged diary v1/backup. Legacy hosted data/deployment are not destroyed or migrated; current runtime has no link to them. Contacts use a separate browser-local key, bounded names/usernames and no identity-verification claim. No friend address, platform login, bot, new paid service or cloud diary is required.

Risks/limits: a contact's handle may be wrong or no longer owned by the intended person; Telegram resolves it and the user checks the recipient. Real client draft behaviour/availability and delivery need manual acceptance. Local storage can be cleared; diary backup excludes contacts. Full messenger embedding and contact/diary sync remain separate scope. Revisit when Telegram contracts, provider/account requirements, storage, host or owner intent change. R15–R16 and revised R09/R11–R14 own acceptance; operations and tests own proof.

## 2026-10-05 — packaged Android pilot and authored packs

Owner requested an APK, design and revenue/return motivation. Before: standalone GitHub website only. Chosen: Java WebViewAssetLoader host with offline shared assets, exact-origin bridge and SAF recovery; API 26 minimum/36 target; quiet open-door style. This avoids duplicating the application/diary while giving a direct-install artifact. Alternatives: browser shortcut only (does not deliver APK), loading the hosted site (requires connectivity), full native rewrite (much larger migration). Revisit if native capability/performance requires it. Browser and app stores are separate; no automatic data migration or cloud sync. Audience/direct-install optional questions were unanswered, so these are defaults.

Commercial proposal: free core plus one-off thematic packs. Price/audience/return mechanisms are hypotheses; no billing configured. Subscription waits for observed recurring demand and a reliable new-content cadence. See [Android](android.md) and [monetization](monetization.md) for canonical contracts and sources. Author: Codex, at owner request.

2026-10-06 — Preserve full brand Бюро других жизней and match APK label for RuStore. Plan five actual Android viewport captures and export of the launcher drawable; capture success is recorded separately after execution. Clearly marked example records are confined to .debug. Candidate 0.4.1/code 5 keeps package/key/schema; store submission is a later owner action. Reverse when brand/store rules/UI changes. [Procedure](rustore.md).

## 2026-10-07 — Universal sharing without an address book

Owner «У нас друзья телеграмм, а он разрешен? Ну лучше сделать универсальным поделиться?»; optional choice explicitly «Без списка». Replace fixed Telegram/username shortcuts with the installed-application chooser; preserve authored content, readable UI, diary v1, private signing identity and old stored contacts without deletion. Android bridge accepts only a catalog id and reconstructs bounded public text from generated assets; browser uses Web Share with silent cancel and truthful copy/selectable fallback. Alternative: keep per-provider buttons or address book, rejected by the owner’s choice and unnecessary for recipient selection. No account/login/message API/SDK is needed. Retired contact implementation/tests stay in Git history; new payload/cancel/compatibility tests prove the current contract. MainActivity and rule 04 retain exact origin/main-frame and no dangerous permissions. No real recipient or send is exercised. Revisit if owner asks for another payload, sync or embedded inbox. Build, publication and signed-candidate evidence is recorded after actual runs in testing/changes; current candidate is 0.4.2/code 6.
