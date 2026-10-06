# 03 — Standalone Pages boundary

## Mandatory rules

- Production is static and independent of the former auth/hosting service. No private API, credential, login redirect or companion server in served assets.
- Publish only the explicit static whitelist, with complete relative imports/icons/manifest beneath the repository path.
- Opening a known mission only displays instructions: no automatic begin/replace, persistence or outgoing request.
- Query input cannot choose a destination; old invite/offer fields are ignored.
- Keep diary v1 compatible. Origin/device changes use explicit backup export/import.

## Enforcement

Mechanisms: `public/links.mjs`, `scripts/build-pages.mjs`, `scripts/verify.mjs`, `tests/pages.test.mjs`, `.github/workflows/pages.yml`.

The verifier/build tests inspect served output for retired auth/server paths and complete relative references. The assembled app test rejects state writes/network calls on deep links/sharing. Source/tests/build precede Pages deployment. Rule 02 owns public-only universal sharing.

## Superseded policy — 2026-10-04

The former Pages rule linked the public frontend to a private authenticated chat origin and forwarded catalog ids/invite tokens. That split no longer satisfies the owner's standalone-product instruction. The current product removes the destination and both deployment modes; Git history retains the earlier reason and implementation. Review when hosts, query links, data migration or output change.
