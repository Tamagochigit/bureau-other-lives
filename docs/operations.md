# Operations

This is a private Sites project. Preserve the project identity in [.openai/hosting.json](../.openai/hosting.json), the audience and the returned checkout. The static directory is the actual runtime source, so there is no separate bundling stage.

Use the installed Sites skill for source synchronisation and publication. Obtain a credential for this same project; pass it only through the source helper's hidden stdin. Never put it in an argument, file, log or repository.

Order: finish code and documentation → run `node scripts/verify.mjs` → update derived context → use the Sites source helper to push this exact source and package the declared static directory → save/deploy that matching archive through the private Sites operation → check a non-terminal deployment until it completes. Do not create another project if publication fails.

Recovery: retain saved version and deployment identifiers. Retry deployment of an already saved version rather than creating another saved version. A known prior saved version can be selected for rollback. No database migration exists.

User data recovery is independent of deployment: import a valid exported diary file. A new device has its own localStorage. Clearing browser storage cannot be repaired without a backup.

Managed browser QA was unavailable because the required control-browser skill was not installed. No preview server or substitute browser path was started.

Review when hosting profile, source workflow, access or storage changes. See [architecture](architecture.md) and [testing](testing.md).
