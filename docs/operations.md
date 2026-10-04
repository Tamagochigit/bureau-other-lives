# Operations

This is an existing owner-private Sites project. Preserve project id, checkout and audience in [.openai/hosting.json](../.openai/hosting.json). The current profile is a Worker with D1 binding `DB`; browser source is public/, and dist/ is generated build output. No R2 binding is needed.

Use the installed Sites skill for installation, build, source synchronisation and publishing. Finish one coherent code/knowledge batch, run verification/lint/build and regenerate context. Obtain a source credential for this same project, pass it only through the source helper's hidden stdin, and use that helper to commit/push/package the exact output. Save/deploy the matching archive with the private Sites operation. Poll non-terminal deployments until complete. Do not create a new project as a repair.

Schema changes: edit db/schema.ts, run `npm run db:generate`, inspect schema-only SQL, and commit new drizzle migrations plus journal/snapshot. Sites applies packaged migrations before the Worker. Never rewrite an applied migration or create tables during a request. No diary migration is involved in this change.

Friends onboarding: first obtain the intended friend's sign-in address and explicitly add that named viewer using Sites access controls. Then pass a one-use chat invitation link to that friend; after sign-in they accept it in the friends view. Invitations expire after seven days and do not change the Site audience. Do not open the Site to the public or send access emails to guessed recipients. No friend address was provided in the current request.

Recovery: retain version/deployment identifiers. Retry a saved version rather than duplicating it. Inspect Worker/migration logs after a failed deployment. Worker rollback does not undo D1 schema or message data; use compatible forward changes and preserve existing migrations/bindings. Diary recovery remains independent: import a valid local backup. New devices have a separate diary.

Source handoff: after the source helper creates the final commit, export `git bundle create bureau-other-lives.bundle --all` and verify it. A bundle contains Git history, not runtime chat databases or credentials. An external GitHub repository needs a separate target/repository decision.

Managed preview depends on the unavailable control-browser skill. Do not start an improvised preview server/browser. Build, SQLite/API tests and native deployment status are evidence; phone layout and two real signed-in participants remain manual acceptance.

Review when hosting, access, migration or source workflows change. See [architecture](architecture.md) and [testing](testing.md).
