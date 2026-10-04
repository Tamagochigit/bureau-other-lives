# Onboarding

Read [product](product.md), [decisions](decisions.md), [architecture](architecture.md), [rules](../rules/README.md) and [operations](operations.md), then [generated facts](../context/application.md). Use the supported Sites install helper; the Node test runtime here is Node 24.

Five anticipated change types; history is too small to establish actual frequency:

1. Add an activity: edit [data.mjs](../public/data.mjs), preserve ids/titles, supply actionable steps/materials/result/prompt. Verify and regenerate context. Server-shared cards resolve the catalog id/title.
2. Change diary persistence or compass: edit [core.mjs](../public/core.mjs) and state boundaries in [app.mjs](../public/app.mjs), preserve version-1 compatibility or define a migration, and update the decision/meaning with meaningful invalid-input/known-rating checks. Chat is not permission to upload notes.
3. Change chat behaviour: read rule 02, then [server](../server/AGENTS.md) and [browser controller](../public/friends.mjs). Test membership, blocking, invite races and retry behaviour. Schema changes follow [db router](../db/AGENTS.md) and new immutable migrations.
4. Adjust layout: read [UX](ux.md), then [style.css](../public/style.css). Keep five primary mobile actions and large opaque text. Verify phone widths/dialogs through supported preview when available; event tests are not screenshots.
5. Publish or recover: follow [operations](operations.md). Frontend changes in GitHub main run the Pages workflow; static build is `node scripts/build-pages.mjs`. Server changes require the existing Sites source/build/private deployment workflow separately. Preserve D1 on rollback; obtain named friend addresses before chat audience changes. Changing a deployment address also touches runtime config, links and Pages boundary tests.

Run `npm run verify`, `npm run lint` and the Sites build helper once after the coherent batch; inspect exit codes. Review when common procedures or boundaries change.
