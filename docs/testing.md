# Testing

Run `node scripts/verify.mjs` once after the coherent implementation batch. It checks JS syntax, all core and UI-event tests, declared asset paths, tradition-to-mission links and the diary network boundary.

[Core tests](../tests/core.test.mjs) cover persistence round trips, partial progress, required ratings, combined filters, surprise choice, truthful compass averages, backup idempotence/newer edits, malformed input rejection, safe personal text and retired mission titles.

[UI event tests](../tests/ui.test.mjs) execute the real application module with a lightweight DOM/event harness. They cover selection → progress → feedback → diary → compass, favourites, tradition selection, concurrent diary preservation and visible storage failure. They do not prove visual layout, CSS sizing, actual browser dialog behaviour or installability.

Browser screenshots and phone acceptance remain unverified; managed preview required an unavailable control-browser skill. No acceptance sign-off has been claimed.

Manual owner script: open on a phone; try a ten-minute mission; mark a step; save a rating and note; reload; inspect the diary and compass; export; reimport and confirm no duplicate. Check modal dismissal and bottom navigation on a narrow screen.

Verification result is recorded in [change provenance](changes.md) after the checks run. Review when test scope or an acceptance result changes.
