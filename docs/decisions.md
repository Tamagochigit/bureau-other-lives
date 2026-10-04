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
