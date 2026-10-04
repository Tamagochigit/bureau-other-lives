# Stack

[Generated application facts](../context/application.md) own module/catalog/routes and binding facts. Browser UI remains authored HTML/CSS/ES modules with native dialogs and localStorage for the diary. The supported Sites Vinext Worker serves the shell/social API; D1 holds chat records and Drizzle generates schema-only migrations.

For the chat server use the provided starter dependency lockfile, install helper and Sites build helper. A framework install and server build are required for its deployment. The Pages frontend instead uses Node-only `build:pages` and the Pages workflow, with no npm dependency installation. package.json permits Node >=22.13.0; CI selects Node 24, including node:sqlite. Chat runtime is Cloudflare Workers; the public frontend is static GitHub Pages.

Dependency rationale: [dependencies](dependencies.md). Deployment/migrations: [operations](operations.md). Review when execution profile or toolchain changes.
