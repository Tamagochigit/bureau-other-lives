# Product

The user requested an application after choosing all three brainstorming strands: small adventures, new traditions and a desire compass. They explicitly selected a web application for the first version on 2026-10-04. The initial experience is personal and in Russian.

The outcome is one real attempt followed by an honest reflection. A mission gives three concrete steps and a small result. Reflection records a 1–5 enjoyment rating, an optional note and an optional desire to repeat. The compass summarises these self-reports; it must not present an inferred personality or a validated psychological assessment.

Acceptance: find a mission by time/place/mood; save a favourite; begin and resume checked steps; complete it; reopen the diary after reload; edit a reflection; inspect category averages; choose a tradition and copy its invitation; export and merge a valid backup.

One mission may be active. Replacing it requires an explicit in-app confirmation. Completion does not require all checklist marks, because users can adapt the steps and recording a disappointing or partial attempt is still useful.

The owner subsequently requested Git and a friends messenger. The new friends view supports one-to-one conversations, one-use invitation links, sharing a catalog mission, chosen display names, unread counts and blocking. It adds no payments, external AI, public profiles, group chat, attachments, calls, automatic reminders or cloud diary sync.

Chat acceptance: grant a named friend Site access; create a link; the signed-in friend accepts it; both send/reload/read a conversation; propose a mission without sharing diary notes; block and unblock. Site access requires the friend's sign-in address, which has not yet been provided.

Current start, after explicit owner feedback on 2026-10-04: select time and place, open one suitable mission, or resume the active experience. The simple selector reuses the existing catalog logic; it is not a learned recommendation system. The readability and scope limits live in [UX](ux.md) and R08–R09 in [requirements](requirements.md).

Code: [catalog](../public/data.mjs), [state](../public/core.mjs), [UI](../public/app.mjs). Review when scope or the meaning of a rating changes.
