# Testing

Run `node scripts/verify.mjs` once after the coherent implementation batch. It checks JS syntax, all core and UI-event tests, declared asset paths, tradition-to-mission links and the diary network boundary.

[Core tests](../tests/core.test.mjs) cover persistence round trips, partial progress, required ratings, combined filters, surprise choice, truthful compass averages, backup idempotence/newer edits, malformed input rejection, safe personal text and retired mission titles.

[UI event tests](../tests/ui.test.mjs) execute the real application module with a lightweight DOM/event harness. They cover home time/place selection → mission, selection → progress → feedback → diary → compass, favourites, tradition selection, concurrent diary preservation and visible storage failure. They do not prove visual layout, CSS sizing, actual browser dialog behaviour or installability.

Browser screenshots and phone acceptance remain unverified; managed preview required an unavailable control-browser skill. No acceptance sign-off has been claimed.

Manual owner script: open on a phone; try a ten-minute mission; mark a step; save a rating and note; reload; inspect the diary and compass; export; reimport and confirm no duplicate. Check modal dismissal and bottom navigation on a narrow screen.

For the readability change, also inspect 320–430 px widths and browser zoom: text must wrap, the bottom bar must not cover the last action, filters must open by keyboard, and mission/rating controls must be comfortably readable. Declared colour contrast can be calculated without a browser; it does not prove rendered layout. The current environment lacks the required control-browser skill, so a managed preview is not started and no screenshot acceptance is claimed.

Verification result is recorded in [change provenance](changes.md) after the checks run. Review when test scope or an acceptance result changes.

Observed on 2026-10-04 for this change: application verification exited 0 with 11/11 tests. Declared-colour/font inspection exited 0 after darkening the orange link token: main text 14.66:1, secondary text 7.74:1, links 7.62:1. Body is 18 px and the smallest declared text is 14 px at the default 16 px browser base. CSS parser packages were unavailable; block balance and manual source review do not substitute for browser acceptance.
