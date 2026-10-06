# Application router

Use Akinator for repository changes when available. Keep code and its knowledge delta together. This is a standalone GitHub Pages product: local diary, surprise missions and shortcuts to existing Telegram conversations.

- [Overview and development](README.md).
- [Product](docs/product.md), [requirements](docs/requirements.md) and [UX](docs/ux.md).
- [Architecture](docs/architecture.md), [operations](docs/operations.md) and [verification](docs/testing.md).
- [Browser module router](public/AGENTS.md) and [rules](rules/README.md).
- [Knowledge index](docs/README.md), [generated facts](context/index.md), [session brief](.ai/BRIEF.md) and [ledger](.ai/ledger/index.md).

Run `node scripts/verify.mjs` once after a coherent batch, then `node scripts/build-pages.mjs`. Regenerate facts with `node scripts/extract-context.mjs`, the brief with `node scripts/build-brief.mjs` and the wiki with the available Akinator indexer. No npm package installation, framework, auth provider or production application server is required. Repeated development/publication procedures live in operations; no repository-local skill duplicates them.

Android changes use [android/AGENTS.md](android/AGENTS.md), [Android contract](docs/android.md) and [runtime rule](rules/04-android-boundary.md). Business/retention proposals live in [monetization](docs/monetization.md); prices and demand are hypotheses. Browser remains package-free; Android has separately pinned Gradle/SDK/WebKit dependencies.

RuStore media/copy preparation uses [docs/rustore.md](docs/rustore.md); actual capture/candidate signing is separate from submission or moderation.
