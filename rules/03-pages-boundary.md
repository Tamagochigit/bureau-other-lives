# 03 — Pages and protected chat

Applies to browser runtime config, deployment links and Pages build.

- Keep the static frontend public and the existing chat server private; a Pages visit/invitation must not grant server access.
- Pages opens protected chat by explicit navigation, never a cross-origin authenticated API, embedded credential or automatic message.
- Forward only known catalog ids and validated one-use invite tokens to fixed configured destinations. Never accept a destination URL from visitor input.
- Opening mission instructions must not begin/replace an experience or upload a diary note. Domain changes use explicit backup export/import.
- Publish only the explicit static asset whitelist; include all required relative imports and manifest icons under the repository path.

## Enforcement

Mechanisms: `public/links.mjs`, `public/hosted-friends.mjs`, `scripts/build-pages.mjs` and `tests/pages.test.mjs`, executed by `scripts/verify.mjs` and `.github/workflows/pages.yml`. Backend authorisation remains rule 02. Review when hosts, link contracts, diary transfer or build output change.
