# Operations

There are two deployment targets. GitHub is the canonical source project; GitHub Pages serves the public static frontend. The existing owner-private Sites project serves authenticated chats and D1 messages. Preserve its project id and audience in [.openai/hosting.json](../.openai/hosting.json), Worker profile and `DB` binding. No R2 binding is needed. Public deployment addresses are in [runtime config](../public/runtime-config.mjs).

## GitHub Pages

Settings → Pages → Source must be **GitHub Actions**. This setting was saved in the owner's repository UI on 2026-10-04. [.github/workflows/pages.yml](../.github/workflows/pages.yml) verifies the application on Node 24, builds the explicit static asset list, uploads out/pages and deploys after success. Pushes to main publish; pull requests verify only; workflow_dispatch permits manual publication. Build jobs have contents:read; deployment jobs have only pages:write and id-token:write. No PAT or Site credential is needed. A bootstrap commit bearing `[skip pages]` deliberately skips publication until the application is imported.

Pages cannot execute the social Worker or D1. Keep all chat API requests on the protected Site origin. The Pages controller offers an ordinary link, forwarding only a known catalog offer and validated invitation token. Sign-in preserves the selected offer; it never submits a message automatically. Opening a shared mission returns to the main frontend and leaves the diary unchanged until the user acts.

Recovery: fix a failing workflow step, then publish the corrected main revision or manually rerun the Pages workflow. Do not broaden Pages permissions or add a secret to browser config as a repair. The static build excludes repository docs, server source, SQL and hosting metadata from the public website artifact; those source files remain in the public GitHub project as explicitly requested.

## Protected chat server

Use the installed Sites skill for installation, build, source synchronisation and publishing. Finish one coherent code/knowledge batch, run verification/lint/build and regenerate context. Obtain a source credential for this same project, pass it only through the source helper's hidden stdin, and use that helper to commit/push/package the exact output. Save/deploy the matching archive with the private Sites operation. Poll non-terminal deployments until complete. Do not create a new project as a repair.

Schema changes: edit db/schema.ts, run `npm run db:generate`, inspect schema-only SQL, and commit new drizzle migrations plus journal/snapshot. Sites applies packaged migrations before the Worker. Never rewrite an applied migration or create tables during a request. No diary migration is involved in this change.

Friends onboarding: first obtain the intended friend's sign-in address and explicitly add that named viewer using Sites access controls. Then pass a one-use chat invitation link to that friend; after sign-in they accept it in the friends view. Invitations expire after seven days and do not change the Site audience. Do not open the Site to the public or send access emails to guessed recipients. No friend address was provided in the current request.

Recovery: retain version/deployment identifiers. Retry a saved version rather than duplicating it. Inspect Worker/migration logs after a failed deployment. Worker rollback does not undo D1 schema or message data; use compatible forward changes and preserve existing migrations/bindings. Diary recovery remains independent: import a valid local backup. New devices have a separate diary.

Source handoff: after the source helper creates the final commit, export `git bundle create bureau-other-lives.bundle --all` and verify it. The authorised target is Tamagochigit/bureau-other-lives. The initial import commit carries this bundle and both workflow files. The one-time import workflow validates the expected source SHA, fetches the complete graph, creates a merge commit using the exact source tree with both bootstrap and source parents, and pushes normally to main. Concurrent changes fail the fast-forward push. Original SHA/author/date values remain unchanged. The bundle disappears from the current source tree after import; the one-time workflow remains as provenance and stops without it. This is not a database export.

GITHUB_TOKEN pushes do not automatically start another push workflow; start the Pages workflow manually after import. Subsequent user/plugin pushes to main publish normally. For future server edits, open the existing Sites checkout with its source helper, bring the intended GitHub code changes into that checkout without copying Git metadata/credentials, and publish the private Worker. Do not force-push either source history or alter an applied migration. Pages publication does not deploy the chat server.

Diary migration across domains is explicit: export from the old origin's settings and import on the new origin. Both keep the version-1 key/schema, but browsers isolate storage by origin. The new settings include the old-address link and the two-step instruction. No application/server code reads the owner's real stored notes during this migration.

Managed preview depends on the unavailable control-browser skill. Do not start an improvised preview server/browser. Build, SQLite/API tests and native deployment status are evidence; phone layout and two real signed-in participants remain manual acceptance.

Review when hosting, access, migration or source workflows change. See [architecture](architecture.md) and [testing](testing.md).
