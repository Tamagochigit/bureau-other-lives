# Dependencies

Server messaging justified moving from a purely static Site to the supported Vinext starter. Its pinned lockfile, `sites()` Vite plugin, Worker entry and D1 migration packaging are kept together; hand-building a different runtime would bypass the supported publishing contract.

The existing browser interface still uses authored ES modules, native dialogs and same-origin assets, with no remote fonts or model API. Server requests use Web Request/Response APIs and bound D1 statements; Drizzle defines and generates schema-only migrations. React/Vinext and Cloudflare build tooling come from the starter. Actual package versions belong to package.json/package-lock.json, not a copied version list here.

Tests use Node built-ins, including SQLite on the current Node 24 runtime. PNG icons were generated once with Pillow; it is not a runtime dependency. Chat changes do not regenerate those assets.

Review when dependencies, lockfile, framework integration or migration tooling change. See [decision](decisions.md) and [stack](stack.md).
