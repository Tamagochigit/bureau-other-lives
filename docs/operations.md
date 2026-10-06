# Operations

Canonical source/history: https://github.com/Tamagochigit/bureau-other-lives. Production website: https://tamagochigit.github.io/bureau-other-lives/. Both are the owner-authorised public project. Pages Source is GitHub Actions. This product requires no separate service, identity configuration or message database.

## Develop and publish

Knowledge refresh uses `node scripts/extract-context.mjs`, `node scripts/build-brief.mjs` and the installed Akinator `scripts/akinator_wiki.py index`. The index command writes by default and has no `--write` flag; inspect `index --help` on plugin updates. Do not add a duplicate repository skill or hook for this routine procedure.

Clone normally. Use Node 22.13+ (CI Node 24), `npm run dev` and http://127.0.0.1:3000. No dependency install is required. The local server binds loopback, serves the selected static directory and accepts only GET/HEAD. It has no application API.

After a coherent change run `npm run verify`, then `npm run build`. Preview the deployable output with `npm start`. Commit/push normally to main. `.github/workflows/pages.yml` checks source and tests, builds out/pages, uploads only that directory and deploys Pages. Pull requests verify/build without deployment. Inspect the run for the exact commit, then fetch live HTML/assets, check status/MIME and compare hashes to the verified build. A green local suite alone does not prove publication.

Codex may write commits through the connected GitHub Git-data API and advance main with force:false when shell push credentials are unavailable. Check current main first and preserve its parent; on concurrent updates fetch/reconcile rather than overwrite history. No persistent personal token is committed.

Changing the address requires runtime-config.mjs, link tests and the related decision. Relative assets/manifest must still work under a repository subpath. GitHub Pages executes no application server; adding one requires a new architecture/hosting decision.

## Recover data and releases

Keep the diary storage key/schema v1. Export JSON through settings before changing device/origin or clearing storage. Import validates/merges completed records; no automatic cross-origin transfer exists. Universal sharing never includes local notes or recipient data. Retired `other-lives:contacts:v1` stays untouched; do not remove it as part of this UI change. Existing external conversations remain with their chosen applications.

Rollback a code regression with an ordinary revert and the same Pages workflow. Select a standalone release; historical pre-0.3 releases depended on the retired platform. Never force-push the preserved source history or store notes/contacts/messages in Git.

The old hosted chat/database were left intact as historical data; their operations are no longer part of this product. No message export/import, legacy data deletion or recipient message was performed. Original source history remains retrievable from Git. Dated receipts in changes are historical, not current runtime requirements.

[Testing](testing.md) owns proof limits; [changes](changes.md) records observed commit/run/asset receipts. Review when hosting, source publication, data recovery or external integration changes.

## Android pilot

[android.md](android.md) owns local build/signing and diary transfer. .github/workflows/android.yml verifies the shared application and builds/lints an unsigned release. Private signing material is excluded from Git and backed up separately; compatible updates require the same package/key and an increased versionCode. Do not install an unsigned CI artifact or treat it as store publication. Website/Android updates use one preserved Git history; no hosted legacy data is removed. The delivered APK stays at its bundled version until installed updates.

[RuStore preparation](rustore.md) adds opt-in real-device capture to the Android workflow. Owner reviews/loads the listing later; no store account, billing or submission is performed. Private signing stays local; unsigned CI captures are not installable releases.
