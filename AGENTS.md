# Application router

Use Akinator for repository changes when available. Keep code and its knowledge delta together; preserve the browser diary / server chat boundary.

- [Product and acceptance](docs/product.md).
- [Project overview and Git handoff](README.md).
- [Pages / protected chat deployment split](docs/operations.md) and [frontend boundary](rules/03-pages-boundary.md).
- [Readability and scope](docs/ux.md) — start here before changing the interface.
- [Knowledge index](docs/README.md), including requirements, decisions, operations and testing.
- [Diary and chat access rules](rules/README.md).
- [Server routes](app/AGENTS.md), [social API](server/AGENTS.md) and [database](db/AGENTS.md).
- [Generated application context](context/index.md).
- [Session brief](.ai/BRIEF.md) and [answered questions / failures](.ai/ledger/index.md).
- [Browser module router](public/AGENTS.md).

Run `node scripts/verify.mjs` once after a coherent code batch. Regenerate context with `node scripts/extract-context.mjs` after catalog, routes or storage changes.

No repository-local skill was needed: Sites already covers the source and publishing workflow. Memory facts have their canonical homes in decisions and change provenance.
